import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Grid, Paper, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../../Constant";
import Loader from "../../components/Loader";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useThemeMode } from "../../Dashboard/Theme";

const SanjayGandhi = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [DocumentList, setDocumentList] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");

  const [totalRows, setTotalRows] = React.useState(0);
  const [limit, setLimit] = React.useState(20);

  const { checkAccess } = useThemeMode();

  const canAdd = checkAccess(10, "IsAdd");

  const columns = [
    {
      field: "srNo",
      headerName: "SR NO",
  minWidth: 60,
      maxWidth: 70,
      flex: 0.2,
            sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.api.getSortedRowIds().indexOf(params.id) + 1,
    },
    {
      field: "Name",
      headerName: "BENEFICIARY NAME",
      width: 400,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title={params.value || ""} arrow>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "MobileNumber",
      headerName: "MOBILE NUMBER",
      width: 300,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title={params.value || ""} arrow>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
  ];

  const successFileRef = React.useRef(null);
  const failFileRef = React.useRef(null);

  const showToast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "center",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  };

  const showuploadfileToast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  };

  const handleFileUpload = async (file, type) => {
    const allowedTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      showToast("error", "Only CSV and Excel (.xlsx) files are allowed!");
      return;
    }
    setLoaderOpen(true);
    setLoading(true);

    try {
      // 🔹 Step 1: Show confirmation alert before uploading
      const result = await Swal.fire({
        title: "Confirm File Upload",
        html: `
        <div style="font-size:15px; text-align:center;">
          <p><b>Selected File:</b> ${file.name}</p>
          <p>Are you sure you want to upload this 
            <b style="color:${type === "S" ? "green" : "red"}">
              ${type === "S" ? "Success" : "Failure"}
            </b> 
            file?</p>
        </div>
      `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Upload",
        cancelButtonText: "No, Cancel",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        // reverseButtons: true,
      });

      //  If user cancels → stop here
      if (!result.isConfirmed) {
        showToast("info", "File upload cancelled.");
        return;
      }
      setLoaderOpen(true);

      //  Proceed with actual upload if confirmed
      const formData = new FormData();
      formData.append("File", file);
      formData.append("Type", type);

      const apiUrl =
        type === "S" ? `${BASE_URL}Beneficiary` : `${BASE_URL}Beneficiary`;

      showuploadfileToast(
        "info",
        `Uploading ${type === "S" ? "Success" : "Failure"} file...`
      );

      const response = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ===========
      if (response.data?.success === false) {
        await Swal.fire({
          icon: "error",
          title: "Upload Failed",
          html: `<p style="text-align:left;">${response.data.message}</p>`,
          confirmButtonText: "OK",
        });
        return;
      }
      // ========

      showToast(
        "success",
        `${type === "S" ? "Success" : "Failure"} file uploaded successfully!`
      );

      const failData = response.data?.values?.Fail || [];

      const rowsWithIds = failData.map((item, index) => ({
        id: index + 1,
        ...item,
      }));

      setDocumentList(rowsWithIds);
      setTotalRows(rowsWithIds.length);
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        toast: true,
        title: "Failed",
        text: error.message,
        showConfirmButton: true,
      });
      showToast(
        "error",
        `Error uploading ${type} file. Please check the server.`
      );
    } finally {
      setLoaderOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}

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
          Sanjay Gandhi
        </Typography>
      </Grid>

      <Grid container spacing={2} justifyContent="flex-end" >
        {/* Success Upload */}

        <Grid item>
          <input
            type="file"
            accept=".csv, .xlsx"
            ref={successFileRef}
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleFileUpload(file, "S");
              e.target.value = null;
            }}
          />

          <Tooltip
            title={
              !canAdd ? (
                <Typography sx={{ fontSize: 13, p: 0.5 }}>
                  You don’t have permission to upload files.
                </Typography>
              ) : (
                <Box
                  sx={{
                    bgcolor: "#1e293b",
                    color: "white",
                    p: 1.5,
                    borderRadius: 1.5,
                    boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
                    minWidth: 220,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <InfoOutlinedIcon
                      sx={{ fontSize: 20, mr: 0.8, color: "#38bdf8" }}
                    />
                    <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                      Required Columns In File
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: 12,
                      mb: 0.8,
                      color: "#cbd5e1",
                      fontStyle: "italic",
                    }}
                  >
                    File type allowed: <b>CSV</b>, <b>Excel</b>
                  </Typography>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "20px",
                      fontSize: "13px",
                      lineHeight: "1.6",
                    }}
                  >
                    <li>
                      <b>Beneficiary Name</b>
                    </li>
                    <li>
                      <b>Mobile Number</b>
                    </li>
                    <li>
                      <b>Amount</b>
                    </li>
                    <li>
                      <b>Bank Name</b>
                    </li>
                  </ul>
                </Box>
              )
            }
            arrow
            placement="left-end"
          >
            <span>
              <Button
                onClick={() => successFileRef.current.click()}
                disabled={!canAdd}
                type="text"
                size="medium"
                sx={{
                  pr: 2,
                  mb: 0,
                  mt: 2,
                  color: "white",
                  fontWeight: "bold",
                  // background: !canAdd
                  //   ? "linear-gradient(to right, #0b7a3e, #16a34a)"
                  //   : "linear-gradient(to right, #0b7a3e, #16a34a)",
                  background: !canAdd
                    ? "#bcd7f9" // Disabled color (light blue-grey)
                    : "linear-gradient(to right, #2196F3, #1e88e5)",
                  borderRadius: "8px",
                  transition: "all 0.2s ease-in-out",
                  // boxShadow: "0 4px 8px rgba(0, 90, 91, 0.3)",
                  boxShadow: !canAdd
                    ? "0 2px 4px rgba(0,0,0,0.1)"
                    : "0 4px 8px rgba(33, 150, 243, 0.3)",

                  "&:hover": {
                    background: canAdd
                      ? "linear-gradient(to right, #1e88e5, #1976d2)" // Darken on hover
                      : "#bcd7f9", // Stay same if disabled

                    transform: canAdd ? "translateY(2px)" : "none",
                    boxShadow: canAdd
                      ? "0 2px 4px rgba(33,150,243,0.2)"
                      : "0 2px 4px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <AddIcon />
                UPLOAD SUCCESS FILE
              </Button>
            </span>
          </Tooltip>
        </Grid>

        {/* Failure Upload */}
        <Grid item>
          <input
            type="file"
            accept=".csv, .xlsx"
            ref={failFileRef}
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleFileUpload(file, "F");
              e.target.value = null;
            }}
          />
          <Tooltip
            title={
              !canAdd ? (
                <Typography sx={{ fontSize: 13, p: 0.5 }}>
                  You don’t have permission to upload files.
                </Typography>
              ) : (
                <Box
                  sx={{
                    bgcolor: "#1e293b",
                    color: "white",
                    p: 1.5,
                    borderRadius: 1.5,
                    boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
                    minWidth: 220,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <InfoOutlinedIcon
                      sx={{ fontSize: 20, mr: 0.8, color: "#38bdf8" }}
                    />
                    <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                      Required Columns In File
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: 12,
                      mb: 0.8,
                      color: "#cbd5e1",
                      fontStyle: "italic",
                    }}
                  >
                    File type allowed: <b>CSV</b>, <b>Excel</b>
                  </Typography>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "20px",
                      fontSize: "13px",
                      lineHeight: "1.6",
                    }}
                  >
                    <li>
                      <b>Beneficiary Name</b>
                    </li>
                    <li>
                      <b>Mobile Number</b>
                    </li>
                    <li>
                      <b>Amount</b>
                    </li>
                    <li>
                      <b>Failure Reason</b>
                    </li>
                  </ul>
                </Box>
              )
            }
            arrow
            placement="right-end"
          >
            <span>
              <Button
                onClick={() => failFileRef.current.click()}
                disabled={!canAdd}
                type="text"
                size="medium"
                sx={{
                  pr: 2,
                  mb: 0,
                  mt: 2,
                  color: "white",
                  fontWeight: "bold",
                  // background: "linear-gradient(to right, #a12b2bff, #ee4949ff)",
                  background: !canAdd
                    ? "#f0b4b4" // Light red for disabled
                    : "linear-gradient(to right, #4f93e0ff, #6bc2f5ff)",
                  borderRadius: "8px",
                  transition: "all 0.2s ease-in-out",
                  // boxShadow: "0 4px 8px rgba(161, 43, 43, 0.3)",
                  boxShadow: !canAdd
                    ? "0 2px 4px rgba(0,0,0,0.1)"
                    : "0 4px 8px rgba(199, 89, 89, 0.3)",
                  "&:hover": {
                    background: canAdd
                      ? "linear-gradient(to right, #8b2525, #d63f3f)" // Slightly darker hover
                      : "#f0b4b4",

                    transform: canAdd ? "translateY(2px)" : "none",
                    boxShadow: canAdd
                      ? "0 2px 4px rgba(161, 43, 43, 0.2)"
                      : "0 2px 4px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <AddIcon />
                UPLOAD FAILURE FILE
              </Button>
            </span>
          </Tooltip>
        </Grid>
      </Grid>

      {/* <Grid
        container
        item
        lg={12}
        component={Paper}
        sx={{ height: "74vh", width: "100%" }}
      > */}
       <Paper
              sx={{
                marginTop: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "#",
              }}
              elevation={1}
            >
              <Box sx={{ height: "74vh", width: "100%" }}>
        <DataGrid
          className="datagrid-style"
          sx={{
            height: "100%",
            minHeight: "500px",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: (theme) => theme.palette.custome.datagridcolor,
            },
            "& .MuiDataGrid-row:hover": {
              boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)",
            },
              "& .MuiDataGrid-virtualScroller": {
                scrollbarWidth: "thin",
              },
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                width: "6px",
                height: "6px",
              },
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
                backgroundColor: "#9e9e9e",
                borderRadius: "10px",
              },
          }}
          rows={DocumentList}
          columns={columns}
          getRowId={(row) => row.Id || `${row.Name}-${row.MobileNumber}`}
          pagination
          paginationMode="server"
          rowCount={totalRows}
          // pageSizeOptions={[20, 50, 100]}
          paginationModel={{ page: currentPage, pageSize: limit }}
          onPaginationModelChange={(newModel) => {
            setCurrentPage(newModel.page);
            setLimit(newModel.pageSize);
          }}
          loading={loading}
          disableColumnFilter
          hideFooterSelectedRowCount
          disableColumnSelector
          disableDensitySelector
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          onFilterModelChange={(model) => {
            const quickFilterValue = model.quickFilterValues?.[0] || "";
            setSearchText(quickFilterValue);
            setCurrentPage(0);
          }}
        />
    </Box>
      </Paper>
          </>
  );
};
export default SanjayGandhi;
