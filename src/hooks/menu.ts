import { useState } from 'react'

export const useMenu = (_isMenuOpen: boolean):any => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(_isMenuOpen)
  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen)
  return { isMenuOpen, setIsMenuOpen, toggleMenu }
}
