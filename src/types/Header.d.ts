export type HeaderProps = {
  menuState: boolean;
  historyList: any[];
  setAppState: (lat: number, lng: number, cbcText: string, zoomLevel: number | null, menuState: boolean) => void;
  setMenuState: (menuState: boolean) => void;
}
