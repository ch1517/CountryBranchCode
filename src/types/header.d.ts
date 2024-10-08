export interface MapState {
  lat: number;
  lng: number;
  cbcCode: string;
  zoomLevel?: number;
}
export interface History {
  cbcCode: string;
  lat: number;
  lng: number;
}
export interface HeaderProperties {
  setMapState: (mapState: MapState) => void;
}
