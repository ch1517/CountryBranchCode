import "./App.css";
import Maps from "./modules/Maps";
import Header from "./modules/Header";
import React from "react";
import { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 36.37216,
      lng: 127.36035,
      zoomLevel: 7,
      menuState: false, // history menu toggle
      historyList: [], // historyList
    };
  }
  //App.js의 state 생성
  setAppState = (_lat, _lng, _cbcCode, _zoomLevel, _menuState) => {
    var _historyList = this.state.historyList;
    if (_zoomLevel === null) {
      _zoomLevel = 21;
    }

    if (_lat === null) {
      _lat = this.state.lat;
    } else if (_lng === null) {
      _lng = this.state.lng;
    } else {
      // history array 요소 중 lat, lng이 같은 값
      let sameValue = _historyList.filter(
        (item) => item.lat === _lat && item.lng === _lng
      );
      if (sameValue.length === 0) {
        sameValue = [{ cbcCode: _cbcCode, lat: _lat, lng: _lng }];
      }
      const otherValueList = _historyList.filter(
        (item) => item.lat !== _lat || item.lng !== _lng
      );
      _historyList = [sameValue[0], ...otherValueList];
    }
    this.setState({
      lat: _lat,
      lng: _lng,
      zoomLevel: _zoomLevel,
      menuState: _menuState,
      historyList: _historyList,
    });
  };
  // history menu toggle state setting
  setMenuState = (_menuState) => {
    this.setState({
      menuState: _menuState,
    });
  };
  render() {
    return (
      <div className="App">
        <Header
          menuState={this.state.menuState}
          historyList={this.state.historyList}
          setAppState={this.setAppState}
          setMenuState={this.setMenuState}
        ></Header>
        <Maps
          lat={this.state.lat}
          lng={this.state.lng}
          menuState={this.state.menuState}
          zoomLevel={this.state.zoomLevel}
          setMenuState={this.setMenuState}
        ></Maps>
      </div>
    );
  }
}

export default App;
