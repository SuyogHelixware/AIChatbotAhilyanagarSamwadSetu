import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Card, Container, Grid, ScopedCssBaseline } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import logo from "../assets/ApaleSarkar.png";
import bgimg from "../../src/assets/bg9.webp";
import Swal from "sweetalert2";
import axios from "axios";
import { BASE_URL } from "../Constant";

function Signin() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    try {
      const body = {
        Username: userId,
        Password: password,
        UserType: "A",
      };

      axios
        .post(`${BASE_URL}Login`, body)
        .then((res) => {
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
            Navigate("/dashboard/home");
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
        })
        .catch((e) => console.log(e));
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
        title: "Please Enter Username And password",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      handleSubmit();
    }
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    if (name === "userId") {
      setUserId(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <>
      <Grid
        container
        width={"100%"}
        height="100vh"
        justifyContent={"center"}
        alignItems={"center"}
        style={{
          backgroundImage: "url(" + bgimg + ")",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          display: "flex",
          alignItems: "center",
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
        }}
      >
    <Card
  elevation={5}
  sx={{
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Slightly white background for better readability
    backdropFilter: "blur(10px)", // Blurred effect
    borderRadius: "20px", // Rounded corners
    boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.1)",
    width: "350px", // Adjusted width to make the form smaller
    zIndex: 2,
    border: "1px solid #006f5f", // Dark teal border
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "0px 25px 50px rgba(0, 0, 0, 0.15)",
    },
  }}
>
  <Grid
    container
    item
    justifyContent="center"
    alignItems="center"
    sx={{ height: "100%", py: 5 }}
  >
    <Container component="main" maxWidth="xs" sx={{ zIndex: 3 }}>
      <ScopedCssBaseline />
      <Grid item sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box mb={0}>
          <img
            src={logo}
            alt="logo"
            width="120px"
            height="auto"
          />
        </Box>

        <Box component="form" sx={{ mt: 0}}>
        <TextField
  margin="normal"
  size="large"
  required
  fullWidth
  id="userId"
  label="User Id"
  name="userId"
  variant="standard"
  autoFocus
  value={userId}
  onChange={handleOnChange}
  sx={{
    "& .MuiInput-underline:before": {
      borderBottomColor: "rgba(0, 0, 0, 0.42)", // Default color
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "rgb(16,59,66)", // Focused bottom line color
    },
    "& .MuiInputLabel-root": {
      color: "rgba(0, 0, 0, 0.6)", // Default label color
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "rgb(16,59,66)", // Focused label color
    },
  }}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton edge="end" sx={{ color: "rgb(16,59,66)" }}>
          <AccountCircleIcon />
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

<TextField
  margin="normal"
  size="large"
  required
  variant="standard"
  fullWidth
  type={showPassword ? "text" : "password"}
  name="password"
  label="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  sx={{
    "& .MuiInput-underline:before": {
      borderBottomColor: "rgba(0, 0, 0, 0.42)", // Default color
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "rgb(16,59,66)", // Focused bottom line color
    },
    "& .MuiInputLabel-root": {
      color: "rgba(0, 0, 0, 0.6)", // Default label color
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "rgb(16,59,66)", // Focused label color
    },
  }}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          edge="end"
          sx={{ color: "rgb(16,59,66)" }}
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>


          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
            sx={{
              color: "rgb(16,59,66)",
            }}
          />

          <Button
            type="submit"
            fullWidth
            sx={{
              mt: 4,
              py: 1,
              color: "white",
              borderRadius: "30px",
              background: "linear-gradient(to right,rgb(16,59,66), #3A808B)", // Dark and light teal gradient
              boxShadow: 5,
              "&:hover": {
                transform: "translateY(2px)",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              },
            }}
            onClick={login}
          >
            Sign In
          </Button>

          <Box mt={2} textAlign="center">
            <a href="#" style={{ color: "rgb(16,59,66)", fontSize: "14px" }}>
              Forgot Password?
            </a>
          </Box>
        </Box>
      </Grid>
    </Container>
  </Grid>
</Card>

      </Grid>
      <footer
        style={{
          position: "absolute",
          bottom: "10px",
          width: "100%",
          textAlign: "center",
          color: "#fff",
          fontSize: "14px",
        }}
      >
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </>
  );
}

export default Signin;
