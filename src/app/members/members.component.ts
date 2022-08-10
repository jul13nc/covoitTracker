import {Component, OnInit, ViewChild} from '@angular/core';
import {Member} from "../model/member";
import {BackendService} from "../backend.service";
import {Sort} from "@angular/material/sort";
import {MatTable} from "@angular/material/table";
import {Trip} from "../model/trip";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<Trip>;
  members: Member[] = [];
  sortedMembers: Member[] = [];

  constructor(private backendService: BackendService) { }

  columnsToDisplay = ['name','nbPoints', 'km','co2'];

  ngOnInit(): void {
    this.getMembers();
    this.sortedMembers = this.members.slice();
  }

  getMembers(): void {
    this.backendService.getMembers()
      .subscribe(members => this.members = members);
  }


  sortData(sort: Sort) {
    const data = this.members.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedMembers = data;
      return;
    }

    this.sortedMembers = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        // case 'ratio':
        //   return compare(a.nbTripPassenger/a.nbTripDriver, b.nbTripPassenger/b.nbTripDriver, isAsc);
        // case 'km':
        //   return compare(a.nbTripPassenger+a.nbTripDriver, b.nbTripPassenger+b.nbTripDriver, isAsc);
        // case 'tripsDrivers':
        //   return compare(a.nbTripDriver, b.nbTripDriver, isAsc);
        // case 'tripsPassenger':
        //   return compare(a.nbTripPassenger, b.nbTripPassenger, isAsc);
        default:
          return 0;
      }
    });
  }


  getKm(member: Member) : number {
    return this.backendService.getKm(member)
  }

  getCo2(member: Member) : number {
    return this.backendService.getCo2(member)
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
