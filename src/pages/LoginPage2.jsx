//===================bg3================
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Fab
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Swal from "sweetalert2";
import axios from "axios";

// Replace this with your own constant
const BASE_URL = "https://example.com/api/";

function LoginPage2() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Example login logic
  const handleSubmit = async () => {
    try {
      const body = { Username: email, Password: password, UserType: "A" };
      const res = await axios.post(`${BASE_URL}Login`, body);

      if (res.data.success === true) {
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
    if (!email || !password) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        toast: true,
        title: "Please enter your email and password",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      handleSubmit();
    }
  };

  // Common dark teal color
  const darkTeal = "#0E3C43";

  // Reusable TextField style: white text, white outline, white label
  const textFieldStyle = {
    mb: 2,
    "& .MuiInputLabel-root": {
      color: "#ffffffcc", // semi-white label
    },
    "& label.Mui-focused": {
      color: "#fff", // fully white label on focus
    },
    "& .MuiOutlinedInput-root": {
      color: "#fff", // white text
      "& fieldset": {
        borderColor: "#ffffff99", // semi-transparent white outline
      },
      "&:hover fieldset": {
        borderColor: "#ffffffcc",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#fff",
      },
    },
  };

  return (
    <>
      {/* Full-page dark teal background */}
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          backgroundColor: darkTeal,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Main card with a slight lighter overlay and large border radius */}
        <Card
          sx={{
            width: { xs: "90%", sm: 400 },
            bgcolor: `${darkTeal}E6`, // Dark teal + alpha for a subtle difference
            borderRadius: 4,
            boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
            p: 4,
            textAlign: "center",
          }}
        >
          {/* Top brand area */}
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#fff", mb: 0.5 }}>
            OneShop
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#ffffffcc", fontStyle: "italic", mb: 3 }}
          >
            Fast & Easy Product Management
          </Typography>

          {/* Welcome text */}
          <Typography variant="h5" sx={{ color: "#fff", mb: 3, fontWeight: 600 }}>
            Welcome Back!
          </Typography>

          {/* Email / Password Form */}
          <Box component="form" onSubmit={login} sx={{ textAlign: "left" }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              label="Password"
              variant="outlined"
              fullWidth
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={textFieldStyle}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      sx={{ color: "#fff" }}
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password strength hint (optional, shown for demo) */}
         

            {/* Remember me & sign in */}
            <FormControlLabel
              control={<Checkbox sx={{ color: "#fff" }} />}
              label={
                <Typography variant="body2" sx={{ color: "#ffffffcc" }}>
                  Remember Me
                </Typography>
              }
              sx={{ mt: 1, mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#fff",
                color: darkTeal,
                fontWeight: 600,
                py: 1.2,
                mb: 2,
                "&:hover": {
                  backgroundColor: "#ffffffcc",
                },
              }}
            >
              Sign in
            </Button>
          </Box>

          <Typography
            variant="body2"
            sx={{ color: "#ffffffcc", textDecoration: "underline", mb: 3, cursor: "pointer" }}
          >
            Forgot My Password
          </Typography>

          {/* Footer links */}
        
        </Card>

        {/* Floating Buttons on the right side */}
        <Box
          sx={{
            position: "absolute",
            right: 16,
            bottom: 16,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Fab
            variant="extended"
            sx={{
              backgroundColor: "#ffffff22",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#ffffff44",
              },
            }}
          >
            Request An Account
          </Fab>
          <Fab
            variant="extended"
            sx={{
              backgroundColor: "#ffffff22",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#ffffff44",
              },
            }}
          >
            Need Help?
          </Fab>
        </Box>
      </Box>
    </>
  );
}

export default LoginPage2;
