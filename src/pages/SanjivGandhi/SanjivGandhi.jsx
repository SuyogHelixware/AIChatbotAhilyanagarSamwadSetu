import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Grid,
  Paper,
  Tooltip,
  Typography
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../../Constant";
import Loader from "../../components/Loader";

const SanjivGandhi = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [DocumentList, setDocumentList] = React.useState([]);
     const [currentPage, setCurrentPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  // const limit = 20;
  // const originalDataRef = React.useRef(null);
  // const firstLoad = React.useRef(true);
  const [totalRows, setTotalRows] = React.useState(0);
  const [limit, setLimit] = React.useState(20);
 
  

 
  // const getAllOfficerList = async (page = 0, searchText = "") => {
  //   try {
  //     setLoading(true);

  //     const params = {
  //       Status: 1,
  //       Page: page,
  //       ...(limit ? { Limit: limit } : {}),
  //       ...(searchText ? { SearchText: searchText } : {}),
  //     };

  //     const response = await axios.get(`${BASE_URL}GazOfficers`, { params });
  //     if (response.data && response.data.values) {
  //       setDocumentList(
  //         response.data.values.map((item, index) => ({
  //           ...item,
  //           id: item.Id,
  //         }))
  //       );
  //       // setTotalRows(response.data.count);
  //       setTotalRows(response.data.count || 0);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // React.useEffect(() => {
  //   if (firstLoad.current) {
  //     firstLoad.current = false;
  //     return;
  //   }
  //   getAllOfficerList(currentPage, searchText, limit);
  // }, [currentPage, searchText, limit]);

  const columns = [
    {
      field: "srNo",
      headerName: "SR NO",
      width: 60,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.api.getSortedRowIds().indexOf(params.id) + 1,
    },
    {
      field: "Name",
      headerName: "NAME",
      width: 400,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title={params.value || ""} arrow>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "phone",
      headerName: " PHONE NUMBER",
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

  // ✅ Common file upload logic
  const handleFileUpload = async (file, type) => {
    const allowedTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      showToast("error", "Only CSV and Excel (.xlsx) files are allowed!");
      return;
    }

    try {
      debugger
      const formData = new FormData();
      formData.append("File", file);   
      formData.append("Type", type);
       

      const apiUrl =
        type === "success"
          ? `${BASE_URL}UploadSuccessList`
          : `${BASE_URL}UploadFailureList`;

      showToast("info", `Uploading ${type === "success" ? "Success" : "Failure"} file...`);

      const response = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(`✅ ${type} Upload Response:`, response.data);
      showToast("success", `${type === "success" ? "Success" : "Failure"} file uploaded successfully!`);
    } catch (error) {
      console.error(`❌ Error uploading ${type} file:`, error);
      showToast("error", `Error uploading ${type} file. Please check the server.`);
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
        elevation={4}
      >
        <Typography
          className="slide-in-text"
          width={"100%"}
          textAlign="center"
          textTransform="uppercase"
          fontWeight="bold"
          // color={"#5C5CFF"}
          padding={1}
          noWrap
        >
          Sanjiv Gandhi Module
        </Typography>
      </Grid>
       
      <Grid container spacing={2} justifyContent="flex-start" marginBottom={1}>
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

        <Button
          onClick={() => successFileRef.current.click()}
          type="text"
          size="medium"
          sx={{
            pr: 2,
            mb: 0,
            mt: 2,
            color: "white",
            fontWeight: "bold",
            background: "linear-gradient(to right, #0b7a3e, #16a34a)",
            borderRadius: "8px",
            transition: "all 0.2s ease-in-out",
            boxShadow: "0 4px 8px rgba(0, 90, 91, 0.3)",
            "&:hover": {
              transform: "translateY(2px)",
              boxShadow: "0 2px 4px rgba(0, 90, 91, 0.2)",
            },
          }}
        >
          <AddIcon />
          UPLOAD SUCCESS FILE
        </Button>
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

        <Button
          onClick={() => failFileRef.current.click()}
          type="text"
          size="medium"
          sx={{
            pr: 2,
            mb: 0,
            mt: 2,
            color: "white",
            fontWeight: "bold",
            background: "linear-gradient(to right, #a12b2bff, #ee4949ff)", // red theme
            borderRadius: "8px",
            transition: "all 0.2s ease-in-out",
            boxShadow: "0 4px 8px rgba(161, 43, 43, 0.3)",
            "&:hover": {
              transform: "translateY(2px)",
              boxShadow: "0 2px 4px rgba(161, 43, 43, 0.2)",
            },
          }}
        >
          <AddIcon />
          UPLOAD FAILURE FILE
        </Button>
      </Grid>
    </Grid>
 
      <Grid
        container
        item
        lg={12}
        component={Paper}
        sx={{ height: "85vh", width: "100%" }}
      >
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
          }}
          rows={DocumentList}
          columns={columns}
          pagination
          paginationMode="server"
          rowCount={totalRows} // REQUIRED — tells grid how many total records exist
          pageSizeOptions={[10, 20, 50]}
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
            setCurrentPage(0); // reset page on search
          }}
          getRowId={(row) => row.Id}
        />
      </Grid>
    </>
  );
};
export default SanjivGandhi;
