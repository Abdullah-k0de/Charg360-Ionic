import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StationService, Station } from '../../services/station';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-add-station',
  templateUrl: './add-station.page.html',
  styleUrls: ['./add-station.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddStationPage implements OnInit {
  station: Partial<Station> = {
    name: '',
    address: '',
    pricePerHour: 10,
    chargingPoints: 2,
    status: 'open',
    tags: ['Public'],
    amenities: ['Wifi', 'Cafe']
  };

  // For demo, we won't implement full file upload UI complexity yet
  // default to a placeholder if no image
  mockImage = 'assets/placeholder-station.jpg';

  constructor(
    private stationService: StationService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  async submitStation() {
    try {
      if (!this.station.name || !this.station.address) {
        alert('Please fill in Name and Address');
        return;
      }

      const user = this.authService.currentUser;
      // If we don't have a user, maybe allow for dev testing or error
      const ownerId = user ? user.uid : 'test_owner_id';

      const newStation: Station = {
        ownerId,
        name: this.station.name!,
        address: this.station.address!,
        lat: 0, // Geocoding would happen here
        lng: 0,
        images: [this.mockImage],
        status: 'open',
        pricePerHour: this.station.pricePerHour || 10,
        tags: this.station.tags || ['Public'],
        amenities: this.station.amenities || [],
        openTime: '09:00',
        closeTime: '22:00',
        chargingPoints: this.station.chargingPoints || 2
      };

      await this.stationService.addStation(newStation, []); // Pass empty file array for now

      alert('Station Created!');
      this.router.navigate(['/tabs/home']); // Go back home to see it
    } catch (e) {
      console.error(e);
      alert('Error creating station: ' + e);
    }
  }
}
