/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-alert */
import '../assets/css/App.css'
import React, { FormEvent, useState } from 'react'
import { h, w } from '../constants/cbc'
import { convertToCbc, convertToLatLng } from '../helper/convert-cbc'
import { validateLatLngRange } from '../helper/latlng'
import { isMobile } from '../helper/agent'
import { HeaderProperties, History, MapState } from '../types/header'
import titleLogo from '../assets/images/title-logo.png'

const App: React.FC<HeaderProperties> = ({
  menuState, historyList, setMapState, setMenuState
}) => {
  const [searchText, setSearchText] = useState<string>('') // 검색창에 입력한 값

  // 검색 버튼을 눌렀을 때 호출되는 handler
  const pushToApp = (event: FormEvent<Element>): void => {
    // 기존의 form event를 막는다.
    event.preventDefault()

    let s: string[] = searchText.split(',')
    const mapState: MapState = {
      cbcCode: '',
      lat: 0,
      lng: 0,
      menuState: false
    }
    // lat, lng 으로 주어질 때
    if (s.length === 2) {
      mapState.lat = Number.parseFloat(s[0])
      mapState.lng = Number.parseFloat(s[1])
      if (validateLatLngRange(mapState.lat, mapState.lng)) {
        const cbc = convertToCbc([mapState.lng, mapState.lat])
        mapState.cbcCode = `${cbc[0]} ${cbc[1]} ${cbc[2]}`
        // App.js로 보내는 작업, App.js에서는 state 설정을 변경한다.
        setMapState(mapState)
      } else {
        alert("ex. '32.66367, 124.43291'")
      }
    } else {
      s = searchText.split(' ')
      // 국가지점번호로 주어질 때
      if (s.length === 3) {
        // s[0](ex.가나)가 문자이며 두 글자이고, 범위 안에 해당될 때
        const check1 = typeof s[0] === 'string'
          && s[0].length === 2
          && Object.values(w).includes(s[0][0])
          && Object.values(h).includes(s[0][1])
        // s[1],s[2]는 숫자이면서 네 자리
        const check2 = !Number.isNaN(Number(s[1])) && s[1].length === 4
        const check3 = !Number.isNaN(Number(s[2])) && s[2].length === 4
        if (!check1 || !check2 || !check3) {
          alert("ex. '가가 1234 1234'")
        } else {
          const latLng: any = convertToLatLng(searchText)
          if (latLng === -1) {
            // convertToLatLng Error
            alert('ex. 가가 1234 1234')
          } else {
            // 그 외의 경우
            // App.js로 보내는 작업, App.js에서는 state 설정을 변경한다.
            setMapState({
              ...mapState,
              cbcCode: searchText,
              lat: latLng[1],
              lng: latLng[0]
            })
          }
        }
      } else {
        alert("ex. '32.66367, 124.43291' or '가가 1234 1234'")
      }
    }
  }

  // history 메뉴 toggle (mobile 경우)
  // mobile의 경우 history 버튼이 없기 때문에 검색 input focus 설정 시 history 영역 호출
  const menuSateChangeMobile = (): void => {
    // 모바일 환경에서만 input Focus, Blur로 history 영역 제어
    if (isMobile()) {
      setMenuState(true)
    }
  }
  const onClickHistory = ({ lng, lat, cbcCode }: History): void => {
    setMapState({
      cbcCode,
      lat,
      lng,
      menuState: true
    })
    setSearchText(cbcCode)
  }
  const makeHistory = (historyArray: History[]): JSX.Element => (
    <div>
      {historyArray.map(({ cbcCode, lat, lng }) => (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div
          key={`history-${cbcCode}`}
          className="historyList"
          onClick={() => onClickHistory({ cbcCode, lat, lng })}
        >
          <img src="/CountryBranchCode/images/marker.png" alt="" />
          <div className="codeDiv">
            <div className="cbcCode">{cbcCode}</div>
            <div className="latlng">
              {lat.toFixed(5)}
              ,
              {lng.toFixed(5)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
  return (
    <div className="header">
      <div className="left-menu">
        <div className="title">
          <img className="logo" src={titleLogo} alt="" />
          <b>국가지점번호</b>
        </div>
      </div>
      <div className="search-container">
        <form className="search" onSubmit={pushToApp}>
          <input
            onFocus={menuSateChangeMobile}
            onBlur={menuSateChangeMobile}
            type="text"
            value={searchText}
            placeholder="32.66367, 124.43291 or 가가 1234 1234"
            // 검색창에 입력하는 값이 달라질 때마다 호출되는 handler
            onChange={(event) => setSearchText(event.target.value)}
          />
          <button className="search-button" type="submit">
            <i className="fas fa-search" />
          </button>
        </form>
        <div className={menuState ? 'historyOpen' : 'historyClose'}>{makeHistory(historyList)}</div>
        {/* history 메뉴 toggle (Window의 경우) */}
        <button className="toggleBtn" type="button" onClick={() => setMenuState(!menuState)}>
          <i className="fas fa-history lg" />
        </button>
      </div>
    </div>
  )
}

export default App
