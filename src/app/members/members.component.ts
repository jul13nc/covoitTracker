import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Member} from "../model/member";
import {BackendService} from "../backend.service";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTable} from "@angular/material/table";
import {Trip} from "../model/trip";
import {MatPaginator} from "@angular/material/paginator";
import {MembersDatasource} from "./members-datasource";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Member>;
  dataSource : MembersDatasource;

  constructor(private backendService: BackendService, private cdref: ChangeDetectorRef) {
    this.dataSource = new MembersDatasource(backendService);
  }

  columnsToDisplay = ['name','nbPoints', 'km','co2', 'stats'];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.sort.sort({disableClear: false, id:'nbPoints',start:'asc'});
    this.cdref.detectChanges();
  }

  //
  // ngOnInit(): void {
  //   this.members = [];
  //   this.getMembers();
  //   this.sortedMembers = this.members.slice();
  //   // let defSort = {direction: 'asc', active:'nbPoints'} as Sort;
  //   // this.sortData(defSort);
  //   // this.sort.sort({disableClear: false, id:'nbPoints',start:'asc'});
  // }
  //
  // getMembers(): void {
  //   console.log("Getting members (current size is " + this.members.length)
  //   this.backendService.getMembers()
  //     .subscribe(members => {this.members = members
  //     console.log("Received members " + members.length)});
  // }

}
