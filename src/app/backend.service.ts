import {Injectable} from '@angular/core';
import {Member, MemberDB, TripsStats} from "./model/member";
import {combineLatest, filter, Observable} from "rxjs";
import {Trip, TripDB} from "./model/trip";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map} from "rxjs/operators";

const KM_AR_LABALME = 46.3 * 2

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  tripsDB$: Observable<TripDB[]> = new Observable<TripDB[]>()
  membersDB$: Observable<MemberDB[]> = new Observable<MemberDB[]>()
  members$: Observable<Member[]> = new Observable<Member[]>()

  constructor(private store: AngularFirestore) {
    this.initMembersAndTrips()
  }

  private initMembersAndTrips() {
    // Use combineLatest
    this.membersDB$ = this.store.collection('membres').snapshotChanges().pipe(
      map(elems => elems.map(responseItem => {
          let values = responseItem.payload.doc.data()
          var member: MemberDB = <MemberDB>new Object()
          // @ts-ignore
          member.name = values.prenom// + " " + values.nom
          // @ts-ignore
          member.id = responseItem.payload.doc.id
          // @ts-ignore
          member.hidden = values.hidden || false
          return member
        }).filter(member => !member.hidden)
      ))

    this.tripsDB$ = this.store.collection('voyages').snapshotChanges().pipe(map(
      responseItems =>
        responseItems.map(
          responseItem => {
            console.log("Item mapped " + responseItem)
            return this.getTripFromRemoteDB(responseItem.payload.doc)
          }
        )
    ))
  }

  private getTripFromRemoteDB(reponseItem: firebase.default.firestore.QueryDocumentSnapshot<unknown>): TripDB {
    let values = reponseItem.data()
    var trip: TripDB = <TripDB>new Object()
    trip.id = reponseItem.id
    // @ts-ignore
    trip.pilote = values.pilote
    // @ts-ignore
    trip.date = values.date.toDate()
    // @ts-ignore
    trip.passagers = values.passagers
    return trip
  }


  getTrips(): Observable<Trip[]> {
    // return this.trips$
    return combineLatest(this.tripsDB$, this.membersDB$).pipe(
      map(([trips, members]) => {
        return trips.map(tripDB => {
          var trip: Trip = <Trip>new Object()
          trip.id = tripDB.id
          // @ts-ignore
          trip.driver = this.getMemberName(tripDB.pilote, members)
          // @ts-ignore
          trip.date = tripDB.date
          // @ts-ignore
          trip.passengers = tripDB.passagers.map(pass => this.getMemberName(pass, members))
          return trip
        })
      })
    )
  }

  getMembers(): Observable<Member[]> {
    return combineLatest(this.tripsDB$, this.membersDB$).pipe(
      map(([trips, members]) => {
        return members.map(member => {
          return this.countMemberTrips(member, trips)
        })
      })
    )
  }

  private countMemberTrips(db: MemberDB, trips: TripDB[]): Member {
    var member: Member = <Member>new Object()
    member.name = db.name
    member.id = db.id
    member.tripStats = []
    member.tripStats.push(computeStatsForTrips(trips, 2, member))
    member.tripStats.push(computeStatsForTrips(trips, 3, member))
    member.tripStats.push(computeStatsForTrips(trips, 4, member))
    member.tripStats.push(computeStatsForTrips(trips, 5, member))
    member.co2 = this.getCo2(member)
    member.kmTotal = this.getKmTotal(member)
    member.kmPass = this.getKmPassager(member)

    member.nbPoints = this.computePointsForPassengersNumber(member, 0);
    member.nbPoints2 = this.computePointsForPassengersNumber(member, 2);
    member.nbPoints3 = this.computePointsForPassengersNumber(member, 3);
    member.nbPoints4More = this.computePointsForPassengersNumberAndMore(member, 4);

    return member
  }

  // Compute points for number of passenger
  // If 0 passed, mean compute points for all trips
  private computePointsForPassengersNumber(member: Member, nbPersonCounting: Number) {
    // Remove 1 point per passenger trip
    var nbPoints = 0
    nbPoints += member.tripStats.filter(trip => trip.nbPerson == nbPersonCounting || nbPersonCounting == 0).map(trip => trip.nbDrive * (trip.nbPerson - 1)).reduce(function (result, item) {
      return result + item
    })
    // Add 1 point per passenger when driver
    nbPoints -= member.tripStats.filter(trip => trip.nbPerson == nbPersonCounting || nbPersonCounting == 0).map(trip => trip.nbPassenger).reduce(function (result, item) {
      return result + item
    })
    return nbPoints;
  }

  // Compute points for number of passenger
  // If 0 passed, mean compute points for all trips
  private computePointsForPassengersNumberAndMore(member: Member, nbPersonCounting: Number) {
    // Add 3.5 points per trip when driving
    var nbPoints = 0
    nbPoints += member.tripStats.filter(trip => trip.nbPerson >= nbPersonCounting).map(trip => trip.nbDrive).reduce(function (result, item) {
      return result + item * 3.5
    }, 0)
    // Remove 1 point per trip when passenger
    nbPoints -= member.tripStats.filter(trip => trip.nbPerson >= nbPersonCounting).map(trip => trip.nbPassenger).reduce(function (result, item) {
      return result + item
    })
    return nbPoints;
  }

  getMemberName(memberId: string, members: MemberDB[]): string {
    // return this.members.find(m => m.id == memberId).name
    const member = members.find(m => m.id == memberId)
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

  getKmTotal(member: Member): number {
    var nbTrajets = member.tripStats.map(function (trip) {
      return trip.nbDrive + trip.nbPassenger
    }).reduce(function (total, currentValue) {
      return total + currentValue
    })
    return (nbTrajets * KM_AR_LABALME);
  }

  getKmPassager(member: Member): number {
    var nbTrajets = member.tripStats.map(function (trip) {
      return trip.nbPassenger
    }).reduce(function (total, currentValue) {
      return total + currentValue
    })
    return (nbTrajets * KM_AR_LABALME);
  }

  getCo2(member: Member): number {
    return (member.tripStats.map(function (trip) {
      return trip.nbPassenger
    }).reduce(function (total, currentValue) {
      return total + currentValue
    }) * KM_AR_LABALME) * 0.1;
  }

}


function computeStatsForTrips(trips: TripDB[], nbPersons: number, member: MemberDB) {
  var tripStat: TripsStats = <TripsStats>new Object()
  tripStat.nbPassenger = trips.filter(trip => trip.passagers.length == (nbPersons - 1) && trip.passagers.includes(member.id)).length
  tripStat.nbDrive = trips.filter(trip => trip.passagers.length == (nbPersons - 1) && trip.pilote == member.id).length
  tripStat.nbPerson = nbPersons
  return tripStat;
}
