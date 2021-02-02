import logo from './logo.svg';
import './App.css';
import Maps from './modules/Maps'
import Header from './modules/Header';
import React from "react";
import { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 36.09698006901975,
      lng: 129.38089519358994,
      zoomLevel: 7,
      menuState: false
    }
    this.setAppState = this.setAppState.bind(this);
    this.setMenuState = this.setMenuState.bind(this);
  }
  setAppState(_lat, _lng, _zoomLevel, _menuState) {
    if (_lat == null) {
      _lat = this.state.lat
    }
    if (_lng == null) {
      _lng = this.state.lng
    }
    this.setState({
      lat: _lat,
      lng: _lng,
      zoomLevel: _zoomLevel,
      menuState: _menuState
    })
  }
  setMenuState(_menuState) {
    this.setState({
      menuState: _menuState
    })
  }
  render() {
    return (
      <div className="App">
        <Header menuState={this.state.menuState} setAppState={this.setAppState} setMenuState={this.setMenuState}></Header>
        <Maps lat={this.state.lat} lng={this.state.lng} menuState={this.state.menuState}
          zoomLevel={this.state.zoomLevel} setMenuState={this.setMenuState}></Maps>
      </div >
    );
  }
}

export default App;
