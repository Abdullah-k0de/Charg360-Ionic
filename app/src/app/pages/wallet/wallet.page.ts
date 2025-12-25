import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService, UserProfile } from '../../services/auth';
import { StationService, Station } from '../../services/station';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { BookingService, Booking } from '../../services/booking';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class WalletPage implements OnInit {
  user$: Observable<UserProfile | null> = of(null);
  myStations$: Observable<Station[]> = of([]);
  incomingBookings$: Observable<Booking[]> = of([]);

  // Mock Earnings
  balance = 1250.50;
  pendingPayout = 0;

  constructor(
    private authService: AuthService,
    private stationService: StationService,
    private bookingService: BookingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user$ = this.authService.user$;

    // Stations
    this.myStations$ = this.user$.pipe(
      switchMap(user => {
        if (user && user.role === 'business') {
          return this.stationService.getMyStations(user.uid);
        }
        return of([]);
      })
    );

    // Incoming Bookings (Business)
    this.incomingBookings$ = this.user$.pipe(
      switchMap(user => {
        if (user && user.role === 'business') {
          return this.bookingService.getBusinessBookings(user.uid);
        }
        return of([]);
      })
    );
  }

  addNewStation() {
    this.router.navigate(['/add-station']);
  }

  withdrawFunds() {
    alert('Connecting to Stripe Express to withdraw $' + this.balance);
    // In real app: Calls API to get Stripe Dashboard Link
  }

  editStation(station: Station) {
    // In real app, navigate to Edit Page
    // For now, toggle status
    const newStatus = station.status === 'open' ? 'closed' : 'open';
    if (confirm(`Mark station as ${newStatus}?`)) {
      this.stationService.updateStationStatus(station.id!, newStatus);
      alert('Status updated! Pull to refresh.');
      // Force refresh simple way:
      this.ngOnInit();
    }
  }
}
