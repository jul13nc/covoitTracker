export interface MemberDB {
  id: number;
  name: string;

}

export interface Member {
  id: number;
  name: string;
  tripStats: TripsStats[];
  nbPoints: number,
  km: number,
  co2: number
}

export interface TripsStats {
  nbPerson: number,
  nbDrive: number,
  nbPassenger: number
}
