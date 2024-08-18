export interface LatLngType {
  lat: number;
  lng: number;
}

export interface ZoomLevelCheckProperties {
  zoomLevel: number;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
}

export interface MapsProperties {
  latLng: LatLngType;
  zoomLevel: number;
}

export interface LineInfo {
  latLongArr: [number, number][]
  id: string
  cbcText: string
}
