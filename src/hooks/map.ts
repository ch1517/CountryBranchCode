import { useState } from 'react'
import { LatLngType } from '~/types/convert-cbc'
import { MapState } from '~/types/header'

interface useMapInfoReturnType {
  cbcCode: string
  latLng: LatLngType
  setCbcCode: (cbcCode: string) => void
  setLatLng: (latLng: LatLngType) => void
  setMapInfo: (mapState: MapState) => void
  setZoomLevel: (zoomLevel: number) => void
  zoomLevel: number
}
export const useMapInfo = (): useMapInfoReturnType => {
  const [latLng, setLatLng] = useState<LatLngType>({ lat: 36.372_16, lng: 127.360_35 })
  const [zoomLevel, setZoomLevel] = useState<number>(7)
  const [cbcCode, setCbcCode] = useState<string>('')

  const setMapInfo = (mapState: MapState): void => {
    const { lat, lng } = mapState
    const newZoomLevel = mapState.zoomLevel ?? 21
    const newLat = lat ?? latLng.lat
    const newLng = lng ?? latLng.lng

    setLatLng({ lat: newLat, lng: newLng })
    setZoomLevel(newZoomLevel)
    setCbcCode(mapState.cbcCode)
  }

  return {
    cbcCode,
    latLng,
    setCbcCode,
    setLatLng,
    setMapInfo,
    setZoomLevel,
    zoomLevel
  }
}
