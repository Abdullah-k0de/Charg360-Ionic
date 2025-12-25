import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService, UserProfile } from '../../services/auth';
import { StationService, Station } from '../../services/station';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  user$: Observable<UserProfile | null> = of(null);

  // Station Data Management
  private allStations: Station[] = [];
  private stationsSubject = new BehaviorSubject<Station[]>([]);
  stations$ = this.stationsSubject.asObservable();

  // Search
  searchTerm: string = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private stationService: StationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user$ = this.authService.user$;
    this.loadStations();
  }

  loadStations() {
    this.stationService.getStations().subscribe(stations => {
      this.allStations = stations;
      this.filterStations(); // Initial push
    });
  }

  filterStations() {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.stationsSubject.next(this.allStations);
      return;
    }
    const filtered = this.allStations.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.address.toLowerCase().includes(term)
    );
    this.stationsSubject.next(filtered);
  }

  goToStation(station: Station) {
    this.router.navigate(['/station-details'], { state: { station } });
  }

  addStation() {
    this.router.navigate(['/add-station']);
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (e) {
      console.error(e);
    }
  }
}
