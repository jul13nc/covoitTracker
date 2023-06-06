import { Component, OnInit } from '@angular/core';
import {BackendService} from "../backend.service";
import {Member} from "../model/member";

export interface TripDialogResult {
  date: Date,
  driver: String,
  passengers: String[]
}


@Component({
  selector: 'app-trip-dialog',
  templateUrl: './trip-dialog.component.html',
  styleUrls: ['./trip-dialog.component.css']
})
export class TripDialogComponent implements OnInit {

  members: Member[] = []
  passagers: Member[] = []
  driver: number | undefined

  constructor(private backendService: BackendService) {
    backendService.getMembers().subscribe(members => this.refreshMembers(members))
  }

  refreshMembers(members: Member[]) {
    this.members = members
    this.driver = undefined
    this.updatePassengers()
  }

  ngOnInit(): void {
  }

  updatePassengers(): void {
    this.passagers = this.members.filter(item => (item.id != this.driver))
  }

}
