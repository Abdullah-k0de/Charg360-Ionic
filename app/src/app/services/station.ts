import { Injectable } from '@angular/core';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  DocumentData
} from 'firebase/firestore';
import { db, storage } from '../firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Observable, from, map } from 'rxjs';

export interface Station {
  id?: string;
  ownerId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  images: string[];
  status: 'open' | 'closed';
  pricePerHour: number;
  tags: string[]; // 'Residential', 'Fixed'
  amenities: string[];
  openTime: string;
  closeTime: string;
  chargingPoints: number;
}

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor() { }

  getStations(): Observable<Station[]> {
    const stationsRef = collection(db, 'stations');
    // In a real app, you might want spatial query (GeoFire)
    return from(getDocs(stationsRef)).pipe(
      map(snapshot => snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Station)))
    );
  }

  getMyStations(ownerId: string): Observable<Station[]> {
    const q = query(collection(db, 'stations'), where('ownerId', '==', ownerId));
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Station)))
    );
  }

  async addStation(station: Station, imageFiles: File[]) {
    // 1. Upload images
    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      const path = `stations/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      const uploadResult = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(uploadResult.ref);
      imageUrls.push(url);
    }

    // 2. Save to Firestore
    station.images = imageUrls;
    return addDoc(collection(db, 'stations'), station);
  }

  async updateStationStatus(stationId: string, status: 'open' | 'closed') {
    const stationRef = doc(db, 'stations', stationId);
    return updateDoc(stationRef, { status });
  }
}
