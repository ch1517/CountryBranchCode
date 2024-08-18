import React, { createContext, useContext, ReactNode } from 'react'
import { useMenu } from '~/hooks/menu'

type MenuContextType = ReturnType<typeof useMenu>;
const MenuContext = createContext<ReturnType<typeof useMenu> | undefined>(undefined)

export const MenuProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const menuState = useMenu(false)

  return (
    <MenuContext.Provider value={menuState}>
      {children}
    </MenuContext.Provider>
  )
}

export const useMenuContext = (): MenuContextType => {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error('useMenuContext must be used within a MenuProvider')
  }
  return context
}
