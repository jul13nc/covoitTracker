import { Injectable } from '@angular/core';
import {Member} from "./model/member";
import {Observable, of} from "rxjs";
import {Trip} from "./model/trip";

const EXAMPLE_DATA: Trip[] = [
  {id: 1, date: new Date(Date.now()), driver: 'loeb', passengers:['helena']},

];

@Injectable({
  providedIn: 'root'
})
export class BackendService {

// TODO: replace this with real data from your application


  constructor() { }

  getMembers(): Observable<Member[]> {
    const heroes = of([
      {id:12, name: 'Teet', nbTripDriver: 2, nbTripPassenger: 4},
      {id:14, name:'Coucou', nbTripDriver: 8, nbTripPassenger: 26},
    ]);
    return heroes;
  }

  getTrips(): Observable<Trip[]> {
    return of(EXAMPLE_DATA)
  }

}
