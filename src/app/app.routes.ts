import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AngularComponent } from './angular/angular.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'angular', component: AngularComponent }
];