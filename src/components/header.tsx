/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-alert */
import '~/assets/css/App.css'
import React, { FormEvent } from 'react'
import { convertToCbc, convertToLatLng, isValidCbcCode } from '~/helper/convert-cbc'
import { validateLatLngRange } from '~/helper/latlng'
import { isMobile } from '~/helper/agent'
import { HeaderProperties, History } from '~/types/header'
import titleLogo from '~/assets/images/title-logo.png'
import markerImg from '~/assets/images/marker.png'
import { useSearch } from '~/hooks/search'
import { useMenuContext } from '~/contexts/menu-context'

const Header = ({
  setMapState
}: HeaderProperties) : JSX.Element => {
  const {
    searchText, setSearchText, historyList, updateHistoryList
  } = useSearch('')
  const { isMenuOpen, toggleMenu, setIsMenuOpen } = useMenuContext()

  const onSubmitHandler = (event: FormEvent<Element>): void => {
    event.preventDefault()

    const cleanedSearchText = searchText.trim()
    const textSplitArray = cleanedSearchText.includes(',')
      ? cleanedSearchText.split(',').map((text) => Number.parseFloat(text)) // 위도, 경도로 주어질 때 (ex. 32.66367, 124.43291)
      : cleanedSearchText.split(' ') // 국가지점번호로 주어질 때 (ex. 가가 1234 1234)

    // 위도, 경도로 주어질 때
    if (
      textSplitArray.length === 2
      && !Number.isNaN(textSplitArray[0])
      && !Number.isNaN(textSplitArray[1])
    ) {
      const [lat, lng] = textSplitArray
      if (typeof lat === 'number' && typeof lng === 'number' && validateLatLngRange(lat, lng)) {
        const cbc = convertToCbc([lng, lat])
        setMapState({ cbcCode: `${cbc[0]} ${cbc[1]} ${cbc[2]}`, lat, lng })
        updateHistoryList(historyList, { lat, lng }, `${cbc[0]} ${cbc[1]} ${cbc[2]}`)
      } else {
        alert("Invalid coordinates. Expected format: '32.66367, 124.43291'")
      }
    } else if (isValidCbcCode(textSplitArray)) { // 국가지점번호로 주어질 때
      const latLng = convertToLatLng(cleanedSearchText)
      if (Array.isArray(latLng)) {
        setMapState({ cbcCode: cleanedSearchText, lat: latLng[1], lng: latLng[0] })
        updateHistoryList(historyList, { lat: latLng[1], lng: latLng[0] }, cleanedSearchText)
      } else {
        alert("Invalid CBC code format. Expected format: '가가 1234 1234'")
      }
    } else {
      alert("Invalid input. Expected format: '32.66367, 124.43291' or '가가 1234 1234'")
    }
  }

  // history 메뉴 toggle (mobile 경우)
  // mobile의 경우 history 버튼이 없기 때문에 검색 input focus 설정 시 history 영역 호출
  const menuSateChangeMobile = (): void => {
    // 모바일 환경에서만 input Focus, Blur로 history 영역 제어
    if (isMobile()) {
      toggleMenu()
    }
  }
  const onClickHistory = ({ lng, lat, cbcCode }: History): void => {
    setMapState({ cbcCode, lat, lng })
    setIsMenuOpen(true)
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
          <img src={markerImg} alt="" />
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
        <form className="search" onSubmit={onSubmitHandler}>
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
        <div className={isMenuOpen ? 'historyOpen' : 'historyClose'}>{makeHistory(historyList)}</div>
        {/* history 메뉴 toggle (Window의 경우) */}
        <button className="toggleBtn" type="button" onClick={() => toggleMenu()}>
          <i className="fas fa-history lg" />
        </button>
      </div>
    </div>
  )
}

export default Header
