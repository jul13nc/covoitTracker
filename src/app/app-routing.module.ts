import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TripsComponent} from "./trips/trips.component";
import {MembersComponent} from "./members/members.component";
import {AuthGuard} from "./shared/guard/auth.guard";
import {SignInComponent} from "./sign-in/sign-in.component";

const routes: Routes = [
  { path: '', redirectTo: '/members', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'members', component:MembersComponent, canActivate: [AuthGuard] },
  { path: 'trips', component:TripsComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
