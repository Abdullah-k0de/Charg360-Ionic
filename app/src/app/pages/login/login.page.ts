import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  mode: 'driver' | 'business' = 'driver'; // Segment value
  isLogin = true; // Toggle for Business Login/Signup

  // Form Models
  email = '';
  password = '';
  fullName = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() { }

  async loginAnonymously() {
    try {
      await this.authService.loginAnonymously();
      this.router.navigate(['/tabs/home']);
    } catch (e) {
      console.error(e);
      alert('Error entering as guest');
    }
  }

  async handleBusinessAuth() {
    if (this.isLogin) {
      await this.loginBusiness();
    } else {
      await this.signupBusiness();
    }
  }

  async loginBusiness() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/tabs/wallet']); // Business lands on wallet/dashboard
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Login failed');
    }
  }

  async signupBusiness() {
    try {
      // Reusing 'email' as name for this mockup if name field is missing in UI, or just empty
      // In a real app we'd bind specific fields
      const name = this.fullName || this.email.split('@')[0];
      await this.authService.signUp(this.email, this.password, name, 'business');
      this.router.navigate(['/tabs/wallet']);
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Signup failed');
    }
  }
}
