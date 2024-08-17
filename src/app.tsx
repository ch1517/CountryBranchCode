import './assets/css/App.css'
import React, { useState } from 'react'
import Maps from './components/maps'
import Header from './components/header'
import { History, MapState } from './types/header'
import { LatLngType } from './types/convert-cbc'

const App = (): JSX.Element => {
  const [latLng, setLatLng] = useState<LatLngType>({
    lat: 36.372_16,
    lng: 127.360_35
  })
  const [zoomLevel, setZoomLevel] = useState<number>(7)
  const [menuState, setMenuState] = useState<boolean>(false) // history menu toggle
  const [historyList, setHistoryList] = useState<History[]>([]) // history list

  // App.js의 state 생성
  const setMapState = (mapState: MapState): void => {
    const {
      lat, lng, cbcCode
    } = mapState
    const newZoomLevel = mapState.zoomLevel ?? 21
    let newLat = lat
    let newLng = lng
    let newHistoryList: History[] = [...historyList]

    if (lat === null) {
      newLat = latLng.lat
    } else if (lng === null) {
      newLng = latLng.lng
    } else {
      // history array 요소 중 lat, lng이 같은 값
      let sameValue = newHistoryList.filter((item) => item.lat === lat && item.lng === lng)
      if (sameValue.length === 0) {
        sameValue = [{ cbcCode, lat, lng }]
      }
      const otherValueList = newHistoryList.filter((item) => item.lat !== lat || item.lng !== lng)
      newHistoryList = [sameValue[0], ...otherValueList]
    }
    setLatLng({
      lat: newLat,
      lng: newLng
    })
    setZoomLevel(newZoomLevel)
    setMenuState(menuState)
    setHistoryList(newHistoryList)
  }

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
  )
}

export default App
