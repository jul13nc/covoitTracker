import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort, MatSortable, Sort} from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TripsDataSource } from './trips-datasource';
import {Trip} from "../model/trip";
import {MatDialog} from "@angular/material/dialog";
import {BackendService} from "../backend.service";
import {TripDialogComponent, TripDialogResult} from "../trip-dialog/trip-dialog.component";

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Trip>;
  dataSource: TripsDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['date', 'driver','passengers','id'];

  constructor(private dialog: MatDialog, private backendService: BackendService, private cdref: ChangeDetectorRef) {
    this.dataSource = new TripsDataSource(backendService);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.sort.sort({disableClear: false, id:'date',start:'desc'});
    this.cdref.detectChanges();
  }

  addTrip(): void {
    const dialogRef = this.dialog.open(TripDialogComponent, {
      width: '400px',
      data: {

      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TripDialogResult|undefined) => {
        if (!result) {
          return;
        }
        this.backendService.addTrip(result.date,result.driver,result.passengers);
        // this.todo.push(result.task);
      });
  }
}
