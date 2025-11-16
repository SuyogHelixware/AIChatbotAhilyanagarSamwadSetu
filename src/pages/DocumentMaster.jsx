import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
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
import { BASE_URL } from "../Constant";
import Loader from "../components/Loader";
import { useThemeMode } from "../Dashboard/Theme";

const DocumentMaster = () => {
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

  const { checkAccess } = useThemeMode();

  const canAdd = checkAccess(5, "IsAdd");
  const canEdit = checkAccess(5, "IsEdit");
  const canDelete = checkAccess(5, "IsDelete");

  const [CreateSubDocRows, setCreateSubDocRows] = React.useState([
    {
      id: Date.now(),
      NameMR: "",
      srNo: "",
      isDisabled: false,
    },
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
      Description: "",
      Status: 1,
    },
  });
  const clearFormData = () => {
    if (ClearUpdateButton === "CLEAR") {
      reset({
        NameEN: "",
        NameMR: "",
        Description: "",
        Status: 1,
        CreateSubDocRows: [],
      });
      setCreateSubDocRows([]);
    }
    // if (ClearUpdateButton === "RESET") {
    //   reset(originalDataRef.current);

    // }
    if (ClearUpdateButton === "RESET") {
      const old = originalDataRef.current;
      if (!old) return;

      // Restore form fields
      reset(old);

      // Restore datagrid rows
      const oldRows = (old.SubDocs || []).map((s, index) => ({
        id: s.LineNum || index + 1,
        ...s,
      }));

      setCreateSubDocRows(oldRows); // 🔥 Important
    }
  };

  const handleClose = () => setOn(false);

  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setClearUpdateButton("CLEAR");
    clearFormData();
    setValue("NameEN", "");
    setValue("NameMR", "");
    setValue("Description", "");

    setOn(true);

    setCreateSubDocRows([
      {
        id: Date.now(),
        NameMR: "",
        srNo: "",
        isDisabled: false,
      },
    ]);
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
      const requiredFields = ["NameEN", "NameMR"];
      const emptyRequiredFields = requiredFields.filter(
        (field) => !formData[field]?.trim()
      );

      if (emptyRequiredFields.length > 0) {
        validationAlert("Please fill in all required fields");
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
        Description: formData.Description || "",
        Status: formData.Status || "1",

        SubDocs: CreateSubDocRows.filter((row) => row.NameMR).map(
          (row, index) => ({
            // LineNum: index + 1,
            LineNum: 0,

            Id: 0,
            Status: 1,
            CreatedDate: dayjs().format("YYYY-MM-DD"),
            CreatedBy: sessionStorage.getItem("userId"),
            ModifiedDate: dayjs().format("YYYY-MM-DD"),
            ModifiedBy: sessionStorage.getItem("userId"),
            // NameEN: row.NameMR,
            NameEN: "",
            NameMR: row.NameMR,
            Description: row.Description || "",
          })
        ),
      };
      let response;

      if (SaveUpdateButton === "SAVE") {
        setLoaderOpen(true);
        response = await axios.post(`${BASE_URL}DocsMaster`, payload);
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

      const response = await axios.get(`${BASE_URL}DocsMaster`, { params });
      if (response.data && response.data.values) {
        setDocumentData(
          response.data.values.map((item, index) => ({
            ...item,
            id: item.Id,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    if (on) DocMasterListTemp();
  }, [on]);

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
                sx={{
                  color: "rgb(0, 90, 91)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 90, 91, 0.1)",
                  },
                }}
                onClick={() => handleUpdate(params.row)}
                            disabled={!canEdit}

              >
                <EditNoteIcon />
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
                sx={{ color: "red" }}
                onClick={() => handleDelete(params.row)}
                            disabled={!canDelete}

              >
                <DeleteForeverIcon />
              </Button>
            </span>
          </Tooltip>
        </strong>
      ),
    },

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
      field: "NameEN",
      headerName: "DOCUMENT NAME",
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
      field: "NameMR",
      headerName: "DOCUMENT NAME MARATHI",
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
      field: "Description",
      headerName: "DOCUMENT DESCRIPTION",
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
  // ===== Delete Row =====
  const handleDeleteRow = (id) => {
    setCreateSubDocRows((prev) => prev.filter((r) => r.id !== id));
  };

  const columnssubDoc = [
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
      field: "actions",
      headerName: "Action",
      width: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Button
          size="small"
          sx={{ color: "red" }}
          onClick={() => handleDeleteRow(params.row.id)}
        >
          <DeleteForeverIcon />
        </Button>
      ),
    },

    {
      field: "NameMR",
      headerName: "DOCUMENT NAME",
      width: 250,
      renderCell: (params) => {
        const handleChange = (e) => {
          const newValue = e.target.value;
          setCreateSubDocRows((prev) =>
            prev.map((r) =>
              r.id === params.row.id ? { ...r, NameMR: newValue } : r
            )
          );
        };

        return (
          <Tooltip title={params.value || ""}>
            <Select
              value={params.value || ""}
              onChange={handleChange}
              fullWidth
              variant="standard"
              MenuProps={{
                PaperProps: { style: { maxHeight: 200 } },
              }}
            >
              {docOptions.length > 0 ? (
                docOptions.map((opt, i) => (
                  <MenuItem key={i} value={opt.NameMR}>
                    {opt.NameMR}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No options available</MenuItem>
              )}
            </Select>
          </Tooltip>
        );
      },
    },
  ];
  const [docOptions, setDocOptions] = React.useState([]);

  // 3️⃣ When updating a record, remember its Id and then fetch the list
  // ✅ Load document by Id for editing
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

        // ✅ store current editing doc Id
        // setCurrentDocId(Document.Id);

        // ✅ set form fields
        setValue("Id", Document.Id);
        setValue("NameEN", Document.NameEN);
        setValue("NameMR", Document.NameMR);
        setValue("Description", Document.Description);
        setValue("Status", Document.Status);

        // ✅ map sub docs
        const subDocs = (Document.SubDocs || []).map((subDoc, index) => ({
          id: subDoc.LineNum || index + 1,
          ...subDoc,
        }));
        setCreateSubDocRows(subDocs);

        // ✅ now fetch all other docs EXCLUDING this one
        await DocMasterListTemp(Document.Id);
      }
    } catch (error) {
      console.error("Error fetching Document data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = () => {
    setCreateSubDocRows((prevRows) => [
      ...prevRows,
      {
        id: prevRows.length + 1,
        DocName: "",
        Description: "",
        isDisabled: false,
      },
    ]);
  };

  const DocMasterListTemp = async (excludeId = null) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}DocsMaster`, {
        params: { Status: "1" },
      });

      if (data?.values) {
        const filteredDocs = excludeId
          ? data.values.filter((doc) => Number(doc.Id) !== Number(excludeId))
          : data.values;

        setDocOptions(filteredDocs);
      }
    } catch (error) {
      console.error("Error fetching DocsMaster:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
      <Modal
        open={on}
        onClose={handleClose}
        sx={{
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: 450,
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
                DOCUMENT NAME
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
                      label="DOCUMENT NAME (ENGLISH)"
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
                  name="NameMR"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="DOCUMENT NAME (MARATHI)"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="Description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label="DESCRIPTION"
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>

            {/* ========================================================== */}
            <Grid
              item
              xs={12}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mt: 2 }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="rgb(0, 90, 91)"
              >
                ADD SUB DOCUMENTS LIST
              </Typography>

              <Button
                variant="outlined"
                size="small"
                sx={{
                  height: "36px",
                  color: "rgb(0, 90, 91)",
                  border: "1px solid rgb(0, 90, 91)",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "rgba(0,90,91,0.1)",
                  },
                }}
                onClick={handleAddRow}
              >
                Add Document Row
              </Button>
            </Grid>

            {/* DATAGRID SECTION */}

            <div style={{ height: 300 }}>
              <DataGrid
                className="datagrid-style"
                rows={CreateSubDocRows}
                columns={columnssubDoc}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableRowSelectionOnClick
                hideFooter
                onRowClick={(params, event) => {
                  if (params.row.isDisabled) event.stopPropagation();
                }}
                getRowId={(row) =>
                  row.DocEntry ||
                  row.id ||
                  `${row.NameMR}-${row.NameEN}-${Math.random()}`
                }
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
                bottom: 5,
                left: 10,
                right: 10,
                // mt: "10px",
              }}
            >
              <Button
                size="small"
                onClick={() => clearFormData()}
                sx={{
                  p: 1,
                  width: 80,
                  color: "rgb(0, 90, 91)",
                  background: "transparent",
                  border: "1px solid rgb(0, 90, 91)",
                  borderRadius: "8px",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    background: "rgba(0, 90, 91, 0.1)",
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
                  background:
                    "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                  boxShadow: 5,
                  "&:hover": {
                    transform: "translateY(2px)",
                    boxShadow: "0 2px 4px rgba(0, 90, 91, 0.2)",
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
          Manage Documents
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
            </span>
          </Tooltip>
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

export default DocumentMaster;
