import {Component, Inject, OnInit} from '@angular/core';
import {BackendService} from "../backend.service";
import {Member} from "../model/member";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

export interface TripDialogResult {
  date: Date,
  driver: string,
  passengers: string[]
}

export interface TripDialogData {
  date: Date,
  driver: string,
  passengers: number[]
}


@Component({
  selector: 'app-trip-dialog',
  templateUrl: './trip-dialog.component.html',
  styleUrls: ['./trip-dialog.component.css']
})
export class TripDialogComponent implements OnInit {

  members: Member[] = []
  passengers: Member[] = []

  constructor(private backendService: BackendService,
              @Inject(MAT_DIALOG_DATA) public data: TripDialogData) {
    backendService.getMembers().subscribe(members => this.refreshMembers(members))
  }

  refreshMembers(members: Member[]) {
    this.members = members
    this.updatePassengers()
  }

  ngOnInit(): void {
  }

  updatePassengers(): void {
    this.passengers = this.members.filter(item => (item.id != this.data.driver))
  }

}
