import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BookingService, Booking } from '../../services/booking';
import { AuthService } from '../../services/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BookingsPage implements OnInit {
  bookings$: Observable<Booking[]> = of([]);

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.bookings$ = this.authService.user$.pipe(
      switchMap(user => {
        if (user) {
          return this.bookingService.getUserBookings(user.uid);
        } else {
          return of([]);
        }
      })
    );
  }
}
