import './App.css';
import Maps from './modules/Maps'
import Header from './modules/Header';
import React from "react";
import { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 36.37216,
      lng: 127.36035,
      zoomLevel: 7,
      menuState: false, // history menu toggle
      historyList: [] // historyList
    }
  }
  //App.js의 state 생성
  setAppState = (_lat, _lng, _cbcCode, _zoomLevel, _menuState) => {
    var _historyList = this.state.historyList;
    if (_zoomLevel === null) {
      _zoomLevel = 21;
    }

    if (_lat === null) {
      _lat = this.state.lat
    } else if (_lng === null) {
      _lng = this.state.lng
    } else {
      // 중복확인
      var type = true
      var index = 0
      // lat, lng이 같은 값이 history array에 존재할 때
      _historyList.forEach(function (item, _index) {
        if (item.lat === _lat && item.lng === _lng) {
          type = false
          index = _index
        }
      })
      // 중복인 경우 해당 리스트값 삭제 후 가장 상단에 새로 추가 
      if (!type && index > -1) {
        _historyList.splice(index, 1);
      }
      _historyList.splice(0, 0, { cbcCode: _cbcCode, lat: _lat, lng: _lng });
    }

    this.setState({
      lat: _lat,
      lng: _lng,
      zoomLevel: _zoomLevel,
      menuState: _menuState,
      historyList: _historyList
    })
  }
  // history menu toggle state setting
  setMenuState = (_menuState) => {
    this.setState({
      menuState: _menuState
    })
  }
  render() {
    return (
      <div className="App">
        <Header menuState={this.state.menuState} historyList={this.state.historyList}
          setAppState={this.setAppState} setMenuState={this.setMenuState}></Header>
        <Maps lat={this.state.lat} lng={this.state.lng} menuState={this.state.menuState}
          zoomLevel={this.state.zoomLevel} setMenuState={this.setMenuState}></Maps>
      </div >
    );
  }
}

export default App;
