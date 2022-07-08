import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TripsComponent} from "./trips/trips.component";
import {MembersComponent} from "./members/members.component";

const routes: Routes = [
  { path: 'members', component:MembersComponent },
  { path: 'trips', component:TripsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
