import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Modal,
  Paper,
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
import LazyAutocomplete from "../components/Autocomplete";
import InputTextField, {
  DatePickerFieldUploadDocModel,
  InputDescriptionField,
} from "../components/Component";
import Loader from "../components/Loader";
import { BASE_URL } from "../Constant";
import { useThemeMode } from "../Dashboard/Theme";
import ClearIcon from "@mui/icons-material/Clear";
import ListIcon from "@mui/icons-material/List";
import SearchIcon from "@mui/icons-material/Search";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useTheme } from "@mui/styles";

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
  const theme = useTheme();

  const [subDocMap, setSubDocMap] = React.useState({});
  const [isMobileDisabled, setIsMobileDisabled] = React.useState(false);

  const { checkAccess } = useThemeMode();
  const canAdd = checkAccess(9, "IsAdd");
  const canEdit = checkAccess(9, "IsEdit");
  const canDelete = checkAccess(9, "IsDelete");

  // =================
  const [gPage, setGPage] = React.useState(0);
  const [hasMoreGazette, setHasMoreGazette] = React.useState(true);
  const [scrollLockGaz, setScrollLockGaz] = React.useState(false);
  const [gLoading, setGLoading] = React.useState(false);
  const [gazSearch, setGazSearch] = React.useState("");
  // -----------------------------------------
  const [dPage, setDPage] = React.useState(0);
  const [hasMoreDocs, setHasMoreDocs] = React.useState(true);
  const [dLoading, setDLoading] = React.useState(false);
  const [docSearch, setDocSearch] = React.useState("");

  // ======================
  const [modalOpen, setModalOpen] = React.useState(false);
  const [currentRowId, setCurrentRowId] = React.useState(null);
  const [tempSelection, setTempSelection] = React.useState([]);
  const [OpenModal, setOpenModal] = React.useState("");

  // const [searchText, setSearchText] = useState("");
  // const handleOpen = () => setOpenModal(true);
  // const handleClose = () => setOpenModal(false);
  // ==================

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

  const { handleSubmit, control, reset, watch, setValue } = useForm({
    defaultValues: {
      initial,
    },
  });

  React.useEffect(() => {
    if (rows.length > 0 && DocmasterList.length > 0) {
      setSubDocMap(() => {
        const map = {};
        rows.forEach((row) => {
          const selectedDoc = DocmasterList.find(
            (doc) => doc.NameMR === row.DocType
          );
          map[row.id] = selectedDoc?.SubDocs || [];
        });
        return map;
      });
    }
  }, [rows, DocmasterList]);
  const [search, setSearch] = React.useState("");

  // ------------ COMMON LISTBOX ------------

  React.useEffect(() => {
    let changed = false;
    const updated = rows.map((r) => {
      if (
        r.isNew &&
        !r.isFileNameEdited &&
        r.DocType &&
        r.FileName !== r.DocType
      ) {
        changed = true;
        return { ...r, FileName: r.DocType };
      }
      return r;
    });

    if (changed) setRows(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.map((r) => r.DocType).join(",")]);

  const handleOpenModal = (row) => {
    setCurrentRowId(row.id);
    setTempSelection(row.MissingDocs || []);
    setModalOpen(true);
    setSearchText("");
  };

  const handleSaveModal = () => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === currentRowId ? { ...r, MissingDocs: tempSelection } : r
      )
    );

    setModalOpen(false);
  };

  const DocColumns = [
    {
      field: "srNo",
      headerName: "SR NO",
      minWidth: 53,
      maxWidth: 60,
      flex: 0.2,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.api.getSortedRowIds().indexOf(params.id) + 1,
    },

    {
      field: "action",
      headerName: "Action",
      minWidth: 120,
      flex: 0.3,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const isDisabled = params.row.isDisabled;
        const hasFile = Boolean(params.row.FileExt || params.row.File);

        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* {hasFile && (
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
            )} */}
            {/* EYE BUTTON ALWAYS VISIBLE — DISABLED IF NO FILE */}
            <Tooltip title={hasFile ? "Open File" : "No file Uploaded"}>
              <span>
                <IconButton
                  size="small"
                  disabled={!hasFile}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hasFile) handleViewFile(params.row);
                  }}
                >
                  <RemoveRedEyeIcon fontSize="small" />
                </IconButton>
              </span>
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
                  <DeleteOutlineOutlinedIcon fontSize="medium" />
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

    // {
    //   field: "FileName",
    //   headerName: "DOCUMENT NAME",
    //   flex: 1,
    //   width: 200,
    //   sortable: false,
    //   renderCell: (params) => {
    //     const { id, field, api, value, row } = params;
    //     const isDisabled = row.isDisabled;
    //     const handleChange = (event) => {
    //       const newValue = event.target.value;
    //       api.updateRows([{ id, [field]: newValue }]);
    //       setRows((prev) =>
    //         prev.map((row) =>
    //           row.id === id ? { ...row, [field]: newValue } : row
    //         )
    //       );
    //     };
    //     const displayValue = value ? value.replace(/\.[^/.]+$/, "") : "";
    //     return (
    //       <Tooltip title={displayValue || ""} arrow placement="top">
    //         <TextField
    //           value={displayValue ?? ""}
    //           onChange={handleChange}
    //           onKeyDown={(e) => e.stopPropagation()}
    //           fullWidth
    //           size="small"
    //           variant="outlined"
    //           disabled={isDisabled}
    //         />
    //       </Tooltip>
    //     );
    //   },
    // },
    // {
    //   field: "FileName",
    //   headerName: "DOCUMENT NAME",
    //   flex: 1,
    //   width: 200,
    //   sortable: false,
    //   renderCell: (params) => {
    //     const { id, api, row } = params;
    //     const isDisabled = row.isDisabled;

    //     const handleChange = (event) => {
    //       const newValue = event.target.value;
    //       api.updateRows([{ id, FileName: newValue }]);
    //       setRows((prev) =>
    //         prev.map((r) => (r.id === id ? { ...r, FileName: newValue } : r))
    //       );
    //     };

    //     // Show the auto-filled or manually typed value
    //     const displayValue = row.FileName || "";

    //     return (
    //       <Tooltip title={displayValue} arrow placement="top">
    //         <TextField
    //           value={displayValue}
    //           onChange={handleChange}
    //           onKeyDown={(e) => e.stopPropagation()}
    //           fullWidth
    //           size="small"
    //           variant="outlined"
    //           disabled={isDisabled}
    //         />
    //       </Tooltip>
    //     );
    //   },
    // },
    {
      field: "FileName",
      headerName: "DOCUMENT NAME",
      flex: 1,
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const { id, row } = params;
        const isDisabled = row.isDisabled;

        const handleChange = (event) => {
          const newValue = event.target.value;
          setRows((prev) =>
            prev.map((r) =>
              r.id === id
                ? {
                    ...r,
                    FileName: newValue,
                    isFileNameEdited: true,
                    isNew: r.isNew ?? false,
                  }
                : r
            )
          );
        };

        const displayValue = row.FileName || "";

        return (
          <Tooltip title={displayValue} arrow placement="top">
            <TextField
              value={displayValue}
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
      // flex: 1,
      width: 180,
      renderCell: (params) => {
        const { id, value, api, field, row } = params;
        const isDisabled = row.isDisabled;

        const handleDateChange = (newValue) => {
          api.updateRows([{ id, [field]: newValue }]);
          setRows((prev) =>
            prev.map((row) =>
              row.id === id ? { ...row, [field]: newValue } : row
            )
          );
        };
        return (
          <DatePickerFieldUploadDocModel
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
      width: 220,

      renderCell: (params) => {
        const { id, field, value, api } = params;

        const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
        const stored = userData.GazOfficer || "";
        const isEditable = userData.UserType === "A" || !stored.trim();

        // ----------------- LOCKED FIELD -----------------
        if (!isEditable) {
          if (value !== stored) {
            api.updateRows([{ id, [field]: stored }]);
            setRows((prev) =>
              prev.map((r) => (r.id === id ? { ...r, [field]: stored } : r))
            );
          }

          return (
            // <Tooltip title={stored || ""} arrow placement="top">
            //   <TextField
            //     value={stored}
            //     disabled
            //     variant="outlined"
            //     sx={{ width: 280 }}
            //   />
            // </Tooltip>
            <Tooltip title={stored || ""} arrow placement="top">
              <TextField
                value={stored}
                disabled
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  sx: {
                    height: 38,
                    paddingRight: "10px",
                    borderRadius: "6px",
                    fontSize: "14px",
                  },
                }}
              />
            </Tooltip>
          );
        }

        // ----------------- EDITABLE FIELD -----------------
        return (
          <Tooltip title={value || ""} arrow placement="top">
            <LazyAutocomplete
              id={id}
              field={field}
              value={value}
              list={gazeteList}
              displayField="Name"
              disabled={false}
              searchValue={gazSearch}
              onSearch={(txt) => {
                setGazSearch(txt);
                setGPage(0);
                setHasMoreGazette(true);
                gazettedList({ page: 0, search: txt });
              }}
              api={api}
              setRows={setRows}
              loading={gLoading}
              onLazyLoad={gazettedList}
              page={gPage}
              setPage={setGPage}
              hasMore={hasMoreGazette}
              PopperProps={{ placement: "top-start" }}
            />
          </Tooltip>
        );
      },
    },

    // {
    //   field: "DocType",
    //   headerName: "DOCUMENT TYPE",
    //   flex: 1,
    //   renderCell: (params) => {
    //     const { id, field, value, api, row } = params;

    //     return (
    //       <LazyAutocomplete
    //         id={id}
    //         field={field}
    //         value={value}
    //         list={DocmasterList}
    //         displayField="NameMR"
    //         disabled={row.isDisabled}
    //         searchValue={docSearch}
    //         onSearch={(txt) => {
    //           setDocSearch(txt);
    //           setDPage(0);
    //           setHasMoreDocs(true);
    //           DocMasterList({ page: 0, search: txt });
    //         }}
    //         api={api}
    //         setRows={setRows}
    //         loading={dLoading}
    //         onLazyLoad={DocMasterList}
    //         page={dPage}
    //         setPage={setDPage}
    //         hasMore={hasMoreDocs}
    //       />
    //     );
    //   },
    // },
    {
      field: "DocType",
      headerName: "DOCUMENT TYPE",
      flex: 1,
      renderCell: (params) => {
        const { id, api, row } = params;

        // const handleSelectDocType = (selected) => {
        //   const selectedValue = selected?.NameMR || "";

        //   setRows((prev) =>
        //     prev.map((r) => {
        //       if (r.id === id) {
        //         if (r.isNew) {
        //           return {
        //             ...r,
        //             DocType: selectedValue,
        //             FileName: selectedValue,
        //             MissingDocs: [],
        //           };
        //         }
        //         return { ...r, DocType: selectedValue };
        //       }
        //       return r;
        //     })
        //   );
        // };

        return (
          <LazyAutocomplete
            id={id}
            field="DocType"
            value={row.DocType}
            list={DocmasterList}
            displayField="NameMR"
            disabled={row.isDisabled}
            api={api}
            setRows={setRows}
            // onChangeValue={handleSelectDocType}
            searchValue={docSearch}
            onSearch={(txt) => {
              setDocSearch(txt);
              setDPage(0);
              setHasMoreDocs(true);
              DocMasterList({ page: 0, search: txt });
            }}
            loading={dLoading}
            onLazyLoad={DocMasterList}
            page={dPage}
            setPage={setDPage}
            hasMore={hasMoreDocs}
            PopperProps={{ placement: "top-start" }}
            onChangeValue={(selected) => {
              const selectedValue = selected?.NameMR || "";

              // update row when cleared or selected
              setRows((prev) =>
                prev.map((r) => {
                  if (r.id === id) {
                    return {
                      ...r,
                      DocType: selectedValue,
                      FileName: r.isNew ? selectedValue : r.FileName,
                      MissingDocs: [],
                    };
                  }
                  return r;
                })
              );
            }}
          />
        );
      },
    },

    // ---------------

    {
      field: "MissingDocs",
      headerName: "MISSING DOCUMENT",
      flex: 1,
      renderCell: (params) => {
        const { row } = params;
        // const isDisabled = row.isDisabled || !row.DocType;
        // const docs = row.MissingDocs || [];

        // const tooltipMessage = isDisabled
        //   ? "Please select document type first"
        //   : docs.length > 0
        //   ? docs.join(", ")
        //   : "Add Missing Document";
        // NEW CONDITION: If file already uploaded → disable

        const hasFile =
          (row.name && row.name.toString() !== "false") ||
          (row.type && row.type.toString().trim() !== "");

        const baseDisabled = row.isDisabled || !row.DocType;

        const isDisabled = baseDisabled || hasFile;

        const docs = row.MissingDocs || [];

        const tooltipMessage = hasFile
          ? "File already uploaded — missing document cannot be edited"
          : baseDisabled
          ? "Please select document type first"
          : docs.length > 0
          ? docs.join(", ")
          : "Add Missing Document";

        return (
          <Tooltip title={tooltipMessage} placement="top" arrow>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",

                border: "1px solid #bdbdbd",
                borderRadius: "6px",
                padding: "3px 6px",
                minHeight: "42px",
              }}
            >
              {/* Modal open button */}
              {/* <IconButton
                size="small"
                onClick={() => handleOpenModal(row)}
                disabled={isDisabled}
                sx={{ flexShrink: 0 }}
              >
                <ListIcon fontSize="small" />
              </IconButton> */}
              <IconButton
                size="small"
                onClick={() => !isDisabled && handleOpenModal(row)}
                disabled={isDisabled}
                sx={{ flexShrink: 0 }}
              ></IconButton>
              {/* CHIPS + TOOLTIP */}
              <Box
                onClick={() => !isDisabled && handleOpenModal(row)}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  maxHeight: 50,
                  overflow: "hidden",
                  flex: 1,
                  cursor: "pointer",
                  // pointerEvents: isDisabled ? "none" : "auto",
                }}
              >
                {docs.length > 0 ? (
                  docs.map((d, idx) => (
                    <Chip
                      key={idx}
                      label={d}
                      size="small"
                      sx={{
                        maxWidth: 175,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="caption" sx={{ opacity: 0.6 }}>
                    Add Missing Document
                  </Typography>
                )}
              </Box>
              {/* </Tooltip> */}
            </Box>
          </Tooltip>
        );
      },
    },
  ];

  const visibleColumns = isAddMissing
    ? DocColumns
    : DocColumns.filter((col) => col.field !== "MissingDocs");

  const Maincolumns = [
    {
      field: "actions",
      headerName: "Action",
      minWidth: 80,
      maxWidth: 100,
      flex: 0.3,
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
                onClick={() => handleUpdate(params.row)}
                disabled={!canEdit}
                sx={{
                  color: "#2196F3",
                }}
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
              <IconButton
                size="medium"
                sx={{
                  "& .MuiButtonBase-root,": {
                    padding: 0,
                    marginLeft: 1,
                  },
                  color: canDelete ? "red" : "grey",
                }}
                // sx={{ color: canDelete ? "red" : "grey" }}
                onClick={() => handleDelete(params.row)}
                disabled={!canDelete}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </strong>
      ),
    },

    // { field: "id", headerName: "Sr.No", width: 80, sortable: true },
    {
      field: "srNo",
      headerName: "SR NO",
      minWidth: 60,
      maxWidth: 70,
      flex: 0.2,
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
  //   const validFiles = files.filter((file) => {
  //     const ext = file.name.split(".").pop().toLowerCase();

  //     if (!allowedExt.includes(ext)) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Invalid File Type",
  //         text: `${file.name} is not allowed. Only JPG, JPEG, PNG, and PDF are accepted.`,
  //         confirmButtonColor: "#d33",
  //       });
  //       return false;
  //     }

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

  //   // const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
  //   const currentUser = userSession.Username || userSession.userId || "";

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
  //          IssuedBy: "",
  //         DocType: "",
  //         Status: 1,
  //         CreatedDate: dayjs().format("YYYY-MM-DD"),
  //         ModifiedDate: dayjs().format("YYYY-MM-DD"),
  //         DocReqDate: dayjs().format("YYYY-MM-DD"),
  //         CreatedBy: currentUser,
  //         ModifiedBy: currentUser,
  //         UserId: currentUser,
  //         isNew: false,
  //       };
  //     })
  //   );

  //   setRows((prev) => [...prev, ...newRows]);

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

    const currentUser = userSession.Username || userSession.userId || "";

    const newRows = validFiles.map((file, index) => {
      const ext = file.name.split(".").pop().toLowerCase();
      return {
        id: Date.now() + index,
        name: file.name,
        type: ext,
        SrcPath: "",
        File: file,
        // FileExt: ext,
        // FileName: file.name,
        IssuedBy: "",
        DocType: "",
        Status: 1,
        CreatedDate: dayjs().format("YYYY-MM-DD"),
        ModifiedDate: dayjs().format("YYYY-MM-DD"),
        DocReqDate: dayjs().format("YYYY-MM-DD"),
        CreatedBy: currentUser,
        ModifiedBy: currentUser,
        UserId: currentUser,
        isNew: false, // important: uploaded rows are NOT "new/missing"
        isFileNameEdited: true, // treat uploaded file as already having a filename (avoid overwrite)
      };
    });

    setRows((prev) => [...prev, ...newRows]);
    console.log("258", newRows);

    if (fileInputRef.current) fileInputRef.current.value = "";
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
              // FileName: file.name,
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

    const missingFileName = rows.find(
      (row) => row.FileExt && (!row.FileName || row.FileName.trim() === "")
    );

    if (missingFileName) {
      Swal.fire({
        toast: true,
        icon: "warning",
        title: "Missing File Name",
        text: "File Name is required for uploaded Document.",
        position: "center",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
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
    });
    try {
      let response;
      if (DeleteLineNums) {
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

  const gazettedList = async ({ page = 0, search = "" } = {}) => {
    if (scrollLockGaz || !hasMoreGazette) return;
    setScrollLockGaz(true);
    setGLoading(true);

    try {
      const { data } = await axios.get(`${BASE_URL}GazOfficers`, {
        params: { Status: "1", page, search },
      });

      const newData = data?.values || [];

      if (newData.length === 0) {
        setHasMoreGazette(false);
        return;
      }

      setgazeteList((prev) => (page === 0 ? newData : [...prev, ...newData]));
    } catch (err) {
      console.error("Error fetching Gazette list:", err);
    } finally {
      setGLoading(false);
      setTimeout(() => setScrollLockGaz(false), 250);
    }
  };

  const DocMasterList = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = { Status: "1", IsMainDoc: true, ...params };

      const { data } = await axios.get(`${BASE_URL}DocsMaster`, {
        params: queryParams,
      });

      // if (data.values) {
      //   setDocmasterList(data.values);
      // }
      const list = data.values || [];

      // If no data → stop further loading
      if (list.length === 0) {
        setHasMoreDocs(false);
        return;
      }

      if (data.values) {
        if (params.page === 0 || params.search) {
          setDocmasterList(data.values);
        } else {
          setDocmasterList((prev) => [...prev, ...data.values]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (firstLoad.current) {
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

  const handleAddRow = () => {
    const UserType = userSession.UserType || "";
    const CreatedBy = userSession.userId || "";

    const newRow = {
      id: Date.now(),
      srNo: "",
      FileName: "",
      DocReqDate: dayjs().format("YYYY-MM-DD"),
      IssuedBy: "",
      DocType: "",
      CreatedBy: CreatedBy,
      isDisabled: false,
      isNew: true,
      isFileNameEdited: false, // allow auto-fill from DocType until user edits
    };
    setRows((prev) => [...prev, newRow]);
  };

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
      {/* <Modal
        open={on}
        sx={{
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          overflow: "auto",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: "95%",
            maxWidth: 1400,
            maxHeight: "90vh",
            overflowY: "auto",
            // position: "absolute",
              position: "relative",

            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: 3,
          }}
        > */}
      <Dialog
        open={on}
        fullWidth
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "95%",
            maxWidth: 1400,
            maxHeight: "90vh",
            overflow: "hidden",
            borderRadius: 3,
          },
        }}
        sx={{
          "& .MuiDialog-container": {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          UPLOAD DOCUMENT
          <IconButton onClick={handleClose}>
            <CloseIcon sx={{ fontSize: 30 }} />
          </IconButton>
        </DialogTitle>
        <Divider
          sx={{
            borderBottomWidth: 0.6,
            backgroundColor: "#ccc",
            boxShadow: "0px 1px 2px rgba(0,0,0,0.2)",
          }}
        />
        {/* <DialogContent
          dividers={false}
          sx={{
            maxHeight: "70vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >  */}

        {/* <Box sx={{ p: 3 }}> */}
        {/* <Grid
            container
            spacing={3}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
          > */}
        {/* Header */}
        {/* <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                pt: 0,
                pb: 0,
              }}
            >
              <Typography fontWeight="bold" sx={{ mt: 1 }}>
                {" "}
                UPLOAD DOCUMENT
              </Typography>
              <IconButton
                onClick={handleClose}
                sx={{
                  p: 0,
                  mt: 0,
                }}
              >
                <CloseIcon sx={{ fontSize: 30 }} />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <Divider
                sx={{
                  borderBottomWidth: "0.6px",
                  backgroundColor: "#ccc",
                  boxShadow: "0px 1px 2px rgba(0,0,0,0.2)",
                  mx: -3,
                }}
              />
            </Grid> */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              overflowY: "auto",
              maxHeight: "calc(90vh - 150px)",
              p: 3,
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="contained"
                  size="small"
                  component={isAddMissing ? undefined : "label"}
                  sx={{
                    width: 130,
                    height: 40,
                    color: "white",
                    backgroundColor: theme.palette.Button.background,
                    boxShadow: "0 2px 4px Solid black",
                    fontSize: "0.79rem",
                    "&:hover": {
                      transform: "translateY(2px)",
                      backgroundColor: theme.palette.Button.background,
                    },
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
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAddMissing}
                      onChange={(e) => setIsAddMissing(e.target.checked)}
                      size="medium"
                      sx={{ color: "#2196F3" }}
                    />
                  }
                  label="Add Missing Document"
                />
              </Grid>
              <Grid item xs={12} sx={{ height: 387 }}>
                <DataGrid
                  rows={updatedRows}
                  // rows={[...updatedRows].sort((a, b) => b.id - a.id)}
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
            </Grid>
          </DialogContent>
          {/* Footer */}
          <Divider
            sx={{
              borderBottomWidth: 0.6,
              backgroundColor: "#ccc",
              mx: -3,
              boxShadow: "0px 1px 2px rgba(0,0,0,0.2)",
            }}
          />

          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              px: 3,
              pb: 2,
            }}
          >
            <Button
              size="small"
              onClick={clearFormData}
              sx={{
                p: 1,
                width: 80,
                color: "#2196F3",
                border: "1px solid #2196F3",
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
                backgroundColor: theme.palette.Button.background,
                "&:hover": {
                  transform: "translateY(2px)",
                  backgroundColor: theme.palette.Button.background,
                },
              }}
            >
              {SaveUpdateButton}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* --------------============================= */}
      <Dialog
        open={modalOpen}
        fullWidth
        PaperProps={{
          sx: {
            height: 600,
            maxHeight: 650,
            width: 500,
            borderRadius: 3,
            overflow: "hidden",
            boxShadow:
              "0px 4px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2) inset",
          },
        }}
      >
        {/* Sticky Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            // background: "white",
            borderBottom: "1px solid #eee",
            px: 2,
            py: 1.5,
          }}
        >
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            sx={{ position: "relative" }}
          >
            <Typography
              fontWeight="600"
              fontSize={17}
              sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              Select Missing Documents
            </Typography>

            <IconButton
              onClick={() => setModalOpen(false)}
              sx={{ ml: "auto" }}
              size="medium"
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Divider
              sx={{
                borderBottomWidth: "0.6px", // thin line
                backgroundColor: "#ccc",
                boxShadow: "0px 1px 2px rgba(0,0,0,0.2)",
                mx: -3,
              }}
            />{" "}
          </Grid>

          {/* Search Box */}
          <TextField
            placeholder="Search documents..."
            fullWidth
            size="small"
            value={searchText}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#777" }} />
                </InputAdornment>
              ),
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchText("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* List */}
        <DialogContent sx={{ px: 0, mt: 1 }}>
          <List disablePadding>
            {(subDocMap[currentRowId] || [])
              .filter((d) =>
                d.NameMR.toLowerCase().includes(searchText.toLowerCase())
              )
              .map((doc) => {
                const checked = tempSelection.includes(doc.NameMR);

                return (
                  <ListItem
                    key={doc.value}
                    button
                    onClick={() => {
                      if (checked) {
                        setTempSelection(
                          tempSelection.filter((d) => d !== doc.NameMR)
                        );
                      } else {
                        setTempSelection([...tempSelection, doc.NameMR]);
                      }
                    }}
                    sx={{
                      px: 2,
                      py: 1,
                      transition: "0.2s",
                      background: checked
                        ? "rgba(0,150,136,0.08)"
                        : "transparent",
                      "&:hover": {
                        background: checked
                          ? "rgba(0,150,136,0.15)"
                          : "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    <Checkbox
                      checked={checked}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2196F3",
                        },
                      }}
                    />
                    <ListItemText
                      primary={doc.NameMR}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: checked ? "600" : "400",
                      }}
                    />
                  </ListItem>
                );
              })}
          </List>
        </DialogContent>
        <Grid item xs={12}>
          <Divider
            sx={{
              borderBottomWidth: "0.6px", // thin line
              backgroundColor: "#ccc",
              boxShadow: "0px 1px 2px rgba(0,0,0,0.2)",
              mx: -3,
            }}
          />{" "}
        </Grid>
        {/* Footer */}
        <DialogActions
          sx={{
            p: 2,
            borderTop: "1px solid #eee",
          }}
        >
          <Button
            onClick={handleSaveModal}
            size="small"
            fullWidth
            sx={{
              p: 1,
              fontWeight: 600,
              color: "white",
              borderRadius: 2,
              textTransform: "none",
              backgroundColor: theme.palette.Button.background,
              "&:hover": {
                opacity: 0.9,
              },
            }}
            variant="contained"
          >
            SAVE SELECTED
          </Button>
        </DialogActions>
      </Dialog>
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
                backgroundColor: theme.palette.Button.background,
                borderRadius: "8px",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 2px 4px Solid black",
                "&:hover": {
                  transform: "translateY(2px)",
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
              Upload Document
            </Button>
          </span>
        </Tooltip>
      </Grid>
      {/* <Grid
        container
        item
        lg={12}
        component={Paper}
        sx={{ height: "76vh", width: "100%" }}
      > */}
      <Paper
        sx={{
          marginTop: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#",
        }}
        elevation={1}
      >
        <Box sx={{ height: "75vh", width: "100%" }}>
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
            rows={Documentlist}
            columns={Maincolumns}
            pagination
            paginationMode="server"
            rowCount={totalRows}
            pageSizeOptions={[limit]}
            paginationModel={{ page: currentPage, pageSize: limit }}
            onPaginationModelChange={(newModel) =>
              setCurrentPage(newModel.page)
            }
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
        </Box>
      </Paper>
    </>
  );
};
export default UploadDocument;
