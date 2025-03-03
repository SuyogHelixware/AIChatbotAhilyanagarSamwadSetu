import React from "react";

export default function App() {
  return (
    <div className="container">
      <style>{`
        /* Reset and base styling */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          height: 100%;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        /* Fullscreen container with gradient background */
        .container {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #004c4c, #1abc9c);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        /* Decorative background shapes using circles and half‑circles */
        .decorative-half-circle {
          position: absolute;
          top: 0;
          left: 0;
          width: 250px;
          opacity: 0.2;
        }
        .decorative-circle {
          position: absolute;
          top: 10%;
          right: 5%;
          width: 150px;
          opacity: 0.15;
        }
        .decorative-circle-bottom {
          position: absolute;
          bottom: -50px;
          left: 10%;
          width: 200px;
          opacity: 0.1;
        }
        /* Login card with subtle blur and rounded corners */
        .login-card {
          position: relative;
          z-index: 2;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(5px);
          border-radius: 16px;
          padding: 2rem;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
          text-align: center;
        }
        .login-card h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #004c4c;
        }
        .login-card p {
          margin-bottom: 1.5rem;
          color: #333;
        }
        /* Form styling */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-group input {
          padding: 0.75rem;
          border: 2px solid transparent;
          border-radius: 8px;
          background-color: #004c4c;
          color: #fff;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }
        .form-group input::placeholder {
          color: #ddd;
        }
        .form-group input:focus {
          outline: none;
          border-color: #1abc9c;
        }
        .form-group label {
          margin-top: 0.5rem;
          font-size: 0.85rem;
          color: #fff;
        }
        .login-button {
          padding: 0.85rem;
          border: none;
          border-radius: 8px;
          background: #004c4c;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .login-button:hover {
          background: #003333;
        }
        .footer {
          margin-top: 1rem;
          font-size: 0.85rem;
          color: #004c4c;
        }
        .footer a {
          color: #004c4c;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
        /* Bottom waves: two overlapping transparent waves */
        .wave-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 25%;
          overflow: hidden;
          z-index: 1;
        }
        .wave {
          width: 100%;
          height: 100%;
        }
      `}</style>

      {/* Decorative half‑circle (creates an attractive curved shape) */}
      <svg className="decorative-half-circle" viewBox="0 0 200 100" preserveAspectRatio="none">
        <path d="M0,0 L200,0 A100,100 0 0,0 0,0 Z" fill="#ffffff" />
      </svg>

      {/* Decorative full circle at top right */}
      <svg className="decorative-circle" viewBox="0 0 100 100" preserveAspectRatio="none">
        <circle cx="50" cy="50" r="50" fill="#ffffff" />
      </svg>

      {/* Decorative circle at bottom left */}
      <svg className="decorative-circle-bottom" viewBox="0 0 100 100" preserveAspectRatio="none">
        <circle cx="50" cy="50" r="50" fill="#ffffff" />
      </svg>

      {/* Login Card */}
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p>Please sign in to continue</p>
        <form className="login-form">
          <div className="form-group">
            <input type="text" placeholder="Username" id="username" />
            <label htmlFor="username">Username</label>
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" id="password" />
            <label htmlFor="password">Password</label>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="footer">
          <a href="#">Forgot password?</a>
        </div>
      </div>

      {/* Bottom Waves: two overlapping transparent waves */}
      <div className="wave-container">
        <svg className="wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#ffffff" fillOpacity="0.7" d="M0,224L1440,96L1440,320L0,320Z" />
          <path fill="#ffffff" fillOpacity="0.5" d="M0,192L1440,128L1440,320L0,320Z" />
        </svg>
      </div>
    </div>
  );
}
