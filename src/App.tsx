import './assets/css/App.css';
import React, { useState } from 'react';
import Maps from './components/Maps';
import Header from './components/Header';
import { MapState } from './types/Header';
import { LatLngType } from './types/ConvertCBC';

const App = () => {
  const [latLng, setLatLng] = useState<LatLngType>({
    lat: 36.372_16,
    lng: 127.360_35
  });
  const [zoomLevel, setZoomLevel] = useState<number>(7);
  const [menuState, setMenuState] = useState<boolean>(false); // history menu toggle
  const [historyList, setHistoryList] = useState<any[]>([]); // history list

  // App.js의 state 생성
  const setMapState = (mapState: MapState) => {
    let {
      lat, lng, cbcCode, zoomLevel, menuState
    } = mapState;
    let _historyList: any[] = [...historyList];
    if (zoomLevel === null) {
      zoomLevel = 21;
    }

    if (lat === null) {
      lat = latLng.lat;
    } else if (lng === null) {
      lng = latLng.lng;
    } else {
      // history array 요소 중 lat, lng이 같은 값
      let sameValue = _historyList.filter((item) => item.lat === lat && item.lng === lng);
      if (sameValue.length === 0) {
        sameValue = [{ cbcCode, lat, lng }];
      }
      const otherValueList = _historyList.filter((item) => item.lat !== lat || item.lng !== lng);
      _historyList = [sameValue[0], ...otherValueList];
    }
    setLatLng({
      lat,
      lng
    });
    setZoomLevel(zoomLevel);
    setMenuState(menuState);
    setHistoryList(historyList);
  };

  return (
    <div className="App">
      <Header
        menuState={menuState}
        historyList={historyList}
        setMapState={setMapState}
        setMenuState={setMenuState}
      />
      <Maps latLng={latLng} zoomLevel={zoomLevel} setMenuState={setMenuState} />
    </div>
  );
};

export default App;
