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
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import InputTextField, {
  DatePickerField,
  InputDescriptionField,
} from "../components/Component";
import Loader from "../components/Loader";
import { BASE_URL } from "../Constant";

const UploadDocument = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [Documentlist, setDocumentlist] = React.useState([]);
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
  const [gazeteList, setgazeteList] = React.useState([]);

  const firstLoad = React.useRef(true);

  const initial = {
    Status: "1",
    CreatedDate: dayjs().format("YYYY-MM-DD"),
    ModifiedDate: dayjs().format("YYYY-MM-DD"),
    Id: "",
    Email: "",
    MobileNo: "",
    Name: "",
    Address: "",
    oDocLines: [],
  };

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      initial,
    },
  });

  const DocopetionOptions = [
    { label: " Aadhaar Card", value: "AadhaarCard" },
    { label: "Income Certificate", value: "Income Certificate" },
    { label: "policy document", value: "policy document" },
    { label: "NOC", value: "NOC" },
  ];

  const DocColumns = [
    {
      field: "srNo",
      headerName: "SR NO",
      width: 55,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.api.getSortedRowIds().indexOf(params.id) + 1,
    },
    // {
    //   field: "ViewFile",
    //   headerName: "View File",
    //   width: 78,
    //   sortable: false,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) => (
    //     <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    //       <Tooltip title="Open File">
    //         <IconButton
    //           size="small"
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             openFileinNewTab(params.row);
    //           }}
    //         >
    //           <RemoveRedEyeIcon fontSize="small" />
    //         </IconButton>
    //       </Tooltip>
    //     </div>
    //   ),
    // },
    {
      field: "ViewFile",
      headerName: "View File",
      width: 78,
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
                handleViewFile(params.row);
              }}
            >
              <RemoveRedEyeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },

    // {
    //   field: "FileName",
    //   headerName: "DOCUMENT NAME",
    //   flex: 1,
    //   sortable: false,
    //   renderCell: (params) => {
    //     const { id, field, api, value } = params;

    //     const handleChange = (event) => {
    //       api.updateRows([{ id, [field]: event.target.value }]);
    //     };

    //     return (
    //       <TextField
    //         value={value ?? ""}
    //         onChange={handleChange}
    //         onKeyDown={(e) => e.stopPropagation()}
    //         fullWidth
    //         size="small"
    //         variant="outlined"
    //       />
    //     );
    //   },
    // },
    {
      field: "FileName",
      headerName: "DOCUMENT NAME",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const { id, field, api, value } = params;

        const handleChange = (event) => {
          const newValue = event.target.value;

          // Update DataGrid UI
          api.updateRows([{ id, [field]: newValue }]);

          // Update rows state for onSubmit
          setRows((prev) =>
            prev.map((row) =>
              row.id === id ? { ...row, [field]: newValue } : row
            )
          );
        };

        return (
          <Tooltip title={value || ""} arrow placement="top">
            <TextField
              value={value ?? ""}
              onChange={handleChange}
              onKeyDown={(e) => e.stopPropagation()}
              fullWidth
              size="small"
              variant="outlined"
            />
          </Tooltip>
        );
      },
    },

    {
      field: "DocReqDate",
      headerName: "DOC REQUEST DATE",
      flex: 1,
      renderCell: (params) => {
        const { id, value, api, field } = params;

        const handleDateChange = (newValue) => {
          // Update DataGrid UI
          api.updateRows([{ id, [field]: newValue }]);

          // Update rows state for submit
          setRows((prev) =>
            prev.map((row) =>
              row.id === id ? { ...row, [field]: newValue } : row
            )
          );
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
      field: "IssuedBy",
      headerName: "GAZETTED OFFICER",
      flex: 1,
      renderCell: (params) => {
        const { id, field, value, api } = params;

        const handleChange = (e) => {
          const newValue = e.target.value;

          // Update DataGrid UI
          api.updateRows([{ id, [field]: newValue }]);

          // Update rows state so submit gets the correct value
          setRows((prev) =>
            prev.map((row) =>
              row.id === id ? { ...row, [field]: newValue } : row
            )
          );
        };

        return (
          <Tooltip title={value || ""} arrow placement="top">
            <Select
              value={value || ""}
              onChange={handleChange}
              fullWidth
              variant="standard"
            >
              {gazeteList.map((option) => (
                <MenuItem key={option.Name} value={option.Name}>
                  {option.Name}
                </MenuItem>
              ))}
            </Select>
          </Tooltip>
        );
      },
    },

    {
      field: "DocType",
      headerName: "DOCUMENT TYPE",
      flex: 1,
      renderCell: (params) => {
        const { id, field, value, api } = params;

        const handleChange = (e) => {
          const newValue = e.target.value;

          // update DataGrid UI
          api.updateRows([{ id, [field]: newValue }]);

          // also update rows state
          setRows((prev) =>
            prev.map((row) =>
              row.id === id ? { ...row, [field]: newValue } : row
            )
          );
        };

        return (
          <Tooltip title={value || ""} arrow placement="top">
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
          </Tooltip>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 90,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleRemove(params.row)}
        >
          Remove
        </Button>
      ),
    },
  ];

  const handleViewFile = (row) => {
    if (row.SrcPath) {
      // Old file from server
      window.open(row.SrcPath, "_blank");
    } else if (row.File) {
      // New file not uploaded yet → create a temporary URL
      const fileURL = URL.createObjectURL(row.File);
      window.open(fileURL, "_blank");

      // Optional: revoke URL after a while to free memory
      setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
    } else {
      console.warn("File not available to open");
    }
  };

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
            onClick={() => handleUpdate(params.row)}
            sx={{
              color: "rgb(0, 90, 91)",
              "&:hover": { backgroundColor: "rgba(0, 90, 91, 0.1)" },
            }}
          >
            <EditNoteIcon />
          </IconButton>
          <IconButton
            size="medium"
            sx={{ color: "red" }}
            onClick={() => handleDelete(params.row)}
          >
            <DeleteForeverIcon />
          </IconButton>
        </strong>
      ),
    },
    { field: "id", headerName: "Sr.No", width: 80, sortable: true },
    {
      field: "Name",
      headerName: "NAME",
      minWidth: 100,
      flex: 1,
      sortable: false,
    },
    {
      field: "MobileNo",
      headerName: "PHONE NO",
      minWidth: 100,
      flex: 1,
      sortable: false,
    },
    {
      field: "Email",
      headerName: "EMAIL ID",
      minWidth: 180,
      flex: 1.2,
      sortable: false,
    },
    {
      field: "Address",
      headerName: "ADDRESS",
      minWidth: 200,
      flex: 1.5,
      sortable: false,
    },
  ];

  const handleDelete = async (rowData) => {
    Swal.fire({
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoaderOpen(true);
        try {
          const response = await axios.delete(
            `${BASE_URL}DocUpload/${rowData.Id}`
          );
          setLoaderOpen(false);
          if (response.data && response.data.success) {
            Swal.fire({
              position: "center",
              icon: "success",
              toast: true,
              title: "Document Deleted Successfully",
              showConfirmButton: false,
              timer: 1500,
            });
            getAllDocList(currentPage, searchText);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              toast: true,
              title: "Failed",
              text: `Unexpected response: ${JSON.stringify(response.data)}`,
              showConfirmButton: true,
            });
          }
        } catch (error) {
          setLoaderOpen(false);
          Swal.fire({
            position: "center",
            icon: "error",
            toast: true,
            title: "Failed",
            text: error.message || "Something went wrong",
            showConfirmButton: true,
          });
        }
      }
    });
  };

  const handleUpdate = async (rowData) => {
    setSaveUpdateButton("UPDATE");
    setClearUpdateButton("RESET");
    setOn(true);
    try {
      setLoading(true);
      const apiUrl = `${BASE_URL}DocUpload/${rowData.Id}`;
      const response = await axios.get(apiUrl);
      if (response.data && response.data.values) {
        const olddata = response.data.values;
        originalDataRef.current = olddata;
        setValue("Id", olddata.Id);
        setValue("Name", olddata.Name);
        setValue("MobileNo", olddata.MobileNo);
        setValue("Email", olddata.Email);
        setValue("Address", olddata.Address);

        if (olddata.oDocLines && Array.isArray(olddata.oDocLines)) {
          // normalize data for DataGrid
          const formattedLines = olddata.oDocLines.map((line, index) => ({
            ...line,
            id: line.LineNum ?? index, // pick unique key
          }));

          setValue("oDocLines", formattedLines); // if storing in react-hook-form
          setRows(formattedLines); // for DataGrid display
        }
      }
    } catch (error) {
      console.error("Error fetching olddata data:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFormData = () => {
    setRows([]); // clear DataGrid first

    if (ClearUpdateButton === "CLEAR") {
      reset({
        Status: 1,
        Address: "",
        Email: "",
        MobileNo: "",
        Name: "",
        oDocLines: [],
      });
    }

    if (ClearUpdateButton === "RESET") {
      if (originalDataRef.current) {
        reset(originalDataRef.current);

        // also set rows for DataGrid
        if (
          originalDataRef.current.oDocLines &&
          Array.isArray(originalDataRef.current.oDocLines)
        ) {
          const formattedLines = originalDataRef.current.oDocLines.map(
            (line, index) => ({
              ...line,
              id: line.LineNum ?? index,
            })
          );
          setRows(formattedLines);
        } else {
          setRows([]);
        }
      } else {
        reset({
          Status: 1,
          Address: "",
          Email: "",
          MobileNo: "",
          Name: "",
          oDocLines: [],
        });
        setRows([]);
      }
    }
  };

  const handleClose = () => setOn(false);

  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setClearUpdateButton("CLEAR");
    setOn(true);
    clearFormData();
    reset({
      Status: 1,
      Address: "",
      Email: "",
      MobileNo: "",
      Name: "",
      oDocLines: [],
    });
    setRows([]); // clears table data
  };

  const handleRemove = (rowToRemove) => {
    setRows((prev) =>
      prev.filter((row) => {
        // If row has LineNum, compare with rowToRemove.LineNum
        if (row.LineNum !== undefined && rowToRemove.LineNum !== undefined) {
          return row.LineNum !== rowToRemove.LineNum;
        }
        // Otherwise, compare by id
        return row.id !== rowToRemove.id;
      })
    );
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);

    const newRows = await Promise.all(
      files.map(async (file, index) => {
        const ext = file.name.split(".").pop().toLowerCase();

        return {
          id: Date.now() + index,
          // file details
          name: file.name,
          type: ext,
          SrcPath: "",
          File: file,
          FileExt: ext,
          FileName: file.name,

          // extra DataGrid fields (initialize them)
          DocReqDate: dayjs().format("YYYY-MM-DD"),
          IssuedBy: "",
          DocType: "",
          DocEntry: "",
          Status: 0,
          CreatedDate: dayjs().format("YYYY-MM-DD"),
          ModifiedDate: dayjs().format("YYYY-MM-DD"),
          CreatedBy: localStorage.getItem("UserName") || " ",
          ModifiedBy: localStorage.getItem("UserName") || " ",
          UserId: localStorage.getItem("UserId") || "1",
        };
      })
    );

    setRows((prev) => [...prev, ...newRows]);
    console.log("object file", newRows);
  };

  const onSubmit = async (data) => {
    if (!rows || rows.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Add Document",
        text: `Please upload at least one document before submitting.`,
      });
      return;
    }

    const invalidRow = rows.find((row) => !row.DocType || !row.IssuedBy);

    if (invalidRow) {
      Swal.fire({
        toast: true,
        icon: "warning",
        title: "Missing Required Fields",
        text: "Please select Document Type and Gazetted Officer .",
        position: "center",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });

      return;
    }

    const formData = new FormData();

    // Common fields
    formData.append("UserId", localStorage.getItem("UserId") || "");
    formData.append("CreatedBy", localStorage.getItem("UserName") || "");
    formData.append("ModifiedBy", localStorage.getItem("UserName") || "");
    formData.append("Status", "1");
    formData.append("Email", data.Email || "");
    formData.append("MobileNo", data.MobileNo || "");
    formData.append("Name", data.Name || "");
    formData.append("Address", data.Address || "");
    formData.append("Id", data.Id || "");

    rows.forEach((row, index) => {
      formData.append(
        `oDocLines[${index}].UserId`,
        localStorage.getItem("UserId")
      );
      formData.append(
        `oDocLines[${index}].CreatedBy`,
        localStorage.getItem("UserName")
      );
      formData.append(
        `oDocLines[${index}].ModifiedBy`,
        localStorage.getItem("UserName")
      );

      formData.append(`oDocLines[${index}].DocEntry`, row.DocEntry || "");
      formData.append(`oDocLines[${index}].LineNum`, row.LineNum || "");

      formData.append(`oDocLines[${index}].FileExt`, row.FileExt || "");
      formData.append(
        `oDocLines[${index}].FileName`,
        row.FileName
          ? row.FileName.substring(0, row.FileName.lastIndexOf(".")) ||
              row.FileName
          : ""
      );
      formData.append(`oDocLines[${index}].SrcPath`, row.SrcPath || "");

      formData.append(
        `oDocLines[${index}].DocReqDate`,
        row.DocReqDate ? dayjs(row.DocReqDate).format("YYYY-MM-DD") : ""
      );
      formData.append(`oDocLines[${index}].IssuedBy`, row.IssuedBy || "");
      formData.append(`oDocLines[${index}].DocType`, row.DocType || "");

      if (row.File) {
        formData.append(`oDocLines[${index}].File`, row.File);
      }
    });

    try {
      let response;

      if (SaveUpdateButton === "SAVE") {
        setLoaderOpen(true);
        response = await axios.post(`${BASE_URL}DocUpload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // PUT request

        const result = await Swal.fire({
          text: "Do you want to Update...?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Update it!",
        });

        if (!result.isConfirmed) return;

        setLoaderOpen(true);

        response = await axios.put(
          `${BASE_URL}DocUpload/${data.Id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      setLoaderOpen(false);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title:
            SaveUpdateButton === "SAVE"
              ? "Document Uploaded Successfully"
              : "Document Updated Successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        handleClose();
        getAllDocList();
      } else {
        throw new Error(response.data.message || "Unexpected error");
      }
    } catch (error) {
      setLoaderOpen(false);
      Swal.fire({
        title: "Error!",
        text: error.message || error,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  // const getAllDocList = async (params = {}) => {
  //   try {
  //     setLoading(true);

  //     // Set default values if not provided
  //     const defaultParams = {
  //       // MobileNo: "",
  //       Status: "1",
  //       // Page: 0,
  //       // Limit: 20,
  //     };

  //     const queryParams = { ...defaultParams, ...params };

  //     //  Only include SearchText if it has a value
  //     if (!queryParams.SearchText) {
  //       delete queryParams.SearchText;
  //     }

  //     const response = await axios.get(`${BASE_URL}DocUpload`, {
  //       params: queryParams,
  //     });

  //     if (response.data && response.data.values) {
  //       const { Page = 0, Limit = 20 } = queryParams;
  //       setDocumentlist(
  //         response.data.values.map((item, index) => ({
  //           ...item,
  //           id: Page * Limit + index + 1,
  //         }))
  //       );
  //       setTotalRows(response.data.count);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const getAllDocList = async (page = 0, searchText = "", limit = 20) => {
  try {
    setLoading(true);

    // Build query params
    const params = {
      Status: "1",
      Page: page,
      Limit: limit,
      ...(searchText ? { SearchText: searchText } : {}),
    };

    const response = await axios.get(`${BASE_URL}DocUpload`, { params });

    if (response.data && response.data.values) {
      setDocumentlist(
        response.data.values.map((item, index) => ({
          ...item,
          id: page * limit + index + 1, // generate unique id for DataGrid
        }))
      );
      setTotalRows(response.data.count);
    }
  } catch (error) {
    console.error("Error fetching documents:", error);
  } finally {
    setLoading(false);
  }
};

  const gazettedList = async (params = {}) => {
    setLoading(true);
    try {
      // Default parameters
      const queryParams = { Status: "1", ...params };

      // Fetch data
      const { data } = await axios.get(`${BASE_URL}GazOfficers`, {
        params: queryParams,
      });

      if (data.values) {
        setgazeteList(data.values);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (firstLoad.current) {
      getAllDocList();
      gazettedList();
      firstLoad.current = false;
    }
  }, []);

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
            maxWidth: 1100,
            Height: 1500,
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

            <Grid item xs={6} md={4}>
              <Controller
                name="Name"
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
                  <Tooltip title={field.value || ""} arrow placement="top">
                    <div style={{ width: "100%" }}>
                      <TextField
                        {...field}
                        inputRef={field.ref} // important for react-hook-form
                        label="ENTER NAME"
                        size="small"
                        inputProps={{ maxLength: 100 }}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </div>
                  </Tooltip>
                )}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <Controller
                name="MobileNo"
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

            <Grid item xs={6} md={4}>
              <Controller
                name="Email"
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
            <Grid item xs={6} md={4}>
              <Controller
                name="Address"
                control={control}
                render={({ field }) => (
                  <Tooltip title={field.value || ""} arrow placement="top">
                    <div style={{ width: "100%" }}>
                      <InputDescriptionField
                        {...field}
                        label="ENTER ADDRESS"
                        size="small"
                        fullWidth
                      />
                    </div>
                  </Tooltip>
                )}
              />
            </Grid>

            <Grid
              item
              xs={6}
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
            minHeight: "400px",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: (theme) => theme.palette.custome.datagridcolor,
            },
            "& .MuiDataGrid-row:hover": {
              boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)",
            },
          }}
          rows={Documentlist}
          // rows={dammyrows}
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
             getAllDocList(0, quickFilterValue, limit);
          }}
          getRowId={(row) => row.Id}
        />
      </Grid>
    </>
  );
};

export default UploadDocument;
