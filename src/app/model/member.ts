export interface MemberDB {
  id: string;
  name: string;

}

export interface Member {
  id: string;
  name: string;
  tripStats: TripsStats[];
  nbPoints: number,
  nbPoints2: number,
  nbPoints3: number,
  nbPoints4: number,
  nbPoints5: number,
  km: number,
  co2: number
}

export interface TripsStats {
  nbPerson: number,
  nbDrive: number,
  nbPassenger: number
}
