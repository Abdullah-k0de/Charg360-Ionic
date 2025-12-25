import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth';
import { BookingService } from '../../services/booking'; // reusing for api call if needed

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SubscriptionPage implements OnInit {
  currentPlan = 'free'; // 'free' or 'gold'

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      // In real app, check user.subscriptionStatus
      if (user && user.role === 'business') {
        // Maybe business has a different plan, but simplistic for now
      }
    });
  }

  async selectPlan(plan: 'free' | 'gold') {
    if (plan === 'free') {
      this.currentPlan = 'free';
      alert('You are on the Basic Plan.');
    } else {
      // Redirect to specific Stripe Payment Link
      window.location.href = 'https://buy.stripe.com/test_14A9AL36pepcewp77Cbo400';
    }
  }
}

