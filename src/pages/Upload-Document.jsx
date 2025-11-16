import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Button,
  Checkbox,
  Collapse,
  FormControlLabel,
  Grid,
  IconButton,
  ListItemText,
  Menu,
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
import { useThemeMode } from "../Dashboard/Theme";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

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
  const [DocmasterList, setDocmasterList] = React.useState([]);

  const [DeleteLineNums, setDeleteLineNums] = React.useState([]);
  const fileInputRef = React.useRef(null);
  const [isAddMissing, setIsAddMissing] = React.useState(false);
  

  const firstLoad = React.useRef(true);
  const handleClose = () => setOn(false);
  const { userSession } = useThemeMode();

  const [subDocMap, setSubDocMap] = React.useState({});
  const [isMobileDisabled, setIsMobileDisabled] = React.useState(false);


  const { checkAccess } = useThemeMode();

  const canAdd = checkAccess(9, "IsAdd");
  const canEdit = checkAccess(9, "IsEdit");
  const canDelete = checkAccess(9, "IsDelete");

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
    //  formState: { errors },
  } = useForm({
    defaultValues: {
      initial,
    },
  });

  const DocopetionOptions = [
    { label: "Land Acquisition", value: "LandAcquisition" },
    { label: "Income Certificate", value: "IncomeCertificate" },
    { label: "Policy Document", value: "PolicyDocument" },
    { label: "NOC", value: "NOC" },
    { label: "OTHER", value: "OTHER" },
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

    {
      field: "action",
      headerName: "Action",
      width: 140,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const isDisabled = params.row.isDisabled;

        return (
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

            <Tooltip title={isDisabled ? "No permission to remove" : "Remove"}>
              <span>
                <IconButton
                  size="small"
                  color="error"
                  disabled={isDisabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDisabled) handleRemove(params.row);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip
              title={
                isDisabled ? "No permission to replace file" : "Replace File"
              }
            >
              <span>
                <IconButton
                  size="small"
                  color="primary"
                  component="label"
                  disabled={isDisabled}
                  onClick={(e) => e.stopPropagation()}
                >
                  <AttachFileIcon fontSize="small" />
                  <input
                    type="file"
                    hidden
                    onChange={(e) => handleChangeFile(e, params.row.id)}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        );
      },
    },

    {
      field: "FileName",
      headerName: "DOCUMENT NAME",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const { id, field, api, value, row } = params;
        const isDisabled = row.isDisabled;
        const handleChange = (event) => {
          const newValue = event.target.value;
          api.updateRows([{ id, [field]: newValue }]);
          setRows((prev) =>
            prev.map((row) =>
              row.id === id ? { ...row, [field]: newValue } : row
            )
          );
        };
        const displayValue = value ? value.replace(/\.[^/.]+$/, "") : "";
        return (
          <Tooltip title={displayValue || ""} arrow placement="top">
            <TextField
              value={displayValue ?? ""}
              onChange={handleChange}
              onKeyDown={(e) => e.stopPropagation()}
              fullWidth
              size="small"
              variant="outlined"
              disabled={isDisabled}
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
        const { id, value, api, field, row } = params;
        const isDisabled = row.isDisabled;

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
            disabled={isDisabled}
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
        const isDisabled = params.row.isDisabled;

        const gazetteOptions = Array.isArray(gazeteList) ? gazeteList : [];

        const userDataStr = sessionStorage.getItem("userData");
        let UserType = null;
        let storedGazOfficer = null;

        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            UserType = userData.UserType;
            storedGazOfficer = userData.GazOfficer || "";
          } catch (error) {
            console.error("Failed to parse userData:", error);
          }
        }

        const handleChange = (e) => {
          const newValue = e.target.value;

          // Update DataGrid UI
          api.updateRows([{ id, [field]: newValue }]);

          // Update parent state
          setRows((prev) =>
            prev.map((row) =>
              row.id === id ? { ...row, [field]: newValue } : row
            )
          );
        };

        //  Logic for enabling/disabling
        const isEditable =
          UserType === "A" ||
          !storedGazOfficer ||
          storedGazOfficer.trim() === "";

        //  When disabled (non-admin + GazOfficer present)
        if (!isEditable) {
          // Keep stored value synced
          if (value !== storedGazOfficer) {
            api.updateRows([{ id, [field]: storedGazOfficer }]);
            setRows((prev) =>
              prev.map((row) =>
                row.id === id ? { ...row, [field]: storedGazOfficer } : row
              )
            );
          }
          return (
            <Tooltip title={storedGazOfficer || ""} arrow placement="top">
              <Select
                value={storedGazOfficer || ""}
                disabled={isDisabled}
                fullWidth
                variant="standard"
              >
                <MenuItem value={storedGazOfficer || ""}>
                  {storedGazOfficer || ""}
                </MenuItem>
              </Select>
            </Tooltip>
          );
        }
        return (
          <Tooltip title={value || ""} arrow placement="top">
            <Select
              value={value || ""}
              onChange={handleChange}
              fullWidth
              variant="standard"
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 220,
                    overflowY: "auto",
                  },
                },
              }}
            >
              {gazetteOptions.length > 0 ? (
                gazetteOptions.map((option) => (
                  <MenuItem
                    key={option.Name}
                    value={option.Name}
                    sx={{
                      height: 35,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {option.Name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No officers found</MenuItem>
              )}
            </Select>
          </Tooltip>
        );
      },
    },
    //     {
    //       field: "DocType",
    //       headerName: "DOCUMENT TYPE",
    //       flex: 1,
    //       renderCell: (params) => {
    //         const { id, field, value, api, row } = params;
    //         const isDisabled = row.isDisabled;

    //         const handleChange = (e) => {
    //           const newValue = e.target.value;

    //           // update DataGrid UI
    //           api.updateRows([{ id, [field]: newValue }]);

    //           // also update rows state
    //           setRows((prev) =>
    //             prev.map((row) =>
    //               row.id === id ? { ...row, [field]: newValue } : row
    //             )
    //           );
    //         };
    //         return (
    //           <Tooltip title={value || ""} arrow placement="top">
    //             <Select
    //               value={value || ""}
    //               onChange={handleChange}
    //               fullWidth
    //               disabled={isDisabled}
    //               variant="standard"
    //               MenuProps={{
    //                 PaperProps: {
    //                   style: {
    //                     maxHeight: 200,
    //                     overflowY: "auto",
    //                   },
    //                 },
    //               }}
    //             >
    //               {DocmasterList.length > 0 ? (
    //                 DocmasterList.map((option) => (
    //                   <MenuItem
    //                     key={option.value}
    //                     value={option.NameMR}
    //                     sx={{
    //                       height: 35,
    //                       display: "flex",
    //                       alignItems: "center",
    //                     }}
    //                   >
    //                     {option.NameMR}
    //                   </MenuItem>
    //                 ))
    //               ) : (
    //                 <MenuItem disabled>No options available</MenuItem>
    //               )}
    //             </Select>
    //           </Tooltip>
    //         );
    //       },
    //     },

    //     {
    //   field: "MissingDocs",
    //   headerName: "MISSING DOCUMENT",
    //   flex: 1,
    //   renderCell: (params) => {
    //     const { id, field, value, api, row } = params;
    //     const isDisabled = row.isDisabled;

    //     // Ensure value is always an array for multi-select
    //     const selectedValues = Array.isArray(value) ? value : [];

    //     const handleChange = (event) => {
    //       const newValues = event.target.value;

    //       // Update DataGrid UI
    //       api.updateRows([{ id, [field]: newValues }]);

    //       // Update rows state
    //       setRows((prev) =>
    //         prev.map((r) =>
    //           r.id === id ? { ...r, [field]: newValues } : r
    //         )
    //       );
    //     };

    //     return (
    //       <Tooltip title={selectedValues.join(", ") || ""} arrow placement="top">
    //         <Select
    //           multiple
    //           value={selectedValues}
    //           onChange={handleChange}
    //           fullWidth
    //           disabled={isDisabled}
    //           variant="standard"
    //           renderValue={(selected) => selected.join(", ")} // show comma-separated values
    //           MenuProps={{
    //             PaperProps: {
    //               style: {
    //                 maxHeight: 220,
    //                 overflowY: "auto",
    //               },
    //             },
    //           }}
    //         >
    //           {DocmasterList.length > 0 ? (
    //             DocmasterList.map((option) => (
    //               <MenuItem key={option.value} value={option.NameMR}>
    //                 <Checkbox
    //                   checked={selectedValues.indexOf(option.NameMR) > -1}
    //                   size="small"
    //                 />
    //                 <ListItemText primary={option.NameMR} />
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

    // ]]]]]]]]]]]]]]]]]]]]]]]]]]]
    // {
    //   field: "DocType",
    //   headerName: "DOCUMENT TYPE",
    //   flex: 1,
    //   renderCell: (params) => {
    //     const { id, field, value, api } = params;
    //     const isDisabled = params.row.isDisabled;

    //     const handleChange = (e) => {
    //       const newValue = e.target.value;

    //       setRows((prev) =>
    //         prev.map((row) => {
    //           if (row.id === id) {
    //             // auto-remove this docType if it exists inside MissingDocs
    //             const updatedMissingDocs = Array.isArray(row.MissingDocs)
    //               ? row.MissingDocs.filter((doc) => doc !== newValue)
    //               : [];
    //             return {
    //               ...row,
    //               [field]: newValue,
    //               MissingDocs: updatedMissingDocs,
    //             };
    //           }
    //           return row;
    //         })
    //       );

    //       api.updateRows([{ id, [field]: newValue }]);
    //     };

    //     return (
    //       <Tooltip title={value || ""} arrow placement="top">
    //         <Select
    //           value={value || ""}
    //           onChange={handleChange}
    //           fullWidth
    //           disabled={isDisabled}
    //           variant="standard"
    //           MenuProps={{
    //             PaperProps: { style: { maxHeight: 200, overflowY: "auto" } },
    //           }}
    //         >
    //           {DocmasterList.length > 0 ? (
    //             DocmasterList.map((option) => (
    //               <MenuItem
    //                 key={option.value}
    //                 value={option.NameMR}
    //                 sx={{ height: 35, display: "flex", alignItems: "center" }}
    //               >
    //                 {option.NameMR}
    //               </MenuItem>
    //             ))
    //           ) : (
    //             <MenuItem disabled>No options available</MenuItem>
    //           )}
    //         </Select>
    //       </Tooltip>
    //     );
    //   },
    // },

    {
      field: "DocType",
      headerName: "DOCUMENT TYPE",
      flex: 1,
      renderCell: (params) => {
        const { id, field, value, api, row } = params;
        const isDisabled = row.isDisabled;

        const handleChange = (e) => {
          const newValue = e.target.value;

          // find selected document in master list
          const selectedDoc = DocmasterList.find(
            (doc) => doc.NameMR === newValue
          );

          // update subdoc list for that row
          setSubDocMap((prev) => ({
            ...prev,
            [id]: selectedDoc?.SubDocs || [],
          }));

          // update DataGrid & rows
          api.updateRows([{ id, [field]: newValue, MissingDocs: [] }]);
          setRows((prev) =>
            prev.map((row) =>
              row.id === id
                ? { ...row, [field]: newValue, MissingDocs: [] }
                : row
            )
          );
        };

        return (
          <Tooltip title={value || ""} arrow placement="top">
            <Select
              value={value || ""}
              onChange={handleChange}
              fullWidth
              disabled={isDisabled}
              variant="standard"
               
              MenuProps={{
                PaperProps: {
                  style: { maxHeight: 200, overflowY: "auto" },
                },
              }}
            >
              {DocmasterList.length > 0 ? (
                DocmasterList.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.NameMR}
                    sx={{ height: 35, display: "flex", alignItems: "center" }}
                  >
                    {option.NameMR}
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
    // {
    //   field: "MissingDocs",
    //   headerName: "MISSING DOCUMENT",
    //   flex: 1,
    //   renderCell: (params) => {
    //     const { id, field, value, api, row } = params;
    //     const isDisabled = row.isDisabled;

    //     const selectedValues = Array.isArray(value) ? value : [];
    //     const selectedDocType = row.DocType;

    //     const handleChange = (event) => {
    //       const newValues = event.target.value;

    //       setRows((prev) =>
    //         prev.map((r) => (r.id === id ? { ...r, [field]: newValues } : r))
    //       );

    //       api.updateRows([{ id, [field]: newValues }]);
    //     };

    //     return (
    //       <Tooltip
    //         title={selectedValues.join(", ") || ""}
    //         arrow
    //         placement="top"
    //       >
    //         <Select
    //           multiple
    //           value={selectedValues}
    //           onChange={handleChange}
    //           fullWidth
    //           disabled={isDisabled}
    //           variant="standard"
    //           renderValue={(selected) => selected.join(", ")}
    //           MenuProps={{
    //             PaperProps: {
    //               style: {
    //                 maxHeight: 220,
    //                 overflowY: "auto",
    //               },
    //             },
    //           }}
    //         >
    //           {DocmasterList.length > 0 ? (
    //             DocmasterList.map((option) => {
    //               const isOptionDisabled = selectedDocType === option.NameMR;
    //               return (
    //                 <MenuItem
    //                   key={option.value}
    //                   value={option.NameMR}
    //                   disabled={isOptionDisabled}
    //                 >
    //                   <Checkbox
    //                     checked={selectedValues.indexOf(option.NameMR) > -1}
    //                     size="small"
    //                   />
    //                   <ListItemText
    //                     primary={
    //                       isOptionDisabled
    //                         ? `${option.NameMR}`
    //                         : option.NameMR
    //                     }
    //                   />
    //                 </MenuItem>
    //               );
    //             })
    //           ) : (
    //             <MenuItem disabled>No options available</MenuItem>
    //           )}
    //         </Select>
    //       </Tooltip>
    //     );
    //   },
    // },
    {
      field: "MissingDocs",
      headerName: "MISSING DOCUMENT",
      flex: 1,
      renderCell: (params) => {
        const { id, field, value, api, row } = params;
        const isDisabled = row.isDisabled;

        const selectedValues = Array.isArray(value) ? value : [];
        const availableSubDocs = subDocMap[id] || []; // get subdocs for this row

        const handleChange = (event) => {
          const newValues = event.target.value;
          setRows((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [field]: newValues } : r))
          );
          api.updateRows([{ id, [field]: newValues }]);
        };

        return (
          <Tooltip
            title={selectedValues.join(", ") || ""}
            arrow
            placement="top"
          >
            <Select
              multiple
              value={selectedValues}
              onChange={handleChange}
              fullWidth
              disabled={isDisabled}
              variant="standard"
              renderValue={(selected) => selected.join(", ")}
              MenuProps={{
                PaperProps: { style: { maxHeight: 220, overflowY: "auto" } },
              }}
            >
              {availableSubDocs.length > 0 ? (
                availableSubDocs.map((option) => (
                  <MenuItem key={option.value} value={option.NameMR}>
                    <Checkbox
                      checked={selectedValues.indexOf(option.NameMR) > -1}
                      size="small"
                    />
                    <ListItemText primary={option.NameMR} />
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No any sub document added</MenuItem>
              )}
            </Select>
          </Tooltip>
        );
      },
    },
  ];

  const visibleColumns = isAddMissing
    ? DocColumns
    : DocColumns.filter((col) => col.field !== "MissingDocs");

  const Maincolumns = [
    // {
    //   field: "actions",
    //   headerName: "Action",
    //   width: 150,
    //   sortable: false,
    //   renderCell: (params) => (
    //     <strong>
    //       <IconButton
    //         color="primary"
    //         onClick={() => handleUpdate(params.row)}
    //         sx={{
    //           color: "rgb(0, 90, 91)",
    //           "&:hover": { backgroundColor: "rgba(0, 90, 91, 0.1)" },
    //         }}
    //       >
    //         <EditNoteIcon />
    //       </IconButton>
    //       <IconButton
    //         size="medium"
    //         sx={{ color: "red" }}
    //         onClick={() => handleDelete(params.row)}
    //         disabled={
    //           JSON.parse(sessionStorage.getItem("userData") || "{}")
    //             ?.UserType?.trim()
    //             .toUpperCase() !== "A"
    //         }
    //       >
    //         <DeleteForeverIcon />
    //       </IconButton>
    //     </strong>
    //   ),
    // },
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <strong>
          {/* ---- EDIT BUTTON ---- */}
          <Tooltip
            title={!canEdit ? "You don't have Edit permission" : ""}
            placement="top"
          >
            <span>
              <IconButton
                color="primary"
                onClick={() => handleUpdate(params.row)}
                disabled={!canEdit}
                sx={{
                  color: canEdit ? "rgb(0, 90, 91)" : "grey",
                  "&:hover": {
                    backgroundColor: canEdit
                      ? "rgba(0, 90, 91, 0.1)"
                      : "transparent",
                  },
                }}
              >
                <EditNoteIcon />
              </IconButton>
            </span>
          </Tooltip>

          {/* ---- DELETE BUTTON ---- */}
          <Tooltip
            title={!canDelete ? "You don't have Delete permission" : ""}
            placement="top"
          >
            <span>
              <IconButton
                size="medium"
                sx={{ color: canDelete ? "red" : "grey" }}
                onClick={() => handleDelete(params.row)}
                disabled={!canDelete}
              >
                <DeleteForeverIcon />
              </IconButton>
            </span>
          </Tooltip>
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
      headerName: "MOBILE NO",
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
    setIsAddMissing(false);
setIsMobileDisabled(true);

    try {
      setLoading(true);

      // Get user data
      const userData = sessionStorage.getItem("userData");
      let userType = null;
      let userId = null;

      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          userType = parsedData.UserType;
          userId = parsedData.UserId;
        } catch (e) {
          console.error("Error parsing userData:", e);
        }
      }

      if (userType === "A") {
        // Call get API by Id
        const apiUrl = `${BASE_URL}DocUpload/${rowData.Id}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.values) {
          const olddata = response.data.values;
          originalDataRef.current = olddata;

          const formattedLines = Array.isArray(olddata.oDocLines)
            ? olddata.oDocLines.map((line, index) => ({
                ...line,
                id: line.LineNum ?? index,
              }))
            : [];

          reset({
            Id: olddata.Id ?? "",
            Name: olddata.Name ?? "",
            MobileNo: olddata.MobileNo
              ? olddata.MobileNo.replace(/^\+91/, "")
              : "",
            Email: olddata.Email ?? "",
            Address: olddata.Address ?? "",
            oDocLines: formattedLines,
          });

          setRows(formattedLines);
        }
      } else {
        const params = {};

        const userData = sessionStorage.getItem("userData");
        let userId = null;
        if (userData) {
          try {
            const parsedData = JSON.parse(userData);
            userId = parsedData.Username;
          } catch (e) {
            console.error("Error parsing userData:", e);
          }
        }

        // if (createdBy) params.CreatedBy = createdBy;
        if (rowData?.Id) params.Id = rowData.Id;

        const listResponse = await axios.get(`${BASE_URL}DocUpload`, {
          params,
        });

        if (listResponse.data && listResponse.data.values) {
          const olddata = listResponse.data.values;
          originalDataRef.current = olddata;

          const formattedLines = Array.isArray(olddata.oDocLines)
            ? olddata.oDocLines.map((line, index) => ({
                ...line,
                id: line.LineNum ?? index,
              }))
            : [];

          reset({
            Id: olddata.Id ?? "",
            Name: olddata.Name ?? "",
            MobileNo: olddata.MobileNo
              ? olddata.MobileNo.replace(/^\+91/, "")
              : "",
            Email: olddata.Email ?? "",
            Address: olddata.Address ?? "",
            oDocLines: formattedLines,
          });

          setRows(formattedLines);
        }
      }
    } catch (error) {
      console.error("Error in handleUpdate:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFormData = () => {
    setRows([]);
  setIsMobileDisabled(false);    

    if (ClearUpdateButton === "CLEAR") {
      reset({
        Status: 1,
        Address: "",
        Email: "",
        MobileNo: "",
        Name: "",
        oDocLines: [],
      });
      setIsAddMissing(false);
    }
    // if (ClearUpdateButton === "RESET") {
    //   if (originalDataRef.current) {
    //     const resetData = { ...originalDataRef.current };

    //     // Remove +91 from MobileNo if it exists
    //     if (resetData.MobileNo && resetData.MobileNo.startsWith("+91")) {
    //       resetData.MobileNo = resetData.MobileNo.slice(3);
    //     }
    //     reset(resetData);

    //     // also set rows for DataGrid
    //     if (resetData.oDocLines && Array.isArray(resetData.oDocLines)) {
    //       const formattedLines = resetData.oDocLines.map((line, index) => ({
    //         ...line,
    //         id: line.LineNum ?? index,
    //         Email:line.Email,
    //        }));
    //       setRows(formattedLines);
    //     } else {
    //       setRows([]);
    //     }
    //   } else {
    //     reset({
    //       Status: 1,
    //       Address: "",
    //       Email: "",
    //       MobileNo: "",
    //       Name: "",
    //       oDocLines: [],
    //     });
    //     setRows([]);
    //   }
    // }
    if (ClearUpdateButton === "RESET") {
      if (originalDataRef.current) {
        const resetData = { ...originalDataRef.current };

        // Format before resetting
        if (resetData.MobileNo?.startsWith("+91")) {
          resetData.MobileNo = resetData.MobileNo.slice(3);
        }

        reset({
          Status: resetData.Status ?? 1,
          Address: resetData.Address ?? "",
          Email: resetData.Email ?? "",
          MobileNo: resetData.MobileNo ?? "",
          Name: resetData.Name ?? "",
          oDocLines: resetData.oDocLines ?? [],
        });

        if (Array.isArray(resetData.oDocLines)) {
          const formattedLines = resetData.oDocLines.map((line, index) => ({
            ...line,
            id: line.LineNum ?? index,
          }));
          setRows(formattedLines);
        } else {
          setRows([]);
        }
        setIsAddMissing(resetData.IsAddMissing ?? false);
      }
    }
  };

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
    setIsAddMissing(false);
  };

  const handleRemove = (rowToRemove) => {
    setRows((prev) =>
      prev.filter((row) => {
        if (row.LineNum !== undefined && rowToRemove.LineNum !== undefined) {
          return row.LineNum !== rowToRemove.LineNum;
        }
        return row.id !== rowToRemove.id;
      })
    );

    if (rowToRemove.LineNum !== undefined) {
      setDeleteLineNums((prev) => {
        // Only add if it doesn't exist already
        if (!prev.includes(Number(rowToRemove.LineNum))) {
          return [...prev, Number(rowToRemove.LineNum)];
        }
        return prev;
      });
    }
  };

  // const handleFileUpload = async (e) => {
  //   const allowedExt = ["jpg", "jpeg", "png", "pdf"];
  //   const maxSize = 1 * 1024 * 1024; // 1 MB

  //   const files = Array.from(e.target.files);

  //   // filter invalid files
  //   const validFiles = files.filter((file) => {
  //     const ext = file.name.split(".").pop().toLowerCase();

  //     // Check file type
  //     if (!allowedExt.includes(ext)) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Invalid File Type",
  //         text: `${file.name} is not allowed. Only JPG, JPEG, PNG, and PDF are accepted.`,
  //         confirmButtonColor: "#d33",
  //       });
  //       return false;
  //     }

  //     // Check file size
  //     if (file.size > maxSize) {
  //       Swal.fire({
  //         toast: true,
  //         position: "center",
  //         icon: "error",
  //         title: `${file.name} exceeds the 1 MB limit.`,
  //         showConfirmButton: false,
  //         timer: 3000,
  //         timerProgressBar: true,
  //       });
  //       return false;
  //     }

  //     return true;
  //   });

  //   if (validFiles.length === 0) return;

  //   const newRows = await Promise.all(
  //     validFiles.map(async (file, index) => {
  //       const ext = file.name.split(".").pop().toLowerCase();

  //       return {
  //         id: Date.now() + index,
  //         name: file.name,
  //         type: ext,
  //         SrcPath: "",
  //         File: file,
  //         FileExt: ext,
  //         FileName: file.name,

  //         DocReqDate: dayjs().format("YYYY-MM-DD"),
  //         IssuedBy: "",
  //         DocType: "",
  //         // DocEntry: "",
  //         Status: 1,
  //         CreatedDate: dayjs().format("YYYY-MM-DD"),
  //         ModifiedDate: dayjs().format("YYYY-MM-DD"),
  //         ModifiedBy: userSession.userId,
  //         CreatedBy: userSession.userId,
  //         UserId: userSession.userId,
  //       };
  //     })
  //   );

  //   setRows((prev) => [...prev, ...newRows]);
  //   console.log("object file", newRows);

  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  // };
  const handleFileUpload = async (e) => {
    const allowedExt = ["jpg", "jpeg", "png", "pdf"];
    const maxSize = 1 * 1024 * 1024; // 1 MB

    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const ext = file.name.split(".").pop().toLowerCase();

      if (!allowedExt.includes(ext)) {
        Swal.fire({
          icon: "error",
          title: "Invalid File Type",
          text: `${file.name} is not allowed. Only JPG, JPEG, PNG, and PDF are accepted.`,
          confirmButtonColor: "#d33",
        });
        return false;
      }

      if (file.size > maxSize) {
        Swal.fire({
          toast: true,
          position: "center",
          icon: "error",
          title: `${file.name} exceeds the 1 MB limit.`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
    const currentUser = userSession.Username || userSession.userId || "";

    const newRows = await Promise.all(
      validFiles.map(async (file, index) => {
        const ext = file.name.split(".").pop().toLowerCase();
        return {
          id: Date.now() + index,
          name: file.name,
          type: ext,
          SrcPath: "",
          File: file,
          FileExt: ext,
          FileName: file.name,
          IssuedBy: "",
          DocType: "",
          Status: 1,
          CreatedDate: dayjs().format("YYYY-MM-DD"),
          ModifiedDate: dayjs().format("YYYY-MM-DD"),
          DocReqDate: dayjs().format("YYYY-MM-DD"),
          CreatedBy: currentUser,
          ModifiedBy: currentUser,
          UserId: currentUser,
        };
      })
    );

    setRows((prev) => [...prev, ...newRows]);
    console.log("object file", newRows);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChangeFile = async (e, rowId) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedExt = ["jpg", "jpeg", "png", "pdf"];
    const ext = file.name.split(".").pop().toLowerCase();

    if (!allowedExt.includes(ext)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: `${file.name} is not allowed. Only JPG, JPEG, PNG, PDF are accepted.`,
        confirmButtonColor: "#d33",
      });
      return;
    }

    // Update only the file fields in the row
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              name: file.name,
              File: file,
              FileExt: ext,
              FileName: file.name,
            }
          : row
      )
    );

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
        text: "Please select Document Type and Gazetted Officer.",
        position: "center",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });

      return;
    }

    //   let hasConflict = false;

    // rows.forEach((row, index) => {
    //   debugger
    //   const hasFile = !!row.FileName; // file uploaded
    //   const hasMissingDocs =
    //     Array.isArray(row.MissingDocs) && row.MissingDocs.length > 0;

    //   if (hasFile && hasMissingDocs) {
    //     hasConflict = true;
    //     // alert(
    //     //   `Row ${index + 1}: You cannot select Missing Documents when a file is uploaded.`
    //     // );
    //        Swal.fire({
    //       toast: true,
    //       position: "center",
    //       icon: "warning",
    //       title: `Row ${index + 1}: You cannot select Missing Documents when a file is uploaded.`,
    //       showConfirmButton: false,
    //       timer: 3000,
    //       timerProgressBar: true,
    //       // background: "#fff8e1",
    //     });

    //   }
    // });

    // if (hasConflict) {
    //   return; // Stop submission
    // }

    const formData = new FormData();

    formData.append("UserId", sessionStorage.getItem("userId") || "");
    formData.append("CreatedBy", sessionStorage.getItem("userId") || "");
    formData.append("ModifiedBy", sessionStorage.getItem("userId") || "");
    formData.append("Status", "1");
    formData.append("Email", data.Email || "");
    formData.append("MobileNo", "+91" + (data.MobileNo || ""));
    formData.append("Name", data.Name || "");
    formData.append("Address", data.Address || "");
    formData.append("Id", data.Id || "");
    formData.append("CreatedDate", dayjs().format("YYYY-MM-DD"));
    formData.append("ModifiedDate", dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS"));
    rows.forEach((row, index) => {
      formData.append(
        `oDocLines[${index}].UserId`,
        sessionStorage.getItem("UserId")
      );
      formData.append(
        `oDocLines[${index}].CreatedBy`,
        sessionStorage.getItem("userId")
      );
      formData.append(
        `oDocLines[${index}].ModifiedBy`,
        sessionStorage.getItem("userId")
      );
      formData.append(`oDocLines[${index}].Id`, row.Id || "");
      formData.append(`oDocLines[${index}].LineNum`, row.LineNum || "");
      formData.append(`oDocLines[${index}].FileExt`, row.FileExt || "");
      // formData.append(
      //   `oDocLines[${index}].FileName`,
      //   row.FileName
      //     ? row.FileName.substring(0, row.FileName.lastIndexOf(".")) ||
      //         row.FileName
      //     : row.DocType
      // );
      formData.append(
        `oDocLines[${index}].FileName`,
        row.FileName && row.FileName.trim() !== ""
          ? row.FileName.substring(0, row.FileName.lastIndexOf(".")) ||
              row.FileName
          : row.DocType
      );

      formData.append(`oDocLines[${index}].SrcPath`, row.SrcPath || "");
      formData.append(
        `oDocLines[${index}].CreatedDate`,
        row.CreatedDate
          ? dayjs(row.CreatedDate).format("YYYY-MM-DD")
          : dayjs().format("YYYY-MM-DD")
      );
      formData.append(
        `oDocLines[${index}].DocReqDate`,
        row.DocReqDate ? dayjs(row.DocReqDate).format("YYYY-MM-DD") : ""
      );
      formData.append(`oDocLines[${index}].IssuedBy`, row.IssuedBy || "");
      formData.append(`oDocLines[${index}].DocType`, row.DocType || "");
      if (row.File) {
        formData.append(`oDocLines[${index}].File`, row.File);
      }

      // Add your multiple selected MissingDocs here

      if (Array.isArray(row.MissingDocs) && row.MissingDocs.length > 0) {
        row.MissingDocs.forEach((docType, i) => {
          formData.append(`oDocLines[${index}].MissingDocs[${i}]`, docType);
        });
      }
      // else {
      //   formData.append(`oDocLines[${index}].MissingDocs`, JSON.stringify([]));
      // }
      // ============
    });
    try {
      let response;
      if (DeleteLineNums) {
        console.log("object", DeleteLineNums);

        await axios.delete(`${BASE_URL}DocUpload`, {
          headers: { "Content-Type": "application/json" },
          data: DeleteLineNums,
        });
      }

      if (SaveUpdateButton === "SAVE") {
        setLoaderOpen(true);
        response = await axios.patch(`${BASE_URL}DocUpload`, formData, {
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

        response = await axios.patch(`${BASE_URL}DocUpload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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

      if (error.response && error.Status === 413) {
        Swal.fire({
          icon: "error",
          title: "File Too Large",
          text: "One or more files exceed the maximum upload size allowed by the server.",
          confirmButtonColor: "#d33",
        });
        return;
      }

      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong while uploading.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

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

      const userData = sessionStorage.getItem("userData");
      let userType = null;

      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          userType = parsedData.UserType;
        } catch (e) {
          console.error("Error parsing userData:", e);
        }
      }

      const response = await axios.get(`${BASE_URL}DocUpload`, { params });
      if (response.data && response.data.values) {
        setDocumentlist(
          response.data.values.map((item, index) => ({
            ...item,
            id: page * limit + index + 1,
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
  //  This makes pagination work correctly
  React.useEffect(() => {
    getAllDocList(currentPage, searchText, limit);
  }, [currentPage, searchText]);

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

  const DocMasterList = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = { Status: "1", ...params };

      const { data } = await axios.get(`${BASE_URL}DocsMaster`, {
        params: queryParams,
      });

      if (data.values) {
        setDocmasterList(data.values);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (firstLoad.current) {
      // getAllDocList();
      firstLoad.current = false;

      DocMasterList();

      const userDataStr = sessionStorage.getItem("userData");
      let userType = null;
      let gazOfficer = null;

      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          userType = userData.UserType;
          gazOfficer = userData.GazOfficer || "";
        } catch (error) {
          console.error("Failed to parse userData:", error);
        }
      }

      // Fetch gazette list for Admins OR if GazOfficer is missing
      if (userType === "A" || !gazOfficer || gazOfficer.trim() === "") {
        gazettedList();
      }

      firstLoad.current = false;
    }
  }, []);

  // ===================Username and CreatedBy are same in case Doc uploaded rows are enabled logic start============================

  const currentUser = userSession.userId || "";
  const currentUserType = userSession.UserType;

  const updatedRows = rows.map((row) => {
    const createdBy = (row.CreatedBy || "").toString().trim();
    const current = currentUser.toString().trim();
    const isAllowed = currentUserType === "A" || createdBy === current;

    return {
      ...row,
      isDisabled: !isAllowed,
    };
  });


  
  // =================== Username and CreatedBy are same in case Doc uploaded rows are enabled logic start ============================
  // const updatedRows = React.useMemo(() => {
  //     if (!userSession || !userSession.UserType) return rows;

  //     const currentUser = userSession.userId || "";
  //     const currentUserType = userSession.UserType;

  //     return rows.map((row) => {
        

  //       const createdBy = (row.CreatedBy || "").toString().trim();
  //       const current = currentUser.toString().trim();
  //       const isAllowed = currentUserType === "A" || createdBy === current;
  //       return { ...row, isDisabled: !isAllowed };
  //     });
  //   }, [rows, userSession]);
  // ====================End============================

  const handleAddRow = () => {
    const userDataStr = sessionStorage.getItem("userData");
    let UserType = null;
    let CreatedBy = null;

    try {
      // debugger
      const userData = userDataStr ? JSON.parse(userDataStr) : {};
      UserType = userData.UserType;
      CreatedBy = userData.Username;
    } catch (err) {
      console.error("Error parsing userData:", err);
    }

    const newRow = {
      id: Date.now(),
      srNo: "",
      FileName: "",
      DocReqDate: dayjs().format("YYYY-MM-DD"),
      IssuedBy: "",
      DocType: "",
      CreatedBy: CreatedBy || "", // track creator for validation logic
      isDisabled: false, // ✅ always enabled when first created
      isNew: true, // optional helper flag for your grid logic
    };

    setRows((prev) => [...prev, newRow]);
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
            maxWidth: 1100,
            Height: 2500,
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
                  validate: (value) =>
                    value.trim() !== "" || "Name cannot be just spaces",
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
                        inputRef={field.ref}
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
                      disabled={isMobileDisabled}    

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
              />{" "}
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
                    type="email"
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
              {/* <Button
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
                  accept=".jpg,.jpeg,.png,.pdf"
                  hidden
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
              </Button>*/}
              <Button
                variant="contained"
                size="small"
                component={isAddMissing ? undefined : "label"}
                sx={{
                  width: 130,
                  height: 40,
                  color: "white",
                  background:
                    "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                  fontSize: "0.79rem",
                }}
                onClick={isAddMissing ? handleAddRow : undefined}
              >
                {isAddMissing ? (
                  <>
                    <AddIcon sx={{ mr: 0.5 }} />
                    Add Row
                  </>
                ) : (
                  <>
                    Upload File
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      hidden
                      multiple
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                  </>
                )}
              </Button>
            </Grid>

            {/* Checkbox Field */}
            <Grid item xs={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAddMissing}
                    onChange={(e) => setIsAddMissing(e.target.checked)}
                    size="medium"
                    sx={{ color: "rgb(0, 90, 91)" }}
                  />
                }
                label="Add Missing Document"
              />
            </Grid>

            {/* Add Row Button (placed beside checkbox) */}
            {/* <Grid item xs={6} md={4}>
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
                  fontSize: "0.79rem",
                }}
                onClick={handleAddRow}
              >
                {" "}
                <AddIcon />
                Add Row
              </Button>
            </Grid> */}

            <Grid item xs={12} style={{ height: 400, paddingBottom: 40 }}>
              <DataGrid
                rows={updatedRows}
                // columns={DocColumns}
                columns={visibleColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableRowSelectionOnClick
                hideFooter
                className="datagrid-style"
                getRowClassName={(params) =>
                  params.row.isDisabled ? "disabled-row" : ""
                }
                isCellEditable={(params) => !params.row.isDisabled}
                onRowClick={(params, event) => {
                  if (params.row.isDisabled) {
                    event.stopPropagation();
                  }
                }}
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: (theme) =>
                      theme.palette.custome.datagridcolor,
                  },
                  "& .MuiDataGrid-row:hover": {
                    boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)",
                  },
                  "& .disabled-row": {
                    pointerEvents: "auto",
                    opacity: 0.7,
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
          columns={Maincolumns}
          pagination
          paginationMode="server"
          rowCount={totalRows}
          pageSizeOptions={[limit]}
          paginationModel={{ page: currentPage, pageSize: limit }}
          onPaginationModelChange={(newModel) => setCurrentPage(newModel.page)}
          loading={loading}
          hideFooterSelectedRowCount
          disableColumnFilter
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
          }}
          getRowId={(row) => row.Id}
        />
      </Grid>
    </>
  );
};
export default UploadDocument;
