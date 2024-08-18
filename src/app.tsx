import '~/assets/css/App.css'
import React, { useEffect, useRef, useState } from 'react'
import Maps from '~/components/maps'
import Header from '~/components/header'
import { useMapInfo } from './hooks/map'
import { useSearch } from './hooks/search'
import { useMenu } from './hooks/menu'

const App = (): JSX.Element => {
  const {
    latLng,
    cbcCode,
    setMapInfo,
    zoomLevel
  } = useMapInfo()
  const { isMenuOpen, toggleMenu, setIsMenuOpen } = useMenu(false)
  const { historyList, updateHistoryList } = useSearch('')
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    updateHistoryList(historyList, latLng, cbcCode)
  }, [latLng])

  return (
    <div className="App">
      <Header
        isMenuOpen={isMenuOpen}
        historyList={historyList}
        setMapState={setMapInfo}
        toggleMenu={toggleMenu}
      />
      <Maps latLng={latLng} zoomLevel={zoomLevel} setIsMenuOpen={setIsMenuOpen} />
    </div>
  )
}

export default App
