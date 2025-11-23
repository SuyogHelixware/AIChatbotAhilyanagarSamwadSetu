// import React from "react";
// import { Grid, TextField } from "@mui/material";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";

// export default function DateRangePickerField({
//   fromDate,
//   toDate,
//   setFromDate,
//   setToDate,
// }) {
//   const handleChangeFrom = (newValue) => {
//     setFromDate(newValue);

//     // If ToDate < FromDate -> Auto Fix
//     if (dayjs(toDate).isBefore(newValue)) {
//       setToDate(newValue);
//     }
//   };

//   const handleChangeTo = (newValue) => {
//     setToDate(newValue);
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//           <DatePicker
//             label="FROM DATE"
//             value={fromDate}
//             format="YYYY-MM-DD" 
//             onChange={handleChangeFrom}
//             slotProps={{ textField: { fullWidth: false, size: "small" } }}
//           />
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <DatePicker
//             label="TO DATE"
//             format="YYYY-MM-DD"  
//             value={toDate}
//             minDate={fromDate}
//             onChange={handleChangeTo}
//             slotProps={{ textField: { fullWidth: false, size: "small" } }}
//           />
//         </Grid>
//       </Grid>
//     </LocalizationProvider>
//   );
// }
import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  TextField,
  IconButton,
  Popper,
  Paper,
  ClickAwayListener,
  Typography,
  Stack,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";

/**
 * CustomMuiRangePicker
 * - Only uses @mui/material + dayjs
 * - Displays a single-month calendar popup
 * - Start -> End selection, hover preview, apply/clear/cancel
 *
 * Props:
 * - fromDate (dayjs|null)
 * - toDate (dayjs|null)
 * - setFromDate(fn) required
 * - setToDate(fn) required
 * - minDate (dayjs|null) optional
 * - maxDate (dayjs|null) optional
 * - locale (string) optional - for weekday labels (not changing dayjs locale here)
 */
export default function CustomMuiRangePicker({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  onApply,
  minDate = null,
  maxDate = null,
  inputPlaceholder = "Select date range",
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // working selection while popup open
  const [workStart, setWorkStart] = React.useState(fromDate ?? null);
  const [workEnd, setWorkEnd] = React.useState(toDate ?? null);

  // hovered date for preview range
  const [hoverDate, setHoverDate] = React.useState(null);

  // which month calendar shows (dayjs at start of month)
  const initialMonth = (fromDate ?? dayjs()).startOf("month");
  const [visibleMonth, setVisibleMonth] = React.useState(initialMonth);

  React.useEffect(() => {
    // sync when parent changes
    setWorkStart(fromDate ?? null);
    setWorkEnd(toDate ?? null);
  }, [fromDate, toDate]);

  const openPopup = (e) => {
    setAnchorEl(e.currentTarget);
    // if there is a selection, show that month
    if (fromDate) setVisibleMonth((fromDate).startOf("month"));
    else setVisibleMonth(dayjs().startOf("month"));
  };

  const closePopup = () => {
    setAnchorEl(null);
    setHoverDate(null);
  };

  const handleClickAway = () => {
    // revert working values on outside click
    setWorkStart(fromDate ?? null);
    setWorkEnd(toDate ?? null);
    setVisibleMonth((fromDate ?? dayjs()).startOf("month"));
    closePopup();
  };

  const startSelecting = () => {
    // called when user starts a new selection
    setWorkEnd(null);
    setHoverDate(null);
  };

  const handleDayClick = (day) => {
    // day is a dayjs instance at midnight
    // ignore if disabled by min/max
    if ((minDate && day.isBefore(minDate, "day")) || (maxDate && day.isAfter(maxDate, "day"))) {
      return;
    }

    if (!workStart || (workStart && workEnd)) {
      // start a new selection
      setWorkStart(day);
      setWorkEnd(null);
    } else {
      // we have workStart and no workEnd -> set end
      if (day.isBefore(workStart, "day")) {
        // swap
        setWorkEnd(workStart);
        setWorkStart(day);
      } else {
        setWorkEnd(day);
      }
    }
  };

  const handleDayMouseEnter = (day) => {
    if (workStart && !workEnd) {
      setHoverDate(day);
    } else {
      setHoverDate(null);
    }
  };
 
// const handleApply = () => {
//   setFromDate(workStart ?? null);
//   setToDate(workEnd ?? null);

//   if (onApply) {
//     onApply(workStart, workEnd);  
//   }
//   closePopup();
// };

const handleApply = () => {
  setFromDate(workStart ?? null);
  setToDate(workEnd ?? null);

  if (onApply) {
    onApply(workStart, workEnd);  
  }

  closePopup();
};


  const handleClear = () => {
    setWorkStart(null);
    setWorkEnd(null);
    setFromDate(null);
    setToDate(null);
    closePopup();
  };

 
  // helpers for rendering month grid
  const startOfMonth = visibleMonth.startOf("month");
  const daysInMonth = visibleMonth.daysInMonth();
  const startWeekday = startOfMonth.day(); // 0 (Sun) - 6 (Sat)

  // Build an array of dayjs for the grid (6 rows x 7 cols to cover any month)
  const calendarDays = React.useMemo(() => {
    const arr = [];
    // first grid date = startOfMonth - startWeekday days
    const firstDate = startOfMonth.subtract(startWeekday, "day");
    for (let i = 0; i < 42; i += 1) {
      arr.push(firstDate.add(i, "day"));
    }
    return arr;
  }, [visibleMonth]);

  const isInRange = (d, a, b) => {
    if (!a || !b) return false;
    return d.isAfter(a, "day") && d.isBefore(b, "day");
  };

  const isSelectedStart = (d) => (workStart && d.isSame(workStart, "day"));
  const isSelectedEnd = (d) => (workEnd && d.isSame(workEnd, "day"));

  const isPreviewInRange = (d) => {
    if (!workStart || hoverDate === null) return false;
    const a = workStart;
    const b = hoverDate;
    if (a.isBefore(b, "day")) {
      return isInRange(d, a, b);
    }
    return isInRange(d, b, a);
  };

  const displayValue = () => {
    if (fromDate && toDate) {
      return `${fromDate.format("YYYY-MM-DD")} → ${toDate.format("YYYY-MM-DD")}`;
    }
    if (workStart && !workEnd) {
      return `${workStart.format("YYYY-MM-DD")} → ...`;
    }
    if (workStart && workEnd) {
      return `${workStart.format("YYYY-MM-DD")} → ${workEnd.format("YYYY-MM-DD")}`;
    }
    return "";
  };

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <Box>
      <TextField
        label="SELECT DATE"    
        variant="outlined"
        size="small"
        value={displayValue()}
        placeholder={inputPlaceholder}
        onClick={openPopup}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              { (fromDate || toDate) ? (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  aria-label="clear"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ) : null }
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  if (open) closePopup();
                  else openPopup(e);
                }}
                aria-label="toggle"
              >
                <CalendarTodayIcon fontSize="small" />
              </IconButton>
            </Box>
          ),
        }}
        sx={{ minWidth: 260, cursor: "pointer" }}
      />

      <Popper open={open} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 1400 }}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper elevation={8} sx={{ mt: 1, p: 2, width: 320 }}>
            <Stack spacing={1}>
              {/* Header: Month + nav */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => setVisibleMonth((m) => m.subtract(1, "month"))}
                  aria-label="previous month"
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>

                <Typography variant="subtitle1">
                  {visibleMonth.format("MMMM YYYY")}
                </Typography>

                <IconButton
                  size="small"
                  onClick={() => setVisibleMonth((m) => m.add(1, "month"))}
                  aria-label="next month"
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Weekday labels */}
              <Grid container spacing={0.5}>
                {weekDays.map((wd) => (
                  <Grid item xs={12 / 7} key={wd}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="caption" color="text.secondary">{wd}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Days grid */}
              <Grid container spacing={0.5} sx={{ userSelect: "none" }}>
                {calendarDays.map((d) => {
                  const isOtherMonth = !d.isSame(visibleMonth, "month");
                  const disabled = (minDate && d.isBefore(minDate, "day")) || (maxDate && d.isAfter(maxDate, "day"));
                  const selectedStart = isSelectedStart(d);
                  const selectedEnd = isSelectedEnd(d);
                  const inRange = isInRange(d, workStart, workEnd);
                  const previewRange = isPreviewInRange(d);

                  // visual priority: disabled -> otherMonth -> selectedStart/End -> inRange/preview
                  return (
                    <Grid item xs={12 / 7} key={d.format("YYYY-MM-DD")}>
                      <Box
                        onClick={() => handleDayClick(d)}
                        onMouseEnter={() => handleDayMouseEnter(d)}
                        onMouseLeave={() => setHoverDate(null)}
                        sx={{
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 1,
                          cursor: disabled ? "not-allowed" : "pointer",
                          bgcolor: selectedStart || selectedEnd
                            ? "primary.main"
                            : inRange
                              ? "primary.light"
                              : previewRange
                                ? "action.hover"
                                : "transparent",
                          color: selectedStart || selectedEnd
                            ? "primary.contrastText"
                            : isOtherMonth
                              ? "text.disabled"
                              : disabled
                                ? "text.disabled"
                                : "text.primary",
                          border: selectedStart ? "2px solid" : "none",
                          borderColor: selectedStart ? "primary.dark" : "transparent",
                          transition: "background-color 120ms ease",
                        }}
                        aria-disabled={disabled}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: selectedStart || selectedEnd ? 600 : 400,
                            fontSize: 13,
                          }}
                        >
                          {d.date()}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>

              <Divider />

              {/* Footer: info + buttons */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {workStart ? `Start: ${workStart.format("YYYY-MM-DD")}` : "Start: -"}
                    {"  "}
                    {workEnd ? `End: ${workEnd.format("YYYY-MM-DD")}` : "End: -"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                   <Button
                    size="small"
                    variant="contained"
                    onClick={handleApply}
                    disabled={!workStart || !workEnd}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}

CustomMuiRangePicker.propTypes = {
  fromDate: PropTypes.any,
  toDate: PropTypes.any,
  setFromDate: PropTypes.func.isRequired,
  setToDate: PropTypes.func.isRequired,
  minDate: PropTypes.any,
  maxDate: PropTypes.any,
  inputPlaceholder: PropTypes.string,
    onApply: PropTypes.func,           

};
