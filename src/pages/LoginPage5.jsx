import React, { useState } from "react";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark/light mode using the switch
  const handleToggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div>
      {/* Inline CSS */}
      <style>{`
        /* Reset default margins/padding */
        html, body {
          margin: 0;
          padding: 0;
        }
        /* Main container fills the viewport, no scroll */
        .container {
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: #f3f3f3; /* Light mode background */
          color: #333;         /* Light mode text */
        }
        .container.dark {
          background: #0b2533; /* Dark mode background */
          color: #f3f3f3;
        }
        /* Toggle switch (slider) for dark/light mode at top-left */
        .switch {
          position: absolute;
          top: 20px;
          left: 20px;
          display: inline-block;
          width: 50px;
          height: 28px;
          z-index: 2;
        }
        .switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 28px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #2196F3;
        }
        input:checked + .slider:before {
          transform: translateX(22px);
        }
        /* Centered sign‑in box */
        .signin-box {
          z-index: 1; /* above waves */
          background: #ffffffcc; /* semi‑transparent white */
          padding: 2rem;
          border-radius: 8px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          text-align: center;
        }
        .container.dark .signin-box {
          background: #00000099; /* semi‑transparent black in dark mode */
        }
        .signin-box h1 {
          margin-bottom: 0.5rem;
        }
        .signin-box p {
          margin-bottom: 2rem;
          font-size: 0.95rem;
          color: #666;
        }
        .container.dark .signin-box p {
          color: #ccc;
        }
        /* Form styling with each input group */
        .signin-form {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }
        .form-group input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #004c4c; /* dark teal border */
          border-radius: 4px;
          font-size: 0.9rem;
          outline: none;
          background-color: #004c4c; /* dark teal background */
          color: #fff;
        }
        .form-group input::placeholder {
          color: #ddd;
        }
        .form-group label {
          margin-top: 0.25rem;
          font-size: 0.8rem;
          color: #fff;
        }
        /* Options row */
        .options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }
        .remember-me {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .options a {
          color: #555;
          text-decoration: none;
        }
        .options a:hover {
          text-decoration: underline;
        }
        /* Login button */
        .login-button {
          padding: 0.7rem;
          border: none;
          border-radius: 4px;
          background: #2ecc71;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          width: 100%;
        }
        .login-button:hover {
          background: #27ae60;
        }
        /* Top wave: a short wave from the left */
        .wave-container.top-wave {
          position: absolute;
          bottom: 20%;
          left: 0;
          width: 50%;
          height: 10%;
          overflow: hidden;
          z-index: 0;
        }
        /* Bottom full‑width wave */
        .wave-container.bottom-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 20%;
          overflow: hidden;
          z-index: 0;
        }
        .wave {
          width: 100%;
          height: 100%;
        }
        /* Dark mode overrides for waves */
        .container.dark .wave-container.top-wave svg path {
          fill: #12ac8f;
        }
        .container.dark .wave-container.bottom-wave svg path {
          fill: #0b7f70;
        }
      `}</style>

      {/* Main container */}
      <div className={darkMode ? "container dark" : "container"}>
        {/* Toggle switch */}
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={handleToggleTheme} />
          <span className="slider"></span>
        </label>

        {/* Sign‑in box */}
        <div className="signin-box">
          <h1>Sign in</h1>
          <p>Sign in and start managing your candidates!</p>
          <form className="signin-form">
            <div className="form-group">
              <input id="username" type="text" placeholder="Enter your login" />
              <label htmlFor="username">Login</label>
            </div>
            <div className="form-group">
              <input id="password" type="password" placeholder="Enter your password" />
              <label htmlFor="password">Password</label>
            </div>
            <div className="options">
              <div className="remember-me">
                <input id="remember" type="checkbox" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>

        {/* Top short wave (from left) */}
        {/* <div className="wave-container top-wave">
          <svg className="wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="#004c4c"
              fillOpacity="1"
              d="M0,128L48,112C96,96,192,64,288,53.3C384,43,480,53,576,80C672,107,768,149,864,144C960,139,1056,85,1152,64C1248,43,1344,53,1392,58.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            />
          </svg>
        </div> */}

        {/* Bottom full-width wave */}
        <div className="wave-container bottom-wave">
          <svg className="wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="#1abc9c"
              fillOpacity="1"
              d="M0,64L48,74.7C96,85,192,107,288,106.7C384,107,480,85,576,106.7C672,128,768,192,864,224C960,256,1056,288,1152,277.3C1248,267,1344,213,1392,186.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
