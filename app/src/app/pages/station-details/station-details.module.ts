import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StationDetailsPageRoutingModule } from './station-details-routing.module';

import { StationDetailsPage } from './station-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StationDetailsPageRoutingModule,
    StationDetailsPage
  ],
  declarations: []
})
export class StationDetailsPageModule { }
