import React, { Component } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

class Maps extends Component {
    constructor() {
        super();
        this.state = {
            lat: 36.350509,
            lng: 127.384637,
            zoom: 13
        }
    }

    render() {
        const position = [this.state.lat, this.state.lng];

        return (
            <div>
                <MapContainer style={{ height: "100vh" }} center={position} zoom={this.state.zoom}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://api.vworld.kr/req/wmts/1.0.0/5FE9AB0A-3B34-32F3-A646-1133D92EF014/midnight/{z}/{y}/{x}.png'

                    />
                    <Marker position={position}>
                        <Popup>
                            <span>A pretty CSS3 popup. <br /> Easily customizable.</span>
                        </Popup>
                    </Marker>
                </MapContainer>

            </div>

        )
    }
}

export default Maps;