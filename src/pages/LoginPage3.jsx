//============bg4=====================
import { Box } from "@mui/material";
import React from "react";
import darkThemeLogo from "../assets/darkThemeLogo.png"
const LoginPage3 = () => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(to right, #004d40, #26a69a)",
      fontFamily: "Arial, sans-serif",
    },
    loginWrapper: {
      display: "flex",
      width: "800px",
      background: "white",
      borderRadius: "20px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      overflow: "hidden",
    },
    leftPanel: {
      flex: 1,
      padding: "40px",
    },
    rightPanel: {
      flex: 1,
      background: "linear-gradient(to right, #004d40, #00796b)",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
      textAlign: "center",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    subtitle: {
      fontSize: "14px",
      marginBottom: "20px",
      color: "#666",
    },
    inputGroup: {
      marginBottom: "15px",
      position: "relative",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "none",
      borderRadius: "25px",
      background: "#f5f5f5",
      fontSize: "16px",
      paddingLeft: "40px",
    },
    icon: {
      position: "absolute",
      top: "50%",
      left: "15px",
      transform: "translateY(-50%)",
      fontSize: "16px",
      color: "#888",
    },
    loginButton: {
      width: "100%",
      background: "#00796b",
      color: "white",
      border: "none",
      padding: "12px",
      borderRadius: "25px",
      fontSize: "16px",
      cursor: "pointer",
      marginTop: "15px",
    },
    checkbox: {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      color: "#666",
      marginTop: "10px",
    },
    checkboxInput: {
      marginRight: "5px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginWrapper}>
        <div style={styles.leftPanel}>
          <h2 style={styles.title}>Hello!</h2>
          <p style={styles.subtitle}>Sign in by your account</p>
          <div style={styles.inputGroup}>
            <span style={styles.icon}>📧</span>
            <input type="text" placeholder="User Name" style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <span style={styles.icon}>🔒</span>
            <input type="password" placeholder="Password" style={styles.input} />
          </div>
          <div style={styles.checkbox}>
            <input type="checkbox" style={styles.checkboxInput} /> Remember Me
          </div>
          <button style={styles.loginButton}>Sign In</button>
        </div>
        <div style={styles.rightPanel}>
        <Box sx={{ mb: 2 }}>
          <img
            src={darkThemeLogo}
            alt="Bailey and Co. logo"
            width="320"
            height="280"
          />
        </Box>
        </div>
      </div>
    </div>
  );
};

export default LoginPage3;
