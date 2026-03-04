import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Chip,
} from "@mui/material";
import { Controller } from "react-hook-form";

const EmailChipInput = ({ label, name, control, theme }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <Grid item xs={12} md={4}>
      <Paper
        elevation={1}
        sx={{
          p: 1,
          borderRadius: 1,
          backgroundColor: theme.palette.grey[25],
        }}
      >
        <Typography variant="subtitle2" fontWeight={500} mb={1}>
          {label}
        </Typography>

        <Controller
          name={name}
          control={control}
          defaultValue={[]}
          render={({ field }) => {
            const emails = field.value || [];

            const handleKeyDown = (event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                const value = inputValue.trim();
                if (!value) return;

                if (!validateEmail(value)) {
                  setError("Invalid email address");
                  return;
                }

                if (emails.includes(value)) {
                  setError("Email already added");
                  return;
                }

                field.onChange([...emails, value]);
                setInputValue("");
                setError("");
              }
            };

            const handleDelete = (emailToDelete) => {
              field.onChange(
                emails.filter((email) => email !== emailToDelete)
              );
            };

            return (
              <Box
                sx={(theme) => ({
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                  border:
                    theme.palette.mode === "dark"
                      ? "1px solid #555"
                      : "1px solid #ddd",
                  borderRadius: "6px",
 

    minHeight: "60px",     // default height
    maxHeight: "120px",    // max height limit
    overflowY: "auto",  
                })}
              >
                {emails.map((email, index) => (
                  <Chip
                    key={index}
                    label={email}
                    onDelete={() => handleDelete(email)}
                    color="primary"
                    size="small"
                  />
                ))}

                <TextField
                  variant="standard"
                  placeholder={`Type ${label} email and press Enter`}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setError("");
                  }}
                  onKeyDown={handleKeyDown}
                  error={!!error}
                  helperText={error}
 
                  sx={{
  minWidth: "150px",
  flex: 1,
  "& .MuiInputBase-root": {
    height: "32px",
  },
}}
                />
              </Box>
            );
          }}
        />
      </Paper>
    </Grid>
  );
};

export default EmailChipInput;