export interface MapState {
  lat: number;
  lng: number;
  cbcCode: string;
  zoomLevel?: number;
  menuState: boolean;
}
export interface History {
  cbcCode: string;
  lat: number;
  lng: number;
}
export interface HeaderProperties {
  historyList: History[];
  setMapState: (mapState: MapState) => void;
}
