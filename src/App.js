import logo from './logo.svg';
import './App.css';
import Maps from './modules/Maps'
import Header from './modules/Header';

import { Component } from 'react';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 36.09698006901975,
      lng: 129.38089519358994,
      zoomLevel: 7
    }
    this.pullToHeader = this.pullToHeader.bind(this);
  }
  pullToHeader(_lat, _lng) {
    this.setState({
      lat: _lat,
      lng: _lng,
      zoomLevel: 21
    });
  }
  render() {
    return (
      <div className="App">
        <Header pullToHeader={this.pullToHeader}></Header>
        <Maps lat={this.state.lat} lng={this.state.lng} zoomLevel={this.state.zoomLevel}></Maps>
      </div >
    );
  }
}

export default App;
