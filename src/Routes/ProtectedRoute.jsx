
import React from "react";
import { Box, Card, Typography } from "@mui/material";

export default function ProtectedRoute({ children, menuId, roleAccess }) {
  const hasAccess = roleAccess?.some(
    (item) => item.MenuId === menuId
  );

  if (!hasAccess) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          backgroundColor: "#f6f9fc",
        }}
      >
        <Card
          sx={{
            p: 4,
            width: "420px",
            borderRadius: "20px",
            textAlign: "center",
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            border: "2px solid transparent",
            backgroundImage:
              "linear-gradient(#fff, #fff), linear-gradient(to right, #ff3d3d, #ff8c00)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
            animation: "fadeIn 0.7s",
          }}
        >
          <Typography sx={{ fontSize: "70px" }}>🚫</Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Access Restricted
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Sorry! You don’t have permission to view this page.  
            Please contact your administrator if you believe this is a mistake.
          </Typography>

          <Typography
            mt={3}
            sx={{ fontSize: "32px", opacity: 0.8 }}
          >
            🔒🔐🚷
          </Typography>
        </Card>
      </Box>
    );
  }

  return children;
}
