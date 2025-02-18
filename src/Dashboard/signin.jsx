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
import Swal from "sweetalert2";
import bgimg from "../../src/assets/back7.png";

function Signin() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = () => {
    if (userId === "" || password === "") {
      Swal.fire({
        position: "top-end",
        icon: "error",
        toast: true,
        title: "Please enter Username and Password",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    // Store dummy user data
    const userData = {
      Name: "John Doe",
      Phone: userId,
      Email: "john.doe@example.com",
      Address: "123 Main St",
      BloodGroup: "O+",
      Avatar: "",
      _id: "123456",
      Token: "dummy-token",
    };

    sessionStorage.setItem("userId", userId);
    sessionStorage.setItem("userData", JSON.stringify(userData));

    Swal.fire({
      position: "top-end",
      toast: true,
      title: "Login Successful",
      showConfirmButton: false,
      timer: 1500,
      icon: "success",
    });

    navigate("/dashboard/home");
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
          backgroundImage: `url(${bgimg})`,
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
            "&:hover": { boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)" },
          }}
        >
          <Grid container item width={"100%"} height={500} alignItems="center">
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
                    onChange={(e) => setUserId(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" sx={{ color: "#9370db" }}>
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
                    type={showPassword ? "text" : "password"}
                    name="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            sx={{ color: "#9370db" }}
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
                    onClick={handleSubmit}
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
