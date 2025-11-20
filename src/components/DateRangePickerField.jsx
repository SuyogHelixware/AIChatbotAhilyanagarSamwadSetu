// 📌 DateRangePickerField.jsx

import React from "react";
import { Grid, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function DateRangePickerField({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}) {
  const handleChangeFrom = (newValue) => {
    setFromDate(newValue);

    // If ToDate < FromDate -> Auto Fix
    if (dayjs(toDate).isBefore(newValue)) {
      setToDate(newValue);
    }
  };

  const handleChangeTo = (newValue) => {
    setToDate(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="FROM DATE"
            value={fromDate}
            format="YYYY-MM-DD" // ✅ Date format
            onChange={handleChangeFrom}
            slotProps={{ textField: { fullWidth: false, size: "small" } }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <DatePicker
            label="TO DATE"
            format="YYYY-MM-DD" // ✅ Date format
            value={toDate}
            minDate={fromDate}
            onChange={handleChangeTo}
            slotProps={{ textField: { fullWidth: false, size: "small" } }}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
