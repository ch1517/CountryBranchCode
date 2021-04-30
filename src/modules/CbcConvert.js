import proj4 from 'proj4';

const w = { 7: "가", 8: "나", 9: "다", 10: "라", 11: "마", 12: "바", 13: "사" };
const h = { 13: "가", 14: "나", 15: "다", 16: "라", 17: "마", 18: "바", 19: "사", 20: "아" };
const grs80 = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs";
const wgs84 = "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees";

// WGS84를 UTM-K로 변경
function converterToCbc(codinate) {
    var grs80P = proj4(wgs84, grs80, codinate);
    var wP = parseInt(grs80P[0].toString().split(".")[0]);
    var hP = parseInt(grs80P[1].toString().split(".")[0]);
    var code = [w[parseInt(parseInt(wP) / 100000)] + h[parseInt(parseInt(hP) / 100000)], parseInt(wP % 100000 / 10), parseInt(hP % 100000 / 10)];
    return code;
}
// UTM-K를 WGS84로 변경
function converterToLatLng(cbcCode) {
    cbcCode = cbcCode.split(" ");
    var lat, lng;
    // ex "가나 1234 5678"
    // "가나"의 "가" value의 key 확인
    Object.keys(w).forEach(function (key) {
        if (w[key] === cbcCode[0].charAt(0)) {
            lat = key;
        }
    })
    // "가나"의 "나" value의 key 확인
    Object.keys(h).forEach(function (key) {
        if (h[key] === cbcCode[0].charAt(1)) {
            lng = key;
        }
    })
    // lat, lng의 값이 null이거나, 1234 5678의 길이가 같지 않을 때
    if (lat === null || lng === null || cbcCode[1].length !== cbcCode[2].length) {
        return -1;
    } else {
        // lat*100000+1234+5(marker의 중앙을 맞춰주기 위해서), lng도 동일한 로직
        const length = cbcCode[1].length + 1;
        lat = Math.pow(10, length) * lat + parseInt(cbcCode[1]) * Math.pow(10, 6 - length) + 5;
        lng = Math.pow(10, length) * lng + parseInt(cbcCode[2]) * Math.pow(10, 6 - length) + 5;

        var wgs84P = proj4(grs80, wgs84, [lat, lng]);
        return wgs84P;
    }
}
// grid 배열 생성
function smallPointXY(m, minX, maxX, minY, maxY) {
    var p;
    var TKM = 100000;
    // 현재 bound가 700000~1500000, 1300000~2200000 이내인가
    // 이내라면 bound 그대로 이용, 아니라면 최대 최소 지정
    minX = (minX > 7 * TKM ? minX : 7 * TKM);
    maxX = (maxX > 15 * TKM ? 15 * TKM : maxX);
    minY = (minY > 13 * TKM ? minY : 13 * TKM);
    maxY = (maxY > 22 * TKM ? 22 * TKM : maxY);

    minX = (parseInt(minX / m) * m < minX ? (parseInt(minX / m) - 1) * m : parseInt(minX / m) * m);
    minY = (parseInt(minY / m) * m < minY ? (parseInt(minY / m) - 1) * m : parseInt(minY / m) * m);
    maxX = (parseInt(maxX / m) * m < maxX ? (parseInt(maxX / m) + 1) * m : parseInt(maxX / m) * m);
    maxY = (parseInt(maxY / m) * m < maxY ? (parseInt(maxY / m) + 1) * m : parseInt(maxY / m) * m);

    var pArr = [];
    for (var x = minX; x <= maxX; x += m) {
        var t = [];
        for (var y = minY; y <= maxY; y += m) {
            p = proj4(grs80, wgs84, [x, y]);
            t.push(p);
        }
        pArr.push(t);
    }
    return pArr;
}
// grid 모양을 한국 지도에 맞게 보여주기 위한 필터링 작업
function isInnerinBound(codinate) {
    var grs80P = proj4(wgs84, grs80, codinate);
    var TKM = 100000;
    var filter = { 7: [13, 21], 8: [13, 20], 9: [14, 21], 10: [15, 21], 11: [15, 21], 12: [17, 21], 13: [18, 21] }

    grs80P[0] = Math.round(grs80P[0]);
    grs80P[1] = Math.round(grs80P[1]);

    var t = parseInt(grs80P[0] / TKM);
    if (filter[t] !== undefined) {
        if (grs80P[1] >= filter[t][0] * TKM && grs80P[1] < filter[t][1] * TKM)
            return true;
    }
    return false
}
// 각각의 grid에 표시할 Label Text 생성 작업
function labelText(d, text) {
    var returnTxt;
    var t1, t2;
    switch (d) {
        case 100000:
            returnTxt = text[0];
            break;
        case 10000:
            t1 = parseInt(text[1] / 1000).toString();
            t2 = parseInt(text[2] / 1000).toString();
            returnTxt = `${text[0]} ${t1}XXX ${t2}XXX`;
            break;
        case 1000:
            t1 = parseInt(text[1] / 100).toString();
            t2 = parseInt(text[2] / 100).toString();
            returnTxt = `${text[0]} ${t1}XX ${t2}XX`;
            break;
        case 100:
            t1 = parseInt(text[1] / 10).toString();
            t2 = parseInt(text[2] / 10).toString();
            returnTxt = `${text[0]} ${t1}X ${t2}X`;;
            break;
        case 10:
            returnTxt = `${text[0]} ${text[1]} ${text[2]}`;
            break;
        default:
            break;
    }
    return returnTxt;
}
// grid를 그리는 작업
function lineArray(zoomLevel, _start, _end) {
    var reArr = [];
    var start = proj4(wgs84, grs80, [_start.lng, _start.lat]);
    var end = proj4(wgs84, grs80, [_end.lng, _end.lat]);

    // zoomLevel에 따라 grid 배열 생성을 다르게 한다.
    var divide = 100000
    if (zoomLevel > 19) {
        divide = 10;
    }
    else if (zoomLevel > 16) {
        divide = 100;
    }
    else if (zoomLevel > 13) {
        divide = 1000;
    }
    else if (zoomLevel > 10) {
        divide = 10000;
    } else {
        divide = 100000;
    }

    //grid 배열 생성
    var pArr = smallPointXY(divide, start[0], end[0], start[1], end[1]);

    for (var i = 0; i < pArr.length; i++) {
        for (var j = 0; j < pArr[0].length; j++) {
            if (i < pArr.length - 1 && j < pArr[i].length - 1) {
                var c = pArr[i][j];
                // 정해진 bound 안에 있다면, 라벨과 grid 표시하기
                if (isInnerinBound(c)) {
                    var nx = pArr[i + 1][j];
                    var ny = pArr[i][j + 1];
                    var nxy = pArr[i + 1][j + 1];
                    var cbc = converterToCbc([(nxy[0] + c[0]) / 2, (nxy[1] + c[1]) / 2])
                    if (cbc !== undefined) {
                        cbc = labelText(divide, cbc)
                    } else {
                        cbc = ""
                    }
                    reArr.push({
                        latLongArr: [[c[1], c[0]], [nx[1], nx[0]], [nxy[1], nxy[0]], [ny[1], ny[0]]],
                        id: zoomLevel.toString() + "." + pArr[i][j] + "y",
                        cbcText: cbc
                    });
                }

            }
        }
    }

    return reArr;
}
const exportedObject = { converterToCbc, lineArray, converterToLatLng }
export default exportedObject;