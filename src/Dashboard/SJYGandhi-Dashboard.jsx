import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import MessageIcon from "@mui/icons-material/Message";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { BarChart, LineChart } from "@mui/x-charts";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { useForm } from "react-hook-form";
import CustomMuiRangePicker from "../components/DateRangePickerField";
import { BASE_URL } from "../Constant";
import { TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

export default function SJYGandhiDashboard() {
  const today = dayjs();
  const firstDayOfMonth = dayjs().startOf("month");

  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());

  const [chartfromDate, setchartFromDate] = useState(dayjs().startOf("month"));
  const [charttoDate, setchartToDate] = useState(dayjs());

  const [ChartData, setChartData] = useState({
    success: new Array(12).fill(0),
    failure: new Array(12).fill(0),
    months: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  });

  const [counts, setCounts] = useState({
    TotalMsgSJYSuccess: 0,
    TotalMsgSJYFailed: 0,
    TotalWPMsgSuccess: 0,
    TotalWPMsgFailed: 0,
  });

  useEffect(() => {
    if (fromDate && toDate) {
      callDashboardAPI(fromDate, toDate);
    }
  }, [fromDate, toDate]);

  const callDashboardAPI = async (fDate, tDate) => {
    try {
      const from = dayjs(fDate).format("YYYY-MM-DD");
      const to = dayjs(tDate).format("YYYY-MM-DD");

      console.log("Calling API with:", { from, to });

      const response = await axios.get(`${BASE_URL}Reports/Dashboard`, {
        params: { FromDate: from, ToDate: to },
      });

      console.log("Dashboard API Response:", response.data);

      // Save values to state
      if (response.data && response.data.values) {
        setCounts({
          TotalMsgSJYSuccess: response.data.values.TotalMsgSJYSuccess || 0,
          TotalMsgSJYFailed: response.data.values.TotalMsgSJYFailed || 0,
          TotalWPMsgSuccess: response.data.values.TotalWPMsgSuccess || 0,
          TotalWPMsgFailed: response.data.values.TotalWPMsgFailed || 0,
        });
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  // -------------------
  const fetchChartData = async (ChartfromDate, CharttoDate) => {
    try {
      const response = await axios.get(
        `${BASE_URL}Reports/SanjayGandhi/Yearly`,

        {
          params: {
            FromDate: dayjs(ChartfromDate).format("YYYY-MM-DD"),
            ToDate: dayjs(CharttoDate).format("YYYY-MM-DD"),
          },
        }
      );

      const apiData = response.data.values;

      const allMonths = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const successData = new Array(12).fill(0);
      const failureData = new Array(12).fill(0);

      apiData.forEach((item) => {
        const [year, month] = item.YearMonth.split("-");
        const monthIndex = parseInt(month, 10) - 1;
        successData[monthIndex] = item.SJYSuccess;
        failureData[monthIndex] = item.SJYFailed;
      });

      setChartData({
        success: successData,
        failure: failureData,
        months: allMonths,
      });
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    }
  };

  useEffect(() => {
    fetchChartData(chartfromDate, charttoDate);
  }, [chartfromDate, charttoDate]);

  return (
    <>
      <Box sx={{ width: "100%", p: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
          }}
        >
          {" "}
          <Paper
            elevation={4}
            sx={{
              p: 1.5,
              borderRadius: 2,
              boxShadow: "0 4px 10px rgba(0, 90, 91, 0.15)",
              transition: "all 0.2s ease",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(0, 90, 91, 0.25)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <CustomMuiRangePicker
              fromDate={fromDate}
              toDate={toDate}
              setFromDate={setFromDate}
              setToDate={setToDate}
              inputPlaceholder="Pick date range"
            />
          </Paper>
        </Box>

        <Grid container spacing={3}>
          {/* CARD 1 */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={cardStyle} elevation={5}>
              <IconBox color="#28A745">
                <MessageIcon sx={{ fontSize: 35, color: "white" }} />
              </IconBox>
              <TextBox>
                <label>Beneficiary Success Alerts</label>
                <h2>
                  <CountUp
                    end={counts.TotalMsgSJYSuccess}
                    duration={2}
                    separator=","
                  />
                </h2>
              </TextBox>
            </Paper>
          </Grid>
          {/* 2 */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={cardStyle} elevation={5}>
              <IconBox color="#e27857ff">
                <SpeakerNotesOffIcon sx={{ fontSize: 35, color: "white" }} />
              </IconBox>
              <TextBox>
                <label>Beneficiary Failure Alerts</label>
                <h2>
                  <CountUp
                    end={counts.TotalMsgSJYFailed}
                    duration={2}
                    separator=","
                  />
                </h2>
              </TextBox>
            </Paper>
          </Grid>
          {/* 3 */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={cardStyle} elevation={5}>
              <IconBox color="#28A745">
                <CheckCircleOutlineIcon sx={{ fontSize: 38, color: "white" }} />
              </IconBox>
              <TextBox>
                <label>Total WhatsApp Success Alerts</label>
                <h2>
                  <CountUp
                    end={counts.TotalWPMsgSuccess}
                    duration={2}
                    separator=","
                  />
                </h2>
              </TextBox>
            </Paper>
          </Grid>
          {/* 4 */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={cardStyle} elevation={5}>
              <IconBox color="#e27857ff">
                <ErrorOutlineIcon sx={{ fontSize: 38, color: "white" }} />
              </IconBox>
              <TextBox>
                <label>Total WhatsApp Failed Alerts</label>
                <h2>
                  <CountUp
                    end={counts.TotalWPMsgFailed}
                    duration={2}
                    separator=","
                  />
                </h2>
              </TextBox>
            </Paper>
          </Grid>

          <Grid item xs={12} md={12}>
            <Paper elevation={6} sx={{ borderRadius: 3, py: 3 }}>
              <Grid
                container
                alignItems="center"
                sx={{ mb: 2, position: "relative" }}
              >
                <Grid item xs={6} md={12} sx={{ textAlign: "center" }}>
                  <Typography variant="h6" fontWeight={"bold"}>
                    Month-Wise Success vs Failure
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={12}
                  sx={{ position: "absolute", right: 0 }}
                >
                  <CustomMuiRangePicker
                    fromDate={chartfromDate}
                    toDate={charttoDate}
                    setFromDate={setchartFromDate}
                    setToDate={setchartToDate}
                    inputPlaceholder="Pick date range"
                  />
                </Grid>
              </Grid>
              {ChartData &&
                ChartData.success?.length > 0 &&
                ChartData.failure?.length > 0 && (
                  <BarChart
                    series={[
                      {
                        label: "Success",
                        data: ChartData.success,
                        color: "#58B25A",
                        barLabel: "value",
                        minBarSize: 1,

                        // barLabel: (value, index) => {
                        //   const total =
                        //     ChartData.success[index] + ChartData.failure[index];
                        //   return total;
                        // },
                      },

                      {
                        label: "Failure",
                        data: ChartData.failure,
                        color: "#F44336",
                        barLabel: (itm) => console.log(itm),
                        minBarSize: 1,
                      },
                    ]}
                    xAxis={[
                      {
                        data: ChartData.months,
                        scaleType: "band",
                      },
                    ]}
                    height={350}
                  />
                )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

/* ------------------- CARD STYLES ------------------- */

const cardStyle = {
  display: "flex",
  alignItems: "center",
  fontWeight: "bold",
  gap: 2,
  p: 2,
  borderRadius: 3,
  minHeight: 140,
  height: 150,
};

const IconBox = ({ children, color }) => (
  <Box
    sx={{
      width: 65,
      height: 60,
      borderRadius: "50%",
      backgroundColor: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </Box>
);

const TextBox = ({ children }) => (
  <Box sx={{ display: "flex", flexDirection: "column" }}>{children}</Box>
);
