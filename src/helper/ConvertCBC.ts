import proj4 from 'proj4';
import { LatLng } from 'leaflet';
import { grs80, wgs84 } from '../constants/map';
import { h, w } from '../constants/cbc';

/**
 * 위경도 좌표 -> 국가지점번호
 * @param codinate 위경도 좌표
 * @returns {string,number,number} 국가지점번호 ["가나",1234,1235]
 */
const convertToCbc = (codinate: [number, number]): [string, number, number] => {
  let grs80P = proj4(wgs84, grs80, codinate);
  let wP: number = parseInt(grs80P[0].toString().split('.')[0]);
  let hP: number = parseInt(grs80P[1].toString().split('.')[0]);
  let code: [string, number, number] = [
    w[Math.floor(Math.floor(wP) / 100000)] + h[Math.floor(Math.floor(hP) / 100000)],
    Math.floor((wP % 100000) / 10),
    Math.floor((hP % 100000) / 10),
  ];
  return code;
};
//
/**
 * 국가지점번호 -> 위경도 좌표
 * @param _cbcCode 국가지점번호
 * @returns {[number,number]} 위경도좌표
 */
const convertToLatLng = (_cbcCode: string): [number, number] | number => {
  const cbcCode: string[] = _cbcCode.split(' ');
  let lat: number | null | undefined, lng: number | null | undefined;
  // ex "가나 1234 5678"
  // "가나"의 "가" value의 key 확인
  Object.keys(w).forEach((key: string) => {
    if (w[parseInt(key)] === cbcCode[0].charAt(0)) {
      lat = parseInt(key);
    }
  });
  // "가나"의 "나" value의 key 확인
  Object.keys(h).forEach((key: string) => {
    if (h[parseInt(key)] === cbcCode[0].charAt(1)) {
      lng = parseInt(key);
    }
  });
  // lat, lng의 값이 null이거나, 1234 5678의 길이가 같지 않을 때
  if (lat === null || lng === null || cbcCode[1].length !== cbcCode[2].length) {
    return -1;
  } else {
    // lat*100000+1234+5(marker의 중앙을 맞춰주기 위해서), lng도 동일한 로직
    const length = cbcCode[1].length + 1;
    lat = Math.pow(10, length) * lat! + parseInt(cbcCode[1]) * Math.pow(10, 6 - length) + 5;
    lng = Math.pow(10, length) * lng! + parseInt(cbcCode[2]) * Math.pow(10, 6 - length) + 5;

    let wgs84P: [number, number] = proj4(grs80, wgs84, [lat, lng]);
    return wgs84P;
  }
};
// grid 배열 생성
/**
 *
 * @param m
 * @param minX minimum X position
 * @param maxX max X position
 * @param minY minimum Y position
 * @param maxY max Y position
 * @returns
 */
const smallPointXY = (m: number, minX: number, maxX: number, minY: number, maxY: number): any[] => {
  let p: [number, number];
  let TKM = 100000;
  // 현재 bound가 700000~1500000, 1300000~2200000 이내인가
  // 이내라면 bound 그대로 이용, 아니라면 최대 최소 지정
  minX = minX > 7 * TKM ? minX : 7 * TKM;
  maxX = maxX > 15 * TKM ? 15 * TKM : maxX;
  minY = minY > 13 * TKM ? minY : 13 * TKM;
  maxY = maxY > 22 * TKM ? 22 * TKM : maxY;

  minX = Math.floor(minX / m) * m < minX ? (Math.floor(minX / m) - 1) * m : Math.floor(minX / m) * m;
  minY = Math.floor(minY / m) * m < minY ? (Math.floor(minY / m) - 1) * m : Math.floor(minY / m) * m;
  maxX = Math.floor(maxX / m) * m < maxX ? (Math.floor(maxX / m) + 1) * m : Math.floor(maxX / m) * m;
  maxY = Math.floor(maxY / m) * m < maxY ? (Math.floor(maxY / m) + 1) * m : Math.floor(maxY / m) * m;

  let pArr: any[] = [];
  for (let x = minX; x <= maxX; x += m) {
    let t: any[] = [];
    for (let y = minY; y <= maxY; y += m) {
      p = proj4(grs80, wgs84, [x, y]);
      t.push(p);
    }
    pArr.push(t);
  }
  return pArr;
};
/**
 * grid 모양을 한국 지도에 맞게 보여주기 위한 필터링 작업
 * @param codinate
 * @returns {boolean}
 */
const isInnerinBound = (codinate: [number, number]) => {
  let grs80P = proj4(wgs84, grs80, codinate);
  let TKM = 100000;
  let filter: any = {
    7: [13, 21],
    8: [13, 20],
    9: [14, 21],
    10: [15, 21],
    11: [15, 21],
    12: [17, 21],
    13: [18, 21],
  };

  grs80P[0] = Math.round(grs80P[0]);
  grs80P[1] = Math.round(grs80P[1]);

  let t = Math.floor(grs80P[0] / TKM);
  if (filter[t] !== undefined) {
    if (grs80P[1] >= filter[t][0] * TKM && grs80P[1] < filter[t][1] * TKM) return true;
  }
  return false;
};
/**
 * 각각의 grid에 표시할 Label Text 생성 작업
 * @param d 배율(100000|10000|1000|100|10)
 * @param  {[string, number, number]} text 국가지점번호 배열
 * @returns {string}
 */
const labelText = (d: number, text: [string, number, number]): string => {
  let returnTxt: string = '';
  let t1, t2;
  switch (d) {
    case 100000:
      returnTxt = text[0];
      break;
    case 10000:
      t1 = Math.floor(text[1] / 1000).toString();
      t2 = Math.floor(text[2] / 1000).toString();
      returnTxt = `${text[0]} ${t1}XXX ${t2}XXX`;
      break;
    case 1000:
      t1 = Math.floor(text[1] / 100).toString();
      t2 = Math.floor(text[2] / 100).toString();
      returnTxt = `${text[0]} ${t1.toString().padStart(2, '0')}XX ${t2.toString().padStart(2, '0')}XX`;
      break;
    case 100:
      t1 = Math.floor(text[1] / 10).toString();
      t2 = Math.floor(text[2] / 10).toString();
      returnTxt = `${text[0]} ${t1.toString().padStart(3, '0')}X ${t2.toString().padStart(3, '0')}X`;
      break;
    case 10:
      returnTxt = `${text[0]} ${text[1].toString().padStart(4, '0')} ${text[2].toString().padStart(4, '0')}`;
      break;
    default:
      break;
  }
  return returnTxt;
};
/**
 * grid를 그리는 작업
 * @param {number} zoomLevel zoom level
 * @param {LatLng} _start start lat, lng 좌표
 * @param {LatLng} _end  end lat, lng 좌표
 * @returns
 */
const lineArray = (zoomLevel: number, _start: LatLng, _end: LatLng) => {
  let reArr = [];
  let start = proj4(wgs84, grs80, [_start.lng, _start.lat]);
  let end = proj4(wgs84, grs80, [_end.lng, _end.lat]);

  // zoomLevel에 따라 grid 배열 생성을 다르게 한다.
  let divide: number = 100000;
  if (zoomLevel > 19) {
    divide = 10;
  } else if (zoomLevel > 16) {
    divide = 100;
  } else if (zoomLevel > 13) {
    divide = 1000;
  } else if (zoomLevel > 10) {
    divide = 10000;
  } else {
    divide = 100000;
  }

  //grid 배열 생성
  let pArr = smallPointXY(divide, start[0], end[0], start[1], end[1]);

  for (let i = 0; i < pArr.length; i++) {
    for (let j = 0; j < pArr[0].length; j++) {
      if (i < pArr.length - 1 && j < pArr[i].length - 1) {
        let c = pArr[i][j];
        // 정해진 bound 안에 있다면, 라벨과 grid 표시하기
        if (isInnerinBound(c)) {
          let nx = pArr[i + 1][j];
          let ny = pArr[i][j + 1];
          let nxy = pArr[i + 1][j + 1];
          let cbc: [string, number, number] = convertToCbc([(nxy[0] + c[0]) / 2, (nxy[1] + c[1]) / 2]);
          let cbcText: string = '';
          if (cbc !== undefined) {
            cbcText = labelText(divide, cbc);
          }
          reArr.push({
            latLongArr: [
              [c[1], c[0]],
              [nx[1], nx[0]],
              [nxy[1], nxy[0]],
              [ny[1], ny[0]],
            ],
            id: zoomLevel.toString() + '.' + pArr[i][j] + 'y',
            cbcText: cbcText,
          });
        }
      }
    }
  }

  return reArr;
};

export { convertToCbc, lineArray, convertToLatLng };
