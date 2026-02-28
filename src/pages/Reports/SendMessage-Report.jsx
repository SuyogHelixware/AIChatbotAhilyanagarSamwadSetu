import DateRangeIcon from "@mui/icons-material/DateRange";
import EditNoteIcon from "@mui/icons-material/EditNote";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import TagIcon from "@mui/icons-material/Tag";
import { Chip, Divider, Grid, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import CustomToolbar from "../../components/CustomToolbar";
import CustomMuiRangePicker from "../../components/DateRangePickerField";
import { BASE_URL } from "../../Constant";
import ChecklistIcon from "@mui/icons-material/Checklist";

export default function SendMessageReport() {
  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());
  const [DocReadyCount, setDocReadyCount] = React.useState(0);
  const [docReadyRows, setDocReadyRows] = React.useState([]);
  const fetchingRef = useRef(false);
  const fetchReport = async (selectedFrom, selectedTo) => {
    try {
      const token = sessionStorage.getItem("BearerTokan");
      if (!token) {
        fetchingRef.current = false;
        return;
      }

      const params = {
        FromDate: dayjs(fromDate).format("YYYY-MM-DD"),
        ToDate: dayjs(toDate).format("YYYY-MM-DD"),
      };

      const response = await axios.get(`${BASE_URL}Campaign/Reports`, {
        params,
        headers: {
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      });

      console.log("dfgfg", response);
      if (!response || !response.data) {
        setDocReadyRows([]);
        return;
      }
 
      const groups = response.data.values ?? [];
      const Totalcount = groups.reduce((total, item) => {
  const sent = item?.MsgSentCnt ?? 0;
  const failed = item?.MsgFailedCnt ?? 0;

  return total + sent + failed;
}, 0);

console.log("Totalcount", Totalcount);
      setDocReadyCount(Totalcount?? 0);

      setDocReadyRows(groups);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDocReadyRows([]);
    } finally {
    }
  };
  useEffect(() => {
    if (fromDate && toDate) {
      fetchReport();
    }
  }, [fromDate, toDate]);

  const officerColumns = [
    {
      field: "srNo",
      headerName: "SR NO",
      minWidth: 60,
      maxWidth: 65,
      flex: 0.1,
      sortable: false,
      headerAlign: "center",
      align: "center",

      renderHeader: () => (
        <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TagIcon fontSize="small" />
          SR NO
        </span>
      ),

      renderCell: (params) =>
        params.api.getSortedRowIds().indexOf(params.id) + 1,
    },
    {
      field: "Title",
      headerName: "Title",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <EditNoteIcon fontSize="small" />
          Title
        </span>
      ),
      renderCell: (params) => <span>{params.value}</span>,
    },
    {
      field: "Type",
      headerName: "Type",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <ChecklistIcon fontSize="small" />
          Type
        </span>
      ),
      renderCell: (params) => <span>{params.value}</span>,
    },
    {
      field: "Templete",
      headerName: "Templete",
      flex: 1.2,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <EditNoteIcon fontSize="small" />
          Templete
        </span>
      ),
      renderCell: (params) => <span>{params.value}</span>,
    },

    {
      field: "MsgFailedCnt",
      headerName: "Msg Failed Cnt Count",
      flex: 0.8,
      align: "center",
      headerAlign: "center",

      renderHeader: () => (
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <FormatListNumberedIcon fontSize="small" />
           Msg Failed Cnt Count
        </span>
      ),

      renderCell: (params) => (
        <span
          style={{
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: "6px",
            fontWeight: 600,
            color: "#F2401B",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "MsgSentCnt",
      headerName: "Msg Sent Cnt Count",
      flex: 0.8,
      align: "center",
      headerAlign: "center",

      renderHeader: () => (
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <FormatListNumberedIcon fontSize="small" />
          Msg Sent Cnt Count
        </span>
      ),

      renderCell: (params) => (
        <span
          style={{
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: "6px",
            fontWeight: 600,
            color: "#00A300",
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
          Send Notification Report
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

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Paper elevation={1} sx={{ borderRadius: 3, p: 2 }}>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              Send Notification
              <Chip
                label={DocReadyCount}
                size="small"
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
                  // mx: -2,
                
                }}
              />
            </Grid>

            <div style={{ height: 520, width: "100%", }}>
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
                getRowId={(row) => row.Id}
                pageSize={10}
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
