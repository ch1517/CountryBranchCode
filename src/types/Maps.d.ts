export type LatLngType = {
  lat: number;
  lng: number;
}

export type ZoomLevelCheckProps = {
  zoomLevel: number;
  setMenuState: (menuState: boolean) => void;
}

export type MapsProps = {
  latLng: LatLngType;
  zoomLevel: number;
  setMenuState: (menuState: boolean) => void;
}
