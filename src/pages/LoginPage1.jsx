//==========bg2============
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Swal from "sweetalert2";
import axios from "axios";
import { BASE_URL } from "../Constant";
import logo from "../assets/ApaleSarkar.png";
import darkThemeLogo from "../assets/darkThemeLogo.png";

function LoginPage1() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Login logic
  const handleSubmit = async () => {
    try {
      const body = {
        Username: userId,
        Password: password,
        UserType: "A",
      };

      const res = await axios.post(`${BASE_URL}Login`, body);
      console.log("Response data:", res.data);

      if (res.data.success === true) {
        const data = res.data.values;
        const userData = {
          Name: `${data.Lastname} ${data.Firstname}`,
          Username: data.Username,
          Address: data.Address,
          Email: data.Email,
          BloodGroup: data.BloodGroup,
          Avatar: data.Avatar,
          _id: data._id,
          Token: data.Token,
        };
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("userData", JSON.stringify(userData));

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
    if (userId === "" || password === "") {
      Swal.fire({
        position: "top-end",
        icon: "error",
        toast: true,
        title: "Please Enter Username And Password",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      handleSubmit();
    }
  };

  // Common TextField styling for a white border and label
  const textFieldStyle = {
    mb: 2,
    "& .MuiInputLabel-root": {
      color: "#fff", // Label color
    },
    "& label.Mui-focused": {
      color: "#fff", // Focused label color
    },
    "& .MuiOutlinedInput-root": {
      color: "#fff", // Text color while typing
      "& fieldset": {
        borderColor: "#fff", // Default border
      },
      "&:hover fieldset": {
        borderColor: "#fff", // Hover border
      },
      "&.Mui-focused fieldset": {
        borderColor: "#fff", // Focused border
      },
    },
  };
console.log("error")
  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0E3C43", // Dark teal background
        color: "#fff",
      }}
    >
      {/* Left Panel */}
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Brand Logo or Image */}
        <Box sx={{ mb: 2 }}>
          <img
            src={darkThemeLogo}
            alt="Bailey and Co. logo"
            width="320"
            height="280"
          />
        </Box>
      </Grid>

      {/* Vertical Divider */}
      <Grid
        item
        xs={12}
        md={1}
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderColor: "rgba(255,255,255,0.3)",
            height: "60%",
            marginTop: "100%",
          }}
        />
      </Grid>

      {/* Right Panel */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 4, md: 8 }, // Horizontal padding
          py: 6, // Vertical padding
        }}
      >
        {/* Wrap the form in a Box to control max width */}
        <Box sx={{ maxWidth: 360, width: "100%", margin: "0 auto" }}>
          <Box component="form" onSubmit={login}>
            {/* Welcome Heading */}
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
              Welcome
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Please login to Admin Dashboard.
            </Typography>

            {/* Username Field */}
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

            {/* Password Field */}
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

            {/* Remember Me Checkbox */}
            <FormControlLabel
              control={<Checkbox sx={{ color: "#fff" }} />}
              label="Remember Me"
              sx={{ mb: 3 }}
            />

            {/* Login Button */}
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

            {/* Forgot Password Link */}
            <Typography
              variant="body2"
              align="center"
              sx={{ textDecoration: "underline", cursor: "pointer" }}
            >
              Forgotten Your Password?
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default LoginPage1;
