import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PeopleIcon from "@mui/icons-material/People";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { BarChart, LineChart } from "@mui/x-charts";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Controller, useForm, useWatch } from "react-hook-form";
import { DatePickerField } from "../components/Component";
import { BASE_URL } from "../Constant";
import SummarizeIcon from "@mui/icons-material/Summarize";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DangerousIcon from "@mui/icons-material/Dangerous";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import CancelIcon from "@mui/icons-material/Cancel";

export default function SJYGandhiDashboard() {
  const today = dayjs();
  const firstDayOfMonth = dayjs().startOf("month");

  const [counts, setCounts] = useState({
    TotalMsgSJYSuccess: 0,
    TotalMsgSJYFailed: 0,
    TotalWPMsgSuccess: 0,
    TotalWPMsgFailed: 0,
  });

  const { control, watch } = useForm({
    defaultValues: {
      FromDate: firstDayOfMonth,
      ToDate: today,
    },
  });
  const [fromDate, toDate] = useWatch({
    control,
    name: ["FromDate", "ToDate"],
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

  return (
    <>
      <Box sx={{ width: "100%", p: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mb: 2,
          }}
        >
          <Controller
            name="FromDate"
            control={control}
            render={({ field }) => (
              <DatePickerField {...field} id="FromDate" label="FROM DATE" />
            )}
          />

          <Controller
            name="ToDate"
            control={control}
            render={({ field }) => (
              <DatePickerField {...field} id="ToDate" label="TO DATE" />
            )}
          />
        </Box>

        <Grid container spacing={3}>
          {/* CARD 1 */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={cardStyle} elevation={5}>
              <IconBox color="#28A745">
                <SummarizeIcon sx={{ fontSize: 35, color: "white" }} />
              </IconBox>
              <TextBox>
                <label>Sanjay Gandhi Success Total Message</label>
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
              <IconBox color="#28A745">
                <SummarizeIcon sx={{ fontSize: 35, color: "white" }} />
              </IconBox>
              <TextBox>
                <label>Sanjay Gandhi Fail Total Message</label>
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
              <IconBox color="#0D6EFD">
                <ReplyAllIcon sx={{ fontSize: 35, color: "white" }} />
              </IconBox>
              <TextBox>
                <label>Sanjay Gandhi Total WhatsApp Success Alert</label>
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
              <IconBox color="#0D6EFD">
                <CancelIcon sx={{ fontSize: 35, color: "white" }} />
              </IconBox>
              <TextBox>
                <label>Sanjay Gandhi Total WhatsApp Failure Alert</label>
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

          {/* CERTIFICATES PER MONTH */}
          <Grid item xs={12} md={6}>
            <Paper elevation={6} sx={{ borderRadius: 3, py: 3 }}>
              <h3 style={{ marginLeft: 20, marginBottom: 10 }}>
                Month-Wise Sended Message
              </h3>

              <BarChart
                series={[
                  {
                    label: "Success",
                    data: [40, 70, 80, 65, 90, 92, 105, 101, 106, 110, 111],
                  },
                  {
                    label: "Failure",
                    data: [5, 12, 8, 6, 10, 9, 7, 14, 11, 13, 15],
                  },
                ]}
                xAxis={[
                  {
                    data: [
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
                    ],
                    scaleType: "band",
                  },
                ]}
                height={280}
              />
            </Paper>
          </Grid>

          {/* OFFICER-WISE CERTIFICATES PROCESSED */}

          <Grid item xs={12} md={6}>
            <Paper elevation={6} sx={{ borderRadius: 3, py: 3 }}>
              <h3 style={{ marginLeft: 20, marginBottom: 10 }}>
                Daily Certificates Processed (Last 10 Days)
              </h3>

              <LineChart
                height={280}
                xAxis={[
                  {
                    data: [
                      "Day 1",
                      "Day 2",
                      "Day 3",
                      "Day 4",
                      "Day 5",
                      "Day 6",
                      "Day 7",
                      "Day 8",
                      "Day 9",
                      "Day 10",
                    ],
                    scaleType: "band",
                  },
                ]}
                series={[
                  {
                    label: "Certificates Processed",
                    data: [15, 28, 22, 35, 30, 40, 25, 38, 42, 36],
                    showMark: true,
                  },
                ]}
              />
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
  height: 150,
};

const IconBox = ({ children, color }) => (
  <Box
    sx={{
      width: 60,
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
