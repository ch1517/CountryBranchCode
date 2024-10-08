// 만약 lat, lng 이 숫자이며, 한국 지도 범위일 때
export const validateLatLngRange = (lat: number, lng: number): boolean => {
  const isNumber = !Number.isNaN(lat) && !Number.isNaN(lng)
  return isNumber && lat > 31 && lat < 39 && lng > 124 && lng < 132
}
