import {Injectable} from '@angular/core';
import {Member, MemberDB, TripsStats} from "./model/member";
import {Observable, of} from "rxjs";
import {Trip} from "./model/trip";
import {AngularFirestore, QueryDocumentSnapshot} from "@angular/fire/compat/firestore";
//
// const EXAMPLE_TRIPS: Trip[] = [
//   {id: 1, date: new Date(Date.now()), driver: 'loeb', passengers:['helena']},
//   {id: 2, date: new Date(Date.now()), driver: 'One', passengers:['Two']},
//   {id: 3, date: new Date(Date.now()), driver: 'Two', passengers:['One']},
//   {id: 4, date: new Date(Date.now()), driver: 'loeb', passengers:['One']},
//
// ];

const KM_AR_LABALME = 46.3*2

@Injectable({
  providedIn: 'root'
})
export class BackendService {

// TODO: replace this with real data from your application
trips : Trip[] = []//= EXAMPLE_TRIPS
members: Member[] = []
  constructor(private store: AngularFirestore) {
    this.initMembersAndTrips()
  }

  private initMembersAndTrips() {
    this.store.collection('membres').snapshotChanges().subscribe(
      responseItems =>
        responseItems.forEach(reponseItem => {
        let values = reponseItem.payload.doc.data()
        var member : Member = <Member>new Object()
        // @ts-ignore
        member.name = values.prenom + " " + values.nom
        // @ts-ignore
        member.id = reponseItem.payload.doc.id
        this.members.push(member)

          this.initTrips()
      })
      )
  }

  private initTrips() {

    // this.store.collection('voyages').get().subscribe(
    //   responseItems =>
    //     responseItems.forEach(responseItem => {
    //       let trip = this.getTripFromRemoteDB(responseItem)
    //       this.addorUpdateTrip(trip)
    //     })
    // )
    this.store.collection('voyages').snapshotChanges().subscribe(
      responseItems =>
        responseItems.forEach(responseItem => {
          console.log(responseItem.payload.doc.data())
          if (responseItem.type == "added" || responseItem.type == "modified") {
            let trip = this.getTripFromRemoteDB(responseItem.payload.doc)
            this.addorUpdateTrip(trip)
          } else if (responseItem.type == "removed") {
            delete this.trips[this.trips.findIndex(t => t.id == responseItem.payload.doc.id)]
          }

        })

    )
  }

  private getTripFromRemoteDB(reponseItem: firebase.default.firestore.QueryDocumentSnapshot<unknown>): Trip {
    let values = reponseItem.data()
    var trip : Trip = <Trip>new Object()
    trip.id = reponseItem.id
    // @ts-ignore
    trip.driver = this.getMemberName(values.pilote)
    // @ts-ignore
    trip.date = values.date.toDate()
    // @ts-ignore
    trip.passengers = values.passagers.map(item => this.getMemberName(item))
    return trip
  }

  private addorUpdateTrip(trip: Trip) {
    let index = this.trips.findIndex(t => t.id == trip.id)
    if (index > -1) {
      this.trips[index] = trip
    } else {
      this.trips.push(trip)
    }
  }

  getMembers(): Observable<Member[]> {
    this.countMembersTrips();
    return of(this.members);
  }

  private countMembersTrips() {
    this.members = this.members.map(db => this.countMemberTrips(db))
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
    member.co2 = this.getCo2(member)
    member.km = this.getKm(member)
    var nbPoints = 0
    // Remove 1 point per passenger trip
    nbPoints += member.tripStats.map(trip => trip.nbDrive * (trip.nbPerson -1)).reduce(function (result, item) { return result + item})
    // Add 1 point per passenger when driver
    nbPoints -= member.tripStats.map(trip => trip.nbPassenger).reduce(function (result, item) { return result + item})
    member.nbPoints = nbPoints
    return member
  }


  getTrips(): Observable<Trip[]> {
    return of(this.trips)
  }

  getMemberName(memberId: string): string {
    // return this.members.find(m => m.id == memberId).name
    const member = this.members.find(m => m.id == memberId);
    if (member) {
      return member.name
    }
    return 'INCONNU'
  }

  addTrip(tripDate: Date, driverId: string, passengersIds: string[]): void {
  var trip = {
    date: tripDate,
    pilote: driverId,
    passagers: passengersIds
  }
  this.store.collection('voyages').add(trip)

  }

  getKm(member: Member) : number {
  var nbTrajets = member.tripStats.map(function(trip) {return trip.nbDrive + trip.nbPassenger}).reduce(function(total,currentValue){ return total + currentValue})
    return (nbTrajets * KM_AR_LABALME);
  }

  getCo2(member: Member) : number {
    return (member.tripStats.map(function(trip) {return trip.nbPassenger}).reduce(function(total,currentValue){ return total + currentValue}) * KM_AR_LABALME) * 0.1;
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
