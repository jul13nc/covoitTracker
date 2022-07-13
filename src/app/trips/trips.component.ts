import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
  displayedColumns = ['date', 'driver','passengers'];

  constructor(private dialog: MatDialog, private backendService: BackendService) {
    this.dataSource = new TripsDataSource(backendService);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  addTrip(): void {
    const dialogRef = this.dialog.open(TripDialogComponent, {
      width: '400px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TripDialogResult|undefined) => {
        if (!result) {
          return;
        }
        // this.todo.push(result.task);
      });
  }
}
