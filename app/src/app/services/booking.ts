import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase-config';
import { Observable, from, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface Booking {
  id?: string;
  userId: string;
  ownerId: string; // Added for Business visibility
  stationId: string;
  stationName: string;
  stationAddress: string;
  stationImage: string;
  startTime: string; // ISO string
  durationHours: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  timestamp: any;
  // Guest Details
  guestName?: string;
  guestPhone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly LOCAL_STORAGE_KEY = 'charge360_guest_bookings';

  constructor(private http: HttpClient) { }

  // 1. Create a "Pending" Booking in Firestore
  async createPendingBooking(booking: Partial<Booking>) {
    booking.status = 'pending';
    booking.timestamp = Timestamp.now();

    const docRef = await addDoc(collection(db, 'bookings'), booking);

    // Persist locally for guests
    this.saveLocalBookingId(docRef.id);

    return docRef;
  }

  private saveLocalBookingId(id: string) {
    const ids = this.getLocalBookingIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(ids));
    }
  }

  async cancelBooking(bookingId: string) {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { status: 'cancelled' });
  }

  private getLocalBookingIds(): string[] {
    const raw = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  // 2. Call Stripe Checkout API
  async initiatePayment(bookingId: string, amount: number, stationName: string) {
    // Call Vercel API
    const session = await this.http.post<any>(`${environment.apiBaseUrl}/create-checkout-session`, {
      bookingId,
      amount,
      stationName
    }).toPromise();

    // Redirect to Stripe Checkout URL provided by API
    if (session && session.url) {
      window.location.href = session.url;
    } else {
      throw new Error('Invalid Stripe Session');
    }
  }

  getUserBookings(userId: string): Observable<Booking[]> {
    // Strategy: Fetch by UserID (if logged in) AND fetch by LocalStorage IDs (guest history)
    // Then combine and deduplicate

    const observables: Observable<Booking[]>[] = [];

    // 1. Auth Query
    if (userId) {
      const qAuth = query(
        collection(db, 'bookings'),
        where('userId', '==', userId)
      );
      observables.push(from(getDocs(qAuth)).pipe(
        map(s => s.docs.map(d => ({ id: d.id, ...d.data() } as Booking)))
      ));
    }

    // 2. Local Storage Query (Fetch each ID)
    const localIds = this.getLocalBookingIds();
    if (localIds.length > 0) {
      // Firestore 'in' query supports up to 10 items. safely detailed logic needed for >10
      // For simplicity, we'll request chunks or individually if needed, 
      // but 'documentId' query is easiest: where(documentId(), 'in', ids)

      // Note: "in" query limited to 10. If user has many, this might break. 
      // Fallback: Just display the last 10 local bookings.
      const recentIds = localIds.slice(-10);
      if (recentIds.length > 0) {
        const qLocal = query(
          collection(db, 'bookings'),
          where('__name__', 'in', recentIds)
        );
        observables.push(from(getDocs(qLocal)).pipe(
          map(s => s.docs.map(d => ({ id: d.id, ...d.data() } as Booking)))
        ));
      }
    }

    if (observables.length === 0) return from(Promise.resolve([]));

    // Combine
    // Combine
    return from(Promise.all(observables.map(o => o.toPromise()))).pipe(
      map(results => {
        let all: Booking[] = [];
        // Standard loop to avoid 'reduce' type issues
        results.forEach(res => {
          if (res) {
            all = all.concat(res);
          }
        });

        // Deduplicate by ID
        const unique = new Map();
        all.forEach(b => {
          if (b && b.id) unique.set(b.id, b);
        });

        // Sort DESC
        return Array.from(unique.values()).sort((a, b) => {
          const tA = a.timestamp?.seconds || 0;
          const tB = b.timestamp?.seconds || 0;
          return tB - tA;
        });
      })
    );
  }

  getBusinessBookings(ownerId: string): Observable<Booking[]> {
    const q = query(
      collection(db, 'bookings'),
      where('ownerId', '==', ownerId)
      // orderBy('timestamp', 'desc')
    );
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Booking)))
    );
  }
}
