import React, { Component } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import CbcConvert from './CbcConvert';
import { useState } from "react";
import { LatLng } from 'leaflet';
function ZoomLevelCheck() {
    const [zoomLevel, setZoomLevel] = useState(7); // initial zoom level provided for MapContainer
    var [lineArr, setLineArr] = useState([]);
    const map = useMap();
    var state = true;
    const mapEvents = useMapEvents({
        zoomend: () => {
            setZoomLevel(mapEvents.getZoom());

            setLineArr(CbcConvert.lineArray(zoomLevel, map.getBounds()._southWest, map.getBounds()._northEast));
        },
        moveend: () => {
            setLineArr(CbcConvert.lineArray(zoomLevel, map.getBounds()._southWest, map.getBounds()._northEast));
        },
    });
    map.whenReady(function (e) {
        if (state) {
            lineArr = CbcConvert.lineArray(zoomLevel, map.getBounds()._southWest, map.getBounds()._northEast);
            state = false;
        }
    });

    if (lineArr.length != 0) {
        return (
            <div>
                {lineArr.map(({ id, latLongArr, cbcText }) => {
                    return <Polygon key={id} positions={latLongArr} color={'white'}
                        eventHandlers={{
                            click: (e) => {
                                console.log([e.latlng["lat"], e.latlng["lng"]]);
                                CbcConvert.converter([e.latlng["lng"], e.latlng["lat"]]);
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
    constructor() {
        super();
        this.state = {
            lat: 36.09698006901975,
            lng: 129.38089519358994,
            zoom: 7,
            data: [],
        }
    }

    render() {
        const position = [this.state.lat, this.state.lng];
        CbcConvert.converter([126.98823732740473, 37.55122041521281]);
        return (
            <div>
                <MapContainer style={{ height: "100vh" }} center={position} zoom={this.state.zoom} scrollWheelZoom={true}>

                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://api.vworld.kr/req/wmts/1.0.0/5FE9AB0A-3B34-32F3-A646-1133D92EF014/midnight/{z}/{y}/{x}.png'

                    />
                    <ZoomLevelCheck />
                    <Marker position={position}>
                        <Popup>
                            <span>A pretty CSS3 popup. <br /> Easily customizable.</span>
                        </Popup>
                    </Marker>
                </MapContainer >

            </div >

        )
    }
}

export default Maps;