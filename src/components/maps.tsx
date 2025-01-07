/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState, useCallback } from 'react'
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Tooltip,
  MapConsumer,
  useMapEvents
} from 'react-leaflet'
import { LatLng, LeafletMouseEvent } from 'leaflet'
import { LineInfo, MapsProperties, ZoomLevelCheckProperties } from '~/types/maps'
import { convertToCbc, getLineInfoArray } from '~/helper/convert-cbc'
import { MAX_NATIVE_ZOOM, MAX_ZOOM } from '~/constants/map'
import { useMenuContext } from '~/contexts/menu-context'
import { getSurroundingGrid } from '~/helper/surround'

// ZoomLevelCheck 컴포넌트
const ZoomLevelCheck = ({ zoomLevel, setIsMenuOpen }: ZoomLevelCheckProperties): JSX.Element => {
  const [mapZoomLevel, setMapZoomLevel] = useState<number>(zoomLevel)
  const [lineInfoArray, setLineInfoArray] = useState<LineInfo[]>([])
  const [surrondCode, setSurrondCode] = useState<string[]>([])
  const map = useMapEvents({
    dragstart: () => setIsMenuOpen(false),
    moveend: () => updateLineArray(),
    zoomend: () => {
      // setSurrondCode([])
      setMapZoomLevel(map.getZoom())
      setIsMenuOpen(false)
      updateLineArray()
    },
    click: (arg) => handleMapClick(arg)
  })
  const [forceUpdate, setForceUpdate] = useState<number>(0) // 강제 업데이트를 위한 상태 추가

  const updateLineArray = useCallback(() => {
    if (map) {
      setLineInfoArray(getLineInfoArray(mapZoomLevel, map.getBounds()))
    }
  }, [mapZoomLevel, map, forceUpdate])

  useEffect(() => {
    updateLineArray()
  }, [mapZoomLevel, updateLineArray, forceUpdate])

  const handlePolygonClick = useCallback((event: LeafletMouseEvent) => {
    convertToCbc([event.latlng.lng, event.latlng.lat])
  }, [])
  
  const handleMapClick = useCallback((event: { latlng: LatLng }) => {
    console.log('\n\n\n\n--------------------------------------------------------------------')
    console.log(`[위경도]\nLat: ${event.latlng.lat}, Lng: ${event.latlng.lng}`)
    const code = convertToCbc([event.latlng.lng, event.latlng.lat])
    setSurrondCode(getSurroundingGrid(code, mapZoomLevel));
    setForceUpdate(prev => prev + 1) // 강제 업데이트 트리거
  }, [mapZoomLevel])

  return (
    <div>
      {lineInfoArray.map(({ id, latLongArr, cbcText, compareCode }) => (
        <Polygon
          key={`${id}-${forceUpdate}`}
          positions={latLongArr}
          color={surrondCode.includes(compareCode) ? 'red' : 'white'}
          eventHandlers={{ click: handlePolygonClick }}
        >
          <Tooltip direction="bottom" opacity={1} permanent>
            <span>{cbcText}</span>
            <br/>
            <span>{compareCode}</span>
          </Tooltip>
        </Polygon>
      ))}
    </div>
  )
}

// Maps 컴포넌트
const Maps = ({ latLng, zoomLevel }: MapsProperties): JSX.Element => {
  const [position, setPosition] = useState<[number, number]>([latLng.lat, latLng.lng])
  const [currentZoomLevel] = useState<number>(zoomLevel)
  const { setIsMenuOpen } = useMenuContext()
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null)
  const [caption, setCaption] = useState('')

  useEffect(() => {
    setPosition([latLng.lat, latLng.lng])
  }, [latLng])

  return (
    <div className="contents">
      <MapContainer
        style={{ height: '100vh' }}
        center={position}
        zoom={currentZoomLevel}
        scrollWheelZoom
      >
        <TileLayer
          maxZoom={MAX_ZOOM}
          maxNativeZoom={MAX_NATIVE_ZOOM}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.vworld.kr/req/wmts/1.0.0/532CA96F-C19D-3423-A745-FA04E44726C4/midnight/{z}/{y}/{x}.png"
        />
        <ZoomLevelCheck zoomLevel={currentZoomLevel} setIsMenuOpen={setIsMenuOpen} />
        <MapConsumer>
          {(map) => {
            useEffect(() => {
              map.setView(new LatLng(latLng.lat, latLng.lng), zoomLevel)
            }, [map, latLng, zoomLevel])
            // eslint-disable-next-line unicorn/no-null
            return null
          }}
        </MapConsumer>
        {markerPosition && (
          <Marker position={markerPosition}>
            <Tooltip>
              <p style={{ whiteSpace: 'pre-line' }}>
                {caption}
              </p>
            </Tooltip>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

export default React.memo(Maps)
