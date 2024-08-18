import React, { useEffect, useState } from 'react'
import {
  MapContainer,
  MapConsumer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents
} from 'react-leaflet'
import { LatLng, LeafletMouseEvent } from 'leaflet'
import { MapsProperties, ZoomLevelCheckProperties } from '~/types/maps'
import { convertToCbc, getLineArray } from '~/helper/convert-cbc'
import { MAX_NATIVE_ZOOM, MAX_ZOOM } from '~/constants/map'
import { useMenuContext } from '~/contexts/menu-context'

const ZoomLevelCheck: React.FC<ZoomLevelCheckProperties> = ({ zoomLevel, setIsMenuOpen }): JSX.Element => {
  const [mapZoomLevel, setMapZoomLevel] = useState<number>(zoomLevel) // initial zoom level provided for MapContainer
  const [lineArray, setLineArray] = useState<any[]>([])
  const map = useMap()

  const mapEvents = useMapEvents({
    // 스크롤로 이동할 때 false
    dragstart: () => {
      setIsMenuOpen(false)
    },
    // 지도 움직임 종료
    moveend: () => {
      setLineArray(getLineArray(mapZoomLevel, map.getBounds()))
    },
    // 지도 zoom 종료
    zoomend: () => {
      setMapZoomLevel(mapEvents.getZoom())
      setIsMenuOpen(false)
      setLineArray(getLineArray(mapZoomLevel, map.getBounds()))
    }
  })

  useEffect(() => {
    // 전체지도에 대한 grid array 그리기
    setLineArray(getLineArray(mapZoomLevel, map.getBounds()))
  }, [mapZoomLevel, map])

  return (
    <div>
      {lineArray.map(({ id, latLongArr, cbcText }) => (
        <Polygon
          key={id}
          positions={latLongArr}
          color="white"
          eventHandlers={{
            click: (event: LeafletMouseEvent) => {
              convertToCbc([event.latlng.lng, event.latlng.lat])
            }
          }}
        >
          <Tooltip direction="bottom" opacity={1} permanent>
            <span>{cbcText}</span>
          </Tooltip>
        </Polygon>
      ))}
    </div>
  )
}
const Maps = ({ latLng, zoomLevel }: MapsProperties) : JSX.Element => {
  const [position, setPosition] = useState<any>([latLng.lat, latLng.lng])
  const { setIsMenuOpen } = useMenuContext()

  const cbc = convertToCbc([latLng.lng, latLng.lat])
  useEffect(() => {
    setPosition([latLng.lat, latLng.lng])
  }, [latLng])
  return (
    <div className="contents">
      <MapContainer style={{ height: '100vh' }} center={position} zoom={zoomLevel} scrollWheelZoom>
        <TileLayer
          maxZoom={MAX_ZOOM}
          maxNativeZoom={MAX_NATIVE_ZOOM}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.vworld.kr/req/wmts/1.0.0/532CA96F-C19D-3423-A745-FA04E44726C4/midnight/{z}/{y}/{x}.png"
        />
        <ZoomLevelCheck zoomLevel={zoomLevel} setIsMenuOpen={setIsMenuOpen} />
        <MapConsumer>
          {(map) => {
            // 헤더로부터 입력받은 값을 업데이트
            map.setView(new LatLng(latLng.lat, latLng.lng), zoomLevel)
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
