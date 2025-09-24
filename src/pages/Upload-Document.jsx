import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Button,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import dayjs from "dayjs";
import * as React from "react";
import { Controller, useForm } from "react-hook-form"; // Importing React Hook Form
import Swal from "sweetalert2";
import InputTextField, {
  DatePickerField,
  InputDescriptionField,
} from "../components/Component";
import Loader from "../components/Loader";
import { openFileinNewTab } from "../components/openFileinNewTab";
import { Celeriq_BASE_URL } from "../Constant";

const UploadDocument = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [imgData, setImgData] = React.useState([]);
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [ClearUpdateButton, setClearUpdateButton] = React.useState("RESET");
  const [totalRows, setTotalRows] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const limit = 20;
  const originalDataRef = React.useRef(null);
  const [rows, setRows] = React.useState([]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Status: 1,
      mobile: "",
      file: null,
    },
  });

  const gaDropdownOptions = [
    { label: "Deputy Collector", value: "officer_a" },
    { label: "Tehsildar", value: "officer_b" },
    { label: "District Collector", value: "officer_c" },
  ];

  const DocopetionOptions = [
    { label: " Aadhaar Card", value: "officer_a" },
    { label: "Income Certificate", value: "officer_b" },
    { label: "policy document", value: "officer_c" },
  ];

  const DocColumns = [
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
      field: "ViewFile",
      headerName: "View File",
      width: 80,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Tooltip title="Open File">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                openFileinNewTab(params.row);
              }}
            >
              <RemoveRedEyeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },

    {
      field: "FileName",
      headerName: "DOCUMENT NAME",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const { id, field, api, value } = params;

        const handleChange = (event) => {
          api.updateRows([{ id, [field]: event.target.value }]);
        };

        return (
          <TextField
            value={value ?? ""}
            onChange={handleChange}
            onKeyDown={(e) => e.stopPropagation()}
            fullWidth
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: "docreq",
      headerName: "DOC REQUEST DATE",
      flex: 1,
      renderCell: (params) => {
        const { id, value, api, field } = params;

        const handleDateChange = (newValue) => {
          api.updateRows([
            { id, [field]: newValue }, // update row data
          ]);
        };

        return (
          <DatePickerField
            value={value ? dayjs(value) : dayjs()}
            onChange={handleDateChange}
          />
        );
      },
    },
    {
      field: "gofficer",
      headerName: "GAZETTED OFFICER",
      flex: 1,
      renderCell: (params) => {
        const { id, field, value, api } = params;
        const handleChange = (e) => {
          api.updateRows([{ id, [field]: e.target.value }]);
        };

        return (
          <Select
            value={value || ""}
            onChange={handleChange}
            fullWidth
            variant="standard"
          >
            {gaDropdownOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: "DOCTYPE",
      headerName: "DOCUMENT TYPE",
      flex: 1,
      renderCell: (params) => {
        const { id, field, value, api } = params;

        const handleChange = (e) => {
          api.updateRows([{ id, [field]: e.target.value }]);
        };
        return (
          <Select
            value={value || ""}
            onChange={handleChange}
            fullWidth
            variant="standard"
          >
            {DocopetionOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleRemove(params.row.id)}
        >
          Remove
        </Button>
      ),
    },
  ];
  const columns = [
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <strong>
          <IconButton
            color="primary"
            // onClick={() => handleUpdate(params.row)}
            sx={{
              color: "rgb(0, 90, 91)",
              "&:hover": {
                backgroundColor: "rgba(0, 90, 91, 0.1)",
              },
            }}
          >
            <EditNoteIcon />
          </IconButton>
          <Button
            size="medium"
            sx={{ color: "red" }}
            // onClick={() => handleDelete(params.row)}
          >
            <DeleteForeverIcon />
          </Button>
        </strong>
      ),
    },
    {
      field: "id",
      headerName: "Sr.No",
      width: 100,
      sortable: true,
    },
    {
      field: "cardname",
      headerName: " NAME",
      flex: 1,
      minWidth: 80,
      sortable: false,
    },
    {
      field: "PhoneNo",
      headerName: "PHONE NO",
      flex: 1,
      minWidth: 150,
      sortable: false,
    },
    {
      field: "EMAILID",
      headerName: "EMAIL ID",
      flex: 1.5,
      minWidth: 180,
      sortable: false,
    },
    {
      field: "ADDREE",
      headerName: "ADDRESS",
      flex: 2,
      minWidth: 200,
      sortable: false,
    },
  ];

  const dammyrows = [
    {
      Id: 1,
      id: 1,
      cardname: "Sagar Waman",
      PhoneNo: "+91 9876543210",
      EMAILID: "sagar01@gmail.com",
      ADDREE: "Chanda , Newasa",
    },
    {
      Id: 2,
      id: 2,
      cardname: "Sumit Borude",
      PhoneNo: "+91 8023456780",
      EMAILID: "sumit@gmail.com",
      ADDREE: "Savedi Ahilyanagar",
    },
    {
      Id: 3,
      id: 3,
      cardname: "Sohel Bagwan",
      PhoneNo: " +91 9988776655",
      EMAILID: "sohel@gmail.com",
      ADDREE: "shendi , Ahilyanagar",
    },
    {
      Id: 4,
      id: 4,
      cardname: "Helixware",
      PhoneNo: "+91 9226273553",
      EMAILID: "thehelix@gmail.com",
      ADDREE: "Pipeline road, Ahilyanagar",
    },
  ];

  const clearFormData = () => {
    reset();
    setRows([]);
    if (ClearUpdateButton === "CLEAR") {
      reset({
        DeptNameEN: "",
        DeptNameMR: "",
        Status: 1,
        mobile: "",
      });
    }
    if (ClearUpdateButton === "RESET") {
      reset(originalDataRef.current);
    }
  };

  const handleClose = () => setOn(false);

  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setClearUpdateButton("CLEAR");
    setOn(true);
    clearFormData();
  };

  const handleRemove = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);

    const newRows = await Promise.all(
      files.map(async (file, index) => {
        const ext = file.name.split(".").pop().toLowerCase();

        return {
          id: Date.now() + index,
          name: file.name,
          type: ext,
          SrcPath: "",
          File: file,
          FileExt: ext,
          FileName: file.name,
        };
      })
    );

    setRows((prev) => [...prev, ...newRows]);
  };

  const onSubmit = async () => {
    if (!rows || rows.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Add Document",
        text: `Please upload at least one document before submitting.`,
      });
      return;
    }

    // Build root object like your invoice example
    const fileobject = {
      UserId: sessionStorage.getItem("UserId") || "1",
      CreatedBy: sessionStorage.getItem("CreatedBy") || "Helix",
      ModifiedBy: sessionStorage.getItem("CreatedBy"),
      Status: "1",
      CreatedDate: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
      ModifiedDate: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),

      // Array of attachments
      oAttachLines: rows.map((row, index) => ({
        UserId: sessionStorage.getItem("UserId"),
        CreatedBy: sessionStorage.getItem("CreatedBy"),
        ModifiedBy: sessionStorage.getItem("CreatedBy"),
        DocEntry: row.DocEntry || "",
        LineNum: (index + 1).toString(),

        //  File details
        FileExt: row.FileExt || "",
        FileName: row.FileName || "",
        File: row.FileBase64 || "",
        SrcPath: row.SrcPath || "",
        Description: row.Description || "",

        //  Extra fields from DataGrid
        DocRequestDate: row.docreq
          ? dayjs(row.docreq).format("YYYY-MM-DD")
          : "",
        GazettedOfficer: row.gofficer || "",
        DocumentType: row.DOCTYPE || "",
      })),
    };

    console.log("OBJ to send:", fileobject);

    try {
      const response = await axios.post(
        `${Celeriq_BASE_URL}Attachment`,
        fileobject,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("API Response:", response.data);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Documents uploaded successfully!",
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "There was an issue uploading the documents. Please try again.",
      });
    }
  };

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
      <Modal
        open={on}
        // onClose={handleClose}
        sx={{
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: 1000,
            Height: 1200,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Grid
            container
            spacing={3}
            padding={3}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Header */}
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography fontWeight="bold"> UPLOAD DOCUMENT</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>

            <Grid item xs={12} md={4}>
             
              {/* <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{
                  required: "Name is required",
                  maxLength: {
                    value: 100,
                    message: "Name cannot exceed 100 characters",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <InputTextField
                    {...field}
                    label="ENTER NAME"
                    size="small"
                    inputProps={{ maxLength: 100 }}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              /> */}
        <Controller
  name="name"
  control={control}
  defaultValue=""
  rules={{
    required: "Name is required",
    maxLength: { value: 100, message: "Name cannot exceed 100 characters" }
  }}
  render={({ field, fieldState: { error } }) => (
    <TextField
      {...field}
      inputRef={field.ref}           // <- IMPORTANT
      label="ENTER NAME"
      size="small"
      inputProps={{ maxLength: 100 }}
      error={!!error}
      helperText={error?.message}
    />
  )}
/>



            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="mobile"
                control={control}
                rules={{
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit mobile number",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label=" ENTER MOBILE NO"
                    // fullWidth
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) {
                        field.onChange(value);
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <span style={{ marginRight: 8 }}>+91</span>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputTextField
                    {...field}
                    label="ENTER EMAIL ID"
                    size="small"
                    rows={1}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <InputDescriptionField
                    {...field}
                    label="ENTER ADDRESS"
                    size="small"
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: "flex", justifyContent: "flex-center" }}
            >
              <Button
                variant="contained"
                size="small"
                component="label"
                sx={{
                  width: 120,
                  height: 40,
                  color: "white",
                  background:
                    "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                  fontSize: "0.75rem",
                }}
              >
                Upload File
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileUpload}
                />
              </Button>
            </Grid>
            <Grid item xs={12} md={4}></Grid>
            {/* DataGrid */}
            <Grid item xs={12} style={{ height: 300 }}>
              <DataGrid
                rows={rows}
                columns={DocColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableRowSelectionOnClick
                hideFooter
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
              />
            </Grid>

            {/* Footer */}
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                position: "absolute",
                bottom: 10,
                left: 10,
                right: 10,
              }}
            >
              <Button
                size="small"
                onClick={clearFormData}
                sx={{
                  p: 1,
                  width: 80,
                  color: "rgb(0, 90, 91)",
                  border: "1px solid rgb(0, 90, 91)",
                  borderRadius: "8px",
                }}
              >
                {ClearUpdateButton}
              </Button>
              <Button
                type="submit"
                size="small"
                sx={{
                  p: 1,
                  width: 80,
                  color: "white",
                  background:
                    "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                }}
              >
                {SaveUpdateButton}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
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
          Upload Document
        </Typography>
      </Grid>
      <Grid container xs={12} md={12} lg={12} justifyContent="flex-end">
        <Button
          onClick={handleOnSave}
          type="text"
          size="medium"
          sx={{
            pr: 2,
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
          <AddIcon />
          Add Document
        </Button>
      </Grid>
      <Grid
        container
        item
        lg={12}
        component={Paper}
        sx={{ height: "80vh", width: "100%" }}
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
          //   rows={imgData}
          rows={dammyrows}
          columns={columns}
          // autoHeight
          pagination
          paginationMode="server"
          rowCount={totalRows}
          pageSizeOptions={[limit]}
          paginationModel={{ page: currentPage, pageSize: limit }}
          onPaginationModelChange={(newModel) => {
            console.log("New Pagination Model:", newModel);
            setCurrentPage(newModel.page);
          }}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 8 } },

            filter: {
              filterModel: {
                items: [],

                quickFilterValues: [],
              },
            },
          }}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          slots={{ toolbar: GridToolbar }} // Enables search & export
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
          getRowId={(row) => row.Id}
        />
      </Grid>
    </>
  );
};

export default UploadDocument;
