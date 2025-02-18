// Create ne w file
import React from 'react';
import loaderImage  from '../assets/loader.png'
const LoginPageLoader = () => {
  return (

        <div className="orp-loader-container">
            <div className="orp-subtext" style={{ backgroundImage: `url(${loaderImage})`,  // Use imported image URL
          }}></div>
        </div>
  
  );
};

export default LoginPageLoader;