import '../assets/css/App.css';
import React, { useState } from 'react';
import CbcConvert, { h, w } from '../helper/ConvertCBC';
import { HeaderProps } from '../types/Header';

const App: React.FC<HeaderProps> = ({ menuState, historyList, setAppState, setMenuState }) => {
  const [searchText, setSearchText] = useState<string>(''); // 검색창에 입력한 값

  // 검색 버튼을 눌렀을 때 호출되는 handler
  const pushToApp = (event: any) => {
    // 기존의 form event를 막는다.
    event.preventDefault();

    let s: string[] = searchText.split(',');
    let _lat: number, _lng: number;
    // lat, lng 으로 주어질 때
    if (s.length === 2) {
      _lat = parseFloat(s[0]);
      _lng = parseFloat(s[1]);
      // 만약 _lat, _lng 이 숫자가 아니고, 한국 지도 범위를 벗어났을 때
      if (isNaN(_lat) || isNaN(_lng) || !(_lat > 31 && _lat < 39) || !(_lng > 124 && _lng < 133)) {
        alert("ex. '32.66367, 124.43291'");
      } else {
        let cbc = CbcConvert.converterToCbc([_lng, _lat]);
        // App.js로 보내는 작업, App.js에서는 state 설정을 변경한다.
        setAppState(_lat, _lng, `${cbc[0]} ${cbc[1]} ${cbc[2]}`, null, true);
      }
    } else {
      s = searchText.split(' ');
      // 국가지점번호로 주어질 때
      if (s.length === 3) {
        //s[0](ex.가나)가 문자이며 두 글자이고, 범위 안에 해당될 때
        let check1 =
          typeof s[0] === 'string' &&
          s[0].length === 2 &&
          Object.values(w).includes(s[0][0]) &&
          Object.values(h).includes(s[0][1]);
        // s[1],s[2]는 숫자이면서 네 자리
        let check2 = typeof parseInt(s[1]) === 'number' && s[1].length === 4;
        let check3 = typeof parseInt(s[2]) === 'number' && s[2].length === 4;
        if (!check1 || !check2 || !check3) {
          alert("ex. '가가 1234 1234'");
          return;
        } else {
          let latLng: any = CbcConvert.converterToLatLng(searchText);
          if (latLng === -1) {
            // converterToLatLng Error
            alert('ex. 가가 1234 1234');
          } else {
            // 그 외의 경우
            _lng = latLng[0];
            _lat = latLng[1];
            // App.js로 보내는 작업, App.js에서는 state 설정을 변경한다.
            setAppState(_lat, _lng, searchText, null, true);
          }
        }
      } else {
        alert("ex. '32.66367, 124.43291' or '가가 1234 1234'");
      }
    }
  };

  // history 메뉴 toggle (mobile 경우)
  // mobile의 경우 history 버튼이 없기 때문에 검색 input focus 설정 시 history 영역 호출
  const menuSateChangeMobile = () => {
    // 모바일 환경에서만 input Focus, Blur로 history 영역 제어
    const state =
      /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent,
      );
    if (state) {
      setMenuState(true);
    }
  };
  const makeHistory = (historyArr: any[], setAppState: any) => {
    return (
      <div>
        {historyArr.map(({ lng, lat, cbcCode }, index) => {
          return (
            <div
              key={index}
              className="historyList"
              onClick={() => {
                setAppState(lat, lng, cbcCode, null, true);
                setSearchText(cbcCode);
              }}
            >
              <img src="/CountryBranchCode/images/marker.png" alt="" />
              <div className="codeDiv">
                <div className="cbcCode">{cbcCode}</div>
                <div className="latlng">
                  {lat.toFixed(5)}, {lng.toFixed(5)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="header">
      <div className="leftMenu">
        <div className="title">국가지점번호</div>
        <div className="developer">
          <a href="https://doqtqu.tistory.com/186">©doqtqu</a>
        </div>
      </div>
      <div className="search-div">
        <form className="search" onSubmit={pushToApp}>
          <input
            onFocus={menuSateChangeMobile}
            onBlur={menuSateChangeMobile}
            type="text"
            value={searchText}
            placeholder="32.66367, 124.43291 or 가가 1234 1234"
            // 검색창에 입력하는 값이 달라질 때마다 호출되는 handler
            onChange={(event) => setSearchText(event.target.value)}
          />
          <input type="submit" value="검색"></input>
          <div className={menuState ? 'historyOpen' : 'historyClose'}>{makeHistory(historyList, setAppState)}</div>
        </form>
        {/* history 메뉴 toggle (Window의 경우) */}
        <button className="toggleBtn" onClick={() => setMenuState(!menuState)}>
          <i className="fas fa-history lg"></i>
        </button>
      </div>
    </div>
  );
};

export default App;
