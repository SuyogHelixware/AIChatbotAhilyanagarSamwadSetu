import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoIcon from "@mui/icons-material/Info";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { InputTextFieldTitle } from "../components/Component";
import Loader from "../components/Loader";
import { BASE_URL } from "../Constant";

export default function UserCreation() {
  const theme = useTheme();
  const [loaderOpen, setLoaderOpen] = useState(false);
  const hasFetched = useRef(false);
  const [allTemplates, setAllTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [openMobileModal, setOpenMobileModal] = useState(false);
  const [newMobile, setNewMobile] = useState("");
  const [status, setStatus] = useState(1);
  const [mobileRows, setMobileRows] = useState([]);
  const [newName, setNewName] = useState("");
  const [isEdit, setIsEdit] = useState("SAVE");
  const [inputValue, setInputValue] = useState("");
  const [paramValues, setParamValues] = useState({});
  const [PrevDocEntry, setPrevDocEntry] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchTextList, setSearchTextList] = useState("");

  // --------Sidebar -----------------------------------
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  // --------------------------------------------------

  const handleEditNumber = async (Id) => {
    setIsEdit("UPDATE");
    const token = sessionStorage.getItem("BearerTokan");

    if (!token) {
      console.error("No token found! Please login first.");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}LawyerSetup/${Id}`, {
        headers: {
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      });

      const item = response?.data?.values || {};
      setNewName(item.Name);
      setNewMobile(item.Phone);
      setStatus(item.Status);
      setPrevDocEntry(item.Id);
    } catch (error) {
      console.error("Edit API Error:", error);
    }
  };

  const handleDeleteNumber = async (Id) => {
    const token = sessionStorage.getItem("BearerTokan");

    if (!token) {
      Swal.fire({
        icon: "error",
        text: "Session expired. Please login again.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${BASE_URL}LawyerSetup/${Id}`, {
        headers: {
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        text: "Phone Number Deleted successfully",
        timer: 1000,
        showConfirmButton: false,
      });

      HandlegetMobileLIst({ page: 0, search: "" });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Failed to delete",
      });
      console.error("Delete Error:", error);
    }
  };

  const MobileNoCol = [
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEditNumber(params.row.Id)}
          >
            <EditOutlinedIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => handleDeleteNumber(params.row.Id)}
          >
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </>
      ),
    },

    { field: "Name", headerName: "Name", flex: 1 },
    { field: "Phone", headerName: "Mobile Number", flex: 1.3 },
    {
      field: "Status",
      headerName: "Status",
      flex: 1,
      valueGetter: (params) => {
        return params.row.Status === 1 ? "Active" : "InActive";
      },
    },
  ];

  const initial = {
    Title: "",
    // Type: "DOCUMENT",
    Type: "",
    template: "",
    FileName: "",
    CampaignDataFile: null,
  };
  const { handleSubmit, control, reset, watch, setValue, getValues } = useForm({
    defaultValues: initial,
  });
  const getMessageTemplates = async () => {
    const token = sessionStorage.getItem("BearerTokan");
    if (!token) {
      console.error("No token found! Please login first.");
      return;
    }
    try {
      const response = await axios.request({
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_URL}Campaign/Templetes`,
        headers: {
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      });

      const jsonData = response.data.values || [];
      const templates = jsonData;
      setAllTemplates(templates);
      console.log("Templetes", templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const handleTypeChange = (type) => {
    let result = [];

    if (type === "DOCUMENT") {
      result = allTemplates.filter((t) =>
        t.components?.some((c) => c.format === "DOCUMENT"),
      );
    }

    if (type === "IMG") {
      result = allTemplates.filter((t) =>
        t.components?.some((c) => c.format === "IMAGE"),
      );
    }

    if (type === "TEXT") {
      result = allTemplates.filter((t) =>
        t.components?.every((c) => c.type !== "HEADER"),
      );
    }

    setFilteredTemplates(result);
    setValue("template", null);
    setValue("Message", "");
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    getMessageTemplates();
  }, []);

  //  -------------------------------------------
  const handleSubmitForm = async (data) => {
    try {
      const formData = new FormData();
      let finalFile;

      // Dropdown IDs → mobile numbers
      const selectedNumbers = mobileRows
        .filter(
          (item) =>
            data.MobileNo?.includes(item.Id) && Number(item.Status) === 1,
        )
        .map((item) => item.Phone?.trim());

      console.log("Selected Dropdown Numbers:", selectedNumbers);

      // Custom Chip Numbers
      const customNumbers = (data.CustomNo || [])
        .map((num) => num.trim())
        .filter((num) => /^\d{10}$/.test(num));

      console.log("Custom Chip Numbers:", customNumbers);

      //  Prepare Template Param Columns (b1, b2, b3...)
      const paramKeys = uniqueParams.map((param) => param.replace(/[{}]/g, ""));

      const paramColumns = paramKeys.map((key) => paramValues[key] || "");

      // ==================================================
      // CASE 1: File Uploaded
      const uploadedFile = data.CampaignDataFile;

      if (uploadedFile) {
        const fileText = await uploadedFile.text();

        const lines = fileText
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line !== "");

        // Remove header
        const existingNumbers = lines.slice(1);

        console.log("Existing Numbers From File:", existingNumbers);

        //  Merge All 3 Sources
        const allNumbers = [
          ...existingNumbers,
          ...selectedNumbers,
          ...customNumbers,
        ];

        // Remove duplicates
        const uniqueNumbers = [...new Set(allNumbers)];

        console.log("Final Unique Numbers:", uniqueNumbers);

        //  Create Header with Params
        let header = "MobileNumber";
        paramKeys.forEach((_, index) => {
          header += `,b${index + 1}`;
        });

        //  Create Rows
        const rows = uniqueNumbers.map((number) => {
          return [number, ...paramColumns].join(",");
        });

        const finalCsvContent = header + "\n" + rows.join("\n");

        finalFile = new File([finalCsvContent], uploadedFile.name, {
          type: "text/csv",
        });
      }

      // ==================================================
      //  CASE 2: File NOT Uploaded
      else {
        const allNumbers = [...selectedNumbers, ...customNumbers];

        const uniqueNumbers = [...new Set(allNumbers)];

        if (uniqueNumbers.length === 0) {
          Swal.fire({
            icon: "warning",
            title: "No Data",
            text: "Please upload file, select mobile numbers, or enter custom numbers.",
          });
          return;
        }

        console.log("Creating New File With Numbers:", uniqueNumbers);

        //  Create Header with Params
        let header = "MobileNumber";
        paramKeys.forEach((_, index) => {
          header += `,b${index + 1}`;
        });

        //Create Rows
        const rows = uniqueNumbers.map((number) => {
          return [number, ...paramColumns].join(",");
        });

        const newCsvContent = header + "\n" + rows.join("\n");

        finalFile = new File([newCsvContent], "CampaignData.csv", {
          type: "text/csv",
        });
      }

      console.log("Final CSV Ready To Send:");
      console.log(await finalFile.text());

      // Append file
      formData.append("CampaignDataFile", finalFile);
      formData.append("CreatedDate", dayjs().format("YYYY-MM-DD"));
      formData.append("CreatedBy", sessionStorage.getItem("userId") || "");
      formData.append("Title", data.Title || "");
      formData.append("Type", data.Type || "");
      formData.append("Templete", data.template || "");
      formData.append("Attachment", data.FileName);

      console.log("FormData Values:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const token = sessionStorage.getItem("BearerTokan");

      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please login again.",
        });
        return;
      }

      const formattedToken = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;

      setLoaderOpen(true);
      // API Call
      let response = await axios.post(`${BASE_URL}Campaign`, formData, {
        headers: {
          Authorization: formattedToken,
          "Content-Type": "multipart/form-data", // important for formData
        },
      });

      console.log("POST", response);
      setLoaderOpen(false);
      reset();
      fetchListData();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Send successfully...",
        toast: true,
        position: "center",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log("ERROR", error);
      setLoaderOpen(false);
    }
  };

  // ---------------------------------
  const selectedType = watch("Type");

  const isAttachmentEnabled =
    selectedType === "DOCUMENT" || selectedType === "IMG";

  useEffect(() => {
    if (selectedType) {
      handleTypeChange(selectedType);
    }
  }, [selectedType]);

  const handleAddAndSave = async () => {
    try {
      const Toast = Swal.mixin({
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      // ===== Validation =====
      if (!newName || !newMobile) {
        Toast.fire({ icon: "error", title: "Please enter both fields" });
        return;
      }

      if (!/^\d{10}$/.test(newMobile)) {
        Toast.fire({
          icon: "error",
          title: "Enter valid 10 digit mobile number",
        });
        return;
      }

      // Duplicate check (ignore same row while editing)
      const isDuplicate = mobileRows.some(
        (row) =>
          row.Phone === newMobile &&
          (isEdit !== "UPDATE" || row.Id !== PrevDocEntry),
      );

      if (isDuplicate) {
        Toast.fire({ icon: "error", title: "Mobile number already added" });
        return;
      }

      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("BearerTokan");

      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Session expired. Please login again.",
        });
        return;
      }

      const formattedToken = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;

      // ===== Payload =====
      const payload = {
        UserId: userId,
        CreatedBy: userId,
        CreatedDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
        ModifiedBy: userId,
        ModifiedDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
        Name: newName,
        Phone: newMobile,
        Status: status, // 1 / 0
      };

      console.log("Payload:", payload);

      // =============================
      if (isEdit === "UPDATE") {
        await axios.put(`${BASE_URL}LawyerSetup/${PrevDocEntry}`, payload, {
          headers: { Authorization: formattedToken },
        });

        Toast.fire({ icon: "success", title: "Updated successfully" });
      }
      // =============================
      else {
        await axios.post(`${BASE_URL}LawyerSetup`, payload, {
          headers: { Authorization: formattedToken },
        });

        Toast.fire({ icon: "success", title: "Added successfully" });
      }

      // ===== Reset =====
      setNewName("");
      setNewMobile("");
      setStatus(1);
      setIsEdit("SAVE");
      setPrevDocEntry(null);
      // Refresh list
      HandlegetMobileLIst({ page: 0, search: "" });
    } catch (error) {
      console.error("Save Error:", error);

      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong while saving. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  const HandlegetMobileLIst = async ({ page = 0, search = "" } = {}) => {
    const token = sessionStorage.getItem("BearerTokan");
    if (!token) {
      console.error("No token found! Please login first.");
      return;
    }
    try {
      const { data } = await axios.get(`${BASE_URL}LawyerSetup`, {
        params: { SearchText: search },
        headers: {
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      });

      const newData = data?.values || [];

      setMobileRows((prev) => (page === 0 ? newData : [...prev, ...newData]));
    } catch (err) {
      console.error("Error fetching Gazette list:", err);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      HandlegetMobileLIst({ page: 0, search: searchText });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const HandleMobileCsvDownload = () => {
    // CSV Template Content
    const csvTemplate = "MobileNumber\n0000000000";

    // Create Blob
    const blob = new Blob([csvTemplate], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    // Create temporary link
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "MobileNo_Template.csv");
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Info Popup
    Swal.fire({
      icon: "info",
      title: "Mobile Number CSV Format",
      html: `
      <div style="text-align:left">
        <p><b>Required Column:</b></p>
        <ul>
          <li><b>MobileNumber</b> (10 digit mandatory)</li>
        </ul>
        <p>Only <b>.csv</b> file allowed.</p>
        <p>Example format:</p>
        <pre>MobileNumber
9876543210</pre>
      </div>
    `,
      confirmButtonText: "OK",
    });
  };
  // --------------------------------------------------

  // Watch message field
  const messageValue = watch("Message") || "";

  // Extract {{1}}, {{2}}, etc
  const paramMatches = messageValue.match(/{{\d+}}/g) || [];
  const uniqueParams = [...new Set(paramMatches)];

  // Store dynamic parameter values

  // Generate live preview message
  const getPreviewMessage = () => {
    let preview = messageValue;

    uniqueParams.forEach((param) => {
      const key = param.replace(/[{}]/g, ""); // "{{1}}" → "1"
      const value = paramValues[key] || param;
      preview = preview.split(param).join(value);
    });

    return preview;
  };

  const sidebarContent = (
    <Box
      sx={{
        height: "79.5vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        border: "1px solid silver",
        backgroundColor: theme.palette.mode === "light" ? "#F5F6FA" : "#080D2B",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          py: 1,
          textAlign: "center",
          position: "relative",
          borderBottom: "1px solid silver",
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>
          {" "}
          Send Notification List
        </Typography>
      </Box>
      {/* <TextField
    size="small"
    fullWidth
    placeholder="Search..."
    value={searchTextList}
    onChange={(e) => setSearchTextList(e.target.value)}
 
  /> */}
      {/* SCROLL AREA */}
      <Box
        id="ListScroll"
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 1,
          minHeight: 0,

          scrollBehavior: "smooth",

          scrollbarWidth: "thin",
          scrollbarColor: "#888 transparent",

          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
        }}
        onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.target;

          if (
            scrollHeight - scrollTop - clientHeight < 5 &&
            hasMore &&
            !fetchingRef.current
          ) {
            setPage((prev) => prev + 1);
          }
        }}
      >
        {listData.map((item, index) => (
          <Card
            elevation={3}
            key={item.id || index}
            sx={{
              mb: 1,
              p: 2,
              borderRadius: 2,
              position: "relative",
              minHeight: 80,
              transition: "all 0.3s ease",

              "&:hover": {
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.grey[800],
                boxShadow: 6,
                transform: "translateY(-2px)",
              },
            }}
          >
            {/* Top Left */}
            <Typography
              sx={{
                position: "absolute",
                top: 8,
                left: 12,
                fontWeight: 600,
                fontSize: 17,
              }}
            >
              {item.Title}
            </Typography>

            {/* Top Right */}
            <Typography
              sx={{
                position: "absolute",
                top: 8,
                right: 12,
                fontSize: 15,
                fontWeight: 600,
                color: "text.secondary",
              }}
            >
              {(item?.MsgSentCnt ?? 0) + (item?.MsgFailedCnt ?? 0)}
            </Typography>

            {/* Bottom Left */}
            <Typography
              sx={{
                position: "absolute",
                bottom: 8,
                left: 12,
                fontSize: 15,
                color: "primary.main",
              }}
            >
              {item.CreatedDate
                ? new Date(item.CreatedDate).toLocaleDateString("en-GB")
                : ""}
            </Typography>

            {/* Bottom Right */}
            <Typography
              sx={{
                position: "absolute",
                bottom: 8,
                right: 12,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              <Box component="span" sx={{ color: "error.main" }}>
                {item?.MsgFailedCnt ?? 0}
              </Box>
              {" || "}
              <Box component="span" sx={{ color: "success.main" }}>
                {item?.MsgSentCnt ?? 0}
              </Box>
            </Typography>
          </Card>
        ))}

        {loading && (
          <Typography textAlign="center" py={2}>
            Loading...
          </Typography>
        )}

        {!hasMore && (
          <Typography textAlign="center" py={2}>
            No More Data
          </Typography>
        )}
      </Box>
    </Box>
  );

  const fetchingRef = useRef(false);
  const fetchListData = async () => {
    if (fetchingRef.current || !hasMore) return;

    fetchingRef.current = true;
    setLoading(true);

    const token = sessionStorage.getItem("BearerTokan");
    if (!token) {
      setLoading(false);
      fetchingRef.current = false;
      return;
    }

    try {
      setLoaderOpen(true);
      const response = await axios.get(`${BASE_URL}Campaign`, {
        params: {
          Page: page,
          Limit: 20,
          SearchText: searchTextList,
        },
        headers: {
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      });

      const newData = response.data.values;
      setLoaderOpen(false);

      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setListData((prev) => [...prev, ...newData]);
      }
    } catch (error) {
      console.error(error);
      setLoaderOpen(false);
    }
    setLoaderOpen(false);

    setLoading(false);
    fetchingRef.current = false;
  };

  useEffect(() => {
    setListData([]);
    setPage(1);
    setHasMore(true);
  }, []);

  useEffect(() => {
    fetchListData();
  }, [page]);

  //    useEffect(() => {
  //   const delayDebounce = setTimeout(() => {
  //     fetchingRef.current = false;
  //     setHasMore(true);
  //     setPage(1);
  //   }, 500);

  //   return () => clearTimeout(delayDebounce);
  // }, [searchTextList]);

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}

      {/* MODAL */}
      <Dialog open={openMobileModal} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          Add Mobile Numbers
          <IconButton onClick={() => setOpenMobileModal(false)}>
            <CloseIcon sx={{ fontSize: 30 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid
            container
            spacing={1}
            sx={{
              border: "1px solid #b8aeae",
              borderRadius: 2,
              p: 1,
            }}
          >
            {/* Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="NAME"
                name="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                fullWidth
                size="small"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="tel"
                label="MOBILE NUMBER"
                value={newMobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setNewMobile(value);
                }}
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                required
              />
            </Grid>
            {/* Status Checkbox */}
            {/* <Grid item xs={6} display="flex" justifyContent="flex-start">
              <FormControlLabel
                control={<Checkbox defaultChecked name="Status" />}
                label="Active"
              />
            </Grid> */}
            <Grid item xs={6} display="flex" justifyContent="flex-start">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={status === 1}
                    onChange={(e) => setStatus(e.target.checked ? 1 : 0)}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
          <Grid sx={{ height: 280, width: "100%" }}>
            <DataGrid
              className="datagrid-style"
              rows={mobileRows}
              columns={MobileNoCol}
              disableMultipleRowSelection
              getRowId={(row) => row.Id}
              disableColumnFilter
              paginationMode="server"
              hideFooter
              keepNonExistentRowsSelected
              disableColumnSelector
              disableRowSelectionOnClick
              disableDensitySelector
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "grey.100",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "action.hover",
                  cursor: "pointer",
                },
                "& .MuiDataGrid-row.Mui-selected": {
                  backgroundColor: "rgba(25, 118, 210, 0.12) !important",
                },
              }}
            />
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 2 }}>
          <Button
            size="small"
            onClick={() => {
              setNewName("");
              setNewMobile("");
              setIsEdit("SAVE");
            }}
            sx={{
              width: 80,
              color: "#2196F3",
              border: "1px solid #2196F3",
              borderRadius: "8px",
            }}
          >
            Clear
          </Button>

          <Button
            size="small"
            type="submit"
            name="SAVE"
            sx={{
              width: 80,
              color: "#fff",
              backgroundColor: theme.palette.Button.background,
              "&:hover": {
                backgroundColor: theme.palette.Button.background,
              },
            }}
            onClick={handleAddAndSave}
          >
            {/* SAVE */}

            {isEdit}
          </Button>
        </DialogActions>
      </Dialog>
      {/* ----------Mobile No Creation modal end------------------ */}
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
          Send Notification
        </Typography>
      </Grid>
      {/* MAIN SECTION */}
      <Box sx={{ maxHeight: "80vh", overflowY: "auto" }}>
        <Grid
          container
          // spacing={1}
          sx={{ height: "100%", border: "1px solid #ccc" }}
        >
          <Grid item xs={12} md={3} lg={3}>
            {sidebarContent}
          </Grid>
          {/* <Box> */}
          <Grid item xs={12} md={9} lg={9} sx={{ height: "79.5vh" }}>
            <Card
              elevation={3}
              component="form"
              onSubmit={handleSubmit(handleSubmitForm)}
              sx={{
                maxWidth: "100%",
                height: "100%",
                margin: 0,
              }}
            >
              <CardContent
                sx={{
                  p: 4,
                  flex: 1,
                  height: "75vh",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": { width: "6px" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#bbb",
                  },
                }}
              >
                <Grid
                  container
                  item
                  spacing={2}
                  width="100%"
                  sm={12}
                  md={12}
                  position="relative"
                >
                  {/* ROW 1 */}

                  <Grid
                    item
                    md={12}
                    sm={12}
                    xs={12}
                    sx={{
                      alignItems: "start",
                      textAlign: "left",
                      marginBottom: 2,
                    }}
                  >
                    <Controller
                      name="Title"
                      control={control}
                      defaultValue=""
                      render={({ field, fieldState: { error } }) => (
                        <InputTextFieldTitle
                          {...field}
                          inputRef={field.ref}
                          label="ENTER TITLE"
                          id="Title"
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item md={4} sm={4} xs={12} marginBottom={2}>
                    <Box display="flex">
                      <Box flex={1} minWidth={0}>
                        <Controller
                          name="CampaignDataFile"
                          control={control}
                          defaultValue={null}
                          render={({ field, fieldState }) => (
                            <TextField
                              size="small"
                              label="UPLOAD MOBILE NO"
                              value={field.value?.name || ""}
                              placeholder="Choose file"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  minHeight: 82,
                                },
                                "& .MuiInputBase-input": {
                                  paddingTop: "14px",
                                  paddingBottom: "14px",
                                },
                              }}
                              InputProps={{
                                readOnly: true,
                                endAdornment: (
                                  <Button
                                    component="label"
                                    variant="outlined"
                                    size="small"
                                    sx={{ ml: 1, textTransform: "none" }}
                                  >
                                    Upload
                                    <input
                                      type="file"
                                      hidden
                                      accept=".csv,.xls,.xlsx"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];

                                        if (!file) {
                                          field.onChange(null);
                                          return;
                                        }

                                        const allowedMimeTypes = [
                                          "text/csv",
                                          "application/vnd.ms-excel",
                                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                        ];

                                        const allowedExtensions = [
                                          ".csv",
                                          ".xls",
                                          ".xlsx",
                                        ];

                                        const fileName =
                                          file.name.toLowerCase();

                                        const isValid =
                                          allowedMimeTypes.includes(
                                            file.type,
                                          ) ||
                                          allowedExtensions.some((ext) =>
                                            fileName.endsWith(ext),
                                          );

                                        if (!isValid) {
                                          Swal.fire({
                                            icon: "warning",
                                            title: "Invalid File Type",
                                            text: "Please upload only CSV or Excel files (.csv, .xls, .xlsx).",
                                            toast: true,
                                            position: "center",
                                            timer: 3000,
                                            showConfirmButton: false,
                                          });

                                          e.target.value = "";
                                          field.onChange(null);
                                          return;
                                        }

                                        field.onChange(file);
                                      }}
                                    />
                                  </Button>
                                ),
                              }}
                            />
                          )}
                        />
                      </Box>
                      <Tooltip
                        title="Click to download mobile number CSV template"
                        arrow
                        placement="top"
                      >
                        <IconButton
                          color="primary"
                          onClick={HandleMobileCsvDownload}
                        >
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>

                  {/* Dropdown Field */}
                  <Grid item md={4} sm={4} xs={12} marginBottom={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Controller
                          name="MobileNo"
                          control={control}
                          defaultValue={[]}
                          render={({ field, fieldState }) => {
                            const activeMobileRows = mobileRows.filter(
                              (item) => Number(item.Status) === 1,
                            );
                            // const allIds = mobileRows.map((item) => item.Id);
                            const allIds = activeMobileRows.map(
                              (item) => item.Id,
                            );
                            const isAllSelected =
                              allIds.length > 0 &&
                              field.value?.length === allIds.length;

                            return (
                              <FormControl
                                fullWidth
                                size="small"
                                error={!!fieldState.error}
                              >
                                <InputLabel>SELECT MOBILE NO</InputLabel>

                                <Select
                                  {...field}
                                  multiple
                                  value={field.value || []}
                                  label="SELECT MOBILE NO"
                                  onChange={(event) => {
                                    const value = event.target.value;

                                    //  Select All Logic
                                    if (value.includes("all")) {
                                      if (isAllSelected) {
                                        field.onChange([]);
                                      } else {
                                        field.onChange(allIds);
                                      }
                                    } else {
                                      field.onChange(value);
                                    }
                                  }}
                                  sx={{
                                    minHeight: 85,
                                    "& .MuiSelect-select": {
                                      display: "flex",
                                      alignItems: "flex-start",
                                      paddingTop: "8px",
                                      paddingBottom: "8px",
                                    },
                                  }}
                                  MenuProps={{
                                    autoFocus: false,
                                    disableAutoFocusItem: true,
                                    PaperProps: {
                                      sx: {
                                        maxHeight: 250,
                                      },
                                    },
                                  }}
                                  renderValue={(selected) => {
                                    const selectedItems =
                                      activeMobileRows.filter(
                                        (item) =>
                                          selected.includes(item.Id) &&
                                          Number(item.Status) === 1,
                                      );

                                    if (selectedItems.length === 0) {
                                      return "Select Mobile No";
                                    }

                                    const mobileNumbers = selectedItems.map(
                                      (item) => item.Phone,
                                    );

                                    return (
                                      <Tooltip
                                        arrow
                                        placement="top"
                                        title={mobileNumbers.join(", ")}
                                      >
                                        <Box
                                          sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 0.5,
                                            maxHeight: 70,
                                            overflowY: "auto",
                                            width: "100%",
                                          }}
                                        >
                                          {selectedItems.map((item) => (
                                            <Chip
                                              key={item.Id}
                                              label={item.Phone}
                                              size="small"
                                              color="primary"
                                              sx={{
                                                width: "48%",
                                              }}
                                            />
                                          ))}
                                        </Box>
                                      </Tooltip>
                                    );
                                  }}
                                >
                                  <MenuItem value="all">
                                    <Checkbox
                                      checked={isAllSelected}
                                      indeterminate={
                                        field.value?.length > 0 &&
                                        field.value?.length < allIds.length
                                      }
                                    />
                                    <ListItemText
                                      primary={`Select All (${allIds.length})`}
                                    />
                                  </MenuItem>

                                  <Divider />

                                  {activeMobileRows.map((option) => (
                                    <MenuItem key={option.Id} value={option.Id}>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          option.Id,
                                        )}
                                      />
                                      <ListItemText
                                        primary={option.Name}
                                        secondary={option.Phone}
                                      />
                                    </MenuItem>
                                  ))}
                                </Select>

                                {fieldState.error && (
                                  <FormHelperText>
                                    {fieldState.error.message}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            );
                          }}
                        />
                      </Box>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setOpenMobileModal(true);
                          setNewName("");
                          setNewMobile("");
                          setIsEdit("SAVE");
                          HandlegetMobileLIst({ page: 0, search: "" });
                        }}
                        sx={{
                          animation: "pulse 1.5s infinite",
                          border: "1px solid #1976d2",
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>

                  <Grid item md={4} sm={4} xs={12} marginBottom={2}>
                    <Controller
                      name="CustomNo"
                      control={control}
                      defaultValue={[]}
                      render={({ field, fieldState: { error } }) => {
                        const handleAddNumber = (number) => {
                          if (!/^\d{10}$/.test(number)) return;
                          if (!field.value.includes(number)) {
                            field.onChange([...field.value, number]);
                          }
                        };

                        return (
                          <Tooltip
                            arrow
                            placement="top"
                            title={
                              field.value?.length
                                ? field.value.join(", ")
                                : "Enter 10 digit mobile number and press Enter"
                            }
                          >
                            <Autocomplete
                              multiple
                              freeSolo
                              options={[]}
                              value={field.value || []}
                              inputValue={inputValue}
                              onChange={(e, newValue) =>
                                field.onChange(newValue)
                              }
                              onInputChange={(e, newInputValue) => {
                                const numericValue = newInputValue.replace(
                                  /\D/g,
                                  "",
                                );
                                if (numericValue.length <= 10) {
                                  setInputValue(numericValue);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddNumber(inputValue);
                                  setInputValue("");
                                }
                              }}
                              renderTags={(value, getTagProps) => (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "4px",
                                    maxHeight: "60px",
                                    overflowY: "auto",
                                    width: "100%",
                                  }}
                                >
                                  {value.map((option, index) => (
                                    <Chip
                                      {...getTagProps({ index })}
                                      label={option}
                                      size="small"
                                      color="primary"
                                      sx={{ maxWidth: "48%" }}
                                    />
                                  ))}
                                </Box>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="ENTER CUSTOM NO."
                                  error={!!error}
                                  helperText={
                                    error?.message ||
                                    "Only 10 digit mobile numbers allowed"
                                  }
                                  inputProps={{
                                    ...params.inputProps,
                                    maxLength: 10,
                                    inputMode: "numeric",
                                  }}
                                />
                              )}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  minHeight: "75px",
                                  alignItems: "flex-start",
                                },
                              }}
                            />
                          </Tooltip>
                        );
                      }}
                    />
                  </Grid>
                  {/* --------------------------------- */}

                  {/* ROW 2 */}
                  <Grid item md={4} sm={6} xs={12} marginBottom={2}>
                    <Controller
                      name="Type"
                      control={control}
                      render={({ field }) => {
                        const options = [
                          { Name: "DOCUMENT" },
                          { Name: "IMG" },
                          { Name: "TEXT" },
                        ];

                        const selected =
                          options.find((o) => o.Name === field.value) || null;

                        return (
                          <Autocomplete
                            options={options}
                            getOptionLabel={(o) => o.Name}
                            value={selected}
                            isOptionEqualToValue={(o, v) => o?.Name === v?.Name}
                            onChange={(_, v) => {
                              const value = v ? v.Name : null;
                              field.onChange(value);
                              handleTypeChange(value);
                              if (value === "TEXT") {
                                setValue("FileName", null);
                              }
                            }}
                            slotProps={{
                              paper: {
                                sx: {
                                  maxHeight: 250,
                                },
                              },
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="SELECT TYPE"
                                size="small"
                                fullWidth
                              />
                            )}
                          />
                        );
                      }}
                    />
                  </Grid>

                  <Grid item md={4} sm={6} xs={12} marginBottom={2}>
                    <Controller
                      name="template"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => {
                        const options = filteredTemplates.map((t) => ({
                          Name: t.name,
                          template: t,
                        }));

                        const selected =
                          options.find((o) => o.Name === field.value) || null;

                        return (
                          <Autocomplete
                            options={options}
                            getOptionLabel={(o) => o.Name}
                            value={selected}
                            isOptionEqualToValue={(o, v) => o?.Name === v?.Name}
                            onChange={(_, v) => {
                              //  set template name in form
                              field.onChange(v ? v.Name : null);
                              setParamValues({});
                              //  BODY text → MESSAGE
                              if (v?.template?.components) {
                                const bodyComponent =
                                  v.template.components.find(
                                    (c) => c.type === "BODY",
                                  );

                                setValue("Message", bodyComponent?.text || "", {
                                  shouldDirty: true,
                                  shouldTouch: true,
                                  shouldValidate: true,
                                });
                                console.log("Message", bodyComponent?.text);
                              } else {
                                setValue("Message", "", {
                                  shouldDirty: true,
                                  shouldTouch: true,
                                });
                              }
                            }}
                            slotProps={{
                              paper: {
                                sx: {
                                  maxHeight: 250,
                                },
                              },
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="SELECT TEMPLATE"
                                size="small"
                                fullWidth
                              />
                            )}
                          />
                        );
                      }}
                    />
                  </Grid>
                  {/* {(selectedType === "DOCUMENT" || selectedType === "IMG") && ( */}
                  <Grid item md={4} sm={6} xs={12} marginBottom={2}>
                    <Controller
                      name="FileName"
                      control={control}
                      defaultValue={null}
                      rules={{
                        required: isAttachmentEnabled
                          ? "File is required"
                          : false,
                        // required: "File is required",
                        validate: (file) => {
                          if (!file) return true;

                          const allowedTypes = [
                            "application/pdf",
                            "image/jpeg",
                            "image/png",
                            "image/jpg",
                            "image/gif",
                            "image/bmp",
                            "image/webp",
                          ];

                          return (
                            allowedTypes.includes(file.type) ||
                            "Only PDF or Image files are allowed"
                          );
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <Tooltip
                          arrow
                          placement="top"
                          title={
                            !isAttachmentEnabled
                              ? "Attachment allowed only for DOCUMENT or IMG type"
                              : ""
                          }
                        >
                          <span>
                            <TextField
                              fullWidth
                              size="small"
                              label="ATTACH FILE"
                              value={field.value?.name || ""}
                              placeholder="Choose file"
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                              disabled={!isAttachmentEnabled}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              InputProps={{
                                readOnly: true,
                                endAdornment: (
                                  <Button
                                    component="label"
                                    variant="outlined"
                                    size="small"
                                    disabled={!isAttachmentEnabled}
                                    sx={{ ml: 1, textTransform: "none" }}
                                  >
                                    Upload
                                    <input
                                      type="file"
                                      hidden
                                      accept=".pdf,image/*"
                                      disabled={!isAttachmentEnabled}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];

                                        if (!file) {
                                          field.onChange(null);
                                          return;
                                        }

                                        const allowedTypes = [
                                          "application/pdf",
                                          "image/jpeg",
                                          "image/png",
                                          "image/jpg",
                                          "image/gif",
                                          "image/bmp",
                                          "image/webp",
                                        ];

                                        if (!allowedTypes.includes(file.type)) {
                                          Swal.fire({
                                            icon: "warning",
                                            title: "Invalid File",
                                            text: "Please upload only PDF or Image files.",
                                            toast: true,
                                            position: "center",
                                            timer: 3000,
                                            showConfirmButton: false,
                                          });
                                          e.target.value = "";
                                          field.onChange(null);
                                          return;
                                        }

                                        field.onChange(file);
                                      }}
                                    />
                                  </Button>
                                ),
                              }}
                            />
                          </span>
                        </Tooltip>
                      )}
                    />
                  </Grid>
                  {/* )} */}

                  {/* MESSAGE */}
                  <Grid item xs={12}>
                    <Controller
                      name="Message"
                      control={control}
                      defaultValue=""
                      render={({ field, fieldState: { error } }) => (
                        <Tooltip
                          title={getPreviewMessage() || "No message entered"}
                          placement="bottom-start"
                          arrow
                        >
                          <TextField
                            {...field}
                            value={getPreviewMessage()}
                            label="MESSAGE"
                            size="small"
                            multiline
                            rows={6}
                            fullWidth
                            error={!!error}
                            helperText={error?.message}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Tooltip>
                      )}
                    />
                  </Grid>
                  {uniqueParams.length > 0 && (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {uniqueParams.map((param) => {
                        const key = param.replace(/[{}]/g, "");

                        return (
                          <Grid item xs={12} sm={4} key={key}>
                            <TextField
                              size="small"
                              label={`Enter value for ${param}`}
                              value={paramValues[key] || ""}
                              onChange={(e) =>
                                setParamValues({
                                  ...paramValues,
                                  [key]: e.target.value,
                                })
                              }
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                </Grid>

                {/* FOOTER */}
              </CardContent>
              <CardActions
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  height: "2vh",
                  pl: 3,
                  pr: 3,
                }}
              >
                <Button
                  size="small"
                  onClick={() => reset()}
                  sx={{
                    width: 80,
                    color: "#2196F3",
                    border: "1px solid #2196F3",
                    borderRadius: "8px",
                  }}
                >
                  Clear
                </Button>

                <Button
                  size="small"
                  type="submit"
                  sx={{
                    width: 80,
                    color: "#fff",
                    backgroundColor: theme.palette.Button.background,
                    "&:hover": {
                      backgroundColor: theme.palette.Button.background,
                    },
                  }}
                >
                  Save
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
