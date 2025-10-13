// import { createContext, useContext } from "react"

// export const ModeContext=createContext({
//     themeMode:"light",
//     DarkMode:()=>{},
//       LightMode:()=>{}
//   })

//   export const ModeContextProvider=ModeContext.Provider

//    export function useThemeMode(){
//     return useContext(ModeContext)
//   }

import { createContext, useContext, useEffect, useState } from "react";

export const ModeContext = createContext({
  themeMode: "light",
  DarkMode: () => {},
  LightMode: () => {},
  userSession: { userId: "", UserType: "", CreatedBy: "" },
  refreshUserSession: () => {},
});

export const ModeContextProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("light");

  const LightMode = () => setThemeMode("light");
  const DarkMode = () => setThemeMode("dark");



   const [userSession, setUserSession] = useState({
    userId: "",
    UserType: "",
    CreatedBy: "",

    
  });
    const storedUser = JSON.parse(sessionStorage.getItem("userData") || "{}");

  useEffect(() => {     
     debugger
    //  const userId = sessionStorage.getItem("userId");
     const userId = storedUser.Username;
    const UserType = storedUser.UserType;
    const CreatedBy = storedUser.Username;
    setUserSession({ userId, UserType, CreatedBy });
  }, []);

  const refreshUserSession = () => {
    const userId =  storedUser.Username;
    const UserType = storedUser.UserType;
    const CreatedBy = storedUser.Username;
    setUserSession({ userId, UserType, CreatedBy });
  };
 
  return (
    <ModeContext.Provider
      value={{
        themeMode,
        LightMode,
        DarkMode,
        userSession,
        refreshUserSession,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ModeContext);
