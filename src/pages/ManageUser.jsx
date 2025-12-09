import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import avatar from "../../src/assets/avtar.png";

import InputTextField, {
  DatePickerField,
  //   DatePickerField,
  InputPasswordField,
} from "../components/Component";
import Loader from "../components/Loader";
import { BASE_URL } from "../Constant";
// import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useTheme } from "@mui/material/styles";
import InputTextFieldNewUserMail from "../components/Component";
import { useThemeMode } from "../Dashboard/Theme";

export default function ManageUsers() {
  const { control, handleSubmit, getValues, reset } = useForm();
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [on, setOn] = React.useState(false);
  const [uploadedImg, setUploadedImg] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [Image, setImage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [totalRows, setTotalRows] = React.useState("");
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [searchText, setSearchText] = React.useState("");
  const [ClearUpdateButton, setClearUpdateButton] = React.useState("RESET");
  const originalDataRef = React.useRef(null);
  const [RoleList, setRoleList] = React.useState([]);
  const theme = useTheme();
  const { checkAccess } = useThemeMode();
  const canAdd = checkAccess(3, "IsAdd");
  const canEdit = checkAccess(3, "IsEdit");
  const canDelete = checkAccess(3, "IsDelete");
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const [rolePage, setRolePage] = useState(0);
  const [hasMoreRole, setHasMoreRole] = useState(true);
  const [searchRole, setSearchRole] = React.useState("");
  const [gazOfficerList, setGazOfficerList] = React.useState([]);
  const [gazOfficerPage, setGazOfficerPage] = React.useState(0);
  const [gazOfficerSearch, setGazOfficerSearch] = React.useState("");
  const [gazOfficerLoading, setGazOfficerLoading] = React.useState(false);
  const [gazOfficerHasMore, setGazOfficerHasMore] = React.useState(true);

  const clearFormData = () => {
  
    if (ClearUpdateButton === "CLEAR") {
      reset({
        Id: "",
        Password: "",
        FirstName: "",
        Username: "",
        LastName: "",
        Phone: "",
        Status: 1,
        Email: "",
        UserType: "U",
        Avatar: "",
      });
      setImage("");
    } else if (ClearUpdateButton === "RESET") {
      // Reset to the original data
      if (originalDataRef.current) {
        const resetData = {
          ...originalDataRef.current,
          // Ensure DOB is always a valid dayjs object
          DOB: originalDataRef.current.DOB
            ? dayjs(originalDataRef.current.DOB)
            : undefined,
        };
        reset(resetData);
      } else {
        console.error("Original data is not available!");
      }
    }
  };

  const handleClose = () => {
    setClearUpdateButton("CLEAR");
    setOn(false);
    clearFormData();

   };

  // const handleProfileClose = () => {
  //   setOpen(false);
  // };

  const handleUpdate = async (row) => {
    setSaveUpdateButton("UPDATE");
    setClearUpdateButton("RESET");
    setOn(true);

    try {
      setLoading(true);
      const apiUrl = `${BASE_URL}Users/${row.Id}`;

      const response = await axios.get(apiUrl);

      if (response.data) {
        const data = response.data.values;
        originalDataRef.current = data;
        reset({
          Id: data.Id ?? "",
          FirstName: data.FirstName ?? "",
          Username: data.Username ?? "",
          LastName: data.LastName ?? "",
          DOB: data.DOB ? dayjs(data.DOB) : null,
          Phone: data.Phone ?? "",
          Email: data.Email ?? "",
          Status: data.Status ?? "",
          UserType: data.UserType ?? "",
          GazOfficer: data.GazOfficer ?? "",
          Role: data.Role ?? "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProfile = () => {
    setOpen(true);
  };

  const handleOnSave = () => {
    setSaveUpdateButton("ADD");
    setClearUpdateButton("CLEAR");
    clearFormData();
    setOn(true);

    setRolePage(0);
    setRoleList([]);
    setHasMoreRole(true);
    fetchRoleList({ page: 0 });
    handleFetchGazOfficers({ page: 0 });
  };

  const deluser = async (id) => {
    setLoaderOpen(true);
    Swal.fire({
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${BASE_URL}Users/${id}`)
          .then((response) => {
            if (response.data.success === true) {
              setLoaderOpen(false);
              setUserData(userData.filter((user) => user.Id !== id));
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "User deleted Successfully",
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              setLoaderOpen(false);
              Swal.fire({
                icon: "error",
                toast: true,
                title: "Failed",
                text: "Failed to Delete Video",
                showConfirmButton: true,
              });
            }
          })
          .catch((error) => {
            setLoaderOpen(false);
            Swal.fire({
              icon: "error",
              toast: true,
              title: "Failed",
              text: error,
              showConfirmButton: true,
            });
          });
      }
      setLoaderOpen(false);
    });
  };

  const validationAlert = (message) => {
    Swal.fire({
      position: "center",
      icon: "warning",
      toast: true,
      width: "500px",
      title: message,
      showConfirmButton: false,
      timer: 3000,
    });
  };

  const OnSubmit = async () => {
    const requiredFields = ["FirstName", "LastName", "Username"];
    const emptyRequiredFields = requiredFields.filter(
      (field) => !getValues(field) || !String(getValues(field)).trim()
    );

    if (emptyRequiredFields.length > 0) {
      validationAlert(
        "Please fill in first Name , Last Name ,user Name & Password required fields"
      );
      return;
    } else if (!isValidUsername(getValues("Username"))) {
      validationAlert("Please enter minimum 4 letters Username.");
      return;
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/.test(getValues("Password")) &&
      SaveUpdateButton === "ADD"
    ) {
      validationAlert(
        "Password must contain at least one numeric digit, one alphabet, and one capital letter and at least 8 character..."
      );
      return;
    }

    setLoaderOpen(true);

    // const filename = new Date().getTime() + "_" + uploadedImg.name;

    const saveObj = {
      UserId: sessionStorage.getItem("userId") || "",
      ModifiedBy: sessionStorage.getItem("userId"),
      CreatedBy: sessionStorage.getItem("userId"),
      FirstName: getValues("FirstName") || "",
      Username: getValues("Username"),
      LastName: getValues("LastName") || "",
      DOB: getValues("DOB") || undefined,
      Password: getValues("Password"),
      Phone: getValues("Phone") || "",
      Email: getValues("Email") || "",
      CreatedDate: dayjs().format("YYYY-MM-DD"),
      UserType: getValues("UserType") || "U",
      GazOfficer: getValues("GazOfficer") || null,
      Role: getValues("Role") || null,

      // Avatar: uploadedImg !== "" ? filename : "",
      Status: getValues("Status"),
    };

    const UpdateObj = {
      Id: getValues("Id"),
      UserId: sessionStorage.getItem("userId") || "",
      ModifiedBy: sessionStorage.getItem("userId"),
      CreatedBy: sessionStorage.getItem("userId"),
      ModifiedDate: dayjs().format("YYYY-MM-DD"),
      FirstName: getValues("FirstName") || "",
      Username: getValues("Username"),
      LastName: getValues("LastName") || "",
      DOB: getValues("DOB") || undefined,
      Phone: getValues("Phone") || "",
      Email: getValues("Email") || "",
      UserType: getValues("UserType") || "U",
      GazOfficer: getValues("GazOfficer") || null,
      Role: getValues("Role") || null,

      Status: getValues("Status"),
      // Avatar: uploadedImg === "" ? getValues("Avatar") : filename,
    };
    setLoaderOpen(true);
    if (getValues("Password") !== "" || getValues("Password") !== undefined) {
      saveObj.Password = getValues("Password");
      UpdateObj.Password = getValues("Password");
    }

    if (SaveUpdateButton === "ADD") {
      const response = await axios.post(`${BASE_URL}Users`, saveObj);
      if (response.data.success === true) {
        if (uploadedImg !== "") {
          const res = await axios.request({
            method: "PUT",
            maxBodyLength: Infinity,
            headers: {
              "Content-Type": "image/jpeg",
              // AccessKey: Bunny_Storage_Access_Key,
            },
            data: uploadedImg,
          });
          if (response.data.success === true) {
            setLoaderOpen(false);
            Swal.fire({
              position: "center",
              icon: "success",
              toast: true,
              title: "User Added Successfully",
              showConfirmButton: false,
              timer: 1500,
            });
            handleClose();
            getUserData(currentPage, searchText);
            setUploadedImg("");
          } else {
            setLoaderOpen(false);
            throw new Error("User Added but Failed to Upload Image");
          }
        } else {
          setLoaderOpen(false);
          Swal.fire({
            position: "center",
            icon: "success",
            toast: true,
            title: "User Added Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          handleClose();
          getUserData(currentPage, searchText);
          setUploadedImg("");
        }
      } else {
        setLoaderOpen(false);
        Swal.fire({
          icon: "error",
          toast: true,
          title: "Failed",
          text: response.data.message,
          showConfirmButton: true,
        });
      }
    } else {
      const result = await Swal.fire({
        text: "Do you want to Update...?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update it!",
      });

      if (result.isConfirmed) {
        try {
          const response = await axios.put(
            `${BASE_URL}Users/${getValues("Id")}`,
            UpdateObj
          );
          if (response.data.status && uploadedImg !== "") {
            const res = await axios.request({
              method: "PUT",
              maxBodyLength: Infinity,
              headers: {
                "Content-Type": "image/jpeg",
                // AccessKey: Bunny_Storage_Access_Key,
              },
              data: uploadedImg,
            });

            if (res.data.HttpCode === 201) {
              if (getValues("Avatar") !== "") {
                await axios.request({
                  method: "DELETE",
                  maxBodyLength: Infinity,
                  headers: {
                    // AccessKey: Bunny_Storage_Access_Key,
                  },
                });
              }
              setLoaderOpen(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "User Updated Successfully",
                toast: true,
                showConfirmButton: false,
                timer: 1500,
              });
              handleClose();
              getUserData(currentPage, searchText);
              setUploadedImg("");
            } else {
              setLoaderOpen(false);
              throw new Error("Failed to Update Data");
            }
          } else {
            setLoaderOpen(false);
            Swal.fire({
              position: "center",
              icon: "success",
              title: " User Updated Successfully",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            handleClose();
            getUserData(currentPage, searchText);
            setUploadedImg("");
          }
        } catch (error) {
          if (error.response.data.HttpCode === 404) {
            setLoaderOpen(false);
            Swal.fire({
              position: "center",
              icon: "success",
              title: " Data Updated Successfully",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            handleClose();
            getUserData();
            setUploadedImg("");
            return;
          }
          setLoaderOpen(false);
          Swal.fire({
            icon: "error",
            toast: true,
            title: "Failed",
            text: error.message,
            showConfirmButton: true,
          });
        }
      } else {
        setLoaderOpen(false);
      }
    }
  };

  const isValidUsername = (username) => {
    const usernameRegex = /^.{4,}$/;
    return usernameRegex.test(username);
  };

  const getUserData = async (page = 0, searchText = "") => {
    try {
      let apiUrl = `${BASE_URL}Users?Page=${page}&Limit=${limit}`;

      if (searchText) {
        apiUrl = `${BASE_URL}Users?SearchText=${searchText}&Page=${page}&Limit=${limit}`;
      }
      const response = await axios.get(apiUrl);

      if (response.data && response.data.values) {
        setUserData(
          response.data.values.map((item, index) => ({
            ...item,
            id: page * limit + index + 1,
          }))
        );
        setTotalRows(response.data.count || 0);

        if (searchText) {
          setTotalRows(response.data.count);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getUserData(currentPage, searchText);
    // handleFetchGazOfficers();
  }, [currentPage, limit, searchText]);

  const columns = [
    {
      field: "Action",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      // width: 100,
      sortable: false,
      minWidth: 80,
      maxWidth: 100,
      flex: 0.3,
      renderCell: (params) => (
        <>
          <Tooltip
            title={!canEdit ? "You don't have Edit permission" : ""}
            placement="top"
          >
            <span>
              <IconButton
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
            title={!canDelete ? "You don't have delete permission" : ""}
            placement="top"
          >
            <span>
              <IconButton
                sx={{
                  "& .MuiButtonBase-root,": {
                    padding: 0,
                    marginLeft: 1,
                  },
                  color: "red",
                }}
                onClick={() => deluser(params.row.Id)}
                disabled={!canDelete}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </>
      ),
    },
    {
      field: "id",
      headerName: "SR.No",
      headerAlign: "center",
      align: "center",
      minWidth: 60,
      maxWidth: 70,
      flex: 0.2,
      sortable: true,
    },

    {
      field: "FirstName",
      headerName: "First Name",
      minWidth: 120,
      maxWidth: 150,
      flex: 1.0,
      sortable: false,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "LastName",
      headerName: "Last Name",
      minWidth: 140,
      maxWidth: 180,
      flex: 1.0,
      sortable: false,
      headerAlign: "center",
      align: "center",
      gap: "6px",
      // fontWeight: 600,
    },

    {
      field: "Username",
      headerName: "Username",
      minWidth: 140,
      maxWidth: 190,
      flex: 1.0,
      sortable: false,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "DOB",
      headerName: "DOB",
      minWidth: 120,
      maxWidth: 150,
      flex: 1.0,
      sortable: false,
      valueFormatter: (params) => {
        const value = params.value;
        return value ? dayjs(value).format("YYYY-MM-DD") : "NA";
      },
      headerAlign: "center",
      align: "center",
    },

    {
      field: "Phone",
      headerName: "Phone",
      minWidth: 130,
      maxWidth: 150,
      flex: 1.0,
      sortable: false,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => {
        if (!params.value) return "NA";
        return `+91 ${params.value}`;
      },
    },

    {
      field: "Email",
      headerName: "Email",
      minWidth: 140,
      maxWidth: 180,
      flex: 1.0,
      sortable: false,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => {
        const value = params.value?.trim();
        return value ? value : "NA";
      },
    },

    {
      field: "UserType",
      headerName: "User Type",
      minWidth: 130,
      maxWidth: 150,
      flex: 1.0,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        // Map U to 'User' and A to 'Admin'
        const userTypeMap = {
          U: "User",
          A: "Admin",
        };
        return userTypeMap[params.value] || params.value;
      },
    },

    {
      field: "Status",
      headerName: "Status",
      minWidth: 110,
      maxWidth: 150,
      flex: 1.0,
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

  const handleFetchGazOfficers = async ({ page = 0, SearchText = "" }) => {
    if (gazOfficerLoading) return;
    setGazOfficerLoading(true);

    try {
      const { data } = await axios.get(`${BASE_URL}GazOfficers`, {
        params: { page, SearchText, Status: "1" },
      });

      const fetched = data.values || [];

      if (page === 0) {
        setGazOfficerList(fetched);
      } else {
        setGazOfficerList((prev) => [...prev, ...fetched]);
      }

      setGazOfficerHasMore(fetched.length >= 20);
    } catch (error) {
      console.error("Error Fetching Gaz Officers", error);
    } finally {
      setGazOfficerLoading(false);
    }
  };

  const handleGazOfficerScroll = (event) => {
    const listboxNode = event.currentTarget;

    const isBottom =
      listboxNode.scrollTop + listboxNode.clientHeight >=
      listboxNode.scrollHeight - 1;

    if (isBottom && !gazOfficerLoading && gazOfficerHasMore) {
      const nextPage = gazOfficerPage + 1;
      setGazOfficerPage(nextPage);
      handleFetchGazOfficers({
        page: nextPage,
        SearchText: gazOfficerSearch,
      });
    }
  };
  const handleGazOfficerSearch = (value) => {
    setGazOfficerSearch(value);
    setGazOfficerPage(0);

    // reset old list
    setGazOfficerList([]);

    // 250ms delay to avoid API spam
    setTimeout(() => {
      handleFetchGazOfficers({ page: 0, SearchText: value });
    }, 250);
  };

  const fetchRoleList = async ({ page = 0, search = "" }) => {
    if (loading) return;
    setLoading(true);

    try {
      const { data } = await axios.get(`${BASE_URL}Role`, {
        params: { page, SearchText: search },
      });

      const fetchedData =
        data.values?.map((item) => ({
          ...item,
          isDisabled: item.Status === 0,
        })) || [];

      if (page === 0) {
        setRoleList(fetchedData);
      } else {
        setRoleList((prev) => [...prev, ...fetchedData]);
      }

      setHasMoreRole(fetchedData.length >= 20);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleScroll = (event) => {
    const listboxNode = event.currentTarget;

    const isBottom =
      listboxNode.scrollTop + listboxNode.clientHeight >=
      listboxNode.scrollHeight - 1;

    if (isBottom && !loading && hasMoreRole) {
      const nextPage = rolePage + 1;
      setRolePage(nextPage);
      fetchRoleList({ page: nextPage, search: searchRole });
    }
  };

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}

      {/* <Modal
        open={on}
        sx={{
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0,0,0,0.35)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={12}
          sx={{
            width: { xs: "93%", sm: "85%", md: 620 },
            maxHeight: "88vh",
            overflowY: "auto",
            p: 4,
            borderRadius: 4,
            position: "relative",

             "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "#bbb",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#888",
            },
          }}
        > */}
      <Dialog
        open={on}
        onClose={() => {}}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: { xs: "93%", sm: "85%", md: 620 },
            maxHeight: "88vh",
            overflow: "hidden",
            borderRadius: 4,
            p: 0,
          },
        }}
        sx={{
          "& .MuiDialog-container": {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0,0,0,0.35)",
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
           USER CREATION
            

          <IconButton onClick={handleClose} sx={{ p: 0, mt: 0 }}>
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
        <DialogContent
          dividers={false}
          sx={{
            p: 4,
            overflowY: "auto",

            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "#bbb",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#888",
            },
          }}
        >
          <Grid
            container
            rowSpacing={3}
            columnSpacing={2}
            spacing={2}
            component={"form"}
            // onSubmit={handleSubmit(OnSubmit)}
          >
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                onClick={handleUploadProfile}
              >
                <img
                  src={Image || avatar}
                  alt="Upload"
                  height={80}
                  width={80}
                  style={{
                    borderRadius: "50%",
                    border: "2px solid #2196F3",
                    boxShadow: "0 0 4px rgba(33,150,243,0.5)",
                  }}
                />
              </Badge>
            </Grid>
           
            <Grid item md={6} sm={6} xs={12}>
              <Controller
                name="FirstName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputTextField
                    {...field}
                    label="FIRST NAME"
                    id="FirstName"
                    className="custom-required-field"
                  />
                )}
              />
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <Controller
                name="LastName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputTextField {...field} label="LAST NAME" id="LastName" />
                )}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Controller
                name="Username"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputTextField
                    {...field}
                    label="USERNAME "
                    id="Username"
                    disabled={ClearUpdateButton === "RESET"}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Controller
                name="Password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputPasswordField
                    {...field}
                    label="PASSWORD"
                    id="Password"
                    type={showPassword ? "text" : "Password"}
                    showPassword={showPassword}
                    onClick={handleClickShowPassword}
                  />
                )}
              />
              <Typography fontSize={"small"} color={"red"}>
                Leave blank here to keep current Password
              </Typography>
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <Controller
                name="DOB"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    {...field}
                    id="DOB"
                    label="DATE OF BIRTH"
                    maxDate={dayjs(undefined)}
                  />
                )}
              />
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <Controller
                name="Phone"
                control={control}
                rules={{
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit mobile number",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="PHONE NO"
                    size="small"
                    sx={{ width: "85%" }}
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
              />
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <Controller
                name="Email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputTextFieldNewUserMail
                    {...field}
                    label="EMAIL ID "
                    id="Email"
                    type="email"
                    required
                    className="custom-required-field"
                  />
                )}
              />
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <Controller
                name="UserType"
                control={control}
                defaultValue="U"
                render={({ field }) => (
                  <TextField
                    select
                    label="USER TYPE "
                    sx={{ width: "86%" }}
                    fullWidth
                    size="small"
                    {...field}
                  >
                    <MenuItem value="U">USER</MenuItem>
                    <MenuItem value="A">ADMIN</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <Controller
                name="Role"
                control={control}
                defaultValue={null}
                render={({ field }) => {
                  const listWithDefault = [
                    { RoleName: "No Role" },
                    ...RoleList,
                  ];

                  const selectedObj = listWithDefault.find(
                    (item) => item.RoleName === field.value
                  );

                  const selectedValue = selectedObj?.RoleName || "";

                  return (
                    <Tooltip title={selectedValue} arrow placement="top">
                      <Autocomplete
                        options={listWithDefault}
                        getOptionLabel={(option) => option?.RoleName || ""}
                        value={selectedObj || null}
                        loading={loading}
                        filterOptions={(x) => x}
                        clearOnEscape
                        freeSolo={false}
                        onInputChange={(event, value, reason) => {
                          if (value === "No Role") return;

                          if (reason === "input" || reason === "clear") {
                            setSearchRole(value || "");
                            setRolePage(0);
                            setRoleList([]);
                            setHasMoreRole(true);
                            fetchRoleList({ page: 0, search: value || "" });
                          }
                        }}
                        onChange={(_, newValue) => {
                          if (!newValue || newValue.RoleName === "No Role") {
                            field.onChange(null);
                          } else {
                            field.onChange(newValue.RoleName);
                          }
                        }}
                        ListboxProps={{
                          onScroll: handleRoleScroll,
                          style: { maxHeight: 170 },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="ROLE"
                            size="small"
                            sx={{ width: "82%" }}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Tooltip>
                  );
                }}
              />
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <Controller
                name="GazOfficer"
                control={control}
                defaultValue={null}
                render={({ field }) => {
                  const listWithDefault = [
                    { Name: "No Officer" },
                    ...gazOfficerList,
                  ];

                  const selectedObj =
                    listWithDefault.find((x) => x.Name === field.value) || null;

                  const selectedValue = selectedObj?.Name || "";

                  return (
                    <Tooltip title={selectedValue} arrow placement="top">
                      <Autocomplete
                        options={listWithDefault}
                        getOptionLabel={(option) => option?.Name || ""}
                        value={selectedObj}
                        loading={gazOfficerLoading}
                        onInputChange={(e, value, reason) => {
                          if (value === "No Officer") return;

                          if (reason === "input" || reason === "clear") {
                            handleGazOfficerSearch(value || "");
                          }
                        }}
                        onChange={(e, newValue) => {
                          if (!newValue || newValue.Name === "No Officer") {
                            field.onChange(null);
                          } else {
                            field.onChange(newValue.Name);
                          }
                        }}
                        ListboxProps={{
                          onScroll: handleGazOfficerScroll,
                          style: { maxHeight: 170, overflow: "auto" },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Gaz Officer"
                            size="small"
                            sx={{ width: "87%" }}
                          />
                        )}
                      />
                    </Tooltip>
                  );
                }}
              />
            </Grid>

            <Grid item md={6} sm={3} xs={12} textAlign={"center"}>
              <Controller
                name="Status"
                control={control}
                defaultValue={1}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value === 1}
                        onChange={(e) =>
                          field.onChange(e.target.checked ? 1 : 0)
                        }
                      />
                    }
                    label="ACTIVE"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        {/* <Grid
              item
              xs={12}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              position="sticky"
              bottom={0}
              sx={{
                padding: "10px",
                zIndex: 1000,
              }}
            > */}
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
            px: 3,
            py: 2,
            position: "sticky",
            bottom: 0,
            // background: "white",
            zIndex: 1000,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Cancel Button (Left) */}
          <Button
            size="small"
            onClick={() => clearFormData()}
            sx={{
              p: 1,
              width: 80,
              color: "#2196F3",
              background: "transparent",
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
            onClick={handleSubmit(OnSubmit)}

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
        {/* </Grid> */}
        {/* </Paper> */}
      </Dialog>

      <Grid
        container
        xs={12}
        sm={12}
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
        elevation="1"
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
          Manage Users
        </Typography>
      </Grid>
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
                backgroundColor: theme.palette.Button.background,

                pr: 2,
                color: "white",

                borderRadius: "8px",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 2px 4px solid black",
                "&:hover": {
                  transform: "translateY(2px)",
                  boxShadow: "0 2px 4px solid black",
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
              Add User
            </Button>
          </span>
        </Tooltip>
      </Grid>
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
            rowHeight={70}
            getRowId={(row) => row.Id}
            rows={userData}
            columns={columns}
            pagination
            paginationMode="server"
            rowCount={totalRows}
            paginationModel={{ page: currentPage, pageSize: limit }}
            onPaginationModelChange={(newModel) => {
              setCurrentPage(newModel.page);
              setLimit(newModel.pageSize);
            }}
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
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: (theme) => theme.palette.custome.datagridcolor,
              },
              "& .MuiDataGrid-row:hover": {
                boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)",
              },

              "& .MuiDataGrid-virtualScroller": {
                scrollbarWidth: "thin", // Firefox
              },
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                width: "6px", // Chrome, Edge
                height: "6px",
              },
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
                backgroundColor: "#9e9e9e",
                borderRadius: "10px",
              },
            }}
          />
        </Box>
      </Paper>
    </>
  );
}
