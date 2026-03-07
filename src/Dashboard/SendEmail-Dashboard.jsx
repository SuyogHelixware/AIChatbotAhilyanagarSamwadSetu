 

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import MessageIcon from "@mui/icons-material/Message";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { BarChart } from "@mui/x-charts";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import CustomMuiRangePicker from "../components/DateRangePickerField";
import { BASE_URL } from "../Constant";
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';

export default function SendEmailDashboard() {
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
    Success: 0,
    Failed: 0,
    Totalcount: 0,
    // Total: 0,
  });
  console.log("counts", counts);

  useEffect(() => {
    if (fromDate && toDate) {
      callDashboardAPI(fromDate, toDate);
    }
  }, [fromDate, toDate]);

 const callDashboardAPI = async (fDate, tDate) => {
  try {
    const from = dayjs(fDate).format("YYYY-MM-DD");
    const to = dayjs(tDate).format("YYYY-MM-DD");

    const token = sessionStorage.getItem("BearerTokan");
    if (!token) return;

    const formattedToken = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;

    const response = await axios.get(`${BASE_URL}Email/Dashboard`, {
      params: { FromDate: from, ToDate: to },
      headers: {
        Authorization: formattedToken,   
      },
    });

    const resp = response.data.values ?? [];
    const Totalcount = response.data.count ?? [];

    const totals = resp.reduce(
      (acc, item) => {
        acc.Success += item?.Success ?? 0;
        acc.Failed += item?.Failed ?? 0;
         return acc;
      },
      {
        Success: 0,
        Failed: 0,
      }
    );

    setCounts({
      ...totals,
      Totalcount:Totalcount,
    //   Total: totals.MsgSentCnt + totals.MsgFailedCnt,
    });

  } catch (error) {
    console.error("API Error:", error);
  }
};

  // -------------------
  const fetchChartData = async (ChartfromDate, CharttoDate) => {
  try {
    const token = sessionStorage.getItem("BearerTokan");
    if (!token) return;

    const formattedToken = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;

    const from = dayjs(ChartfromDate).format("YYYY-MM-DD");
    const to = dayjs(CharttoDate).format("YYYY-MM-DD");

    const response = await axios.get(
      `${BASE_URL}Email/Dashboard`,
      {
        params: {
          FromDate: from,
          ToDate: to,
        },
        headers: {
          Authorization: formattedToken,
        },
      }
    );

    const apiData = response.data.values ?? [];

    // 🔹 Create date range
    const start = dayjs(ChartfromDate);
    const end = dayjs(CharttoDate);

    const dates = [];
    let current = start;

    while (
      current.isBefore(end) ||
      current.isSame(end, "day")
    ) {
      dates.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }

    // 🔹 Initialize arrays
    const successData = new Array(dates.length).fill(0);
    const failureData = new Array(dates.length).fill(0);

    // 🔹 Map API data
    apiData.forEach((item) => {
      if (!item.Date) return;

      const formattedDate = dayjs(item.Date).format("YYYY-MM-DD");
      const index = dates.indexOf(formattedDate);

      if (index !== -1) {
        successData[index] += item.Success ?? 0;
        failureData[index] += item.Failed ?? 0;
      }
    });

    // 🔹 Format labels
    const formattedLabels = dates.map((d) =>
      dayjs(d).format("DD MMM")
    );

    setChartData({
      success: successData,
      failure: failureData,
      months: formattedLabels,
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
        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
          }}
        > */}
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          {" "}
          <Grid item xs={12} sm={7} md={4} lg={4}>
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                borderRadius: 2,
                boxShadow: "0 1.5px 1.5px rgba(0, 90, 91, 0.15)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#4a91caff",
                }}
              >
                Send EMail Notifications Dashboard
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                borderRadius: 2,
                boxShadow: "0 1px 1px rgba(0, 90, 91, 0.15)",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 1px 1px rgba(0, 90, 91, 0.25)",
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
            {/* </Box> */}
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* CARD 1 */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={cardStyle} elevation={1}>
              <IconBox color="#2196F3">

                <CampaignOutlinedIcon sx={{ fontSize: 35, color: "white" }} />
              </IconBox>
              <TextBox>
                <label>Total Email Campaign</label>
                <h2>
                  <CountUp
                    end={counts.Totalcount}
                    duration={2}
                    separator=","
                  />
                </h2>
              </TextBox>
            </Paper>
          </Grid>
          {/* 2 */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <Paper sx={cardStyle} elevation={1}>
              <IconBox color="#e27857ff">
                <PermContactCalendarOutlinedIcon sx={{ fontSize: 35, color: "white" }} />
              </IconBox>
              <TextBox>
                <label>Total Contact No</label>
                <h2>
                  <CountUp
                    end={counts.Total}
                    duration={2}
                    separator=","
                  />
                </h2>
              </TextBox>
            </Paper>
          </Grid> */}
          {/* 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={cardStyle} elevation={1}>
              <IconBox color="#2c865c">
                <CheckCircleOutlineIcon sx={{ fontSize: 38, color: "white" }} />
              </IconBox>
              <TextBox>
                <label>Total Success EMail</label>
                <h2>
                  <CountUp
                    end={counts.Success}
                    duration={2}
                    separator=","
                  />
                </h2>
              </TextBox>
            </Paper>
          </Grid>
          {/* 4 */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={cardStyle} elevation={1}>
              <IconBox color="#e27857ff">
                <ErrorOutlineIcon sx={{ fontSize: 38, color: "white" }} />
              </IconBox>
              <TextBox>
                <label>Total Failed EMail</label>
                <h2>
                  <CountUp
                    end={counts.Failed}
                    duration={2}
                    separator=","
                  />
                </h2>
              </TextBox>
            </Paper>
          </Grid>

          <Grid item xs={12} md={12}>
            <Paper elevation={1} sx={{ borderRadius: 3, py: 3 }}>
              <Grid
                container
                alignItems="center"
                sx={{
                  mb: 2,
                  px: 1,
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={10}
                  sx={{
                    display: "flex",
                    justifyContent: {
                      xs: "center",
                      md: "center",
                    },
                    mb: { xs: 1, md: 0 },
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={"bold"}
                    sx={{
                      mr: { md: "-150px" },
                    }}
                  >
                    Day-Wise EMail Success vs Failure 
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={2}
                  sx={{
                    display: "flex",
                    justifyContent: {
                      xs: "center",
                      md: "flex-end",
                    },
                  }}
                >
                  {/* <Paper
                    sx={{
                      p: 1.3,
                      borderRadius: 2.5,
                      border: "1px solid #e0e0e0",
                      boxShadow: "0 1px 1px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "#0288d1",
                        transform: "translateY(-2px)",
                      },
                    }}
                  > */}
                  <CustomMuiRangePicker
                    fromDate={chartfromDate}
                    toDate={charttoDate}
                    setFromDate={setchartFromDate}
                    setToDate={setchartToDate}
                    inputPlaceholder="Pick date range"
                  />
                  {/* </Paper> */}
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
