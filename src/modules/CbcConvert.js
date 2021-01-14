import proj4 from 'proj4';

const w = { 7: "가", 8: "나", 9: "다", 10: "라", 11: "마", 12: "바", 13: "사" };
const h = { 13: "가", 14: "나", 15: "다", 16: "라", 17: "마", 18: "바", 19: "사", 20: "아" };
const grs80 = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs";
const wgs84 = "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees";

function converter(codinate) {
    var wgs84P = proj4(wgs84, grs80, codinate);
    var wP = parseInt(wgs84P[0].toString().split(".")[0]);
    var hP = parseInt(wgs84P[1].toString().split(".")[0]);
    var code = [w[parseInt(parseInt(wP) / 100000)] + h[parseInt(parseInt(hP) / 100000)], parseInt(wP % 100000 / 10), parseInt(hP % 100000 / 10)]
    // console.log(wP, hP);
    return code;
}
function pointXY(m) {
    var p;
    var TKM = 100000;
    var pArr = [];
    for (var x = 7 * TKM; x < 15 * TKM; x += m) {
        var t = [];
        for (var y = 13 * TKM; y < 22 * TKM; y += m) {
            p = proj4(grs80, wgs84, [x, y]);
            t.push(p);
        }
        pArr.push(t);
    }
    return pArr;
}
function HangleLineArray() {
    var pArr = pointXY(100000);
    var reArr = [];
    var filter = [[0, 9], [0, 7], [1, 9], [2, 9], [2, 9], [4, 9], [5, 9], [6, 9]];
    for (var i = 0; i < pArr.length; i++) {
        for (var j = filter[i][0]; j < filter[i][1]; j++) {
            if (i < pArr.length - 1 && j < pArr[i].length - 1) {
                var c = pArr[i][j];
                var nx = pArr[i + 1][j];
                var ny = pArr[i][j + 1];
                var nxy = pArr[i + 1][j + 1];
                var cbc = converter([(nxy[0] + c[0]) / 2, (nxy[1] + c[1]) / 2])
                if (cbc != undefined) {
                    cbc = cbc[0]
                } else {
                    cbc = "dd"
                }
                reArr.push({
                    latLongArr: [[c[1], c[0]], [nx[1], nx[0]], [nxy[1], nxy[0]], [ny[1], ny[0]]],
                    id: i.toString() + j.toString() + "x",
                    cbcText: cbc
                });
            }
        }
    }
    return reArr;
}
function smallPointXY(m, minX, maxX, minY, maxY) {
    var p;
    var TKM = 100000;
    console.log(minX, maxX, minY, maxY);
    // 현재 bound가 700000~1500000, 1300000~2200000 이내인가
    // 이내라면 bound 그대로 이용, 아니라면 최대 최소 지정
    minX = (minX > 7 * TKM ? minX : 7 * TKM);
    maxX = (maxX > 15 * TKM ? 15 * TKM : maxX);
    minY = (minY > 13 * TKM ? minY : 13 * TKM);
    maxY = (maxY > 22 * TKM ? 22 * TKM : maxY);

    console.log(minX, maxX, minY, maxY);

    minX = (parseInt(minX / m) * m < minX ? (parseInt(minX / m) - 1) * m : parseInt(minX / m) * m);
    minY = (parseInt(minY / m) * m < minY ? (parseInt(minY / m) - 1) * m : parseInt(minY / m) * m);
    maxX = (parseInt(maxX / m) * m < maxX ? (parseInt(maxX / m) + 1) * m : parseInt(maxX / m) * m);
    maxY = (parseInt(maxY / m) * m < maxY ? (parseInt(maxY / m) + 1) * m : parseInt(maxY / m) * m);

    console.log(parseInt(maxX / m) * m, maxX);
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
function smallLineArray(zoomLevel, start, end) {
    var reArr = [];
    var start = proj4(wgs84, grs80, [start.lng, start.lat]);
    var end = proj4(wgs84, grs80, [end.lng, end.lat]);
    if (zoomLevel > 10) {
        var pArr = smallPointXY(10000, start[0], end[0], start[1], end[1]);
    } else {
        var pArr = []

    }

    for (var i = 0; i < pArr.length; i++) {
        for (var j = 0; j < pArr[0].length; j++) {
            if (i < pArr.length - 1 && j < pArr[i].length - 1) {
                var c = pArr[i][j];
                var nx = pArr[i + 1][j];
                var ny = pArr[i][j + 1];
                var nxy = pArr[i + 1][j + 1];
                var cbc = converter([(nxy[0] + c[0]) / 2, (nxy[1] + c[1]) / 2])
                if (cbc != undefined) {
                    cbc = cbc[0]
                } else {
                    cbc = "dd"
                }
                reArr.push({
                    latLongArr: [[c[1], c[0]], [nx[1], nx[0]], [nxy[1], nxy[0]], [ny[1], ny[0]]],
                    id: i.toString() + j.toString() + "y",
                    cbcText: cbc
                });
            }
        }
    }

    console.log(reArr);
    return reArr;
}
function lineArray() {
    return HangleLineArray()
}
export default { converter, lineArray, smallLineArray };