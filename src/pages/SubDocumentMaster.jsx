import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
import Loader from "../components/Loader";
import { BASE_URL } from "../Constant";
import { useThemeMode } from "../Dashboard/Theme";
import { useTheme } from "@mui/styles";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const SubDocumentMaster = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [DocumentData, setDocumentData] = React.useState([]);
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [ClearUpdateButton, setClearUpdateButton] = React.useState("RESET");
  const [totalRows, setTotalRows] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [limit, setLimit] = React.useState(20);
  const originalDataRef = React.useRef(null);
  const firstLoad = React.useRef(true);
  const selectedSubDocsRef = React.useRef([]);
  const scrollRef = React.useRef(null);
  const [SubPage, setSubPage] = React.useState(0);
  const [hasSubMore, setSubHasMore] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [searchSubText, setSearchSubText] = React.useState("");
    const theme = useTheme();

  const { checkAccess } = useThemeMode();
  const canAdd = checkAccess(5, "IsAdd");
  const canEdit = checkAccess(5, "IsEdit");
  const canDelete = checkAccess(5, "IsDelete");
   
  

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    getValues,
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
     }

    if (ClearUpdateButton === "RESET") {
      const old = originalDataRef.current;
      if (!old) return;
      reset(old);
    }
  };

  const handleClose = () => {
    setOn(false);
  };

  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setClearUpdateButton("CLEAR");
    clearFormData();
    setValue("NameEN", "");
    setValue("NameMR", "");
    setValue("Description", "");
    setOn(true);
     setValue("IsMainDoc", false);
    resetTableAndFetch();
    setRows([]);
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

        SubDocs: rows
          .filter((row) => row.isChecked === true)
          .map((row) => ({
            LineNum: 0,
            Id: 0,
            Status: 1,
            CreatedDate: dayjs().format("YYYY-MM-DD"),
            CreatedBy: sessionStorage.getItem("userId"),
            ModifiedDate: dayjs().format("YYYY-MM-DD"),
            ModifiedBy: sessionStorage.getItem("userId"),
            NameEN: row.NameEN,
            NameMR: row.NameMR,
            Description: row.Description,
          })),
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
        text: error.message,
        showConfirmButton: true,
      });
    }
  };

  const getAllDocumentList = async (page = 0, searchText = "") => {
    try {
      setLoading(true);

      const apiPage = page;

      let apiUrl = `${BASE_URL}DocsMaster?Page=${apiPage}&Limit=${limit}&IsMainDoc=${false}`;
      if (searchText) {
        apiUrl = `${BASE_URL}DocsMaster?SearchText=${encodeURIComponent(
          searchText
        )}&Page=${apiPage}&Limit=${limit}&IsMainDoc=${false}`;
      }

      const response = await axios.get(apiUrl);

      if (response.data && response.data.values) {
        // setDocumentData(
        //   response.data.values.map((item, index) => ({
        //     ...item,
        //     id: page * limit + index + 1,
        //   }))
        // );

        // setTotalRows(response.data.count || 0);
        const allData = response.data.values.map((item, index) => ({
          ...item,
          id: page * limit + index + 1,
        }));
        setDocumentData(allData.filter((x) => x.IsMainDoc === false));

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
    if (firstLoad.current) {
      getAllDocumentList();
      firstLoad.current = false;
    }
  }, []);

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

  const renderTooltipText = (params) => (
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
  );

  const columns = [
    {
      field: "actions",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      sortable: false,

      minWidth: 90,
      maxWidth: 110,
      flex: 0.3,
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
                  color: "#2196F3",
                  "&:hover": {
                    backgroundColor: "rgba(0, 90, 91, 0.1)",
                  },
                }}
                onClick={() => handleUpdate(params.row)}
                disabled={!canEdit}
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
                sx={{ color: "red" }}
                onClick={() => handleDelete(params.row)}
                disabled={!canDelete}
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
      sortable: false,
      headerAlign: "center",
      align: "center",

      minWidth: 65,
      maxWidth: 80,
      flex: 0.2,
      renderCell: (params) => {
        const page = params.api.state.pagination.paginationModel.page;
        const pageSize = params.api.state.pagination.paginationModel.pageSize;
        const rowIndex = params.api.getSortedRowIds().indexOf(params.id);
        return page * pageSize + (rowIndex + 1);
      },
    },

    {
      field: "NameEN",
      headerName: "DOCUMENT NAME",
      minWidth: 250,
      flex: 1.2,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: renderTooltipText,

      // renderCell: (params) => (
      //   <Tooltip title={params.value || ""} arrow placement="top-start">
      //     <Typography
      //       noWrap
      //       sx={{
      //         overflow: "hidden",
      //         textOverflow: "ellipsis",
      //         whiteSpace: "nowrap",
      //         width: "100%",
      //       }}
      //     >
      //       {params.value}
      //     </Typography>
      //   </Tooltip>
      // ),
    },
    {
      field: "NameMR",
      headerName: "DOCUMENT NAME MARATHI",
      minWidth: 250,
      flex: 1.2,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: renderTooltipText,
      // renderCell: (params) => (
      //   <Tooltip title={params.value || ""} arrow placement="top-start">
      //     <Typography
      //       noWrap
      //       sx={{
      //         overflow: "hidden",
      //         textOverflow: "ellipsis",
      //         whiteSpace: "nowrap",
      //         width: "100%",
      //       }}
      //     >
      //       {params.value}
      //     </Typography>
      //   </Tooltip>
      // ),
    },

    {
      field: "Description",
      headerName: "DOCUMENT DESCRIPTION",
      minWidth: 350,
      flex: 1.8,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: renderTooltipText,
    },
    {
      field: "Status",
      headerName: "Status",
      minWidth: 80,
      maxWidth: 100,
      flex: 0.3,
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

  const toggleCheck = (row) => {
    setRows((prev) =>
      prev.map((r) => (r.Id === row.Id ? { ...r, isChecked: !r.isChecked } : r))
    );
    if (selectedSubDocsRef.current.includes(row.NameMR)) {
      selectedSubDocsRef.current = selectedSubDocsRef.current.filter(
        (x) => x !== row.NameMR
      );
    } else {
      selectedSubDocsRef.current.push(row.NameMR);
    }
  };

  const handleUpdate = async (rowData) => {
    setSaveUpdateButton("UPDATE");
    setClearUpdateButton("RESET");
    setOn(true);
    setSearchText("");
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
        const existingNames = (Document.SubDocs || []).map((s) => s.NameMR);
        selectedSubDocsRef.current = existingNames;
         setRows([]);
        setSubPage(0);
        setSubHasMore(true);

        const newRows = await HandleSubDocs(0, null);
        const updatedRows = newRows.map((r) => ({
          ...r,
          isChecked: existingNames.includes(r.NameMR),
        }));

        setRows(updatedRows);
      }
    } catch (error) {
      console.error("Error fetching Document data:", error);
    } finally {
      setLoading(false);
    }
  };

  const HandleSubDocs = async (pageNo, search = searchSubText) => {
    if (loading) return [];
    setLoading(true);
    try {
      const apiUrl = `${BASE_URL}DocsMaster?Status=1&Limit=${limit}&Page=${pageNo}${
        search ? `&SearchText=${encodeURIComponent(search)}` : ""
      }`;
      const response = await axios.get(apiUrl);

      let newData = response.data.values || [];
      const currentDocId = getValues("Id");
      newData = newData.filter((d) => d.Id !== currentDocId);

      if (newData.length === 0) {
        setSubHasMore(false);
        return [];
      }

      newData = newData.map((item, idx) => ({
        ...item,
        id: pageNo * limit + idx + 1,
        isChecked: selectedSubDocsRef.current.includes(item.NameMR),
      }));

      setRows((prev) => [...prev, ...newData]);
      setSubPage(pageNo + 1);

      return newData;
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || loading || !hasSubMore) return;

    const isBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 30;

    if (isBottom) {
      HandleSubDocs(SubPage);
    }
  };

  const resetTableAndFetch = (text) => {
    setRows([]);
    setSubPage(0);
    setSubHasMore(true);
    setSearchSubText(text);

    setTimeout(() => HandleSubDocs(0, text), 0);
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
            maxWidth: 700,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            justifyContent: "center",
            overflow: "auto",
            maxHeight: "100vh",
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
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            field.onChange(isChecked);
                            if (isChecked) {
                              setRows((prev) =>
                                prev.map((r) => ({ ...r, isChecked: false }))
                              );
                              selectedSubDocsRef.current = [];
                            }
                          }}
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 24,
                              fontWeight: "bold",
                            },
                            "&.Mui-checked .MuiSvgIcon-root": {
                              fontWeight: "bold",
                            },
                          }}
                        />
                      }
                      label={
                        <span style={{ fontWeight: "bold" }}>
                          Is Main Document
                        </span>
                      }
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
                      label={<span style={{ fontWeight: "bold" }}>Active</span>}
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          size="medium"
                          color="primary"
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 26,
                              fontWeight: 700,
                            },
                          }}
                        />
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* ========================================================== */}
            {isMainDoc && (
              <>
                {/* SEARCH BOX */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 1,
                    px: 1,
                  }}
                >
                  <TextField
                    placeholder="Search Document..."
                    value={searchSubText}
                    onChange={(e) => resetTableAndFetch(e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "#777" }} />
                        </InputAdornment>
                      ),
                      endAdornment: searchSubText && (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => resetTableAndFetch("")}
                            edge="end"
                            size="small"
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: "8px", paddingRight: "4px" },
                    }}
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "280px",
                        md: "300px",
                      },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Box>

                <Box
                  ref={scrollRef}
                  onScroll={handleScroll}
                  sx={{
                    height: { xs: 250, sm: 350, md: 400 },
                    width: "100%",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    maxWidth: "100%",
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "13px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          SR NO
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "13px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          SELECT
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "13px",
                            textAlign: "center",
                            paddingRight: { xs: 0, md: "80px" },
                            whiteSpace: "nowrap",
                          }}
                        >
                          DOCUMENT NAME
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {rows.map((row, i) => (
                        <TableRow
                          key={row.id}
                          sx={{
                            "& .MuiTableCell-root": { padding: "9px 15px" },
                          }}
                        >
                          <TableCell>{i + 1}</TableCell>

                          <TableCell>
                            <Checkbox
                              checked={row.isChecked || false}
                              onChange={() => toggleCheck(row)}
                            />
                          </TableCell>

                          <TableCell
                            onClick={() => toggleCheck(row)}
                            sx={{ cursor: "pointer" }}
                          >
                            <Tooltip title={row.NameMR || ""}>
                              <span>{row.NameMR}</span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}

                      {loading && (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            Loading...
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </>
            )}

            {/* =====================Footer=================== */}
            <Grid
              item
              xs={12}
              md={12}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                position: "sticky",
                borderTop: "1px solid #ddd",
                zIndex: 20,
                bottom: 2,
                left: 5,
                right: 0,
              }}
            >
              <Button
                size="small"
                onClick={() => clearFormData()}
               sx={{
                  p: 1,
                  width: 80,
                  background: "transparent",
                  color: "#2196F3",
                  border: "1px solid #2196F3",
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
      {/* <Grid
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
      </Grid> */}
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
                               boxShadow: "0 2px 4px Solid red",
                               "&:hover": {
                                 transform: "translateY(2px)",
                                 backgroundColor: theme.palette.Button.background,
                                 // backgroundColor: (theme) => theme.palette.custome.datagridcolor
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
                Add Sub Document
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
        sx={{ height: "65vh", width: "100%" }}
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
          rows={DocumentData}
          columns={columns}
          pagination
          paginationMode="server"
          rowCount={totalRows}
          pageSizeOptions={[limit]}
          paginationModel={{ page: currentPage, pageSize: limit }}
          onPaginationModelChange={(newModel) => {
            setCurrentPage(newModel.page);
            setLimit(newModel.pageSize);
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
export default SubDocumentMaster;
