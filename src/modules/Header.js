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
        this.props.pullToHeader(this.state.lat, this.state.lng);
        event.preventDefault();
    }
    render() {
        return (
            <header>
                <div className="title">국가지점번호</div>
                <form className="search" onSubmit={this.pushToApp}>
                    <input type="text" placeholder="36.09698006901975, 129.38089519358994" onChange={this.handleChange} />
                    <input type="submit" value="검색"></input>
                    <div className="alert">{this.state.alertTxt}</div>
                </form>
                <div className="developer"><a href="https://doqtqu.tistory.com/186">©doqtqu</a></div>

            </header >
        );
    }
}

export default Header;
