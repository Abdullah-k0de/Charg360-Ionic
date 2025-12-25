import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddStationPage } from './add-station.page';

describe('AddStationPage', () => {
  let component: AddStationPage;
  let fixture: ComponentFixture<AddStationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
