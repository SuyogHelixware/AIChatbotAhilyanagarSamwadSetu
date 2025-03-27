import { Box } from "@mui/material";
import React, { useState } from "react";
import darkThemeLogo from "../assets/darkThemeLogo.png";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../Constant";
import Loader from "../components/Loader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRecover = () => {
    if (email === "") {
      Swal.fire({
        position: "top-end",
        icon: "error",
        toast: true,
        title: "Please enter your email",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
        setLoading(true);
      axios
        .post(`${BASE_URL}Users/RequestOTPForRecover?Email=${email}`)
        .then((res) => {
            setLoading(false);
          if (res.data.success) {
            localStorage.setItem("user", JSON.stringify(res.data.values));
            Swal.fire({
              position: "top-end",
              toast: true,
              title: "OTP Sent To Your Email",
              showConfirmButton: false,
              timer: 2000,
              icon: "success",
            });
            setShowOtp(true);
          } else {
            Swal.fire({
              position: "top-end",
              icon: "error",
              toast: true,
              title: "Email not found or failed to send OTP",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]*$/.test(value)) return; // Only digits allowed
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Move to next box if value is entered
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        toast: true,
        title: "Please enter 6-digit OTP",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
  
    const body = {
      Email: email,
      OTP: enteredOtp,
    };
    setLoading(true);

    axios
      .post(`${BASE_URL}Users/VerifyOTP`, body)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          // Get user data from localStorage
          const data = JSON.parse(localStorage.getItem("user"));
  
          if (data) {
            const userData = {
              Name: `${data.LastName ?? ""} ${data.FirstName ?? ""}`,
              Username: data.Username,
              Address: data.Address ?? "",
              Email: data.Email,
              BloodGroup: data.BloodGroup ?? "",
              Avatar: data.Avatar ?? "",
              _id: data.Id ?? data._id ?? "",
            };
  
            sessionStorage.setItem("userId", data.Username);
            sessionStorage.setItem("userData", JSON.stringify(userData));
          }
  
          Swal.fire({
            position: "top-end",
            icon: "success",
            toast: true,
            title: "OTP Verified! Login Successful",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate("/dashboard/home");
          });
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            toast: true,
            title: "Invalid or expired OTP",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((err) => console.log(err));
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
          {!showOtp ? (
            <>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "25px" }}>
                Enter the email address associated with your account.
              </h2>
              <Box sx={{ width: { xs: "80%", sm: "70%", md: "250px" } }}>
                <Box sx={{ position: "relative", mb: 2 }}>
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "15px",
                      transform: "translateY(-50%)",
                      fontSize: "16px",
                      color: "#888",
                    }}
                  >
                    📧
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 12px 12px 40px",
                      border: "none",
                      borderRadius: "25px",
                      background: "#f5f5f5",
                      fontSize: "16px",
                    }}
                  />
                </Box>

                <button
                  onClick={handleRecover}
                  style={{
                    width: "100%",
                    background: "#00796b",
                    color: "white",
                    border: "none",
                    padding: "12px",
                    borderRadius: "25px",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Send OTP
                </button>
              </Box>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
                Verify OTP
              </h2>
              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                {otp.map((value, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={value}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    style={{
                      width: "40px",
                      height: "40px",
                      textAlign: "center",
                      fontSize: "18px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                ))}
              </Box>
              <button
                onClick={handleVerifyOtp}
                style={{
                  width: "100%",
                  background: "#00796b",
                  color: "white",
                  border: "none",
                  padding: "12px",
                  borderRadius: "25px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Verify OTP
              </button>
            </>
          )}

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "none",
                border: "none",
                color: "#00796b",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Back to Sign In
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
          <Box sx={{ mb: 2, width: { xs: "220px", sm: "280px", md: "320px" } }}>
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

export default ForgotPassword;
