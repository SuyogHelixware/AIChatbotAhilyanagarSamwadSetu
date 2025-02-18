
export function isLogin() {
    return sessionStorage.getItem("userData") ? true : false;
  }
  
  
  export function setLoginInfo(userData) {
    sessionStorage.setItem("userData", JSON.stringify(userData));
    sessionStorage.setItem("userId", userData.userId);
   
  
  }
  
  export function getLoginInfo() {
    if (isLogin) return JSON.parse(sessionStorage.getItem("userData"));
    else return null;
  }
  