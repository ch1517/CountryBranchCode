/* eslint-disable no-unused-vars */
export type MapState = {
  lat: number;
  lng: number;
  cbcCode: string;
  zoomLevel: number | null;
  menuState: boolean;
};

export type HeaderProps = {
  menuState: boolean;
  historyList: any[];
  setMapState: (mapState: MapState) => void;
  setMenuState: (menuState: boolean) => void;
};
