import { useState } from 'react'
import { LatLngType } from '~/types/convert-cbc'
import { History } from '~/types/header'

interface useSearchReturnType {
  historyList: History[]
  searchText: string
  setSearchText: (text: string) => void
  updateHistoryList: (
    historyList: History[],
    latLng: LatLngType,
    cbcCode: string
  ) => void
}
export const useSearch = (text: string): useSearchReturnType => {
  const [searchText, setSearchText] = useState<string>(text)
  const [historyList, setHistoryList] = useState<History[]>([])

  const updateHistoryList = (
    _historyList: History[],
    latLng: LatLngType,
    cbcCode: string
  ): void => {
    const updatedList = _historyList.filter(
      (item) => item.lat !== latLng.lat || item.lng !== latLng.lng
    )

    setHistoryList([
      { cbcCode, lat: latLng.lat, lng: latLng.lng },
      ...updatedList
    ])
  }

  return {
    historyList,
    searchText,
    setSearchText,
    updateHistoryList
  }
}
