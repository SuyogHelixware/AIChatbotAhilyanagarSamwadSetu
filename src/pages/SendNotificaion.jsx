import {
  Box,
  Paper,
  Grid,
  Typography,
  Divider,
  Button,
  IconButton,
  Autocomplete,
  Tooltip,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Checkbox,
  ListItemText,
  Chip,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import InputTextField, {
  InputDescriptionField,
  InputTextFieldTitle,
} from "../components/Component";
import { useTheme } from "@mui/styles";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../Constant";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import InfoIcon from "@mui/icons-material/Info";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

export default function UserCreation() {
  const theme = useTheme();
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  // --------Sidebar -----------------------------------
  const [listData, setListData] = useState([]);
const [page, setPage] = useState(0);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);
// --------------------------------------------------
  // const handleEditNumber = (row) => {
  //   setNewName(row.Name);
  //   setNewMobile(row.Phone);

  //   // Agar modal use kar rahe ho to open bhi kar do
  //   setOpenMobileModal(true);
  // };

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
    Type: "DOCUMENT",
    template: "",
    FileName: "",
    // CampaignDataFile: "",
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
        // params: {
        //   fields: "name,components,language",
        // },
        headers: {
          // apikey: "8552af6c-8c67-11f0-98fc-02c8a5e042bd",
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      });
      const jsonData = response.data.response;
      console.log("Without JSON", jsonData);
      // const jsonDataOBJ = JSON.parse(jsonData);
      // console.log("With JSON", jsonDataOBJ)

      const templates = jsonData?.data || [];
      setAllTemplates(templates);
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
    fetchListData()
  }, []);
  // ---------old logic-------
  // const handleSubmitForm = async (data) => {
  //   try {
  //     const formData = new FormData();

  //     formData.append("Title", data.Title || "");
  //     formData.append("Type", data.Type || "");
  //     formData.append("Templete", data.template || "");
  //     formData.append("Attachment", data.FileName);
  //     formData.append("CampaignDataFile", data.CampaignDataFile);

  //     let response = await axios.post(
  //       `${BASE_URL}WPUtility/Campaign01`,
  //       formData,
  //     );
  //     console.log("POST", response);
  //     reset();
  //     setValue("Message", "");
  //     setValue("Title", "");
  //     setValue("template", "");
  //     setValue("FileName", "");
  //     setValue("Type", "");

  //     Swal.fire({
  //       icon: "success",
  //       title: "Success",
  //       text: "Send successfully...",
  //       toast: true,
  //       position: "center",
  //       timer: 2000,
  //       showConfirmButton: false,
  //     });
  //   } catch (error) {
  //     let errorMessage = "Something went wrong. Please try again.";

  //     if (error.response) {
  //       errorMessage =
  //         error.response.data?.message ||
  //         error.response.data?.error ||
  //         "Server error occurred";
  //     }
  //   }
  // };
  // ---------------New logic on below----------------------

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
      // ==================================================
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
      // ==================================================
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

      // Other fields
      formData.append("Title", data.Title || "");
      formData.append("Type", data.Type || "");
      formData.append("Templete", data.template || "");
      formData.append("Attachment", data.FileName);

      // Debug FormData
      console.log("FormData Values:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // API Call
      let response = await axios.post(
        `${BASE_URL}WPUtility/Campaign01`,
        formData,
      );

      console.log("POST", response);

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
    }
  };

  // ---------------------------------
  const selectedType = watch("Type");
  const isAttachmentEnabled =
    selectedType === "DOCUMENT" || selectedType === "IMG";

  // const handleAddAndSave = async (data) => {
  //   try {
  //     const Toast = Swal.mixin({
  //       toast: true,
  //       position: "center",
  //       showConfirmButton: false,
  //       timer: 1500,
  //       timerProgressBar: true,
  //     });

  //     // ===== Validation =====
  //     if (!newName || !newMobile) {
  //       Toast.fire({
  //         icon: "error",
  //         title: "Please enter both fields",
  //       });
  //       return;
  //     }

  //     if (!/^\d{10}$/.test(newMobile)) {
  //       Toast.fire({
  //         icon: "error",
  //         title: "Enter valid 10 digit mobile number",
  //       });
  //       return;
  //     }

  //     // Duplicate check (Skip in Edit if same number)
  //     const isDuplicate = mobileRows.some((row) => row.mobileNo === newMobile);

  //     if (isDuplicate) {
  //       Toast.fire({
  //         icon: "error",
  //         title: "Mobile number already added",
  //       });
  //       return;
  //     }

  //     // ===== Payload =====
  //     const payload = {
  //       UserId: sessionStorage.getItem("userId"),
  //       CreatedBy: sessionStorage.getItem("userId"),
  //       CreatedDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
  //       ModifiedBy: sessionStorage.getItem("userId"),
  //       ModifiedDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
  //       Name: newName,
  //       Phone: newMobile,
  //       Status: status,
  //     };
  //     console.log("object", payload);
  //     // return
  //     // ===== API CALL =====
  //     if (isEdit === "UPDATE") {
  //       await BASE_URL.put(`/MobileMaster/${editMobile}`, payload);
  //       let response = await axios.put(
  //         `${BASE_URL}MobileMaster/${data.Id}`,
  //         payload,
  //       );

  //       Toast.fire({
  //         icon: "success",
  //         title: "Updated successfully",
  //       });

  //       // Update DataGrid row
  //       setMobileRows((prev) =>
  //         prev.map((row) =>
  //           row.mobileNo === editMobile
  //             ? { ...row, name: newName, mobileNo: newMobile }
  //             : row,
  //         ),
  //       );
  //     } else {
  //       const token = sessionStorage.getItem("BearerTokan");

  //       if (!token) {
  //         console.error("No token found! Please login first.");
  //         return;
  //       }

  //       const formattedToken = token.startsWith("Bearer ")
  //         ? token
  //         : `Bearer ${token}`;

  //       let response = await axios.post(`${BASE_URL}LawyerSetup`, payload, {
  //         headers: {
  //           Authorization: formattedToken,
  //         },
  //       });

  //       Toast.fire({
  //         icon: "success",
  //         title: "Added successfully",
  //       });
  //     }

  //     setNewName("");
  //     setNewMobile("");
  //     setIsEdit(false);
  //     setEditMobile(null);
  //     HandlegetMobileLIst({ page: 0, search: "" });

  //     // setOpenMobileModal(false);
  //   } catch (error) {
  //     console.error(error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Save Failed",
  //       text:error.response?.data?.message ||
  //         "Something went wrong while saving. Please try again.",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };

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

  // const sidebarContent = (
  //   <>
  //     <Grid
  //       item
  //       width={"100%"}
  //       py={0.5}
  //       alignItems={"center"}
  //       border={"1px solid silver"}
  //       borderBottom={"none"}
  //       position={"relative"}
  //       sx={{
  //         backgroundColor:
  //           theme.palette.mode === "light" ? "#F5F6FA" : "#080D2B",
  //       }}
  //     >
  //       <Typography
  //         textAlign={"center"}
  //         alignContent={"center"}
  //         height={"100%"}
  //       >
  //         Send Message List
  //       </Typography>
  //       <IconButton
  //         edge="end"
  //         color="inherit"
  //         aria-label="close"
  //         onClick={() => setDrawerOpen(false)}
  //         sx={{
  //           position: "absolute",
  //           right: "10px",
  //           top: "0px",
  //           display: { lg: "none", xs: "block" },
  //         }}
  //       >
  //         <CloseIcon />
  //       </IconButton>
  //     </Grid>

  //     <Grid
  //       container
  //       item
  //       width={"100%"}
  //       height={"100%"}
  //       border={"1px silver solid"}
  //       sx={{
  //         backgroundColor:
  //           theme.palette.mode === "light" ? "#F5F6FA" : "#080D2B",
  //       }}
  //     >
  //       <Grid item md={12} sm={12} width={"100%"} height={`100%`}>
  //         <Box
  //           sx={{
  //             width: "100%",
  //             height: "100%",
  //             px: 1,
  //             overflow: "scroll",
  //             overflowX: "hidden",
  //             typography: "body1",
  //           }}
  //           id="ListScroll"
  //         >
  //           <Grid
  //             item
  //             padding={1}
  //             md={12}
  //             sm={12}
  //             width={"100%"}
  //             sx={{
  //               position: "sticky",
  //               top: "0",
  //               backgroundColor:
  //                 theme.palette.mode === "light" ? "#F5F6FA" : "#080D2B",
  //             }}
  //           >
  //             {/* <SearchInputField
  //               onChange={(e) => handleOpenListSearch(e.target.value)}
  //               value={openListquery}
  //               onClickClear={handleOpenListClear}
  //             /> */}
  //           </Grid>
  //           {/* <InfiniteScroll
  //             style={{ textAlign: "center", justifyContent: "center" }}
  //             // dataLength={openListData.length}
  //             // hasMore={hasMoreOpen}
  //             // next={fetchMoreOpenListData}
  //             // loader={
  //             //   <BeatLoader 
  //             //     color={theme.palette.mode === "light" ? "black" : "white"}
  //             //   />
  //             // }
  //             scrollableTarget="ListScroll"
  //             endMessage={<Typography>No More Records</Typography>}
  //           > */}
  //           {/* {openListData.map((item, i) => (
  //               <CardComponent
  //                 key={i}
  //                 title={item.TemplateName}
  //                 subtitle={item.Email}
  //                 isSelected={selectedData === item.DocEntry}
  //                 searchResult={openListquery}
  //               />
  //             ))} */}
  //           {/* </InfiniteScroll> */}
  //         </Box>
  //       </Grid>
  //     </Grid>
  //   </>
  // );
  
  const sidebarContent = (
  <Box
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      border: "1px solid silver",
      backgroundColor:
        theme.palette.mode === "light" ? "#F5F6FA" : "#080D2B",
    }}
  >
    {/* HEADER */}
    <Box
      sx={{
        py: 1,
        textAlign: "center",
        position: "relative",
        borderBottom: "1px solid silver",
      }}
    >
      <Typography>Send Message List</Typography>

      <IconButton
        onClick={() => setDrawerOpen(false)}
        sx={{
          position: "absolute",
          right: 10,
          top: 2,
          display: { lg: "none", xs: "block" },
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>

    {/* SCROLL AREA */}
    <Box
      id="ListScroll"
      sx={{
        flex: 1,
        overflowY: "auto",
        px: 1,
      }}
    >
      {/* Infinite Scroll Here */}
    </Box>
  </Box>
);
  
const fetchListData = async () => {
  if (loading) return;

  setLoading(true);
   const token = sessionStorage.getItem("BearerTokan");
    if (!token) {
      console.error("No token found! Please login first.");
      return;
    }
  try {  

     const response = await axios.request({
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_URL}Campaign`,
        params: {
 page: page,
      pageSize: 10,        },
        headers: {
           Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      });
    const newData = response.data.values;
console.log("object=====", newData)
    if (newData.length === 0) {
      setHasMore(false);
    } else {
      setListData((prev) => [...prev, ...newData]);
      setPage((prev) => prev + 1);
    }
  } catch (error) {
    console.error(error);
  }

  setLoading(false);
};
  
  return (
    <>
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
          Send Message
        </Typography>
      </Grid>
      {/* MAIN SECTION */}
      <Box sx={{ height: "70vh" }}>
      <Grid container spacing={1} sx={{ height: "100%" }}>
        <Grid item xs={12} md={3} lg={3}>
          {sidebarContent}
        </Grid>
        {/* <Box> */}
          <Grid item xs={12} md={9} lg={9} sx={{ height: "100%" }}> 
          <Paper
            sx={{
              maxWidth: 1100,
              mx: "auto",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit(handleSubmitForm)}
              sx={{
                p: 4,
                maxHeight: "120vh",
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "#bbb",
                  borderRadius: "8px",
                },
              }}
            >
              <Grid
                container
                spacing={5}
                width="100%"
                height="100%"
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
                  sx={{ alignItems: "start", textAlign: "left" }}
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

                <Grid item md={4} sm={4} xs={12}>
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

                                      const fileName = file.name.toLowerCase();

                                      const isValid =
                                        allowedMimeTypes.includes(file.type) ||
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
                <Grid item md={4} sm={4} xs={12}>
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
                                  const selectedItems = activeMobileRows.filter(
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

                                {/* <MenuItem disableRipple disableTouchRipple>
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder="Search mobile..."
                                  value={searchText}
                                      autoFocus  

                                  onChange={(e) =>
                                    setSearchText(e.target.value)
                                  }
                                  onKeyDown={(e) => e.stopPropagation()}
                                />
                              </MenuItem> */}
                                <Divider />

                                {activeMobileRows.map((option) => (
                                  <MenuItem key={option.Id} value={option.Id}>
                                    <Checkbox
                                      checked={field.value?.includes(option.Id)}
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

                <Grid item md={4} sm={4} xs={12}>
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
                            onChange={(e, newValue) => field.onChange(newValue)}
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
                {/* <Divider
                sx={{
                  borderBottom: "0.5px solid #111111",
                  width: "100%",
                  position: "relative",
                  mt: 2,
                }}
              /> */}
                {/* ROW 2 */}
                <Grid item md={4} sm={6} xs={12}>
                  <Controller
                    name="Type"
                    control={control}
                    defaultValue={"DOCUMENT"}
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

                <Grid item md={4} sm={6} xs={12}>
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
                              const bodyComponent = v.template.components.find(
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
                <Grid item md={4} sm={6} xs={12}>
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
                {/* <Grid item xs={12}>
                <Controller
                  name="Message"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState: { error } }) => (
                    <Tooltip
                      title={field.value || "No message entered"}
                      placement="bottom-start"
                      arrow
                    >
                      <TextField
                        {...field}
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
              </Grid> */}
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
                          value={getPreviewMessage()} // ✅ Show live replaced message
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

              <Divider sx={{ my: 2 }} />

              {/* FOOTER */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
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
              </Box>
            </Box>
          </Paper>
          {/* </Box> */}
        </Grid>
      </Grid>
      </Box>
    </>
  );
}
