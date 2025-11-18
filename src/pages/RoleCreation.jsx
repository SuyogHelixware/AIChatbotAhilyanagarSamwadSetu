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
import { useThemeMode } from "../Dashboard/Theme";

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
  const [pickerInitialSelectedIds, setPickerInitialSelectedIds] =
    React.useState([]);
  const [pickerDisabledSubmenuIds, setPickerDisabledSubmenuIds] =
    React.useState([]);
  const { checkAccess } = useThemeMode();
  const canAdd = checkAccess(12, "IsAdd");
  const canEdit = checkAccess(12, "IsEdit");
  const canDelete = checkAccess(12, "IsDelete");
  const handleCloseMenu = () => setOpenMenu(false);
  const firstLoad = React.useRef(true);
  const [MenuList, setMenuList] = React.useState([]);
  const [expandedRowIds, setExpandedRowIds] = React.useState([]);

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
            pl: params.row.isChild ? 5 : 0,
            fontWeight: params.row.isChild ? 350 : 450,
          }}
        >
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
                  color: "rgb(0, 90, 91)",
                  "&:hover": { backgroundColor: "rgba(0, 90, 91, 0.1)" },
                }}
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
              <IconButton
                size="medium"
                sx={{ color: "red" }}
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

       const params = {
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

    // --- If it's a child row ---
    if (typeof displayId === "string" && displayId.includes("-child-")) {
      const [parentIdStr, childIdxStr] = displayId.split("-child-");
      const parentId = Number(parentIdStr);
      const childIndex = Number(childIdxStr);

      setRoleTableData((prev) => {
        // Update parent’s internal array
        const updatedData = prev.map((row) => {
          if (String(row.id) !== String(parentId)) return row;

          const updatedChildren = Array.isArray(row.oSubMenusSpeAccess)
            ? row.oSubMenusSpeAccess.filter((_, i) => i !== childIndex)
            : [];

          return { ...row, oSubMenusSpeAccess: updatedChildren };
        });

        // Remove the child’s flattened row from DataGrid
        const filtered = updatedData.filter(
          (r) => String(r.id) !== displayId 
        );
        return filtered;
      });
      return;
    }
    // --- If it's a parent row ---
    setRoleTableData((prev) =>
      prev.filter(
        (r) =>
          String(r.id) !== String(displayId) &&  
          !String(r.id).startsWith(`${displayId}-child-`)  
      )
    );
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
      return;
    }

    if (ClearUpdateButton === "RESET") {
      if (originalDataRef.current) {
        const resetData = { ...originalDataRef.current };

        // Remove +91 from MobileNo if it exists
        if (resetData.MobileNo && resetData.MobileNo.startsWith("+91")) {
          resetData.MobileNo = resetData.MobileNo.slice(3);
        }

        // Reset the form
        reset(resetData);

        // Rebuild datagrid rows (parent + children)
        if (Array.isArray(resetData.oLines)) {
          const formattedLines = [];

          resetData.oLines.forEach((line, index) => {
            // --- parent row ---
            const parentRow = {
              ...line,
              id: line.LineNum ?? index,
              isChild: false,
              ParentMenuName: line.ParentMenu ?? "",
              SubMenuName: line.MenuName ?? "",
              Name: line.MenuName ?? "",
            };

            formattedLines.push(parentRow);

            // --- child rows (oSpecialAccess) ---
            if (
              Array.isArray(line.oSpecialAccess) &&
              line.oSpecialAccess.length
            ) {
              line.oSpecialAccess.forEach((child, cIndex) => {
                formattedLines.push({
                  ...child,
                  id: `${line.LineNum}-child-${cIndex}`,
                  isChild: true,
                  ParentMenuName: line.ParentMenu ?? "",
                  SubMenuName: line.MenuName ?? "",
                  Name: child.MenuName ?? "",
                });
              });
            }
          });
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
    setRoleTableData([]); 
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
      Status: data.Status === false ? 0 : 1,
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
        text: error.message  ,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };
  const handleSelectedMenus = () => {
    if (!Array.isArray(selectedIds) || selectedIds.length === 0) return;
    const existingSubMenus = new Set(
      (RoleTableData || []).map((r) => Number(r.SubMenuId))
    );
    const selectedData = [];
    MenuList.forEach((menu) => {
      (menu.oSubMenus || []).forEach((sub) => {
        if (
          selectedIds.includes(sub.id) &&
          !existingSubMenus.has(sub.LineNum)
        ) {
          const filteredAccess = (sub.oSubMenusSpeAccess || []).filter((acc) =>
            selectedIds.includes(`${sub.id}_${acc.LineNum}`)
          );
          selectedData.push({
            id: `${sub.id}_${Date.now()}`,
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
              isChild: true,
            })),
          });
        }
      });
    });
    setRoleTableData((prev) => [...prev, ...selectedData]);
    setOpenMenu(false);
  };
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
  React.useEffect(() => {
    handleMenusList();
  }, []);

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
        //  Parent row clicked (displayId === parent.id)
        if (displayId === parent.id) {
          return { ...parent, [field]: value };
        }

        //  Child clicked: expected format "<parentId>-child-<idx>"
        if (typeof displayId === "string" && displayId.includes("-child-")) {
          const [parentIdStr, childIdxStr] = displayId.split("-child-");
          if (String(parent.id) === parentIdStr) {
            const childIdx = Number(childIdxStr);
            const childArr = Array.isArray(parent.oSubMenusSpeAccess)
              ? [...parent.oSubMenusSpeAccess]
              : [];

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
            id: `${row.id}-child-${idx}`, 
            isChild: true,
            parentId: row.id,
            ParentMenuName: row.ParentMenuName,
          }))
        : []),
    ];
  });

  const handleOpenMenu = () => {
    const { initialSelectedIds, disabledSubmenuIds } =
      prepareExistingMenus(RoleTableData);
    setPickerInitialSelectedIds(initialSelectedIds);
    setPickerDisabledSubmenuIds(disabledSubmenuIds);
    setOpenMenu(true);
  };

  const prepareExistingMenus = (roleTableData) => {
    const selectedIds = new Set();
    const disabledSubMenus = new Set();
    roleTableData.forEach((row) => {
      if (row.SubMenuId) {
        disabledSubMenus.add(Number(row.SubMenuId));
        selectedIds.add(row.SubMenuId); 
      }

      // For child special access
      if (Array.isArray(row.oSubMenusSpeAccess)) {
        row.oSubMenusSpeAccess.forEach((acc) => {
          const accessId = `${row.SubMenuId}_${acc.LineNum}`;
          selectedIds.add(accessId);
        });
      }
    });

    return {
      initialSelectedIds: Array.from(selectedIds),
      disabledSubmenuIds: Array.from(disabledSubMenus),
    };
  };

  return (
    <>
      <Dialog open={openMenu} onClose={handleCloseMenu} fullWidth maxWidth="md">
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <DialogTitle>ROLE CREATION</DialogTitle>
          <IconButton onClick={handleCloseMenu}>
            <CloseIcon />
          </IconButton>
        </Grid>

        <DialogContent dividers>
          <div style={{ height: 550, width: "100%" }}>
            <CollapsibleMenuGrid
              menuList={MenuList}
              onSelectionChange={setSelectedIds}
              // existingSubMenus={[
              //   ...new Set(
              //     (RoleTableData || [])
              //       .filter((r) => r.SubMenuId != null)
              //       .map((r) => r.SubMenuId)
              //   ),
              // ]}
              initialSelectedIds={pickerInitialSelectedIds}
              disabledSubmenuIds={pickerDisabledSubmenuIds}
            />
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 3, 
          }}
        >
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
                          size="medium"
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
              Add Role
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
        />
      </Grid>
    </>
  );
};
export default RoleCreation;
