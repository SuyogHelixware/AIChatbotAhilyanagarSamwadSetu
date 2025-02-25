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
import logo from "../../src/assets/logo.png";
import bgimg from "../../src/assets/back7.png";
import Swal from "sweetalert2";
import axios from "axios";
import { BASE_URL } from "../Constant";

function Signin() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();
  // const [valueSelected, setValueSelected] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // const handleSelectValue = () => {
  //   setValueSelected(true);
  // };

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
              _id:data._id,
              Token:data.Token

            };
            sessionStorage.setItem("userId", userId);
            sessionStorage.setItem("userData", JSON.stringify(userData));
            Swal.fire({
              position: "top-end",
              toast: true,
              title: "Login Success",
              showConfirmButton: false,
              timer: 1500,
              icon:"success",
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

      console.log("Login successful!");
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
          height: "90",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Card
          elevation={3}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(0px)",
            borderRadius: "20px",
            border: "2px solid white",
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <Grid
            container
            item
            width={"100%"}
            height={500}
            style={{
              backgroundSize: "cover",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Container component="main" maxWidth="xs" sx={{ zIndex: 3 }}>
              <ScopedCssBaseline />
              <Grid
                item
                sx={{
                  height: "550px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 7,
                }}
              >
                <Box>
                  <img
                    src={logo}
                    alt="logo"
                    width="100%"
                    height="120"
                    maxHeight="50px"
                    maxWidth="80px"
                  />
                </Box>

                <Box component="form" sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    size="small"
                    required
                    fullWidth
                    id="userId"
                    label="User Id"
                    name="userId"
                    autoFocus
                    value={userId}
                    onChange={handleOnChange}
                    // onBlur={handleSelectValue}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "20px",
                        // backgroundColor: valueSelected
                        //   ? "#f0f0f0"
                        //   : "transparent",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" sx={{ color: "#9370db " }}>
                            <AccountCircleIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    margin="normal"
                    size="small"
                    required
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                    }}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            sx={{ color: "#9370db " }}
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
                  />

                  <Button
                    type="submit"
                    fullWidth
                    sx={{
                      mt: 4,
                      py: 1,
                      color: "white",
                      borderRadius: "30px",
                      background:
                        "-webkit-linear-gradient(260deg, #8F00FF , #8F00FF)",

                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #A160B0 50%, #A160B0 70%)",
                      },
                    }}
                    onClick={login}
                  >
                    Sign In
                  </Button>
                </Box>
              </Grid>
            </Container>
          </Grid>
        </Card>
      </Grid>
    </>
  );
}

export default Signin;
