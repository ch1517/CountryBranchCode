import '~/assets/css/App.css'
import React, { useEffect, useRef } from 'react'
import Maps from '~/components/maps'
import Header from '~/components/header'
import { useMapInfo } from '~/hooks/map'
import { useSearch } from '~/hooks/search'
import { MenuProvider } from '~/contexts/menu-context'

const App = (): JSX.Element => {
  const {
    latLng,
    cbcCode,
    setMapInfo,
    zoomLevel
  } = useMapInfo()
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
      <MenuProvider>
        <Header
          historyList={historyList}
          setMapState={setMapInfo}
        />
        <Maps latLng={latLng} zoomLevel={zoomLevel} />
      </MenuProvider>
    </div>
  )
}

export default App
