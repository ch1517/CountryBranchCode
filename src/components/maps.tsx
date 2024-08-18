/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState, useCallback } from 'react'
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  Tooltip,
  MapConsumer,
  useMapEvents
} from 'react-leaflet'
import { LatLng, LeafletMouseEvent } from 'leaflet'
import { MapsProperties, ZoomLevelCheckProperties } from '~/types/maps'
import { convertToCbc, getLineArray } from '~/helper/convert-cbc'
import { MAX_NATIVE_ZOOM, MAX_ZOOM } from '~/constants/map'
import { useMenuContext } from '~/contexts/menu-context'

// ZoomLevelCheck 컴포넌트
const ZoomLevelCheck = ({ zoomLevel, setIsMenuOpen }: ZoomLevelCheckProperties): JSX.Element => {
  const [mapZoomLevel, setMapZoomLevel] = useState<number>(zoomLevel)
  const [lineArray, setLineArray] = useState<any[]>([])
  const map = useMapEvents({
    dragstart: () => setIsMenuOpen(false),
    moveend: () => updateLineArray(),
    zoomend: () => {
      setMapZoomLevel(map.getZoom())
      setIsMenuOpen(false)
      updateLineArray()
    }
  })

  const updateLineArray = useCallback(() => {
    if (map) {
      setLineArray(getLineArray(mapZoomLevel, map.getBounds()))
    }
  }, [mapZoomLevel, map])

  useEffect(() => {
    updateLineArray()
  }, [mapZoomLevel, updateLineArray])

  const handlePolygonClick = useCallback((event: LeafletMouseEvent) => {
    convertToCbc([event.latlng.lng, event.latlng.lat])
  }, [])

  return (
    <div>
      {lineArray.map(({ id, latLongArr, cbcText }) => (
        <Polygon
          key={id}
          positions={latLongArr}
          color="white"
          eventHandlers={{ click: handlePolygonClick }}
        >
          <Tooltip direction="bottom" opacity={1} permanent>
            <span>{cbcText}</span>
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
  const cbc = convertToCbc([latLng.lng, latLng.lat])

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
        <Marker position={position}>
          <Popup>
            <span className="popupSpan">
              <b>{`${cbc[0]} ${cbc[1]} ${cbc[2]}`}</b>
              <br />
              {latLng.lat}
              ,
              {latLng.lng}
            </span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default React.memo(Maps)
