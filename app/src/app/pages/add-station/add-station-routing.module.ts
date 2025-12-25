import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddStationPage } from './add-station.page';

const routes: Routes = [
  {
    path: '',
    component: AddStationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddStationPageRoutingModule {}
