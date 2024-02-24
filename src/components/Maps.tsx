import React, { useEffect } from 'react';
import {
  MapContainer,
  MapConsumer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { useState } from 'react';
import { LatLng } from 'leaflet';
import { MapsProps, ZoomLevelCheckProps } from '../types/Maps';
import { convertToCbc, lineArray } from '../helper/convertCBC';

const ZoomLevelCheck: React.FC<ZoomLevelCheckProps> = ({ zoomLevel, setMenuState }) => {
  const [mapZoomLevel, setMapZoomLevel] = useState<number>(zoomLevel); // initial zoom level provided for MapContainer
  let [lineArr, setLineArr] = useState<any[]>([]);
  const map = useMap();
  let state = true; // 초기화 시 한번만 실행하기 위한 state 변수

  const mapEvents = useMapEvents({
    // 지도 zoom 종료
    zoomend: () => {
      setMapZoomLevel(mapEvents.getZoom());
      setMenuState(false);
      setLineArr(lineArray(mapZoomLevel, map.getBounds().getSouthWest(), map.getBounds().getNorthEast()));
    },
    // 지도 움직임 종료
    moveend: () => {
      setLineArr(lineArray(mapZoomLevel, map.getBounds().getSouthWest(), map.getBounds().getNorthEast()));
    },
    // 스크롤로 이동할 때 false
    dragstart: () => {
      setMenuState(false);
    },
  });

  map.whenReady(() => {
    if (state) {
      // 전체지도에 대한 grid array 그리기
      lineArr = lineArray(mapZoomLevel, map.getBounds().getSouthWest(), map.getBounds().getNorthEast());
      state = false;
    }
  });

  if (lineArr.length !== 0) {
    return (
      <div>
        {lineArr.map(({ id, latLongArr, cbcText }) => {
          return (
            <Polygon
              key={id}
              positions={latLongArr}
              color={'white'}
              eventHandlers={{
                click: (e) => {
                  convertToCbc([e.latlng['lng'], e.latlng['lat']]);
                },
              }}
            >
              <Tooltip direction="bottom" opacity={1} permanent>
                <span>{cbcText}</span>
              </Tooltip>
            </Polygon>
          );
        })}
      </div>
    );
  } else {
    return null;
  }
};
const Maps: React.FC<MapsProps> = ({ latLng, zoomLevel, setMenuState }) => {
  const [position, setPosition] = useState<any>([latLng.lat, latLng.lng]);
  const cbc = convertToCbc([latLng.lng, latLng.lat]);
  useEffect(() => {
    setPosition([latLng.lat, latLng.lng]);
  }, [latLng]);
  return (
    <div className="contents">
      <MapContainer style={{ height: '100vh' }} center={position} zoom={zoomLevel} scrollWheelZoom={true}>
        <TileLayer
          maxZoom={22}
          maxNativeZoom={18}
          // zoom={zoomLevel}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.vworld.kr/req/wmts/1.0.0/532CA96F-C19D-3423-A745-FA04E44726C4/midnight/{z}/{y}/{x}.png"
        />
        <ZoomLevelCheck zoomLevel={zoomLevel} setMenuState={setMenuState} />
        <MapConsumer>
          {(map) => {
            // 헤더로부터 입력받은 값을 업데이트
            map.setView(new LatLng(latLng.lat, latLng.lng), zoomLevel);
            return null;
          }}
        </MapConsumer>
        <Marker position={position}>
          <Popup>
            <span className="popupSpan">
              <b>{`${cbc[0]} ${cbc[1]} ${cbc[2]}`}</b>
              <br />
              {latLng.lat}, {latLng.lng}
            </span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
export default React.memo(Maps);
