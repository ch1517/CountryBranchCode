import './assets/css/App.css';
import Maps from './modules/Maps';
import Header from './modules/Header';
import React from 'react';
import { useState } from 'react';

interface LatLngInterface {
  lat: number;
  lng: number;
}
function App() {
  const [latLng, setLatLng] = useState<LatLngInterface>({
    lat: 36.37216,
    lng: 127.36035,
  });
  const [zoomLevel, setZoomLevel] = useState<number>(7);
  const [menuState, setMenuState] = useState<boolean>(false); // history menu toggle
  const [historyList, setHistoryList] = useState<any[]>([]); // history list

  //App.js의 state 생성
  const setAppState = (
    _lat: number,
    _lng: number,
    _cbcCode: string,
    _zoomLevel: number | null,
    _menuState: boolean,
  ) => {
    let _historyList: any[] = [...historyList];
    if (_zoomLevel === null) {
      _zoomLevel = 21;
    }

    if (_lat === null) {
      _lat = latLng.lat;
    } else if (_lng === null) {
      _lng = latLng.lng;
    } else {
      // history array 요소 중 lat, lng이 같은 값
      let sameValue = _historyList.filter((item) => item.lat === _lat && item.lng === _lng);
      if (sameValue.length === 0) {
        sameValue = [{ cbcCode: _cbcCode, lat: _lat, lng: _lng }];
      }
      const otherValueList = _historyList.filter((item) => item.lat !== _lat || item.lng !== _lng);
      _historyList = [sameValue[0], ...otherValueList];
    }
    setLatLng({
      lat: _lat,
      lng: _lng,
    });
    setZoomLevel(_zoomLevel);
    setMenuState(_menuState);
    setHistoryList(_historyList);
  };

  return (
    <div className="App">
      <Header
        menuState={menuState}
        historyList={historyList}
        setAppState={setAppState}
        setMenuState={setMenuState}
      ></Header>
      <Maps latLng={latLng} zoomLevel={zoomLevel} setMenuState={setMenuState}></Maps>
    </div>
  );
}

export default App;
