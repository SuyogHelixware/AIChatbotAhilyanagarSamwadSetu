import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import darkThemeLogo from "../assets/darkThemeLogo.png";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../Constant";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Loader from "../components/Loader";
import PersonIcon from "@mui/icons-material/Person";
// import PersonIcon from "@mui/icons-material/Person";
import CryptoJS from "crypto-js";
import { useThemeMode } from "./Theme";

const Signin = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refreshUserSession } = useThemeMode();

  const [role, setRole] = useState(() => {
    const storedRole = localStorage.getItem("RoleDetails");
    return storedRole ? JSON.parse(storedRole) : null;
  });

  const { refreshRoleAccess } = useThemeMode();

  const SECRET_KEY = "YourStrongSecretKey123!";

  const handleSubmit = async () => {
    // try {
    //   const body = {
    //     Username: userId,
    //     Password: password,
    //   };
    //   setLoading(true);
    //   axios
    //     .post(`${BASE_URL}Login`, body)
    //     .then((res) => {
    //       if (res.data.success === true) {

    //         const data = res.data.values;
    //         const userData = {

    //           Name: ` ${data.FirstName} ${data.LastName}`,
    //           Username: data.Username,
    //           Address: data.Address,
    //           Email: data.Email,
    //           Phone: data.Phone,
    //           UserType: data.UserType,
    //           GazOfficer: data.GazOfficer,
    //           BloodGroup: data.BloodGroup,
    //           Avatar: data.Avatar,
    //           _id: data._id,
    //           Token: data.Token,
    //         };
    //         sessionStorage.setItem("userId", userData.Username);

    //         sessionStorage.setItem("userData", JSON.stringify(userData));

    //         Swal.fire({
    //           position: "top-end",
    //           toast: true,
    //           title: "Login Success",
    //           showConfirmButton: false,
    //           timer: 1500,
    //           icon: "success",
    //         });

    //         // Wait briefly to show loader, then navigate
    //         setTimeout(() => {
    //           navigate("/dashboard/home");
    //         }, 1000);
    //       } else {
    //         setLoading(false);
    //         Swal.fire({
    //           position: "top-end",
    //           icon: "error",
    //           toast: true,
    //           title: "Invalid username or password",
    //           showConfirmButton: false,
    //           timer: 1500,
    //         });
    //       }
    //     })
    //     .catch((e) => {
    //       setLoading(false);
    //       console.log(e);
    //     });
    // }

    try {
      const body = {
        Username: userId,
        Password: password,
      };
      setLoading(true);

      axios
        .post(`${BASE_URL}Login`, body)

        .then(async (res) => {
 
          if (res.data.success === true) {
            const data = res.data.values;

            const userData = {
              Name: `${data.FirstName} ${data.LastName}`,
              Username: data.Username,
              Address: data.Address,
              Email: data.Email,
              Phone: data.Phone,
              UserType: data.UserType,
              GazOfficer: data.GazOfficer,
              Avatar: data.Avatar,
              _id: data._id,
              Token: data.Token,
              RoleName: data.Role,
            };

            // Save basic user info
            console.log("tt==+++++++++===", userData);
            sessionStorage.setItem("BearerTokan", res.headers.authorization);

            sessionStorage.setItem("userId", userData.Username);
            sessionStorage.setItem("userData", JSON.stringify(userData));
            refreshUserSession();

            const roleNameToUse = data?.Role;
            const encodedRoleName = encodeURIComponent(roleNameToUse);

            const roleResponse = await axios.get(
              `${BASE_URL}Role?RoleName=${encodedRoleName}`
            );

            if (roleResponse.data.success === true) {
              const roleData = roleResponse.data.values;
              const oLines =
                Array.isArray(roleData) && roleData.length > 0
                  ? roleData[0].oLines || []
                  : roleData.oLines || [];

              const RoleDetails = {
                oLines,
              };

              const encryptedRoleDetails = CryptoJS.AES.encrypt(
                JSON.stringify(RoleDetails),
                SECRET_KEY
              ).toString();

              sessionStorage.setItem("RoleDetails", encryptedRoleDetails);
              refreshRoleAccess();
            }

            Swal.fire({
              position: "top-end",
              toast: true,
              title: "Login Success",
              showConfirmButton: false,
              timer: 1500,
              icon: "success",
            });

            setTimeout(() => {
              navigate("/dashboard/home");
            }, 1000);
          } else {
            setLoading(false);
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
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    } catch (error) {
      setLoading(false);
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

  return (
    <>
      {loading && <Loader open={loading} />}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(to right, #004d40, #26a69a)",
          fontFamily: "Arial, sans-serif",
          px: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", md: "row" },
            width: { xs: "100%", sm: "90%", md: "800px" },
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              flex: 1,
              p: { xs: 3, md: 5 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              Sign In
            </h2>

            <Box
              sx={{
                width: "100%",
                // display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                maxWidth: { xs: "90%", sm: "80%", md: "320px" },
                mx: "auto", // center
              }}
            >
              <Box sx={{ position: "relative", mb: 2 }}>
                <PersonIcon
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "2px",
                    // left: "15px",
                    transform: "translateY(-50%)",
                    fontSize: "25px",
                    color: "#888",
                  }}
                />
                {/* 📧 */}

                <input
                  type="text"
                  placeholder="Username"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  tabIndex={1}
                  style={{
                    width: "80%",
                    padding: "12px 12px 12px 40px",
                    border: "none",
                    borderRadius: "20px",
                    background: "#f5f5f5",
                    fontSize: "16px",
                  }}
                />
              </Box>

              <Box sx={{ position: "relative", mb: 2 }}>
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: "2px",
                    // left: "1px",
                    transform: "translateY(-50%)",
                    color: "#888",
                    p: 0,
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      login(e);
                    }
                  }}
                  tabIndex={2}
                  style={{
                    width: "80%",
                    padding: "12px 12px 12px 45px",
                    border: "none",
                    borderRadius: "20px",
                    background: "#f5f5f5",
                    fontSize: "16px",
                  }}
                />
              </Box>

              <p
                onClick={() => navigate("/forgot-password")}
                style={{
                  cursor: "pointer",
                  color: "#00796b",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                Forgot Password?
              </p>

              <button
                onClick={login}
                tabIndex={3}
                style={{
                  width: "100%",
                  background: "#00796b",
                  color: "white",
                  border: "none",
                  padding: "12px",
                  borderRadius: "25px",
                  fontSize: "16px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Sign In
              </button>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              background: "linear-gradient(to right, #004d40, #00796b)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: { xs: 3, md: 5 },
            }}
          >
            <Box
              sx={{ mb: 2, width: { xs: "220px", sm: "280px", md: "320px" } }}
            >
              <img
                src={darkThemeLogo}
                alt="Logo"
                width="100%"
                style={{ objectFit: "contain" }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Signin;
