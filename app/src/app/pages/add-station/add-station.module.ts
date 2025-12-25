import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddStationPageRoutingModule } from './add-station-routing.module';

import { AddStationPage } from './add-station.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddStationPageRoutingModule,
    AddStationPage
  ],
  declarations: []
})
export class AddStationPageModule { }
