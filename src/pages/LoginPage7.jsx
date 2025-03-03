import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import back9 from "../assets/back9.jpg";
import darkThemeLogo from "../assets/darkThemeLogo.png";
export default function App() {
  // State for login form
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // A simple style object for text fields
  const textFieldStyle = {
    backgroundColor: "#fff",
    borderRadius: "4px",
    mb: 2,
  };

  // Login handler
  const login = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { userId, password });
  };

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <style>{`
        /* Reset & Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          height: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #e0f7fa; /* Pastel light teal background */
        }
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
        }
        /* Paper-like card */
        .paper {
          background: #fff;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          overflow: hidden;
          max-width: 1100px;
          width: 100%;
          height: 550px; /* Increased height */
        }
        /* Left Section: Illustrative Image */
        .left-section {
          flex: 1;
          background:rgb(255, 255, 255);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .left-section img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        /* Right Section: Login Form container (will host the Material-UI Box) */
        .right-section {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #004c4c; /* Dark teal background */
        }
        @media (max-width: 768px) {
          .paper {
            flex-direction: column;
            height: auto;
          }
          .left-section, .right-section {
            flex: none;
            width: 100%;
          }
          .left-section {
            height: 200px;
          }
        }
      `}</style>
      <div className="paper">
        {/* Left Section with an illustrative image */}
        <div className="left-section">
          <img
            src={back9}
            alt="Illustration"
            style={{ width: "70%", height: "70%" }}
          />
        </div>
        {/* Right Section with the Login Form (Material-UI) */}
        <div className="right-section">
          <Box
            sx={{
              maxWidth: 360,
              width: "100%",
              margin: "0 auto",
              backgroundColor: "#004c4c",
              padding: 3,
              borderRadius: 2,
            }}
          >
            <Box component="form" onSubmit={login}>
              <img src={darkThemeLogo} alt="" height={"60%"} width={"60%"} />

              <TextField
                required
                fullWidth
                variant="outlined"
                label="Username"
                name="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                sx={textFieldStyle}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" sx={{ color: "#fff" }}>
                        <AccountCircleIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                required
                fullWidth
                variant="outlined"
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={textFieldStyle}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        sx={{ color: "#fff" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={<Checkbox sx={{ color: "#fff" }} />}
                label="Remember Me"
                sx={{ mb: 3, color: "#fff" }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#F16529",
                  color: "#fff",
                  fontWeight: 600,
                  py: 1.2,
                  mb: 2,
                  "&:hover": {
                    backgroundColor: "#D14F20",
                  },
                }}
              >
                LOGIN
              </Button>

              <Typography
                variant="body2"
                align="center"
                sx={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                Forgotten Your Password?
              </Typography>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
}
