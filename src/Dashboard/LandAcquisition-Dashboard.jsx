import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { BarChart } from "@mui/x-charts";
import CountUp from "react-countup";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RuleIcon from "@mui/icons-material/Rule";

// ICONS
import ChecklistIcon from "@mui/icons-material/Checklist";

import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { DatePickerField } from "../components/Component";
import CustomToolbar from "../components/CustomToolbar";
import { BASE_URL } from "../Constant";
 import { PieChart } from "@mui/x-charts";


export default function LandAcquisition() {
  const [officerRows, setOfficerRows] = React.useState([]);

  const officerColumns = [
    {
      field: "Name",
      headerName: "NAME",
      minWidth: 100,
      flex: 1,
      sortable: false,
    },
    {
      field: "TotalCnt",
      headerName: "Total",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  const today = dayjs();
  const firstDayOfMonth = dayjs().startOf("month");

  const [counts, setCounts] = useState({
    TotalMissingDocsLandAcqui: 0,
    TotalDocsLandAcqui: 0,
    TotalWPMsgSuccess: 0,
    TotalWPMsgFailed: 0,
  });

  const { control, watch } = useForm({
    defaultValues: {
      FromDate: firstDayOfMonth,
      ToDate: today,
      toDateOfficer: today,
      fromDateOfficer: firstDayOfMonth,
    },
  });
  const [fromDate, toDate] = useWatch({
    control,
    name: ["FromDate", "ToDate"],
  });
  // const [fromDateOfficer, toDateOfficer] = useWatch({
  //   control,
  //   name: ["fromDateOfficer", "toDateOfficer"],
  // });

  const callDashboardAPI = async (fDate, tDate) => {
    try {
      const from = dayjs(fDate).format("YYYY-MM-DD");
      const to = dayjs(tDate).format("YYYY-MM-DD");

      const response = await axios.get(`${BASE_URL}Reports/Dashboard`, {
        params: { FromDate: from, ToDate: to },
      });

      // Save values to state
      if (response.data && response.data.values) {
        setCounts({
          TotalMissingDocsLandAcqui:
            response.data.values.TotalMissingDocsLandAcqui || 0,
          TotalDocsLandAcqui: response.data.values.TotalDocsLandAcqui || 0,
          TotalWPMsgFailed: response.data.values.TotalWPMsgFailed || 0,
          TotalWPMsgSuccess: response.data.values.TotalWPMsgSuccess || 0,
        });
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      callDashboardAPI(fromDate, toDate);
    }
  }, [fromDate, toDate]);

  const HandleOfficerList = async (fromDateOfficer, toDateOfficer) => {
    try {
      const params = {
        fromDateOfficer: dayjs(fromDateOfficer).format("YYYY-MM-DD"),
        toDateOfficer: dayjs(toDateOfficer).format("YYYY-MM-DD"),
      };

      const response = await axios.get(
        `${BASE_URL}Reports/LandAcqu/GazOfficerwise`,
        { params }
      );
      if (response.data && response.data.values) {
        setOfficerRows(
          response.data.values.map((item, index) => ({
            ...item,
            id: item.Id,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      HandleOfficerList(fromDate, toDate);
    }
  }, [fromDate, toDate]);

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
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={cardStyle} elevation={5}>
              <IconBox color="#28A745">
                <ChecklistIcon sx={{ fontSize: 35, color: "white" }} />
              </IconBox>
              <TextBox>
                <label>Total Documents</label>
                <h2>
                  <CountUp
                    end={counts.TotalDocsLandAcqui}
                    duration={2}
                    separator=","
                  />
                </h2>
              </TextBox>
            </Paper>
          </Grid>

          {/* CARD 2 */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={cardStyle} elevation={5}>
              <IconBox color="#e27857ff">
                <RuleIcon sx={{ fontSize: 35, color: "white" }} />
              </IconBox>
              <TextBox>
                <label>Total Missing Documents </label>
                <h2>
                  <CountUp
                    end={counts.TotalMissingDocsLandAcqui}
                    duration={2}
                    separator=","
                  />
                </h2>
              </TextBox>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={cardStyle} elevation={5}>
              <IconBox color="#28A745">
                <CheckCircleOutlineIcon sx={{ fontSize: 35, color: "white" }} />
              </IconBox>
              <TextBox>
                <label>Total WhatsApp Success Alert</label>
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

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={cardStyle} elevation={5}>
              <IconBox color="#e27857ff">
                <ErrorOutlineIcon sx={{ fontSize: 35, color: "white" }} />
              </IconBox>
              <TextBox>
                <label>Total Whatsapp Miss Alert </label>
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

          {/* CERTIFICATE   TABLE */}
          <Grid item xs={12} md={6}>
            <Paper elevation={7} sx={{ borderRadius: 3, p: 2 }}>
              <h3>Officer-wise Certificates Processed</h3>
              <div style={{ height: 300, width: "100%", marginTop: 10 }}>
                <DataGrid
                  className="datagrid-style"
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: (theme) =>
                        theme.palette.custome.datagridcolor,
                    },
                    "& .MuiDataGrid-row:hover": {
                      boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)",
                    },
                  }}
                  rows={officerRows}
                  columns={officerColumns}
                  pageSize={5}
                  disableSelectionOnClick
                  hideFooter={true}
                  slots={{ toolbar: CustomToolbar }}
                  getRowId={(row) => row.Name}
                />
              </div>
            </Paper>
          </Grid>

              <Grid item xs={12} md={6}>
            <Paper elevation={7} sx={{ borderRadius: 3, py: 3 }}>
                            <div style={{ height: 335, width: "100%", marginTop: 10 }}>

              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 10, label: "series A" },
                      { id: 1, value: 15, label: "series B" },
                      { id: 2, value: 20, label: "series C" },
                    ],
                  },
                ]}
                height={300}
                colors={["#005A5B", "#338687 ", "#9CD8C4"]}
              />
              </div>
            </Paper>
          </Grid>

          {/* OFFICER-WISE BAR Graph CERTIFICATES PROCESSED */}

          <Grid item xs={12} md={12}>
            <Paper elevation={6} sx={{ borderRadius: 3, py: 3 }}>
              <h3 style={{ marginLeft: 10, marginBottom: 10 }}>
                Certificates Generated Per Month
              </h3>
              <BarChart
                series={[
                  {
                    data: [40, 70, 80, 65, 90, 92, 105, 101, 106, 110, 111],
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
                height={295}
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
  height: 130,
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
