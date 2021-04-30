import React, { Component } from 'react';
import { MapContainer, MapConsumer, TileLayer, Polygon, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import CbcConvert from './CbcConvert';
import { useState } from "react";
import { LatLng } from 'leaflet';

function ZoomLevelCheck(props) {
    const [zoomLevel, setZoomLevel] = useState(props.zoomLevel); // initial zoom level provided for MapContainer
    var [lineArr, setLineArr] = useState([]);
    const map = useMap();
    var state = true; // 초기화 시 한번만 실행하기 위한 state 변수

    const mapEvents = useMapEvents({
        // 지도 zoom 종료
        zoomend: () => {
            setZoomLevel(mapEvents.getZoom());
            props.setMenuState(false);
            setLineArr(CbcConvert.lineArray(zoomLevel, map.getBounds()._southWest, map.getBounds()._northEast));
        },
        // 지도 움직임 종료
        moveend: () => {
            setLineArr(CbcConvert.lineArray(zoomLevel, map.getBounds()._southWest, map.getBounds()._northEast));
        },
        // 스크롤로 이동할 때 false
        dragstart: () => {
            props.setMenuState(false);
        }
    });

    map.whenReady(function (e) {
        if (state) { // 전체지도에 대한 grid array 그리기
            lineArr = CbcConvert.lineArray(zoomLevel, map.getBounds()._southWest, map.getBounds()._northEast);
            state = false;
        }
    });

    if (lineArr.length !== 0) {
        return (
            <div>
                {lineArr.map(({ id, latLongArr, cbcText }) => {
                    return <Polygon key={id} positions={latLongArr} color={'white'}
                        eventHandlers={{
                            click: (e) => {
                                console.log([e.latlng["lat"], e.latlng["lng"]]);
                                CbcConvert.converterToCbc([e.latlng["lng"], e.latlng["lat"]]);
                            },
                        }}>
                        <Tooltip direction='bottom' opacity={1} permanent>
                            <span>{cbcText}</span>
                        </Tooltip>
                    </Polygon>

                })}
            </div>
        )
    } else {
        return null;
    }

}
class Maps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    }

    // 검색으로 인해 lat, lng 값이 변경 됐을 경우에만 props 업데이트
    shouldComponentUpdate(nextProps, nextState) {
        if ((this.props.lat !== nextProps.lat) || (this.props.lng !== nextProps.lng)) {
            return true
        } else {
            return false
        }
    }
    render() {
        const position = [this.props.lat, this.props.lng];
        const cbc = CbcConvert.converterToCbc([this.props.lng, this.props.lat]);
        const cbcTxt = cbc[0] + " " + cbc[1] + " " + cbc[2];
        return (
            <div className="contents">
                <MapContainer style={{ height: "100vh" }} center={position} zoom={this.props.zoomLevel}
                    scrollWheelZoom={true}>
                    <TileLayer maxZoom={22} maxNativeZoom={18} zoom={this.props.zoomLevel}
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://api.vworld.kr/req/wmts/1.0.0/B68996E4-BC0C-3C4A-B658-93658DD96E73/midnight/{z}/{y}/{x}.png'
                    />
                    <ZoomLevelCheck zoomLevel={this.props.zoomLevel} setMenuState={this.props.setMenuState} />
                    <MapConsumer>
                        {(map) => {
                            // 헤더로부터 입력받은 값을 업데이트
                            map.setView(new LatLng(this.props.lat, this.props.lng), this.props.zoomLevel)
                            return null
                        }}
                    </MapConsumer>
                    <Marker position={position}>
                        <Popup>
                            <span className="popupSpan">
                                <b>{cbcTxt}</b>
                                <br />
                                {this.props.lat}, {this.props.lng}</span>
                        </Popup>
                    </Marker>
                </MapContainer >

            </div >

        )
    }
}

export default Maps;