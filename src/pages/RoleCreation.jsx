import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
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
import { InputDescriptionField } from "../components/Component";
import Loader from "../components/Loader";
import { BASE_URL } from "../Constant";
import MenuWithOneCollapse from "../components/MenuWithOneCollapse";
import CollapsibleMenuGrid from "../components/MenuWithOneCollapse";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";

const RoleCreation = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [GetRolelist, setGetRolelist] = React.useState([]);
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
  const handleClose = () => setOn(false);
  const [openMenu, setOpenMenu] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState([]);

  const handleOpenMenu = () => setOpenMenu(true);
  const handleCloseMenu = () => setOpenMenu(false);
  const firstLoad = React.useRef(true);
  const [MenuList, setMenuList] = React.useState([]);
  const initial = {
    RoleName: "",
    Remarks: "",
    Status: "",
    oLines: [],
  };
  const initialRole = {
    CreatedDate: dayjs().format("YYYY-MM-DD"),
    ModifiedDate: dayjs().format("YYYY-MM-DD"),
    RoleName: "",
    Remarks: "",
    Status: "",
    oSubMenus: [],
    oSubMenusSpeAccess: [],
  };
  const { handleSubmit, control, reset } = useForm({
    defaultValues: initial,
  });

  const [RoleTableData, setRoleTableData] = React.useState(() => [
    {
      ...initialRole,
      id: `parent-${Date.now()}`,
      IsRead: true,
      IsAdd: true,
      IsEdit: true,
      IsDelete: true,

      oSubMenusSpeAccess: (initialRole.oSubMenusSpeAccess || []).map(
        (child, idx) => ({
          ...child,
          id: `child-${Date.now()}-${idx}`,

          IsRead: true,
          IsAdd: true,
          IsEdit: true,
          IsDelete: true,
        })
      ),
    },
  ]);

  // 🔹 Track selected rows
  const RoleCrationColumns = [
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
      field: "action",
      headerName: "Action",
      width: 120,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                handleRemove(params.row);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        );
      },
    },
    {
      field: "expand",
      headerName: "",
      width: 50,
      sortable: false,
      renderCell: (params) => {
        const hasChild = params.row.oSubMenusSpeAccess?.length > 0;
        const isExpanded = expandedRowIds.includes(params.row.id);

        return hasChild ? (
          <IconButton
            size="small"
            onClick={() => toggleExpandRow(params.row.id)}
          >
            {isExpanded ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
          </IconButton>
        ) : null;
      },
    },

    {
      field: "Name",
      headerName: "Activity Name",
      width: 350,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            pl: params.row.isChild ? 5 : 0, // indent children visually
            fontWeight: params.row.isChild ? 350 : 450,
          }}
        >
          {/* {params.row.isChild
            ? `↳ ${params.row.Name}`
            : `${params.row.ParentMenuName || ""} - ${
                params.row.SubMenuName || params.row.Name
              }`} */}
          {params.row.isChild
            ? `↳ ${params.row.Name}`
            : [
                params.row.ParentMenuName,
                params.row.SubMenuName || params.row.Name,
              ]
                .filter(Boolean)
                .join(" - ")}
        </Typography>
      ),
    },
    // {
    //   field: "IsRead",
    //   headerName: "READ",
    //   flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    //   sortable: false,

    //   renderCell: (params) => (
    //     <Checkbox
    //       checked={Boolean(params.row.IsRead)}
    //       onChange={(e) =>
    //         handleCheckboxChange(params.row.id, "IsRead", e.target.checked)
    //       }
    //       size="medium"
    //       color="primary"
    //     />
    //   ),
    // },

    //     {
    //       field: "IsAdd",
    //       headerName: "ADD",
    //       flex: 1,
    //       headerAlign: "center",
    //       align: "center",
    //       sortable: false,
    //       renderCell: (params) => (
    //         <Checkbox
    //           checked={Boolean(params.row.IsAdd)}
    //           onChange={(e) =>
    //             handleCheckboxChange(params.row.id, "IsAdd", e.target.checked)
    //           }
    //           size="medium"
    //           color="success"
    //         />
    //       ),
    //     },
    //     {
    //       field: "IsEdit",
    //       headerName: "EDIT",
    //       flex: 1,
    //       headerAlign: "center",
    //       align: "center",
    //       sortable: false,
    //       renderCell: (params) => (
    //         <Checkbox
    //           checked={Boolean(params.row.IsEdit)}
    //           onChange={(e) =>
    //             handleCheckboxChange(params.row.id, "IsEdit", e.target.checked)
    //           }
    //           size="medium"
    //           color="info"
    //         />
    //       ),
    //     },
    //     {
    //       field: "IsDelete",
    //       headerName: "DELETE",
    //       flex: 1,
    //       headerAlign: "center",
    //       align: "center",
    //       sortable: false,
    //       renderCell: (params) => (
    //         <Checkbox
    //           checked={Boolean(params.row.IsDelete)}
    //           onChange={(e) =>
    //             handleCheckboxChange(params.row.id, "IsDelete", e.target.checked)
    //           }
    //           size="medium"
    //           color="error"
    //         />
    //       ),
    //     },
    {
      field: "IsRead",
      headerName: "READ",
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) =>
        params.row.isChild ? null : (
          <Checkbox
            checked={Boolean(params.row.IsRead)}
            onChange={(e) =>
              handleCheckboxChange(params.row.id, "IsRead", e.target.checked)
            }
            size="medium"
            color="primary"
          />
        ),
    },
    {
      field: "IsAdd",
      headerName: "ADD",
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) =>
        params.row.isChild ? null : (
          <Checkbox
            checked={Boolean(params.row.IsAdd)}
            onChange={(e) =>
              handleCheckboxChange(params.row.id, "IsAdd", e.target.checked)
            }
            size="medium"
            color="success"
          />
        ),
    },
    {
      field: "IsEdit",
      headerName: "EDIT",
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) =>
        params.row.isChild ? null : (
          <Checkbox
            checked={Boolean(params.row.IsEdit)}
            onChange={(e) =>
              handleCheckboxChange(params.row.id, "IsEdit", e.target.checked)
            }
            size="medium"
            color="info"
          />
        ),
    },
    {
      field: "IsDelete",
      headerName: "DELETE",
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) =>
        params.row.isChild ? null : (
          <Checkbox
            checked={Boolean(params.row.IsDelete)}
            onChange={(e) =>
              handleCheckboxChange(params.row.id, "IsDelete", e.target.checked)
            }
            size="medium"
            color="error"
          />
        ),
    },
  ];

  const Maincolumns = [
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
            disabled={
              JSON.parse(sessionStorage.getItem("userData") || "{}")
                ?.UserType?.trim()
                .toUpperCase() !== "A"
            }
          >
            <DeleteForeverIcon />
          </IconButton>
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
      field: "RoleName",
      headerName: " ROLE NAME",
      minWidth: 100,
      flex: 1,
      sortable: false,
    },
    {
      field: "Remarks",
      headerName: "REMARK",
      minWidth: 100,
      flex: 1,
      sortable: false,
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

  const getAllRoleList = async (page = 0, searchText = "", limit = 20) => {
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

      const response = await axios.get(`${BASE_URL}Role`, { params });
      if (response.data && response.data.values) {
        setGetRolelist(
          response.data.values.map((item, index) => ({
            ...item,
            // id: page * limit + index + 1,
            id: item.Id || item.id || page * limit + index + 1,
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

  React.useEffect(() => {
    if (firstLoad.current) {
      getAllRoleList();
      firstLoad.current = false;
    }
  }, []);

  const handleRemove = (displayRow) => {
    const displayId = displayRow.id;

    // if child
    if (typeof displayId === "string" && displayId.includes("-child-")) {
      const [parentIdStr, childIdxStr] = displayId.split("-child-");

      setRoleTableData((prev) =>
        prev.map((parent) => {
          if (String(parent.id) !== parentIdStr) return parent;
          const idx = Number(childIdxStr);
          const childArr = Array.isArray(parent.oSubMenusSpeAccess)
            ? parent.oSubMenusSpeAccess.filter((_, i) => i !== idx)
            : [];
          return { ...parent, oSubMenusSpeAccess: childArr };
        })
      );
      return;
    }

    // otherwise parent row
    setRoleTableData((prev) => prev.filter((r) => r.id !== displayId));
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
          const response = await axios.delete(`${BASE_URL}Role/${rowData.Id}`);
          setLoaderOpen(false);
          if (response.data && response.data.success) {
            Swal.fire({
              position: "center",
              icon: "success",
              toast: true,
              title: "RoleName Deleted Successfully",
              showConfirmButton: false,
              timer: 1500,
            });
            getAllRoleList(currentPage, searchText);
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
    console.log("object ", rowData);
    setSaveUpdateButton("UPDATE");
    setClearUpdateButton("RESET");
    setOn(true);

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

      const apiUrl = `${BASE_URL}Role/${rowData.Id}`;
      const response = await axios.get(apiUrl);
      if (response.data && response.data.values) {
        const olddata = response.data.values;

        originalDataRef.current = olddata;
         const formattedLines = Array.isArray(olddata.oLines)
          ? olddata.oLines.map((line, index) => ({
              ...line,
              id: line.MenuId || `${olddata.Id}-${index}-${Date.now()}`,

              // 🔹 Display Name
              Name: `${line.ParentMenu || ""} - ${line.MenuName || ""}`.trim(),

              SubMenuId: line.SubMenuId ?? null,

              oSubMenusSpeAccess: Array.isArray(line.oSpecialAccess)
                ? line.oSpecialAccess.map((sa, saIndex) => ({
                    ...sa,
                    id: sa.MenuId,
                    LineNum: sa.MenuId,
                    parentId: line.MenuId,
                    Name: sa.MenuName,
                    isChild: true,
                  }))
                : [],
            }))
          : [];

        reset({
          Id: olddata.Id,
          RoleName: olddata.RoleName,
          Remarks: olddata.Remarks,
          Status: olddata.Status,
          oLines: formattedLines,
        });

        setRoleTableData(formattedLines);
      }
    } catch (error) {
      console.error("Error in handleUpdate:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFormData = () => {
    setRoleTableData([]);

    if (ClearUpdateButton === "CLEAR") {
      reset({
        Status: 1,

        RoleName: "",
        oLines: [],
      });
    }
    if (ClearUpdateButton === "RESET") {
      if (originalDataRef.current) {
        const resetData = { ...originalDataRef.current };

        // Remove +91 from MobileNo if it exists
        if (resetData.MobileNo && resetData.MobileNo.startsWith("+91")) {
          resetData.MobileNo = resetData.MobileNo.slice(3);
        }
        reset(resetData);

        // also set rows for DataGrid
        if (resetData.oLines && Array.isArray(resetData.oLines)) {
          const formattedLines = resetData.oLines.map((line, index) => ({
            ...line,
            id: line.LineNum ?? index,
          }));
          setRoleTableData(formattedLines);
        } else {
          setRoleTableData([]);
        }
      } else {
        reset({
          Status: 1,

          RoleName: "",
          oLines: [],
        });
        setRoleTableData([]);
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
      RoleName: "",
      oLines: [],
    });
    setRoleTableData([]); // clears table data
  };

  const onSubmit = async (data) => {
    if (!data.RoleName || data.RoleName.trim() === "") {
      Swal.fire({
        toast: true,
        icon: "warning",
        title: "Invalid Role Name",
        text: "Role Name cannot be empty or just spaces.",
        position: "center",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });
      return;
    }

    const payload = {
      Id: data.Id || 0,
      CreatedBy: sessionStorage.getItem("userId") || "",
      CreatedDate: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS"),
      ModifiedBy: sessionStorage.getItem("userId") || "",
      ModifiedDate: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS"),
      Status: 1,
      RoleName: data.RoleName || "",
      Remarks: data.Remarks || "",
      oLines: RoleTableData.map((row, index) => ({
        LineNum: 0,
        Id: row.Id || 0,
        CreatedDate: row.CreatedDate
          ? dayjs(row.CreatedDate).format("YYYY-MM-DDTHH:mm:ss")
          : dayjs().format("YYYY-MM-DDTHH:mm:ss"),
        CreatedBy: sessionStorage.getItem("userId") || "",
        ModifiedDate: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS"),
        ModifiedBy: sessionStorage.getItem("userId") || "",
        ParentMenuId: row.ParentMenuId || 0,
        ParentMenuName: row.ParentMenuName,
        MenuId: row.SubMenuId || row.MenuId,
        SubMenuName: row.SubMenuName,
        IsRead: row.IsRead,
        IsAdd: row.IsAdd,
        IsEdit: row.IsEdit,
        IsDelete: row.IsDelete,
        oSpecialAccess:
          row.oSubMenusSpeAccess?.length > 0
            ? row.oSubMenusSpeAccess.map((sp, i) => ({
                MenuId: sp.LineNum,
                Name: sp.spName,
              }))
            : [],
      })),
    };
    // console.log(" My object", payload);
    // return

    try {
      let response;

      if (SaveUpdateButton === "SAVE") {
        setLoaderOpen(true);
        response = await axios.post(`${BASE_URL}Role`, payload);
      } else {
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
        response = await axios.put(`${BASE_URL}Role/${data.Id}`, payload);
      }

      setLoaderOpen(false);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title:
            SaveUpdateButton === "SAVE"
              ? "RoleName Uploaded Successfully"
              : "RoleName Updated Successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        handleClose();
        getAllRoleList();
      } else {
        throw new Error(response.data.message || "Unexpected error");
      }
    } catch (error) {
      setLoaderOpen(false);

      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong while uploading.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleSelectedMenus = () => {
    if (!Array.isArray(selectedIds) || selectedIds.length === 0) return;

    const selectedData = [];

    MenuList.forEach((menu) => {
      (menu.oSubMenus || []).forEach((sub) => {
        if (selectedIds.includes(sub.id)) {
          // Filter only selected special accesses
          const filteredAccess = (sub.oSubMenusSpeAccess || []).filter(
            (access) => selectedIds.includes(`${sub.id}_${access.LineNum}`)
          );

          selectedData.push({
            id: `${sub.id}_${Date.now()}_${Math.random()
              .toString(36)
              .slice(2, 8)}`,
            ParentMenuId: menu.Id,
            ParentMenuName: menu.Name,
            SubMenuId: sub.LineNum,
            SubMenuName: sub.Name,
            IsRead: true,
            IsAdd: true,
            IsEdit: true,
            IsDelete: true,
            oSubMenusSpeAccess: filteredAccess.map((acc) => ({
              ...acc,
              LineNum: acc.LineNum,
              spName: acc.Name,
              isChild: true,
              IsRead: true,
              IsAdd: true,
              IsEdit: true,
              IsDelete: true,
            })),
          });
        }
      });
    });

    // Merge with existing table data
    setRoleTableData((prev) => [...prev, ...selectedData]);
    setOpenMenu(false);
  };
  // const handleSelectedMenus = () => {
  //   if (!Array.isArray(selectedIds) || selectedIds.length === 0) return;

  //   const selectedData = [];

  //   MenuList.forEach((menu) => {
  //     (menu.oSubMenus || []).forEach((sub) => {
  //       if (selectedIds.includes(sub.Id)) {
  //         const filteredAccess =
  //           (sub.oSubMenusSpeAccess || []).filter((access) =>
  //             selectedIds.includes(`${sub.Id}_${access.LineNum}`)
  //           ) || [];

  //         selectedData.push({
  //           id: `${sub.Id}_${Date.now()}_${Math.random()
  //             .toString(36)
  //             .slice(2, 8)}`,
  //           ParentMenuId: menu.Id,
  //           ParentMenuName: menu.Name,
  //           SubMenuId: sub.Id,
  //           SubMenuName: sub.Name,
  //           IsRead: true,
  //           IsAdd: true,
  //           IsEdit: true,
  //           IsDelete: true,
  //           oSubMenusSpeAccess: filteredAccess.map((acc) => ({
  //             ...acc,
  //             parentId: sub.Id,
  //             isChild: true,
  //             IsRead: true,
  //             IsAdd: true,
  //             IsEdit: true,
  //             IsDelete: true,
  //           })),
  //         });
  //       }
  //     });
  //   });

  //   setRoleTableData((prev) => [...prev, ...selectedData]);
  //   setOpenMenu(false);
  // };

  const handleMenusList = async (params = {}) => {
    setLoading(true);

    try {
      const token = sessionStorage.getItem("BearerTokan");

      if (!token) {
        console.error("No token found! Please login first.");
        return;
      }

      const { data } = await axios.get(`${BASE_URL}Menus`, {
        params,
        headers: {
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      });

      if (data && data.success && Array.isArray(data.values)) {
        const formatted = data.values.map((menuParent) => ({
          ...menuParent,
          id: menuParent.Id ?? Math.random(),
          oSubMenus: Array.isArray(menuParent.oSubMenus)
            ? menuParent.oSubMenus.map((sub) => ({
                ...sub,
                id: `sub_${menuParent.Id}_${sub.LineNum}`,
                oSubMenusSpeAccess: Array.isArray(sub.oSubMenusSpeAccess)
                  ? sub.oSubMenusSpeAccess
                  : [],
              }))
            : [],
        }));

        setMenuList(formatted);
      } else {
        setMenuList([]);
      }
    } catch (err) {
      console.error("Error fetching menus:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Call when the component mounts
  React.useEffect(() => {
    handleMenusList();
  }, []);

  const [expandedRowIds, setExpandedRowIds] = React.useState([]);

  const toggleExpandRow = (rowId) => {
    setExpandedRowIds((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  const handleCheckboxChange = (displayId, field, value) => {
    setRoleTableData((prev) =>
      prev.map((parent) => {
        // 1) Parent row clicked (displayId === parent.id)
        if (displayId === parent.id) {
          return { ...parent, [field]: value };
        }

        // 2) Child clicked: expected format "<parentId>-child-<idx>"
        if (typeof displayId === "string" && displayId.includes("-child-")) {
          const [parentIdStr, childIdxStr] = displayId.split("-child-");
          // parent ids may be numbers — compare as strings for safety
          if (String(parent.id) === parentIdStr) {
            const childIdx = Number(childIdxStr);
            const childArr = Array.isArray(parent.oSubMenusSpeAccess)
              ? [...parent.oSubMenusSpeAccess]
              : [];

            // guard index
            if (childIdx >= 0 && childIdx < childArr.length) {
              childArr[childIdx] = { ...childArr[childIdx], [field]: value };
            }

            return { ...parent, oSubMenusSpeAccess: childArr };
          }
        }

        return parent;
      })
    );
  };

  const displayRows = RoleTableData.flatMap((row) => {
    const isExpanded = expandedRowIds.includes(row.id);
    return [
      row,
      ...(isExpanded
        ? (row.oSubMenusSpeAccess || []).map((child, idx) => ({
            ...child,
            // id: `${row.id}-child-${idx}`,
            id: `${row.id}-child-${idx}`, // ✅ guaranteed unique (includes parent id)

            isChild: true,
            parentId: row.id,
            ParentMenuName: row.ParentMenuName,
          }))
        : []),
    ];
  });

  return (
    <>
      <Dialog open={openMenu} onClose={handleCloseMenu} fullWidth maxWidth="md">
        <DialogTitle>Menu Activity</DialogTitle>
        <DialogContent dividers>
          <div style={{ height: 550, width: "100%" }}>
            {/* <CollapsibleMenuGrid
              menuList={MenuList}
              onSelectionChange={setSelectedIds}
               existingSubMenus={[
                ...new Set(
                  RoleTableData.filter((r) => r.SubMenuId != null).map(
                    (r) => r.SubMenuId
                  ) // SubMenuId = LineNum
                ),
              ]}
            /> */}
            <CollapsibleMenuGrid
              menuList={MenuList}
              onSelectionChange={setSelectedIds}
              existingSubMenus={[
                ...new Set(
                  (RoleTableData || [])
                    .filter((r) => r.SubMenuId != null)
                    .map((r) => r.SubMenuId)
                ),
              ]}
            />
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between", // adds space between buttons
            px: 3, // optional: adds some padding on left and right
          }}
        >
          <Button
            onClick={handleCloseMenu}
            variant="outlined"
            size="small"
            sx={{
              p: 1,
              width: 80,
              color: "rgb(0, 90, 91)",
              border: "1px solid rgb(0, 90, 91)",
              borderRadius: "8px",
            }}
          >
            Cancle
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleSelectedMenus}
            sx={{
              p: 1,
              width: 80,
              color: "white",
              background:
                "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
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
            maxWidth: 1400,
            Height: 4500,
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
              <Typography fontWeight="bold"> ROLE CREATION</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>

            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="flex-start"
              sx={{ mb: 1, pl: 4 }}
            >
              {/* Role Name */}
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="RoleName"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "RoleName is required",
                    validate: (value) =>
                      value.trim() !== "" || "RoleName cannot be just spaces",
                    maxLength: {
                      value: 100,
                      message: "RoleName cannot exceed 100 characters",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Tooltip title={field.value || ""} arrow placement="top">
                      <TextField
                        {...field}
                        label="ENTER ROLE NAME"
                        size="small"
                        fullWidth
                        inputProps={{ maxLength: 100 }}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </Tooltip>
                  )}
                />
              </Grid>

              {/* Remark */}
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="Remarks"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState: { error } }) => (
                    <Tooltip title={field.value || ""} arrow placement="top">
                      <InputDescriptionField
                        {...field}
                        label="ENTER REMARK"
                        size="small"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    </Tooltip>
                  )}
                />
              </Grid>

              {/* Active Checkbox */}
              <Grid
                item
                xs={12}
                sm={4}
                md={2}
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
                          size="large"
                          color="primary"
                        />
                      }
                      label="Active"
                    />
                  )}
                />
              </Grid>

              {/* Search Button */}
              <Grid
                item
                xs={12}
                sm={4}
                md={2}
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleOpenMenu}
                  sx={{
                    width: "100%",
                    maxWidth: 160,
                    height: 38,
                    color: "white",
                    background:
                      "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                    fontSize: "0.75rem",
                    textTransform: "none",
                    borderRadius: 1,
                  }}
                >
                  SEARCH ACTIVITY
                </Button>
              </Grid>
            </Grid>

            <Grid item xs={12} style={{ height: 400, paddingBottom: 40 }}>
              {/* ==================================================================== */}

              {/* 🔹 Collapse below rows (for oSubMenusSpeAccess) */}
              <DataGrid
                className="datagrid-style"
                rows={displayRows}
                columns={RoleCrationColumns}
                getRowId={(row) => row.id}
                hideFooter
                disableRowSelectionOnClick
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: (theme) =>
                      theme.palette.custome?.datagridcolor || "#f0f0f0",
                  },
                  "& .MuiDataGrid-row:hover": {
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                  },
                  "& .MuiDataGrid-virtualScrollerRenderZone": {
                    "& .MuiDataGrid-row": {
                      borderBottom: "1px solid #ddd",
                    },
                  },
                }}
              />

              {/* ========================================================================== */}
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
      {/* Modal (Dialog) */}

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
          ROLE CREATION
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
          Add Role
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
          getRowId={(row) => row.Id}
          rows={GetRolelist}
          columns={Maincolumns}
          pagination
          paginationMode="server"
          hideFooterSelectedRowCount
          rowCount={totalRows}
          pageSizeOptions={[limit]}
          paginationModel={{ page: currentPage, pageSize: limit }}
          onPaginationModelChange={(newModel) => {
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
            getAllRoleList(0, quickFilterValue, limit);
          }}
          // getRowId={(row) => row.MenuId}
          // getRowId={(row) => row.Id ?? row.id ?? row.MenuId ?? row.LineNum ?? `${row.RoleName}-${Math.random()}`}
        />
      </Grid>
    </>
  );
};
export default RoleCreation;
