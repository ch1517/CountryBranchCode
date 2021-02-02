import '../App.css';
import { React, Component } from 'react';
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 36.09698006901975,
            lng: 129.38089519358994,
            alertTxt: ""
        }
        this.pushToApp = this.pushToApp.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.menuSateChangeWindow = this.menuSateChangeWindow.bind(this);
        this.menuSateChangeMobile = this.menuSateChangeMobile.bind(this);
    }

    handleChange(event) {
        var s = event.target.value.split(",")
        var _lat = parseFloat(s[0])
        var _lng = parseFloat(s[1])
        if (!(_lat > 32 && _lat < 39) || !(_lng > 124 && _lng < 131)) {
            this.setState({
                alertTxt: "lat,lng 형식으로 입력해주세요."
            });
        } else {
            this.setState({
                lat: _lat,
                lng: _lng,
                alertTxt: ""
            });
        }
    }
    pushToApp(event) {
        console.log(event)
        this.props.setAppState(this.state.lat, this.state.lng, this.zoomLevel);
        this.props.setMenuState(false);
        event.preventDefault();
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
    render() {
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
                    <div className="alert">{this.state.alertTxt}</div>

                    <div className={this.props.menuState ? 'historyOpen' : 'historyClose'}></div>
                </form>
                <button className="toggleBtn" onClick={this.menuSateChangeWindow}>history</button>

            </header >
        );
    }
}

export default Header;
