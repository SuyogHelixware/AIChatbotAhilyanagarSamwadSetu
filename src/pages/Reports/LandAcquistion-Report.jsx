import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import dayjs from "dayjs";
import axios from "axios";
import { BASE_URL } from "../../Constant";
import { DatePickerField } from "../../components/Component";
import { Controller, useForm } from "react-hook-form";

import { DatePicker } from "@mui/x-date-pickers";

import { DateRangePicker } from "@mui/x-date-pickers-pro";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DateRangePickerField from "../../components/DateRangePickerField";
import CustomToolbar from "../../components/CustomToolbar";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import PhoneIcon from '@mui/icons-material/Phone';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import DateRangeIcon from '@mui/icons-material/DateRange';
export default function LandAcquistionReport() {
  // 👉 Sample data (can be replaced when API comes)

  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());

  const [rows, setRows] = React.useState([]);
  const limit = 20;
  const [loading, setLoading] = React.useState(false);
  const [totalRows, setTotalRows] = React.useState(0);
  const [DocMissingCount, setDocMissingCount] = React.useState(0);
  const [DocReadyCount, setDocReadyCount] = React.useState(0);

  const [docMissingRows, setDocMissingRows] = React.useState([]);
  const [docReadyRows, setDocReadyRows] = React.useState([]);

  const { control, watch, getValues } = useForm({
    defaultValues: {
      DateRange: [dayjs(), dayjs()],
    },
  });

  const fetchReport = async () => {
    try {
      setLoading(true);

      const params = {
         FromDate: dayjs(fromDate).format("YYYY-MM-DD"),
        ToDate: dayjs(toDate).format("YYYY-MM-DD"),
      };

      const response = await axios.get(`${BASE_URL}Reports/LandAcqu`, {
        params,
      });

      if (!response || !response.data) {
        setDocMissingRows([]);
        setDocReadyRows([]);
        return;
      }

      const groups = Array.isArray(response.data.values)
        ? response.data.values
        : [];

      debugger;
      // -- DocMissing
      const missingGroup = groups.find((g) => g.TransType === "DocMissing");
      const docMissingRows =
        missingGroup?.Values?.map((item, idx) => ({
          ...item,
          id: item.Id ?? `DocMissing-${idx + 1}`,
        })) || [];

      setDocMissingCount(missingGroup?.Count ?? 0);

      // -- DocReady
      const readyGroup = groups.find((g) => g.TransType === "DocReady");
      const docReadyRows =
        readyGroup?.Values?.map((item, idx) => ({
          ...item,
          id: item.Id ?? `DocReady-${idx + 1}`,
        })) || [];
      setDocReadyCount(readyGroup?.Count ?? 0);

      setDocMissingRows(docMissingRows);
      setDocReadyRows(docReadyRows);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDocMissingRows([]);
      setDocReadyRows([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReport();
  }, []); //
  //    const officerColumns = [
  //     {
  //       field: "srNo",
  //       headerName: "SR NO",
  //       width: 80,
  //       sortable: false,
  //       headerAlign: "center",
  //       align: "center",
  //       renderCell: (params) =>
  //         params.api.getSortedRowIds().indexOf(params.id) + 1,
  //     },

  //     {
  //   field: "SentDate",
  //   headerName: "Send Date",
  //   flex: 1,
  //   valueGetter: (params) => {
  //     if (!params.row.SentDate) return "";

  //     const date = new Date(params.row.SentDate);
  //     return date.toLocaleDateString("en-GB", {
  //       day: "2-digit",
  //       month: "short",
  //       year: "numeric",
  //     }).replace(/ /g, "-"); // to format 18-Nov-2025
  //   },
  // },
  //     { field: "PhoneNo", headerName: "Phone No", flex: 1 },
  //     {
  //       field: "MsgCnt",
  //       headerName: "Message Count",
  //       flex: 1,
  //       align: "center",
  //       headerAlign: "center",
  //     },
  //   ];

  const officerColumns = [
    {
      field: "srNo",
      headerName: "SR NO",
      width: 80,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.api.getSortedRowIds().indexOf(params.id) + 1,
    },
 {
  field: "SentDate",
  headerName: "SEND DATE",
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
    // {
    //   field: "PhoneNo",
    //   headerName: "📞 PHONE NO",
    //   flex: 1.2,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) => <span>{params.value}</span>,
    // },
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
    // {
    //   field: "MsgCnt",
    //   headerName: "📨 COUNT",
    //   flex: 0.7,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params) => (
    //     <span
    //       style={{
    //         display: "inline-block",
    //         padding: "3px 10px",
    //         borderRadius: "6px",
    //         background: "#1c7255ff",
    //         fontWeight: 600,
    //         color: "#ebebebff",
    //       }}
    //     >
    //       {params.value}
    //     </span>
    //   ),
    // },
    {
  field: "MsgCnt",
  headerName: "COUNT",
  flex: 0.7,
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
        background: "#1c7255ff",
        fontWeight: 600,
        color: "#ebebebff",
      }}
    >
      {params.value}
    </span>
  ),
}
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
        elevation={4}
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
          Land Acquisition Report
        </Typography>
      </Grid>
      <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
        <Grid item xs={12} sm={4}>
          <DateRangePickerField
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Button
            onClick={fetchReport}
            type="text"
            size="large"
            sx={{
              // pr: 2,
              color: "white",
              background:
                "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
              borderRadius: "8px",
              transition: "all 0.2s ease-in-out",
              boxShadow: "0 4px 8px rgba(0, 90, 91, 0.3)",
              "&:hover": {
                transform: "translateY(2px)",
                boxShadow: "0 2px 4px rgba(0, 90, 91, 0.2)",
              },
              "& .MuiButton-label": {
                display: "flex",
                alignItems: "center",
              },
              "& .MuiSvgIcon-root": {
                marginRight: "10px",
              },
            }}
          >
            <ContentPasteSearchIcon />
            Search
          </Button>
        </Grid>{" "}
      </Grid>

      <Grid item xs={12} sx={{ mt: 3 }}>
        <Paper elevation={7} sx={{ borderRadius: 3, p: 2 }}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            Ready Document
            <Chip
              label={DocReadyCount}
              size="small"
              color="success"
              sx={{ fontWeight: "bold" }}
            />
          </h3>

          <div style={{ height: 280, width: "100%", marginTop: 4 }}>
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
              rows={docReadyRows}
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

      {/* DataGrid */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Paper elevation={7} sx={{ borderRadius: 3, p: 2 }}>
          {/* <h3>Missing Document (Count: {DocMissingCount}) </h3> */}
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            Missing Document
            <Chip
              label={DocMissingCount}
              size="small"
              color="error" // red color for missing
              sx={{ fontWeight: "bold" }}
            />
          </h3>

          <div style={{ height: 280, width: "100%", marginTop: 5 }}>
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
              rows={docMissingRows}
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
      {/* ================================ */}
    </>
  );
}
