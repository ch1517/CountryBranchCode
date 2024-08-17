/* eslint-disable no-unused-vars */
export interface LatLngType {
  lat: number;
  lng: number;
}

export interface ZoomLevelCheckProperties {
  zoomLevel: number;
  setMenuState: (menuState: boolean) => void;
}

export interface MapsProperties {
  latLng: LatLngType;
  zoomLevel: number;
  setMenuState: (menuState: boolean) => void;
}
