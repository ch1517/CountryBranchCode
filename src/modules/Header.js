import '../App.css';
import { React, Component } from 'react';
import CbcConvert from './CbcConvert';
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 36.09698006901975,
            lng: 129.38089519358994,
            submitValue: "",
        }
        this.pushToApp = this.pushToApp.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.menuSateChangeWindow = this.menuSateChangeWindow.bind(this);
        this.menuSateChangeMobile = this.menuSateChangeMobile.bind(this);
    }

    handleChange(event) {
        this.setState({
            submitValue: event.target.value
        })
    }
    pushToApp(event) {
        event.preventDefault();
        var s = this.state.submitValue.split(",");
        var _lat, _lng;
        // lat, lng 으로 주어질 때
        if (s.length == 2) {
            _lat = parseFloat(s[0])
            _lng = parseFloat(s[1])
            if (_lat == NaN || _lng == NaN || !(_lat > 32 && _lat < 39) || !(_lng > 124 && _lng < 131)) {
                alert("ex. '32.66367, 124.43291'");
            } else {
                this.setState({
                    lat: _lat,
                    lng: _lng,
                });
                var cbc = CbcConvert.converterToCbc([_lng, _lat])
                this.props.setAppState(_lat, _lng, cbc[0] + " " + cbc[1] + " " + cbc[2], null, true);
            }
        } else {
            s = this.state.submitValue.split(" ")
            if (s.length == 3) {
                //"마마 6932 9052"
                //s[0]가 문자, s[1],s[2]가 숫자가 아닌 경우
                if (!isNaN(s[0]) || isNaN(s[1]) || isNaN(s[2])) {
                    alert("ex. '가가 1234 1234'");
                } else {
                    var latLng = CbcConvert.converterToLatLng(this.state.submitValue);
                    if (latLng == -1) {
                        alert("ex. 가가 1234 1234");
                    } else {
                        _lng = latLng[0];
                        _lat = latLng[1];
                        this.setState({
                            lat: _lat,
                            lng: _lng
                        });
                        this.props.setAppState(_lat, _lng, this.state.submitValue, null, true);
                    }
                }
            } else {
                alert("ex. '32.66367, 124.43291' or '가가 1234 1234'");
            }
        }
    }
    menuSateChangeWindow() {
        this.props.setMenuState(!this.props.menuState);
    }
    menuSateChangeMobile() {
        // 모바일 환경에서만 input Focus, Blur로 history 영역 제어
        const state = /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent);
        if (state) {
            this.props.setMenuState(true);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if ((this.state.lat !== nextProps.lat) || (this.state.lng !== nextProps.lng)) {
            return true
        } else {
            return false
        }
    }
    render() {
        function makeHistory(historyArr, setAppState) {
            return <div>
                {historyArr.map(({ lng, lat, cbcCode }) => {
                    return <div className="historyList" onClick={(event) => {
                        setAppState(lat, lng, cbcCode, null, true)
                    }}>
                        <img src="/CountryBranchCode/images/marker.png" />
                        <div className="codeDiv">
                            <div className="cbcCode">{cbcCode}</div>
                            <div className="latlng">{lat.toFixed(5)}, {lng.toFixed(5)}</div>
                        </div>
                    </div>
                })}
            </div>
        }
        return (
            <header>
                <div className="leftMenu">
                    <div className="title">국가지점번호</div>
                    <div className="developer"><a href="https://doqtqu.tistory.com/186">©doqtqu</a></div>
                </div>
                <form className="search" onSubmit={this.pushToApp}>
                    <input onFocus={this.menuSateChangeMobile} onBlur={this.menuSateChangeMobile} type="text"
                        placeholder="36.09698006901975, 129.38089519358994" onChange={this.handleChange} />
                    <input type="submit" value="검색"></input>
                    <div className={this.props.menuState ? 'historyOpen' : 'historyClose'}>
                        {makeHistory(this.props.historyList, this.props.setAppState)}
                    </div>
                </form>
                <button className="toggleBtn" onClick={this.menuSateChangeWindow}>history</button>

            </header >
        );
    }
}

export default Header;
