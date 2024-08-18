import '~/assets/css/App.css'
import React from 'react'
import Maps from '~/components/maps'
import Header from '~/components/header'
import { useMapInfo } from '~/hooks/map'
import { MenuProvider } from '~/contexts/menu-context'

const App = (): JSX.Element => {
  const {
    latLng,
    setMapInfo,
    zoomLevel
  } = useMapInfo()

  return (
    <div className="App">
      <MenuProvider>
        <Header
          setMapState={setMapInfo}
        />
        <Maps latLng={latLng} zoomLevel={zoomLevel} />
      </MenuProvider>
    </div>
  )
}

export default App
