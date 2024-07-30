export interface MemberDB {
  id: string;
  name: string;
  hidden: boolean;
}

export interface Member {
  id: string;
  name: string;
  hidden: boolean;
  tripStats: TripsStats[];
  nbPoints: number,
  nbPoints2: number,
  nbPoints3: number,
  nbPoints4More: number,
  km: number,
  co2: number
}

export interface TripsStats {
  nbPerson: number,
  nbDrive: number,
  nbPassenger: number
}
