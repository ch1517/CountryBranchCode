import { useState } from 'react'

interface useMenuReturnType {
  isMenuOpen: boolean
  setIsMenuOpen: (value: boolean) => void
  toggleMenu: () => void
}
export const useMenu = (_isMenuOpen: boolean): useMenuReturnType => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(_isMenuOpen)
  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen)
  return { isMenuOpen, setIsMenuOpen, toggleMenu }
}
