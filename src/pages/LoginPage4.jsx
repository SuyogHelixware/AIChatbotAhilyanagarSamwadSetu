//=======================bg5=================
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import darkThemeLogo from "../assets/darkThemeLogo.png";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Link
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Swal from "sweetalert2";
import axios from "axios";
import { BASE_URL } from "../Constant";

// Replace with your actual BASE_URL

function LoginPage4() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Example login submit
  const handleSubmit = async () => {
    try {
      const body = { Username: userId, Password: password, UserType: "A" };
      const res = await axios.post(`${BASE_URL}Login`, body);

      if (res.data.success === true) {
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("userData", JSON.stringify(res.data.values));

        Swal.fire({
          position: "top-end",
          toast: true,
          title: "Login Success",
          showConfirmButton: false,
          timer: 1500,
          icon: "success",
        });
        navigate("/dashboard/home");
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          toast: true,
          title: "Invalid username or password",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        toast: true,
        title: error.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const login = (e) => {
    e.preventDefault();
    if (!userId || !password) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        toast: true,
        title: "Please enter Username and Password",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      handleSubmit();
    }
  };

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #D4F1F4,rgb(238, 232, 228))", // Light teal gradient
      }}
    >
      {/* Wrapper Grid to fit the background */}
      <Grid item xs={12} sx={{ display: "flex", width: "100%", padding:"6% 6%", borderRadius:"25px" }}>
        {/* Left Column: White container for heading and form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            position: "relative",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: { xs: 4, md: 8 },
            py: 6,
            overflow: "hidden",
          }}
        >
          {/* Background Circles */}
          <Box
            sx={{
              position: "absolute",
              top: "-80px",
              left: "-80px",
              width: 160,
              height: 160,
              borderRadius: "50%",
              backgroundColor: "#FF8A00",
              opacity: 0.2,
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "-100px",
              left: "20%",
              width: 200,
              height: 200,
              borderRadius: "50%",
              backgroundColor: "#FFA45B",
              opacity: 0.2,
              zIndex: 0,
            }}
          />
  <Box
            sx={{
              position: "absolute",
              top: "-80px",
              left: "68%",
              width: 160,
              height: 160,
              borderRadius: "50%",
              backgroundColor: "#FF8A00",
              opacity: 0.2,
              zIndex: 0,
            }}
          />
          <Box sx={{ maxWidth: 400, width: "100%", mx: "auto", zIndex: 1 }}>
            {/* Page Title */}
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              Dashboard Login
            </Typography>

            {/* Login Form */}
            <Box component="form" onSubmit={login}>
              {/* Username Field */}
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <AccountCircleIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Field */}
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Forgot Password Link */}
              <Box sx={{ textAlign: "right", mb: 3 }}>
                <Link href="#" variant="body2">
                  Forgot Password?
                </Link>
              </Box>

              {/* Sign In Button (Dark Teal) */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#014040", // Dark Teal
                  color: "#fff",
                  fontWeight: 600,
                  py: 1.2,
                  mb: 2,
                  "&:hover": {
                    backgroundColor: "#012F2F", // Slightly darker on hover
                  },
                }}
              >
                Login
              </Button>

              {/* Register Link */}
              <Typography variant="body2" align="center">
                Don’t have an account?{" "}
                <Link href="#" variant="body2" sx={{ fontWeight: 600 }}>
                  Register
                </Link>
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Right Column: Teal panel with an image */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: "#045D5D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Image Placeholder */}
          <Box sx={{ mb: 2 }}>
            <img
              src={darkThemeLogo}
              alt="Bailey and Co. logo"
              width="320"
              height="280"
            />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default LoginPage4;
