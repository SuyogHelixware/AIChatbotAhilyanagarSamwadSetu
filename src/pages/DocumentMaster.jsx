import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import dayjs from "dayjs";
import * as React from "react";
import { Controller, useForm } from "react-hook-form"; // Importing React Hook Form
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import { BASE_URL } from "../Constant";
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
  const [docOptions, setDocOptions] = React.useState([]);
  const [limit, setLimit] = React.useState(20);

  const originalDataRef = React.useRef(null);
  const firstLoad = React.useRef(true);

  //  ===============
  const [page, setPage] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [scrollLock, setScrollLock] = React.useState(false);
  // ============

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
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      NameEN: "",
      NameMR: "",
      Description: "",
      Status: 1,
    },
  });
  const isMainDoc = watch("IsMainDoc");

  const clearFormData = () => {
    if (ClearUpdateButton === "CLEAR") {
      reset({
        NameEN: "",
        NameMR: "",
        Description: "",
        Status: 1,
        IsMainDoc: false,
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

      setCreateSubDocRows(oldRows);
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
        IsMainDoc: formData.IsMainDoc,
              Status: formData.Status === false ? 0 : 1,


        SubDocs: CreateSubDocRows.filter((row) => row.NameMR).map(
          (row, index) => ({
            LineNum: 0,
            Id: 0,
            Status: 1,
            CreatedDate: dayjs().format("YYYY-MM-DD"),
            CreatedBy: sessionStorage.getItem("userId"),
            ModifiedDate: dayjs().format("YYYY-MM-DD"),
            ModifiedBy: sessionStorage.getItem("userId"),
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

  const CustomListBox = React.forwardRef(function CustomListBox(props, ref) {
    const { children, ...other } = props;

    const handleScroll = (event) => {
      const list = event.currentTarget;
      const bottom = list.scrollHeight - (list.scrollTop + list.clientHeight);

      if (bottom < 30 && !loading && hasMore && !scrollLock) {
        const nextPage = page + 1;
        setPage(nextPage);
        DocMasterListTemp(nextPage);
      }
    };

    return (
      <ul
        {...other}
        ref={ref}
        style={{ maxHeight: 250, overflow: "auto" }}
        onScroll={handleScroll}
      >
        {children}
      </ul>
    );
  });

  // const getAllDocumentList = async (page = 0, searchText = "") => {
  //   try {
  //     setLoading(true);

  //     const params = {
  //       Status: 1,
  //       Page: page,
  //        ...(limit ? { Limit: limit } : {}),
  //       ...(searchText ? { SearchText: searchText } : {}),
  //     };

  //     const response = await axios.get(`${BASE_URL}DocsMaster`, { params });
  //     if (response.data && response.data.values) {
  //       setDocumentData(
  //         response.data.values.map((item, index) => ({
  //           ...item,
  //           id: item.Id,
  //         }))
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getAllDocumentList = async (page = 0, searchText = "") => {
    try {
      setLoading(true);

      const apiPage = page;

      let apiUrl = `${BASE_URL}DocsMaster?Page=${apiPage}&Limit=${limit}`;
      if (searchText) {
        apiUrl = `${BASE_URL}DocsMaster?SearchText=${encodeURIComponent(
          searchText
        )}&Page=${apiPage}&Limit=${limit}`;
      }

      const response = await axios.get(apiUrl);

      if (response.data && response.data.values) {
        setDocumentData(
          response.data.values.map((item, index) => ({
            ...item,
            id: page * limit + index + 1,
          }))
        );

        setTotalRows(response.data.count || 0);
      } else {
        setDocumentData([]);
        setTotalRows(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (on) DocMasterListTemp(0);
  }, [on]);

  React.useEffect(() => {
    if (firstLoad.current) {
      getAllDocumentList();
      firstLoad.current = false;
    }
  }, []);
 
// React.useEffect(() => {
//   if (isMainDoc === true) {
//     setCreateSubDocRows([]);  
//   }
// }, [isMainDoc]);

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
      width: 80,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const page = params.api.state.pagination.paginationModel.page;
        const pageSize = params.api.state.pagination.paginationModel.pageSize;
        const rowIndex = params.api.getSortedRowIds().indexOf(params.id);
        return page * pageSize + (rowIndex + 1);
      },
    },

    //   {
    //   field: "srNo",
    //   headerName: "SR NO",
    //   width: 80,
    //   sortable: false,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) => params.row.id ?? "",
    // },

    {
      field: "IsMainDoc",
      headerName: "MAIN DOCUMENT",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Checkbox
          checked={params.value === true}
          color="success"
          size="medium"
          onChange={(e) => {
            const newValue = e.target.checked;
            params.api.setEditCellValue({
              id: params.id,
              field: "IsMainDoc",
              value: newValue,
            });
          }}
        />
      ),
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
     {
      field: "Status",
      headerName: "Status",
      width: 80,
      headerAlign: "center",
      align: "center",
      sortable: false,
      valueGetter: (params) =>
        params.row.Status === 1 ? "Active" : "Inactive",
      renderCell: (params) => {
        const isActive = params.row.Status === 1;
        return (
          <button
            style={isActive ? activeButtonStyle : inactiveButtonStyle}
            disabled
          >
            {isActive ? "Active" : "InActive"}
          </button>
        );
      },
    },
  ];

   const buttonStyles = {
    border: "none",
    borderRadius: "4px",
    padding: "4px 8px",
    fontSize: "12px",
    cursor: "pointer",
    color: "#fff",
    width: 55,
  };


    const activeButtonStyle = {
    ...buttonStyles,
    backgroundColor: "green",
  };

  const inactiveButtonStyle = {
    ...buttonStyles,
    backgroundColor: "#dc3545",
  };


  const [selectedDocs, setSelectedDocs] = React.useState([]);

  // ===== Delete Row =====
  const handleDeleteRow = (id) => {
    const deletedDoc = CreateSubDocRows.find((r) => r.id === id)?.NameMR;
    setCreateSubDocRows((prev) => prev.filter((r) => r.id !== id));
    if (deletedDoc) {
      setSelectedDocs((prev) => prev.filter((x) => x !== deletedDoc));
    }
  };

  const columnssubDoc = [
    {
      field: "srNo",
      headerName: "SR NO",
      width: 60,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const index = CreateSubDocRows.findIndex((r) => r.id === params.row.id);
        return index + 1;
      },
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

    // {
    //   field: "NameMR",
    //   headerName: "DOCUMENT NAME",
    //   width: 250,
    //   renderCell: (params) => {
    //     const currentValue = params.row.NameMR;

    //     const handleChange = (e) => {
    //       const newValue = e.target.value;

    //       // Update grid rows
    //       setCreateSubDocRows((prev) =>
    //         prev.map((r) =>
    //           r.id === params.row.id ? { ...r, NameMR: newValue } : r
    //         )
    //       );

    //       // Update selected documents list
    //       setSelectedDocs((prev) => {
    //         const withoutCurrent = prev.filter((x) => x !== currentValue);
    //         return [...withoutCurrent, newValue];
    //       });
    //     };

    //     // Filter dropdown (hide selected except current row value)
    //     const filteredOptions = docOptions.filter(
    //       (opt) => !selectedDocs.includes(opt.NameMR) || opt.NameMR === currentValue
    //     );

    //     return (
    //       <Tooltip title={params.value || ""}>
    //         <Select
    //           value={params.value || ""}
    //           onChange={handleChange}
    //           fullWidth
    //           variant="standard"
    //           MenuProps={{
    //             PaperProps: { style: { maxHeight: 200, maxWidth: 200 } },
    //           }}
    //           sx={{ minWidth: 250 }}
    //         >
    //           {filteredOptions.length > 0 ? (
    //             filteredOptions.map((opt, i) => (
    //               <MenuItem
    //                 key={i}
    //                 value={opt.NameMR}
    //                 sx={{
    //                   whiteSpace: "normal",
    //                   wordWrap: "break-word",
    //                   alignItems: "flex-start",
    //                 }}
    //               >
    //                 {opt.NameMR}
    //               </MenuItem>
    //             ))
    //           ) : (
    //             <MenuItem disabled>No options available</MenuItem>
    //           )}
    //         </Select>
    //       </Tooltip>
    //     );
    //   },
    // }

    // ========================
    {
      field: "NameMR",
      headerName: "DOCUMENT NAME",
      width: 250,
      renderCell: (params) => {
        const currentValue = params.row.NameMR;

        // Filter options to avoid duplicates
        const filteredOptions = docOptions.filter(
          (opt) =>
            !selectedDocs.includes(opt.NameMR) || opt.NameMR === currentValue
        );

        const handleChange = (e, newValue) => {
          if (!newValue) return;

          // Update grid rows
          setCreateSubDocRows((prev) =>
            prev.map((r) =>
              r.id === params.row.id ? { ...r, NameMR: newValue.NameMR } : r
            )
          );

          // Update selected documents list
          setSelectedDocs((prev) => {
            const withoutCurrent = prev.filter((x) => x !== currentValue);
            return [...withoutCurrent, newValue.NameMR];
          });
        };

        return (
          <Tooltip title={params.value || ""}>
            <Autocomplete
              disablePortal
              ListboxComponent={CustomListBox} //  Use custom scroll logic
              value={
                docOptions.find((opt) => opt.NameMR === currentValue) || null
              }
              onChange={handleChange}
              options={filteredOptions}
              getOptionLabel={(option) => option.NameMR}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Select..."
                />
              )}
              fullWidth
              sx={{ minWidth: 250 }}
            />
          </Tooltip>
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
        setValue("Description", Document.Description);
        setValue("Status", Document.Status);
        setValue("IsMainDoc", Document.IsMainDoc);
        setValue("Status", Document.Status);


        const subDocs = (Document.SubDocs || []).map((subDoc, index) => ({
          id: subDoc.LineNum || index + 1,
          ...subDoc,
        }));
        setCreateSubDocRows(subDocs);

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
        id: Date.now(),
        NameMR: "",
        Description: "",
        isDisabled: false,
      },
    ]);
  };

  const DocMasterListTemp = async (page = 0, excludeId = null) => {
    if (scrollLock || !hasMore) return;
    setScrollLock(true);
    setLoading(true);

    try {
      const { data } = await axios.get(`${BASE_URL}DocsMaster`, {
        params: { Status: "1", page },
      });

      const newDocs = data?.values || [];

      if (excludeId) {
        newDocs = newDocs.filter((doc) => Number(doc.Id) !== Number(excludeId));
      }

      if (newDocs.length === 0) {
        setHasMore(false);
        return;
      }

      setDocOptions((prev) => (page === 0 ? newDocs : [...prev, ...newDocs]));
    } catch (err) {
      console.error("Error fetching DocsMaster:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setScrollLock(false), 300);
    }
  };

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
      <Modal
        open={on}
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
              <Grid item xs={8}>
                <Controller
                  name="IsMainDoc"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value === true}
                          onChange={(e) =>
                            field.onChange(e.target.checked ? true : false)
                          }
                        />
                      }
                      label="Is Main Document"
                    />
                  )}
                />
              </Grid> 
                  <Grid
                              item
                              xs={6}
                              sm={4}
                              md={4}
                              display="flex"
                              alignItems="center"
                              justifyContent="flex-start"
                            >
                              <Controller
                                name="Status"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <FormControlLabel
                                    sx={{ ml: 1 }}
                                    control={
                                      <Checkbox
                                        {...field}
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        size="medium"
                                        color="primary"
                                      />
                                    }
                                    label="Active"
                                  />
                                )}
                              />
                            </Grid>
            </Grid>

            {/* ========================================================== */}
            {isMainDoc && (
              <>
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
              </>
            )}

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
        sx={{ height: "75vh", width: "100%" }}
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
          pagination
          paginationMode="server"
          rowCount={totalRows}
          pageSizeOptions={[limit]}
          paginationModel={{ page: currentPage, pageSize: limit }}
          onPaginationModelChange={(newModel) => {
            // update state and immediately fetch the correct page
            setCurrentPage(newModel.page);
            setLimit(newModel.pageSize);
            // fetch new page with current searchText (use the state value)
            getAllDocumentList(newModel.page, searchText);
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
