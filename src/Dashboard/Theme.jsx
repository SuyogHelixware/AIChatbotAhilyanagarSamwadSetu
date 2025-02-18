import { createContext, useContext } from "react"

export const ModeContext=createContext({
    themeMode:"light",
    DarkMode:()=>{},
      LightMode:()=>{}
  })


  export const ModeContextProvider=ModeContext.Provider 

   export function useThemeMode(){
    return useContext(ModeContext)
  }