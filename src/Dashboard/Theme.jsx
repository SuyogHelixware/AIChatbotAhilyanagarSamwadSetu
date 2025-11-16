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
import CryptoJS from "crypto-js";

export const ModeContext = createContext({
  themeMode: "light",
  DarkMode: () => {},
  LightMode: () => {},
  userSession: { userId: "", UserType: "", CreatedBy: "" },
  refreshUserSession: () => {},

  refreshRoleAccess: () => {},

  getAccessFor: () => ({
    canAdd: false,
    canEdit: false,
    canRead: false,
    canDelete: false,
  }),
});

export const ModeContextProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("light");
  const LightMode = () => setThemeMode("light");
  const DarkMode = () => setThemeMode("dark");

  const [roleAccess, setRoleAccess] = useState([]);

  const SECRET_KEY =
    process.env.REACT_APP_SECRET_KEY || "YourStrongSecretKey123!";

  const SECRET_KEYU =
    process.env.REACT_APP_SECRET_KEY || "KT@12345_MY_SECRET_KEY";

  const loadRoleAccess = () => {
    try {
      const encrypted = sessionStorage.getItem("RoleDetails");
      if (!encrypted) return [];

      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      const parsed = JSON.parse(decryptedData);

      return parsed.oLines || [];
    } catch (err) {
      console.error("Error decrypting RoleDetails:", err);
      return [];
    }
  };

  const [userSession, setUserSession] = useState({
    userId: "",
    UserType: "",
    CreatedBy: "",
  });
  const storedUser = JSON.parse(sessionStorage.getItem("userData") || "{}");

  // const encrypted = sessionStorage.getItem("userData");

  // let storedUser = {};

  // if (encrypted) {
  //   try {
  //     const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEYU);

  //     // Convert decrypted bytes to UTF-8 string
  //     const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

  //     if (decryptedString && decryptedString.trim() !== "") {
  //       storedUser = JSON.parse(decryptedString);
  //     } else {
  //       console.error("❌ SECRET_KEY incorrect OR encrypted data invalid");
  //     }
  //   } catch (err) {
  //     console.error("❌ Failed to decrypt userData:", err);
  //   }
  //   console.log("Decrypted String:", decryptedString);
  // }

  useEffect(() => {
    const userId = storedUser.Username;
    const UserType = storedUser.UserType;
    const CreatedBy = storedUser.Username;
    setUserSession({ userId, UserType, CreatedBy });

    const oLinesData = loadRoleAccess();
    setRoleAccess(oLinesData);
  }, []);

  // ✅ same here — always read fresh data
  const refreshUserSession = () => {
    const userId = storedUser.Username;
    const UserType = storedUser.UserType;
    const CreatedBy = storedUser.Username;
    setUserSession({ userId, UserType, CreatedBy });
  };

  const refreshRoleAccess = () => {
    const updatedData = loadRoleAccess();
    setRoleAccess(updatedData);
  };

  const checkAccess = (MenuId, permissionType) => {
    try {
      const found = roleAccess?.find((r) => r.MenuId === MenuId);
      if (!found) return false;

      // permissionType can be one of: "IsAdd", "IsEdit", "IsDelete", "IsRead"
      return found[permissionType] === true;
    } catch (err) {
      console.error("Error checking access:", err);
      return false;
    }
  };

  return (
    <ModeContext.Provider
      value={{
        themeMode,
        LightMode,
        DarkMode,
        userSession,
        refreshUserSession,
        roleAccess,
        refreshRoleAccess,
        checkAccess,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ModeContext);
