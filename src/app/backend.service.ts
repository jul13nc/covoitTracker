import { Injectable } from '@angular/core';
import {Member, MemberDB, TripsStats} from "./model/member";
import {Observable, of} from "rxjs";
import {Trip} from "./model/trip";

const EXAMPLE_TRIPS: Trip[] = [
  {id: 1, date: new Date(Date.now()), driver: 'loeb', passengers:['helena']},
  {id: 2, date: new Date(Date.now()), driver: 'One', passengers:['Two']},
  {id: 3, date: new Date(Date.now()), driver: 'Two', passengers:['One']},
  {id: 4, date: new Date(Date.now()), driver: 'loeb', passengers:['One']},

];

const BASE_MEMBERS: MemberDB[] = [
  {id:1, name: 'One'},
  {id:2, name:'Two'},
  {id:3, name:'Three'},
  {id:4, name: 'Four'},
  {id:5, name:'Five'},
  {id:6, name:'Six'},
];

@Injectable({
  providedIn: 'root'
})
export class BackendService {

// TODO: replace this with real data from your application
trips = EXAMPLE_TRIPS
members: Member[] = []
  constructor() { }

  getMembers(): Observable<Member[]> {
    this.countMembersTrips();
    return of(this.members);
  }

  private countMembersTrips() {
    this.members = BASE_MEMBERS.map(db => this.countMemberTrips(db))
  }

  private countMemberTrips(db: MemberDB): Member {
    var member : Member = <Member>new Object()
    member.name = db.name
    member.id = db.id
    member.tripStats = []
    member.tripStats.push(computeStatsForTrips(this.trips, 2, member))
    member.tripStats.push(computeStatsForTrips(this.trips, 3, member))
    member.tripStats.push(computeStatsForTrips(this.trips, 4, member))
    member.tripStats.push(computeStatsForTrips(this.trips, 5, member))
    console.log(member.tripStats)
    member.co2 = this.getCo2(member)
    member.km = this.getKm(member)
    // Add 1 point per passenger when driver
    // Remove 1 point per passenger trip
    var nbPoints = 0
    console.log(nbPoints)
    nbPoints += member.tripStats.map(trip => trip.nbDrive * (trip.nbPerson -1)).reduce(function (result, item) { return result + item})
    console.log(nbPoints)
    nbPoints -= member.tripStats.map(trip => trip.nbPassenger).reduce(function (result, item) { return result + item})
    console.log(nbPoints)
    member.nbPoints = nbPoints
    return member
  }


  getTrips(): Observable<Trip[]> {
    return of(this.trips)
  }

  getMemberName(memberId: number): string {
    // return this.members.find(m => m.id == memberId).name
    return 'Name ' + memberId
  }

  addTrip(date: Date, driverId: number, passengersIds: number[]): void {
    var driverName = this.getMemberName(driverId)
    var passengersNames = passengersIds.map(pass => this.getMemberName(pass))
    var trip = {
      id: 54,
      date: date,
      driver: driverName,
      passengers: passengersNames
    } as Trip
    alert(trip.driver + '/' + trip.passengers)
    this.trips.push(trip)
  }

  getPassengerRatio(member: Member) : number{
    return 0;
  }

  getKm(member: Member) : number {
  var nbTrajets = member.tripStats.map(function(trip) {return trip.nbDrive + trip.nbPassenger}).reduce(function(total,currentValue){ return total + currentValue})
    return (nbTrajets * 46.3);
  }

  getCo2(member: Member) : number {
    return (member.tripStats.map(function(trip) {return trip.nbPassenger}).reduce(function(total,currentValue){ return total + currentValue}) * 46.3) * 0.1;
  }


}


function computeStatsForTrips(trips: Trip[], nbPersons: number, member: Member) {
  var tripStat : TripsStats = <TripsStats>new Object()
  tripStat.nbPassenger = trips.filter(trip => trip.passengers.length == (nbPersons - 1) && trip.passengers.includes(member.name)).length
  tripStat.nbDrive = trips.filter(trip => trip.passengers.length == (nbPersons - 1) && trip.driver == member.name).length
  tripStat.nbPerson = nbPersons
  return tripStat;
}

function nbTrips(trip: TripsStats) : number {
  return trip.nbDrive + trip.nbPassenger
}
