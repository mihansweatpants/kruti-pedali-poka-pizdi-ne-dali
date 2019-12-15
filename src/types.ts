export interface TrackData {
  ID: number;
  Name: string;
  PortionName: string;
  Type: string[];
  Width: number;
  Location: string;
  DepartamentalAffiliation: string;
  OperOrgName: string;
  ObjectOperOrgPhone: string;
  global_id: number;
  geoData: GeoData;
}

interface GeoData {
  type: string;
  coordinates: number[][][];
}
