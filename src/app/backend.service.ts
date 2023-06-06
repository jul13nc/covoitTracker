import { Injectable } from '@angular/core';
import {Member} from "./model/member";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor() { }

  getMembers(): Observable<Member[]> {
    const heroes = of([
      {id:12, name: 'Teet', nbTripDriver: 2, nbTripPassenger: 4},
      {id:14, name:'Coucou', nbTripDriver: 8, nbTripPassenger: 26},
    ]);
    return heroes;
  }
}
