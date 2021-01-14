import React, { Component } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import CbcConvert from './CbcConvert';
import { useState } from "react";
function ZoomLevelCheck() {
    const [zoomLevel, setZoomLevel] = useState(5); // initial zoom level provided for MapContainer
    const map = useMap();
    const mapEvents = useMapEvents({
        zoomend: () => {
            setZoomLevel(mapEvents.getZoom());
        },
        moveend: () => {
            console.log();
            console.log(map.getBounds()._southWest);
            CbcConvert.HangleLineArray2(map.getBounds()._northEast, map.getBounds()._southWest);

        }
    });
    if (zoomLevel > 15) {

    }
    console.log(zoomLevel);

    return null
}
class Maps extends Component {
    constructor() {
        super();
        this.state = {
            lat: 36.35046532102072,
            lng: 127.38477578320756,
            zoom: 16,
            data: CbcConvert.lineArray(),
        }
    }
    render() {
        const position = [this.state.lat, this.state.lng];
        CbcConvert.converter([126.98823732740473, 37.55122041521281]);
        // console.log(CbcConvert.lineArray());

        return (
            <div>
                <MapContainer style={{ height: "100vh" }} center={position} zoom={this.state.zoom}>
                    <ZoomLevelCheck />
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://api.vworld.kr/req/wmts/1.0.0/5FE9AB0A-3B34-32F3-A646-1133D92EF014/midnight/{z}/{y}/{x}.png'

                    />
                    {this.state.data.map(({ id, latLongArr, cbcText }) => {
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