import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import Swal from "sweetalert2";

// import { CheckboxInputs, InputDescriptionField } from "../components/Component";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useTheme } from "@mui/styles";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form"; // Importing React Hook Form
import Loader from "../../components/Loader";
import { BASE_URL } from "../../Constant";
import { useThemeMode } from "../../Dashboard/Theme";

const Rehabilitation = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [DocumentData, setDocumentData] = React.useState([]);
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [ClearUpdateButton, setClearUpdateButton] = React.useState("RESET");
  const [totalRows, setTotalRows] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const limit = 20;
  const originalDataRef = React.useRef(null);
  const firstLoad = React.useRef(true);

  const [CreateSubDocRows, setCreateSubDocRows] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const theme = useTheme();

  const { checkAccess } = useThemeMode();

  const canAdd = checkAccess(11, "IsAdd");
  const canEdit = checkAccess(11, "IsEdit");
  const canDelete = checkAccess(11, "IsDelete");

  const [DammyData, setDammyData] = React.useState([
    { id: 1, NameMR: "Driving License", isNew: false },
    { id: 2, NameMR: "Aadhar Card", isNew: false },
    { id: 3, NameMR: "Pan Card", isNew: false },
    { id: "custom-1", NameMR: "", isNew: true },
  ]);

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      NameEN: "",
      NameMR: "",
      Remark: "",
      MobileNo: "",
      Status: 1,
    },
  });
  const clearFormData = () => {
    if (ClearUpdateButton === "CLEAR") {
      reset({
        NameEN: "",
        NameMR: "",
        MobileNo: "",
        Remark: "",
        Status: 1,
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
    clearFormData();
    setValue("NameEN", "");
    setValue("NameMR", "");
    setValue("MobileNo", "");
    setValue("Remark", "");
    setOn(true);
    setCreateSubDocRows([]);
  };

  const validationAlert = (message) => {
    Swal.fire({
      position: "center",
      icon: "warning",
      toast: true,
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleSubmitForm = async (formData) => {
    try {
      const requiredFields = ["NameEN", "MobileNo"];
      const emptyRequiredFields = requiredFields.filter(
        (field) => !formData[field]?.trim()
      );

      if (emptyRequiredFields.length > 0) {
        validationAlert("Please fill in all required fields");
        return;
      }

      // 🔹 Validate DataGrid checked rows (selectedRows)
      const emptyCheckedRows = DammyData.filter(
        (row) => selectedRows.includes(row.id) && !row.NameMR?.trim()
      );

      if (emptyCheckedRows.length > 0) {
        validationAlert("Please Type issue for selected rows");
        return;
      }

      const payload = {
        Id: null || formData.Id,
        CreatedDate: dayjs().format("YYYY-MM-DD"),
        CreatedBy: sessionStorage.getItem("userId"),
        ModifiedBy: sessionStorage.getItem("userId"),
        ModifiedDate: dayjs().format("YYYY-MM-DD"),
        NameEN: formData.NameEN,
        NameMR: formData.NameMR,
        Remark: formData.Remark || "",
        MobileNo: formData.MobileNo || "",
        Status: formData.Status || "1",

        SubDocs: CreateSubDocRows.filter((row) => row.NameMR).map(
          (row, index) => ({
            LineNum: 0,
            Id: 0,
            Status: 1,
            CreatedDate: dayjs().format("YYYY-MM-DD"),
            CreatedBy: sessionStorage.getItem("userId"),
            ModifiedDate: dayjs().format("YYYY-MM-DD"),
            ModifiedBy: sessionStorage.getItem("userId"),
            // NameEN: row.NameMR,
            NameEN: row.NameEN,
            NameMR: row.NameMR,
            MobileNo: row.MobileNo,
            Remark: row.Remark || "",
          })
        ),
      };
      let response;

      if (SaveUpdateButton === "SAVE") {
        setLoaderOpen(true);
        response = await axios.post(`${BASE_URL}DocsMastertemp`, payload);
      } else {
        if (!formData.Id) {
          Swal.fire({
            position: "center",
            icon: "error",
            toast: true,
            title: "Update Failed",
            text: "Invalid Document ID",
            showConfirmButton: true,
          });
          return;
        }

        const result = await Swal.fire({
          text: "Do you want to Update...?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Update it!",
        });

        if (!result.isConfirmed) {
          return;
        }

        setLoaderOpen(true);
        response = await axios.put(
          `${BASE_URL}DocsMaster/${formData.Id}`,
          payload
        );
      }

      setLoaderOpen(false);

      if (response.data.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          toast: true,
          title:
            SaveUpdateButton === "SAVE"
              ? "Document Added Successfully"
              : "Document Updated Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        handleClose();

        getAllDocumentList(currentPage, searchText);
      } else {
        throw new Error(response.data.message || "Unexpected error");
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
  };

  const getAllDocumentList = async (page = 0, searchText = "") => {
    try {
      setLoading(true);

      const params = {
        Status: 1,
        Page: page,
        ...(limit ? { Limit: limit } : {}),
        ...(searchText ? { SearchText: searchText } : {}),
      };

      const response = await axios.get(`${BASE_URL}DocsMastertemp`, { params });
      //   if (response.data && response.data.values) {
      //     setDocumentData(
      //       response.data.values.map((item, index) => ({
      //         ...item,
      //         id: item.Id || index + 1,
      //       }))
      //     );
      //   }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (firstLoad.current) {
      getAllDocumentList();
      firstLoad.current = false;
    }
  }, []);

  // =========================

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
            `${BASE_URL}DocsMaster/${rowData.Id}`
          );
          setLoaderOpen(false);
          if (response.data && response.data.success) {
            Swal.fire({
              position: "center",
              icon: "success",
              toast: true,
              title: "Document deleted successfully",
              showConfirmButton: false,
              timer: 1500,
            });

            getAllDocumentList(currentPage, searchText);
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

  const columns = [
    // {
    //   field: "actions",
    //   headerName: "Action",
    //   width: 150,
    //   headerAlign: "center",
    //   align: "center",
    //   sortable: false,
    //   renderCell: (params) => (
    //     <strong>
    //       <IconButton
    //         color="primary"
    //         sx={{
    //           color: "rgb(0, 90, 91)",
    //           "&:hover": {
    //             backgroundColor: "rgba(0, 90, 91, 0.1)",
    //           },
    //         }}
    //         onClick={() => handleUpdate(params.row)}
    //       >
    //         <EditNoteIcon />
    //       </IconButton>
    //       <Button
    //         size="medium"
    //         sx={{ color: "red" }}
    //         onClick={() => handleDelete(params.row)}
    //       >
    //         <DeleteForeverIcon />
    //       </Button>
    //     </strong>
    //   ),
    // },
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <strong>
          <Tooltip
            title={!canEdit ? "You don't have Edit permission" : ""}
            placement="top"
          >
            <span>
              <IconButton
                color="primary"
                disabled={!canEdit}
                sx={{
                  color: canEdit ? "#2196F3" : "grey",
                  "&:hover": {
                    backgroundColor: canEdit
                      ? "rgba(0, 90, 91, 0.1)"
                      : "transparent",
                  },
                }}
                onClick={() => handleUpdate(params.row)}
              >
                <EditOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip
            title={!canDelete ? "You don't have Delete permission" : ""}
            placement="top"
          >
            <span>
              <Button
                size="medium"
                disabled={!canDelete}
                sx={{ color: canDelete ? "red" : "grey" }}
                onClick={() => handleDelete(params.row)}
              >
                <DeleteOutlineOutlinedIcon />
              </Button>
            </span>
          </Tooltip>
        </strong>
      ),
    },

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
      field: "NameEN",
      headerName: "NAME",
      width: 200,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Tooltip title={params.value || ""} arrow placement="top-start">
          <Typography
            noWrap
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "NameMR",
      headerName: "CONTACT NUMBER",
      width: 300,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Tooltip title={params.value || ""} arrow placement="top-start">
          <Typography
            noWrap
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },

    {
      field: "Remark",
      headerName: "REMARK",
      width: 500,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title={params.value || ""} arrow placement="top-start">
          <Typography
            noWrap
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
  ];

  const columnssubDoc = [
    {
      field: "srNo",
      headerName: "SR NO",
      width: 90,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.api.getSortedRowIds().indexOf(params.id) + 1,
    },

    {
      field: "NameMR",
      headerName: "ISSUES ",
      flex: 1,
      sortable: false, // ⛔ disable sorting here
      alignItems: "center",
      renderCell: (params) => {
        const { row } = params;
        if (row.isNew) {
          return (
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={row.NameMR || ""}
              placeholder="Type Custom Issue..."
              onChange={(e) =>
                handleInputChange(row.id, "NameMR", e.target.value)
              }
              onKeyDown={(e) => {
                // ✅ Allow typing space by preventing grid from hijacking it
                if (e.key === " ") {
                  e.stopPropagation();
                }
              }}
            />
          );
        }

        return (
          <div style={{ opacity: 0.7, padding: "6px 8px" }}>{row.NameMR}</div>
        );
      },
    },
  ];

  const handleUpdate = async (rowData) => {
    setSaveUpdateButton("UPDATE");
    setClearUpdateButton("RESET");
    setOn(true);
    try {
      setLoading(true);
      const apiUrl = `${BASE_URL}DocsMaster/${rowData.Id}`;
      const response = await axios.get(apiUrl);
      if (response.data.values) {
        const Document = response.data.values;
        originalDataRef.current = Document;
        setValue("Id", Document.Id);
        setValue("NameEN", Document.NameEN);
        setValue("NameMR", Document.NameMR);
        setValue("Remark", Document.Remark);
        setValue("Status", Document.Status);

        const subDocs = (Document.SubDocs || []).map((subDoc, index) => ({
          id: subDoc.id || subDoc.DocEntry || index + 1,
          ...subDoc,
        }));

        setCreateSubDocRows(subDocs);
      }
    } catch (error) {
      console.error("Error fetching Document data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = () => {
    setDammyData((prevRows) => [
      ...prevRows,
      {
        id: Date.now(), // unique id
        NameMR: "",
        isNew: true, // editable only for this
      },
    ]);
  };
  const handleInputChange = (id, field, value) => {
    setDammyData((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
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
            maxWidth: 500,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            justifyContent: "center",
            overflow: "auto",
            maxHeight: "90vh",
          }}
        >
          <Grid
            container
            component="form"
            spacing={3}
            padding={3}
            flexDirection="column"
            onSubmit={handleSubmit(handleSubmitForm)}
          >
            {/* HEADER */}
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight="bold" textAlign={"center"}>
                REHABILITATION
              </Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>

            {/* FORM FIELDS */}
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={12} sm={6} lg={6}>
                <Controller
                  name="NameEN"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="NAME"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={6}>
                <Controller
                  name="MobileNo"
                  control={control}
                  rules={{
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter a valid 10-digit number",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label=" ENTER MOBILE NO"
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

              <Grid item xs={12}>
                <Controller
                  name="Remark"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label="REMARK"
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>

            {/* ========================================================== */}
            <Grid item xs={12} display="flex" alignItems="center">
              <Button
                variant="outlined"
                size="small"
                sx={{
                  height: "36px",
                  color: "#2196F3",
                  border: "1px solid #2196F3",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "rgba(0,90,91,0.1)",
                  },
                }}
                onClick={handleAddRow}
              >
                <AddIcon />
                Add Row
              </Button>
            </Grid>

            {/* DATAGRID SECTION */}

            <div style={{ height: 300 }}>
              <DataGrid
                className="datagrid-style"
                rows={DammyData}
                columns={columnssubDoc}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onRowSelectionModelChange={(newSelection) =>
                  setSelectedRows(newSelection)
                }
                checkboxSelection
                hideFooter
                getRowId={(row) => row.id}
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: (theme) =>
                      theme.palette.custome?.datagridcolor || "#f5f5f5",
                  },
                  "& .MuiDataGrid-row:hover": {
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                  },
                }}
              />
            </div>

            {/* ======================================== */}
            <Grid item xs={12} sm={12}></Grid>
            <Grid
              item
              xs={12}
              md={12}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                position: "absolute",
                bottom: 10,
                left: 10,
                right: 10,
                mt: "10px",
              }}
            >
              <Button
                size="small"
                onClick={() => clearFormData()}
                sx={{
                  p: 1,
                  width: 80,
                  color: "#2196F3",
                  background: "transparent",
                  border: "1px solid #2196F3",
                  borderRadius: "8px",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    background: "#2196F3",
                    transform: "translateY(2px)",
                  },
                }}
              >
                {ClearUpdateButton}
              </Button>
              <Button
                type="submit"
                size="small"
                sx={{
                  marginTop: 1,
                  p: 1,
                  width: 80,
                  color: "white",
                  backgroundColor: theme.palette.Button.background,

                  boxShadow: 5,
                  "&:hover": {
                    transform: "translateY(2px)",
                    backgroundColor: theme.palette.Button.background,
                  },
                }}
              >
                {SaveUpdateButton}
              </Button>
            </Grid>
            {/* </form> */}
            <Grid />
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
          Rehabilitation
        </Typography>
      </Grid>
      <Grid container spacing={2} marginBottom={1} justifyContent="flex-end">
        <Grid textAlign={"end"} marginBottom={1}>
          <Tooltip
            title={!canAdd ? "You don't have Add permission" : ""}
            placement="top"
          >
            <span>
              <Button
                onClick={handleOnSave}
                disabled={!canAdd}
                type="text"
                size="medium"
                sx={{
                  pr: 2,
                  mb: 0,
                  mt: 2,
                  color: "white",
                  backgroundColor: theme.palette.Button.background,
                  borderRadius: "8px",
                  transition: "all 0.2s ease-in-out",
                  backgroundColor: theme.palette.Button.background,
                  "&:hover": {
                    //  boxShadow: "0 2px 4px rgba(0, 90, 91, 0.2)",

                    transform: canAdd ? "translateY(2px)" : "none",
                    backgroundColor: theme.palette.Button.background,
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
                Add Rehabilitation
              </Button>
            </span>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid
        container
        item
        lg={12}
        component={Paper}
        sx={{ height: "74vh", width: "100%" }}
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
          rows={DocumentData}
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
            // getAllImgList(newModel.page, searchText);
            getAllDocumentList();
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
          disableRowSelectionOnClick
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

            getAllDocumentList(0, quickFilterValue);
          }}
          getRowId={(row) => row.Id}
        />
      </Grid>
    </>
  );
};

export default Rehabilitation;
