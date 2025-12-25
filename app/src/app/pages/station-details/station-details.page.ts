import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Station } from '../../services/station';
import { AuthService } from '../../services/auth';
import { BookingService } from '../../services/booking';

@Component({
  selector: 'app-station-details',
  templateUrl: './station-details.page.html',
  styleUrls: ['./station-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class StationDetailsPage implements OnInit {
  station: Station | null = null;
  selectedDate: string = new Date().toISOString();
  // Duration in hours
  duration: number = 1;

  // Guest Details
  guestName: string = '';
  guestPhone: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private bookingService: BookingService
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.station = nav.extras.state['station'];
    }
  }

  ngOnInit() {
    // If accessed directly without state, fetch ID (implementation skipped for briefly)
    if (!this.station) {
      console.warn('No station data passed');
      // In real app, fetchById(this.route.snapshot.paramMap.get('id'))
    }
  }

  get totalCost(): number {
    return (this.station?.pricePerHour || 0) * this.duration;
  }

  async bookNow() {
    if (!this.station) return;

    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Check if station is closed
    if (this.station.status === 'closed') {
      alert('This station is currently Closed and cannot be booked.');
      return;
    }

    // Validation for Guests
    if (currentUser.role === 'guest' || !currentUser.email) {
      if (!this.guestName || !this.guestPhone) {
        alert('Please enter your Name and Phone to continue.');
        return;
      }
    }

    const startTime = new Date(this.selectedDate);

    if (!this.station.id || !this.station.ownerId) {
      alert('Station Error: Missing ID');
      return;
    }

    try {
      // Create Booking in Firestore
      await this.bookingService.createPendingBooking({
        userId: currentUser.uid,
        ownerId: this.station.ownerId,
        stationId: this.station.id,
        stationName: this.station.name,
        stationAddress: this.station.address,
        stationImage: this.station.images[0] || '',
        startTime: startTime.toISOString(),
        durationHours: this.duration,
        totalAmount: this.totalCost,
        guestName: this.guestName,
        guestPhone: this.guestPhone
      });

      // Navigate to Bookings page
      alert('Booking Created Successfully!');
      this.router.navigate(['/tabs/bookings']);

    } catch (e: any) {
      console.error(e);
      alert('Booking failed. Please try again.');
    }
  }
}
