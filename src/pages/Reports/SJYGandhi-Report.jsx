// import React, { useEffect, useState } from "react";
// import { Grid, Paper, Button, TextField, Box, Typography } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import dayjs from "dayjs";
// import axios from "axios";
// import { BASE_URL } from "../../Constant";
// import { DatePickerField } from "../../components/Component";
// import { Controller, useForm } from "react-hook-form";

// import { DatePicker } from "@mui/x-date-pickers";

// import { DateRangePicker } from "@mui/x-date-pickers-pro";

// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import DateRangePickerField from "../../components/DateRangePickerField";

// export default function SJYGandhiReport() {

//   return (
//     <>
//
//       <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
//
//
//       </Grid>

//          <Grid item xs={12} sx={{ mt: 3 }}>
//         <Paper elevation={7} sx={{ borderRadius: 3, p: 2 }}>
//           <h3>Success List</h3>
//           <div style={{ height: 280, width: "100%", marginTop: 5 }}>
//
//           </div>
//         </Paper>
//       </Grid>

//       {/* DataGrid */}
//       <Grid item xs={12} sx={{ mt: 3 }}>
//         <Paper elevation={7} sx={{ borderRadius: 3, p: 2 }}>
//
//           <div style={{ height: 280, width: "100%", marginTop: 5 }}>
//
//           </div>
//         </Paper>
//       </Grid>

//     </>
//   );
// }

import { Chip, Divider, Grid, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../Constant";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import PhoneIcon from "@mui/icons-material/Phone";
import CustomToolbar from "../../components/CustomToolbar";
import TagIcon from "@mui/icons-material/Tag";
import CustomMuiRangePicker from "../../components/DateRangePickerField";
export default function LandAcquistionReport() {
  const [DocMissingCount, setDocMissingCount] = React.useState(0);
  const [DocReadyCount, setDocReadyCount] = React.useState(0);
  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());

  const [SJYFailed, setSJYFailed] = React.useState([]);
  const [SJYSuccess, setSJYSuccess] = React.useState([]);

  // const {  } = useForm({
  //   defaultValues: {
  //     DateRange: [dayjs(), dayjs()],
  //   },
  // });

  // const fetchReport = async (selectedFrom, selectedTo) => {

  const fetchReport = async () => {
    try {
      const params = {
        FromDate: dayjs(fromDate).format("YYYY-MM-DD"),
        ToDate: dayjs(toDate).format("YYYY-MM-DD"),
      };

      const response = await axios.get(`${BASE_URL}Reports/LandAcqu`, {
        params,
      });

      if (!response || !response.data) {
        setSJYFailed([]);
        setSJYSuccess([]);
        return;
      }

      const groups = Array.isArray(response.data.values)
        ? response.data.values
        : [];

      // -- Docfail
      const FailGroup = groups.find((g) => g.TransType === "SJYFailed");
      const SJYFailed =
        FailGroup?.Values?.map((item, idx) => ({
          ...item,
          id: item.Id ?? `DocMissing-${idx + 1}`,
        })) || [];
      setDocMissingCount(FailGroup?.Count ?? 0);

      // -- Docsucess
      const SuccessGroup = groups.find((g) => g.TransType === "SJYSuccess");
      const SJYSuccess =
        SuccessGroup?.Values?.map((item, idx) => ({
          ...item,
          id: item.Id ?? `DocReady-${idx + 1}`,
        })) || [];
      setDocReadyCount(SuccessGroup?.Count ?? 0);

      setSJYFailed(SJYFailed);
      setSJYSuccess(SJYSuccess);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSJYFailed([]);
      setSJYSuccess([]);
    } finally {
    }
  };
  // useEffect(() => {
  //   fetchReport();
  // }, []);
  useEffect(() => {
    if (fromDate && toDate) {
      fetchReport();
    }
  }, [fromDate, toDate]);

  const officerColumns = [
    // {
    //   field: "srNo",
    //   headerName: "SR NO",
    //   width: 80,
    //   sortable: false,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) =>
    //     params.api.getSortedRowIds().indexOf(params.id) + 1,
    // },
    {
      field: "srNo",
      headerName: "SR NO",
      minWidth: 60,
      maxWidth: 70,
      flex: 0.2,
      sortable: false,
      headerAlign: "center",
      align: "center",

      renderHeader: () => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <TagIcon fontSize="small" />
          SR NO
        </span>
      ),

      renderCell: (params) =>
        params.api.getSortedRowIds().indexOf(params.id) + 1,
    },
    {
      field: "SentDate",
      headerName: "SEND DATE",
      minWidth: 120,
      maxWidth: 170,
      flex: 1,
      headerAlign: "center",
      align: "center",

      renderHeader: () => (
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <DateRangeIcon fontSize="small" />
          SEND DATE
        </span>
      ),

      valueGetter: (params) => {
        if (!params.row.SentDate) return "";
        const d = new Date(params.row.SentDate);
        return d
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, "-");
      },
    },

    {
      field: "PhoneNo",
      headerName: "PHONE NO",
      flex: 1.2,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <PhoneIcon fontSize="small" />
          PHONE NO
        </span>
      ),
      renderCell: (params) => <span>{params.value}</span>,
    },

    {
      field: "MsgCnt",
      headerName: "COUNT",
      minWidth: 100,
      maxWidth: 120,
      flex: 0.8,
      align: "center",
      headerAlign: "center",

      renderHeader: () => (
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <FormatListNumberedIcon fontSize="small" />
          COUNT
        </span>
      ),

      renderCell: (params) => (
        <span
          style={{
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: "6px",
            fontWeight: 600,
          }}
        >
          {params.value}
        </span>
      ),
    },
  ];

  return (
    <>
      <Grid
        container
        md={12}
        lg={12}
        component={Paper}
        textAlign={"center"}
        sx={{
          width: "100%",
          px: 5,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
        elevation={1}
      >
        <Typography
          className="slide-in-text"
          width={"100%"}
          textAlign="center"
          textTransform="uppercase"
          fontWeight="bold"
          padding={1}
          noWrap
        >
          Sanjay Gandhi Report
        </Typography>
      </Grid>
      <Grid container justifyContent="flex-end" item xs={12} sm={12}>
        <Paper
          sx={{
            p: 1.3,
            borderRadius: 2.5,
            border: "1px solid #e0e0e0",
            boxShadow: "0 1px 1px rgba(0,0,0,0.08)",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "#0288d1",
              boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <CustomMuiRangePicker
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
            onApply={fetchReport}
          />
        </Paper>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Paper elevation={1} sx={{ borderRadius: 3, p: 2 }}>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              Beneficiary Sucess List
              <Chip
                label={DocReadyCount}
                size="small"
                color="success"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "#2196F3",
                }}
              />
            </h3>
            <Grid item xs={12}>
              <Divider
                sx={{
                  borderBottomWidth: "0.6px",
                  backgroundColor: "#ccc",
                  boxShadow: "0px 1px 2px rgba(0,0,0,0.2)",
                  mx: -2,
                }}
              />
            </Grid>
            <div style={{ height: 400, width: "100%", marginTop: 4 }}>
              <DataGrid
                className="datagrid-style"
                sx={{
                  height: "100%",
                  minHeight: "250px",
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: (theme) =>
                      theme.palette.custome.datagridcolor,
                  },
                  "& .MuiDataGrid-row:hover": {
                    boxShadow: "0px 4px 20px rgba(0,0,0,.2)",
                  },
                }}
                rows={SJYSuccess}
                columns={officerColumns}
                pageSize={5}
                disableSelectionOnClick
                hideFooter={true}
                slots={{
                  toolbar: CustomToolbar,
                }}
              />
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Paper elevation={1} sx={{ borderRadius: 3, p: 2 }}>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              Beneficiary Failure Reason List
              <Chip
                label={DocMissingCount}
                size="small"
                color="error"
                sx={{ fontWeight: "bold" }}
              />
            </h3>
            <Grid item xs={12}>
              <Divider
                sx={{
                  borderBottomWidth: "0.6px",
                  backgroundColor: "#ccc",
                  boxShadow: "0px 1px 2px rgba(0,0,0,0.2)",
                  mx: -2,
                }}
              />
            </Grid>
            <div style={{ height: 400, width: "100%", marginTop: 5 }}>
              <DataGrid
                className="datagrid-style"
                sx={{
                  height: "100%",
                  minHeight: "200px",
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: (theme) =>
                      theme.palette.custome.datagridcolor,
                  },
                  "& .MuiDataGrid-row:hover": {
                    boxShadow: "0px 4px 20px rgba(0,0,0,.2)",
                  },
                }}
                rows={SJYFailed}
                columns={officerColumns}
                pageSize={5}
                disableSelectionOnClick
                hideFooter={true}
                slots={{
                  toolbar: CustomToolbar,
                }}
              />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
