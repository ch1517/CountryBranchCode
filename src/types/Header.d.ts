/* eslint-disable no-unused-vars */
export interface MapState {
  lat: number;
  lng: number;
  cbcCode: string;
  zoomLevel: number | null;
  menuState: boolean;
}

export interface HeaderProperties {
  menuState: boolean;
  historyList: any[];
  setMapState: (mapState: MapState) => void;
  setMenuState: (menuState: boolean) => void;
}
