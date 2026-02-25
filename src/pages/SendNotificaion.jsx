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
export default function UserCreation() {
  const theme = useTheme();
  const hasFetched = useRef(false);
  const [allTemplates, setAllTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);

  const [openMobileModal, setOpenMobileModal] = useState(false);
  const [newMobile, setNewMobile] = useState("");
  const [mobileRows, setMobileRows] = useState([]);
  const [newName, setNewName] = useState("");
  const [isEdit, setIsEdit] = useState("SAVE");
  const [editMobile, setEditMobile] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [paramValues, setParamValues] = useState({});

  const handleEditNumber = (row) => {
    setNewName(row.name);
    setNewMobile(row.mobileNo);

    // Agar modal use kar rahe ho to open bhi kar do
    setOpenMobileModal(true);
  };

  const handleDeleteNumber = async (DocEntry, row) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No",
    });
    if (!result.isConfirmed) return;
    try {
      await BASE_URL.delete(`/echnicians/${DocEntry}`);
      Swal.fire({
        icon: "success",
        text: "Deleted successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Failed to delete",
      });
      console.error(error);
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
            onClick={() => handleEditNumber(params.row)}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => handleDeleteNumber(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },

    { field: "name", headerName: "Name", flex: 1 },
    { field: "mobileNo", headerName: "Mobile Number", flex: 1.3 },
    { field: "Status", headerName: "Status", flex: 1 },
  ];

  const initial = {
    Title: "",
    Type: "",
    template: "",
    FileName: "",
    // CampaignDataFile: "",
    CampaignDataFile: null,
  };
  const { handleSubmit, control, reset, watch, setValue, getValues } = useForm({
    defaultValues: initial,
  });

  const getMessageTemplates = async () => {
    try {
      const response = await axios.request({
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_URL}WPUtility`,
        params: {
          fields: "name,components,language",
        },
        headers: {
          apikey: "8552af6c-8c67-11f0-98fc-02c8a5e042bd",
        },
      });
      const jsonData = response.data.response;
      const jsonDataOBJ = JSON.parse(jsonData);

      const templates = jsonDataOBJ?.data || [];
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

  // const handleSubmitForm = async (data) => {
  //   try {
  //     const formData = new FormData();
  //     let finalFile;

  //     // 🔹 Convert dropdown IDs → mobile numbers
  //     // const selectedNumbers = campaignOptions
  //     //   .filter((item) => data.MobileNo?.includes(item.id))
  //     //   .map((item) => item.mobileNo);

  //     // console.log("Selected Dropdown Numbers:", selectedNumbers);

  //     // // ==================================================
  //     // // ✅ CASE 1: File Uploaded
  //     // // ==================================================
  //     // if (data.CampaignDataFile) {
  //     //   const fileText = await data.CampaignDataFile.text();

  //     //   const lines = fileText
  //     //     .split(/\r?\n/)
  //     //     .filter((line) => line.trim() !== "");

  //     //   const existingNumbers = lines.slice(1);

  //     //   console.log("Existing Numbers From File:", existingNumbers);

  //     //   // Merge
  //     //   const allNumbers = [...existingNumbers, ...selectedNumbers];

  //     //   // Remove duplicates
  //     //   const uniqueNumbers = [...new Set(allNumbers)];

  //     //   console.log("Final Unique Numbers:", uniqueNumbers);

  //     //   const finalCsvContent = "MobileNumber\n" + uniqueNumbers.join("\n");

  //     //   finalFile = new File([finalCsvContent], data.CampaignDataFile.name, {
  //     //     type: "text/csv",
  //     //   });
  //     // }

  //     // // ==================================================
  //     // // ✅ CASE 2: File NOT Uploaded → Create New CSV
  //     // // ==================================================
  //     // else {
  //     //   if (selectedNumbers.length === 0) {
  //     //     Swal.fire({
  //     //       icon: "warning",
  //     //       title: "No Data",
  //     //       text: "Please upload file or select mobile numbers.",
  //     //     });
  //     //     return;
  //     //   }

  //     //   const uniqueNumbers = [...new Set(selectedNumbers)];
  //     //   console.log("Creating New File With Numbers:", uniqueNumbers);
  //     //   const newCsvContent = "MobileNumber\n" + uniqueNumbers.join("\n");
  //     //   finalFile = new File([newCsvContent], "CampaignData.csv", {
  //     //     type: "text/csv",
  //     //   });
  //     // }

  //     // console.log("Final CSV Ready To Send:");
  //     // console.log(await finalFile.text());

      
  //     // 🔹 1️⃣ Dropdown IDs → mobile numbers
  //     const selectedNumbers = campaignOptions
  //       .filter((item) => data.MobileNo?.includes(item.id))
  //       .map((item) => item.mobileNo?.trim());

  //     console.log("Selected Dropdown Numbers:", selectedNumbers);

  //     // 🔹 2️⃣ Custom Chip Numbers
  //     const customNumbers = (data.CustomNo || [])
  //       .map((num) => num.trim())
  //       .filter((num) => /^\d{10}$/.test(num));

  //     console.log("Custom Chip Numbers:", customNumbers);

  //     // ==================================================
  //     // ✅ CASE 1: File Uploaded
  //     // ==================================================
  //     const uploadedFile = data.CampaignDataFile;

  //     if (uploadedFile) {
  //       const fileText = await uploadedFile.text();

  //       const lines = fileText
  //         .split(/\r?\n/)
  //         .map((line) => line.trim())
  //         .filter((line) => line !== "");

  //       // Remove header
  //       const existingNumbers = lines.slice(1);

  //       console.log("Existing Numbers From File:", existingNumbers);

  //       // 🔥 Merge All 3 Sources
  //       const allNumbers = [
  //         ...existingNumbers,
  //         ...selectedNumbers,
  //         ...customNumbers,
  //       ];

  //       // Remove duplicates
  //       const uniqueNumbers = [...new Set(allNumbers)];

  //       console.log("Final Unique Numbers:", uniqueNumbers);

  //       const finalCsvContent = "MobileNumber\n" + uniqueNumbers.join("\n");

  //       finalFile = new File([finalCsvContent], uploadedFile.name, {
  //         type: "text/csv",
  //       });
  //     }

  //     // ==================================================
  //     // ✅ CASE 2: File NOT Uploaded
  //     // ==================================================
  //     else {
  //       const allNumbers = [...selectedNumbers, ...customNumbers];

  //       const uniqueNumbers = [...new Set(allNumbers)];

  //       if (uniqueNumbers.length === 0) {
  //         Swal.fire({
  //           icon: "warning",
  //           title: "No Data",
  //           text: "Please upload file, select mobile numbers, or enter custom numbers.",
  //         });
  //         return;
  //       }

  //       console.log("Creating New File With Numbers:", uniqueNumbers);

  //       const newCsvContent = "MobileNumber\n" + uniqueNumbers.join("\n");

  //       finalFile = new File([newCsvContent], "CampaignData.csv", {
  //         type: "text/csv",
  //       });
  //     }

  //     console.log("Final CSV Ready To Send:");
  //     console.log(await finalFile.text());

  //     // Append file
  //     formData.append("CampaignDataFile", finalFile);

  //     // Other fields
  //     formData.append("Title", data.Title || "");
  //     formData.append("Type", data.Type || "");
  //     formData.append("Templete", data.template || "");
  //     formData.append("Attachment", data.FileName);

  //     // Debug FormData
  //     console.log("FormData Values:");
  //     for (let pair of formData.entries()) {
  //       console.log(pair[0], pair[1]);
  //     }

  //     // API Call
  //     let response = await axios.post(
  //       `${BASE_URL}WPUtility/Campaign01`,
  //       formData,
  //     );

  //     console.log("POST", response);

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
  //     console.log("ERROR", error);
  //   }
  // };

  const handleSubmitForm = async (data) => {
  try {
    const formData = new FormData();
    let finalFile;

    // 🔹 1️⃣ Dropdown IDs → mobile numbers
    const selectedNumbers = campaignOptions
      .filter((item) => data.MobileNo?.includes(item.id))
      .map((item) => item.mobileNo?.trim());

    console.log("Selected Dropdown Numbers:", selectedNumbers);

    // 🔹 2️⃣ Custom Chip Numbers
    const customNumbers = (data.CustomNo || [])
      .map((num) => num.trim())
      .filter((num) => /^\d{10}$/.test(num));

    console.log("Custom Chip Numbers:", customNumbers);

    // 🔹 3️⃣ Prepare Template Param Columns (b1, b2, b3...)
    const paramKeys = uniqueParams.map((param) =>
      param.replace(/[{}]/g, "")
    );

    const paramColumns = paramKeys.map(
      (key) => paramValues[key] || ""
    );

    // ==================================================
    // ✅ CASE 1: File Uploaded
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

      // 🔥 Merge All 3 Sources
      const allNumbers = [
        ...existingNumbers,
        ...selectedNumbers,
        ...customNumbers,
      ];

      // Remove duplicates
      const uniqueNumbers = [...new Set(allNumbers)];

      console.log("Final Unique Numbers:", uniqueNumbers);

      // 🔥 Create Header with Params
      let header = "MobileNumber";
      paramKeys.forEach((_, index) => {
        header += `,b${index + 1}`;
      });

      // 🔥 Create Rows
      const rows = uniqueNumbers.map((number) => {
        return [number, ...paramColumns].join(",");
      });

      const finalCsvContent = header + "\n" + rows.join("\n");

      finalFile = new File([finalCsvContent], uploadedFile.name, {
        type: "text/csv",
      });
    }

    // ==================================================
    // ✅ CASE 2: File NOT Uploaded
    // ==================================================
    else {
      const allNumbers = [...selectedNumbers, ...customNumbers];

      const uniqueNumbers = [...new Set(allNumbers)];

      if (uniqueNumbers.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "No Data",
          text:
            "Please upload file, select mobile numbers, or enter custom numbers.",
        });
        return;
      }

      console.log("Creating New File With Numbers:", uniqueNumbers);

      // 🔥 Create Header with Params
      let header = "MobileNumber";
      paramKeys.forEach((_, index) => {
        header += `,b${index + 1}`;
      });

      // 🔥 Create Rows
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

  const [campaignOptions, setCampaignOptions] = useState([
    { id: 1, name: "Rahul Sharma", mobileNo: "9876543210" },
    { id: 2, name: "Abc Test", mobileNo: "8080161922" },
    { id: 3, name: "Neha Singh", mobileNo: "9988776655" },
  ]);

  // const handleAddAndSave = () => {
  //   // ===== Validation =====
  //   if (!newName || !newMobile) {
  //     const Toast = Swal.mixin({
  //       toast: true,
  //       position: "center",
  //       showConfirmButton: false,
  //       timer: 2500,
  //       timerProgressBar: true,
  //     });

  //     Toast.fire({
  //       icon: "error",
  //       title: "Please enter both fields",
  //     });
  //     return;
  //   }

  //   if (!/^\d{10}$/.test(newMobile)) {
  //     // alert("Enter valid 10 digit mobile number");
  //     const Toast = Swal.mixin({
  //       toast: true,
  //       position: "center",
  //       showConfirmButton: false,
  //       timer: 2500,
  //       timerProgressBar: true,
  //     });

  //     Toast.fire({
  //       icon: "error",
  //       title: "Enter valid 10 digit mobile number",
  //     });
  //     return;
  //   }

  //   // Duplicate check in DataGrid
  //   const isDuplicate = mobileRows.some((row) => row.mobileNo === newMobile);

  //   if (isDuplicate) {
  //     const Toast = Swal.mixin({
  //       toast: true,
  //       position: "center",
  //       showConfirmButton: false,
  //       timer: 2500,
  //       timerProgressBar: true,
  //     });

  //     Toast.fire({
  //       icon: "error",
  //       title: "Mobile number already added",
  //     });
  //     return;
  //   }

  //   // ===== Create New Row =====
  //   const newRow = {
  //     id: Date.now(),
  //     name: newName,
  //     mobileNo: newMobile,
  //   };

  //   // 1️⃣ Add to DataGrid
  //   setMobileRows((prev) => [...prev, newRow]);

  //   // ===== Add to campaignOptions =====
  //   const existsInOptions = campaignOptions.some(
  //     (item) => item.mobileNo === newMobile,
  //   );

  //   if (!existsInOptions) {
  //     const newId =
  //       campaignOptions.length > 0
  //         ? Math.max(...campaignOptions.map((item) => item.id)) + 1
  //         : 1;

  //     const newEntry = {
  //       id: newId,
  //       name: newName,
  //       mobileNo: newMobile,
  //     };

  //     setCampaignOptions((prev) => [...prev, newEntry]);

  //     // 2️⃣ Update React Hook Form
  //     const selectedIds = getValues("MobileNo") || [];
  //     setValue("MobileNo", [...selectedIds, newId]);
  //   }

  //   // Reset input fields only
  //   setNewName("");
  //   setNewMobile("");
  // };

  const handleAddAndSave = async (data) => {
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
        Toast.fire({
          icon: "error",
          title: "Please enter both fields",
        });
        return;
      }

      if (!/^\d{10}$/.test(newMobile)) {
        Toast.fire({
          icon: "error",
          title: "Enter valid 10 digit mobile number",
        });
        return;
      }

      // Duplicate check (Skip in Edit if same number)
      const isDuplicate = mobileRows.some((row) => row.mobileNo === newMobile);

      if (isDuplicate) {
        Toast.fire({
          icon: "error",
          title: "Mobile number already added",
        });
        return;
      }

      // ===== Payload =====
      const payload = {
        UserId: sessionStorage.getItem("userId"),
        CreatedBy: sessionStorage.getItem("userId") || "",

        CreatedDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
        ModifiedBy: sessionStorage.getItem("userId") || "",

        ModifiedDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
        Name: newName,
        MobileNo: newMobile,
      };
      console.log("object", payload);
      // return
      // ===== API CALL =====
      if (isEdit === "UPDATE") {
        await BASE_URL.put(`/MobileMaster/${editMobile}`, payload);
        let response = await axios.put(
          `${BASE_URL}MobileMaster/${data.Id}`,
          payload,
        );

        Toast.fire({
          icon: "success",
          title: "Updated successfully",
        });

        // Update DataGrid row
        setMobileRows((prev) =>
          prev.map((row) =>
            row.mobileNo === editMobile
              ? { ...row, name: newName, mobileNo: newMobile }
              : row,
          ),
        );
      } else {
        let response = await axios.post(`${BASE_URL}MobileMaster`, payload);

        Toast.fire({
          icon: "success",
          title: "Added successfully",
        });

        const newRow = {
          id: Date.now(),
          name: newName,
          mobileNo: newMobile,
        };

        setMobileRows((prev) => [...prev, newRow]);
      }

      // ===== Reset =====
      setNewName("");
      setNewMobile("");
      setIsEdit(false);
      setEditMobile(null);
      setOpenMobileModal(false);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text:
          error?.response?.data?.message ||
          "Something went wrong while saving. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

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
            <Grid item xs={6} display="flex" justifyContent="flex-start">
              <FormControlLabel
                control={<Checkbox defaultChecked name="Status" />}
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
              getRowId={(row) => row.mobileNo}
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
            SAVE
            {/* {QCSAVE} */}
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
      <Box>
        {/* <Paper
          sx={{
            maxWidth: 850,
            mx: "auto",
            borderRadius: 4,
            overflow: "hidden",
            mb:2


            
          }}
        >Test</Paper> */}
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
            <Grid container spacing={5}>
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
                  {/* <Box flex={1} minWidth={0}>
                    <Controller
                      name="MobileNo"
                      control={control}
                      defaultValue={[]}
                      render={({ field, fieldState }) => {
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
                              sx={{
                                minHeight: 85,
                                "& .MuiSelect-select": {
                                  display: "flex",
                                  alignItems: "center",
                                },
                              }}
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    maxHeight: 200,
                                  },
                                },
                              }}
                              renderValue={(selected) => {
                                const selectedItems = campaignOptions.filter(
                                  (item) => selected.includes(item.id),
                                );

                                if (selectedItems.length === 0) {
                                  return "Select Mobile No";
                                }
                                const mobileNumbers = selectedItems.map(
                                  (item) => item.mobileNo,
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
                                          key={item.id}
                                          label={item.mobileNo}
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
                              {campaignOptions.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                  />
                                  <ListItemText
                                    primary={option.name}
                                    secondary={option.mobileNo}
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
                  </Box> */}
                  <Box flex={1} minWidth={0}>
                    <Controller
                      name="MobileNo"
                      control={control}
                      defaultValue={[]}
                      render={({ field, fieldState }) => {
                        const allIds = campaignOptions.map((item) => item.id);
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

                                // ✅ Select All Logic
                                if (value.includes("all")) {
                                  if (isAllSelected) {
                                    field.onChange([]); // Unselect all
                                  } else {
                                    field.onChange(allIds); // Select all
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
                                PaperProps: {
                                  sx: {
                                    maxHeight: 250,
                                  },
                                },
                              }}
                              renderValue={(selected) => {
                                const selectedItems = campaignOptions.filter(
                                  (item) => selected.includes(item.id),
                                );

                                if (selectedItems.length === 0) {
                                  return "Select Mobile No";
                                }

                                const mobileNumbers = selectedItems.map(
                                  (item) => item.mobileNo,
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
                                          key={item.id}
                                          label={item.mobileNo}
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
                              {/* ✅ Select All Option */}
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

                              {/* ✅ Your Existing Options */}
                              {campaignOptions.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                  />
                                  <ListItemText
                                    primary={option.name}
                                    secondary={option.mobileNo}
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

              {/* <Grid item md={4} sm={4} xs={12}>
                <Controller
                  name="CustomNo"
                  control={control}
                  defaultValue={[]}
                  rules={{
                    validate: (value) => {
                      if (!value || value.length === 0) {
                        return "Please enter at least one mobile number";
                      }
                      return true;
                    },
                  }}
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
                          field.value && field.value.length > 0
                            ? field.value.join(", ")
                            : "Enter 10 digit mobile number and press Enter"
                        }
                      >
                        <Box>
                          <Autocomplete
                            multiple
                            freeSolo
                            options={[]}
                            value={field.value || []}
                            inputValue={inputValue}
                            // 🔹 FIX DELETE ISSUE
                            onChange={(event, newValue) => {
                              field.onChange(newValue);
                            }}
                            onInputChange={(event, newInputValue) => {
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
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  label={option}
                                  {...getTagProps({ index })}
                                  size="small"
                                  color="primary"
                                />
                              ))
                            }
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
                            // 🔹 FIX HEIGHT + 2 CHIP PER ROW + SCROLL
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                minHeight: "70px",
                                maxHeight: "70px",
                                overflowY: "auto",
                                alignItems: "flex-start",
                                flexWrap: "wrap",
                                gap: "4px",
                              },
                              "& .MuiChip-root": {
                                maxWidth: "48%", // 2 chips per row approx
                              },
                            }}
                          />
                        </Box>
                      </Tooltip>
                    );
                  }}
                />
              </Grid> */}

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
                  defaultValue={null}
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
                    required: isAttachmentEnabled ? "File is required" : false,
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
      </Box>
    </>
  );
}
