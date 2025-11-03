// Create ne w file
import React from 'react';
import loaderImage  from '../assets/ApaleSarkar.png'
const LoginPageLoader = () => {
  return (

        // <div className="mah-loader-container">
        //     <div className="mah-subtext" style={{ backgroundImage: `url(${loaderImage})`
        //   }}> </div>
        //   <div className="mah-subtext" >
        //    KETAN</div>
        // </div>
        <div className="mah-loader-container">
  <div
    className="mah-subtext image"
    style={{ backgroundImage: `url(${loaderImage})` }}
  ></div>
<div
  style={{
    fontWeight: "bold",
      textAlign: "center",
    fontSize: "28px",
    letterSpacing: "1px",
   }}
>
  महाराष्ट्र शासन
</div>
</div>
  
  );
};

export default LoginPageLoader;