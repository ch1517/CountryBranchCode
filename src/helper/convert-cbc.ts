/* eslint-disable sort-keys */
/* eslint-disable no-restricted-syntax */
import proj4 from 'proj4'
import { LatLngBounds } from 'leaflet'
import { GRS80, WGS84 } from '../constants/map'
import { h, w } from '../constants/cbc'

/**
 * 위경도 좌표 -> 국가지점번호
 * @param coordinate 위경도 좌표
 * @returns {string,number,number} 국가지점번호 ["가나",1234,1235]
 */
const convertToCbc = (coordinate: [number, number]): [string, number, number] => {
  const grs80P = proj4(WGS84, GRS80, coordinate)
  const wP: number = Math.trunc(Number(grs80P[0]))
  const hP: number = Math.trunc(Number(grs80P[1]))
  const code: [string, number, number] = [
    w[Math.floor(Math.floor(wP) / 100_000)] + h[Math.floor(Math.floor(hP) / 100_000)],
    Math.floor((wP % 100_000) / 10),
    Math.floor((hP % 100_000) / 10)
  ]
  return code
}
//
/**
 * 국가지점번호 -> 위경도 좌표
 * @param _cbcCode 국가지점번호
 * @returns {[number,number]} 위경도좌표
 */
const convertToLatLng = (_cbcCode: string): [number, number] | number => {
  const cbcCode: string[] = _cbcCode.split(' ')
  let lat: number | null | undefined; let
    lng: number | null | undefined
  // ex "가나 1234 5678"
  // "가나"의 "가" value의 key 확인
  for (const [key, value] of Object.entries(w)) {
    if (value === cbcCode[0].charAt(0)) {
      lat = Number(key)
    }
  }

  // "가나"의 "나" value의 key 확인
  for (const [key, value] of Object.entries(h)) {
    if (value === cbcCode[0].charAt(1)) {
      lng = Number(key)
    }
  }
  // lat, lng의 값이 null이거나, 1234 5678의 길이가 같지 않을 때
  if (lat === null || lng === null || cbcCode[1].length !== cbcCode[2].length) {
    return -1
  }
  // lat*100000+1234+5(marker의 중앙을 맞춰주기 위해서), lng도 동일한 로직
  const length = cbcCode[1].length + 1
  const factor = 10 ** (6 - length)
  const latOffset = Number(cbcCode[1]) * factor + 5
  const lngOffset = Number(cbcCode[2]) * factor + 5

  lat = 10 ** length * lat! + latOffset
  lng = 10 ** length * lng! + lngOffset

  const wgs84P: [number, number] = proj4(GRS80, WGS84, [lat, lng])
  return wgs84P
}
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
  const TKM = 100_000
  // 현재 bound가 700000~1500000, 1300000~2200000 이내인가
  // 이내라면 bound 그대로 이용, 아니라면 최대 최소 지정

  const adjustedMinX = minX > 7 * TKM ? minX : 7 * TKM
  const adjustedMaxX = maxX > 15 * TKM ? 15 * TKM : maxX
  const adjustedMinY = minY > 13 * TKM ? minY : 13 * TKM
  const adjustedMaxY = maxY > 22 * TKM ? 22 * TKM : maxY

  const flooredMinX = Math.floor(adjustedMinX / m) * m < adjustedMinX ? (Math.floor(adjustedMinX / m) - 1) * m : Math.floor(adjustedMinX / m) * m
  const flooredMinY = Math.floor(adjustedMinY / m) * m < adjustedMinY ? (Math.floor(adjustedMinY / m) - 1) * m : Math.floor(adjustedMinY / m) * m
  const flooredMaxX = Math.floor(adjustedMaxX / m) * m < adjustedMaxX ? (Math.floor(adjustedMaxX / m) + 1) * m : Math.floor(adjustedMaxX / m) * m
  const flooredMaxY = Math.floor(adjustedMaxY / m) * m < adjustedMaxY ? (Math.floor(adjustedMaxY / m) + 1) * m : Math.floor(adjustedMaxY / m) * m

  const pArray: any[] = []
  for (let x = flooredMinX; x <= flooredMaxX; x += m) {
    const t: any[] = []
    for (let y = flooredMinY; y <= flooredMaxY; y += m) {
      const p: [number, number] = proj4(GRS80, WGS84, [x, y])
      t.push(p)
    }
    pArray.push(t)
  }
  return pArray
}
/**
 * grid 모양을 한국 지도에 맞게 보여주기 위한 필터링 작업
 * @param coordinate
 * @returns {boolean}
 */
const isWithinInnerBoundary = (coordinate: [number, number]): boolean => {
  const grs80P = proj4(WGS84, GRS80, coordinate)
  const TKM = 100_000
  const filter: any = {
    7: [13, 21],
    8: [13, 20],
    9: [14, 21],
    10: [15, 21],
    11: [15, 21],
    12: [17, 21],
    13: [18, 21]
  }

  grs80P[0] = Math.round(grs80P[0])
  grs80P[1] = Math.round(grs80P[1])

  const t = Math.floor(grs80P[0] / TKM)
  if (filter[t] !== undefined && grs80P[1] >= filter[t][0] * TKM && grs80P[1] < filter[t][1] * TKM) return true
  return false
}
/**
 * 각각의 grid에 표시할 Label Text 생성 작업
 * @param d 배율(100000|10000|1000|100|10)
 * @param  {[string, number, number]} text 국가지점번호 배열
 * @returns {string}
 */
const labelText = (d: number, text: [string, number, number]): string => {
  let returnTxt = ''
  let t1; let
    t2
  switch (d) {
    case 100_000: {
      [returnTxt] = text
      break
    }
    case 10_000: {
      t1 = Math.floor(text[1] / 1000).toString()
      t2 = Math.floor(text[2] / 1000).toString()
      returnTxt = `${text[0]} ${t1}XXX ${t2}XXX`
      break
    }
    case 1000: {
      t1 = Math.floor(text[1] / 100).toString()
      t2 = Math.floor(text[2] / 100).toString()
      returnTxt = `${text[0]} ${t1.toString().padStart(2, '0')}XX ${t2.toString().padStart(2, '0')}XX`
      break
    }
    case 100: {
      t1 = Math.floor(text[1] / 10).toString()
      t2 = Math.floor(text[2] / 10).toString()
      returnTxt = `${text[0]} ${t1.toString().padStart(3, '0')}X ${t2.toString().padStart(3, '0')}X`
      break
    }
    case 10: {
      returnTxt = `${text[0]} ${text[1].toString().padStart(4, '0')} ${text[2].toString().padStart(4, '0')}`
      break
    }
    default: {
      break
    }
  }
  return returnTxt
}
/**
 * grid를 그리는 작업
 * @param {number} zoomLevel zoom level
 * @param {LatLngBounds} latLngBounds lat, lng bound
 * @returns
 */
const getLineArray = (zoomLevel: number, latLngBounds: LatLngBounds): any[] => {
  const reArray = []
  const startLatLng = latLngBounds.getSouthWest()
  const endLatLng = latLngBounds.getNorthEast()
  const startUTMK = proj4(WGS84, GRS80, [startLatLng.lng, startLatLng.lat])
  const endUTMK = proj4(WGS84, GRS80, [endLatLng.lng, endLatLng.lat])

  // zoomLevel에 따라 grid 배열 생성을 다르게 한다.
  let divide = 100_000
  switch (true) {
    case zoomLevel > 19: {
      divide = 10
      break
    }
    case zoomLevel > 16: {
      divide = 100
      break
    }
    case zoomLevel > 13: {
      divide = 1000
      break
    }
    case zoomLevel > 10: {
      divide = 10_000
      break
    }
    default: {
      divide = 100_000
    }
  }

  // grid 배열 생성
  const pArray = smallPointXY(divide, startUTMK[0], endUTMK[0], startUTMK[1], endUTMK[1])
  for (const [index, row] of pArray.entries()) {
    for (const [index2, c] of row.entries()) {
      if (index < pArray.length - 1 && index2 < row.length - 1 && isWithinInnerBoundary(c)) {
        const nx = pArray[index + 1][index2]
        const ny = pArray[index][index2 + 1]
        const nxy = pArray[index + 1][index2 + 1]
        const cbc: [string, number, number] = convertToCbc([(nxy[0] + c[0]) / 2, (nxy[1] + c[1]) / 2])
        const cbcText = cbc ? labelText(divide, cbc) : ''

        reArray.push({
          latLongArr: [
            [c[1], c[0]],
            [nx[1], nx[0]],
            [nxy[1], nxy[0]],
            [ny[1], ny[0]]
          ],
          id: `${zoomLevel.toString()}.${c}y`,
          cbcText
        })
      }
    }
  }

  return reArray
}

export { convertToCbc, getLineArray, convertToLatLng }
