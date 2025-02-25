import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CloseIcon from "@mui/icons-material/Close";
import { GridToolbar } from "@mui/x-data-grid";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../Constant";
import Loader from "../components/Loader";
import InputTextField, {
  CheckboxInputs,
  InputSelectField,
  InputTextField1,
} from "../components/Component";
import DeleteIcon from "@mui/icons-material/Delete";

const OfflineServices = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [totalRows, setTotalRows] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [searchText, setSearchText] = React.useState("");
  const limit = 20; // Fixed page size
  const [rows, setRows] = React.useState([]);
  const [addressList, setAddressList] = React.useState([]);
  const [EmailList, setEmailList] = React.useState([]);
  const [ClearUpdateButton, setClearUpdateButton] = React.useState("RESET");
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({
    Id: null,
    ServicesEN: "",
    ServicesMR: "",
    DepartmentEN: "",
    DepartmentMR: "",
    SubDepartmentEN: "",
    SubDepartmentMR: "",
    TimeLimitEN: "",
    TimeLimitMR: "",
    DesignatedOfficerEN: "",
    DesignatedOfficerMR: "",
    FirstAppellateOfficerEN: "",
    FirstAppellateOfficerMR: "",
    SecondAppllateOfficerEN: "",
    SecondAppllateOfficerMR: "",
    AvailableOnPortalEN: "",
    AvailableOnPortalMR: "",
    PhoneNumbers: "",
    Website: "",
    OtherLink: "",
    Address: [],
    Email: [],
  });
  const originalDataRef = React.useRef(null);

  const handleAddAddress = () => {
    const newRow = {
      id: addressList.length + 1,
      srNo: addressList.length + 1,
      Address: "",
      AddressLink: "",
    };
    setAddressList([...addressList, newRow]);
  };

  const handleAddressChange = (id, field, value) => {
    setAddressList((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleDeleteAddress = (id) => {
    const updatedList = addressList.filter((row) => row.id !== id);
    const updatedWithSrNo = updatedList.map((row, index) => ({
      ...row,
      id: index + 1,
    }));
    setAddressList(updatedWithSrNo);
  };

  const handleAddEmail = () => {
    const newRow = {
      id: EmailList.length + 1, // Ensure new ID is unique
      srNo: EmailList.length + 1, // Sr. No. is always sequential
      Email: "", // Empty address field
    };
    setEmailList([...EmailList, newRow]); // Append row at the end
  };
  // Function to handle direct input changes inside the DataGrid
  const handleEmailChange = (id, value) => {
    setEmailList((prev) =>
      prev.map((row) => (row.id === id ? { ...row, Email: value } : row))
    );
  };
  // Function to delete an address row and update Sr. No.
  const handleDeleteEmail = (id) => {
    setEmailList((prevList) => {
      // Filter out the deleted row
      const updatedList = prevList.filter((row) => row.id !== id);

      // Recalculate Sr. No. for all remaining rows
      return updatedList.map((row, index) => ({
        ...row,
        id: index + 1, // Reset Sr. No. sequentially
      }));
    });
  };

  const validateForm = () => {
    const {
      DepartmentEN,
      SubDepartmentEN,
      ServicesEN,
      TimeLimitEN,
      DesignatedOfficerEN,
      FirstAppellateOfficerEN,
      SecondAppllateOfficerEN,
      AvailableOnPortalEN,
      Website,
    } = data;
    return (
      Website &&
      DepartmentEN &&
      SubDepartmentEN &&
      ServicesEN &&
      TimeLimitEN &&
      DesignatedOfficerEN &&
      FirstAppellateOfficerEN &&
      SecondAppllateOfficerEN &&
      AvailableOnPortalEN &&
      Website
    );
  };
  const handleSave = async () => {
    setClearUpdateButton("CLEAR");
    try {
      // const selectedDept = Departments.find(
      //   (dept) => dept.Id === formData.DeptId
      // );

      // Ensure Documents are structured correctly
      const formattedEmail = EmailList
      .filter(item => item.Email && item.Email.trim() !== "")  // Only include if Email is non-empty
      .map(docType => ({
        Id: docType.Id || null,
        Email: docType.Email,
      }));
    
    const formattedAddress = addressList
      .filter(item => 
        (item.Address && item.Address.trim() !== "") || 
        (item.AddressLink && item.AddressLink.trim() !== "")
      )  // Only include if either Address or AddressLink is non-empty
      .map(sp => ({
        Id: sp.Id || null,
        Address: sp.Address,
        AddressLink: sp.AddressLink,
      }));

      const formattedData = {
        ...data,
        Id: data.Id || null,
        Status: 1,
        Address: formattedAddress,
        Email: formattedEmail,
      };

      if (SaveUpdateButton === "SAVE") {
        axios
          .post(`${BASE_URL}DepartmentNoticeSer/`, formattedData)
          .then((response) => {
            setLoaderOpen(false);
            if (response.data.success === true) {
              getAllImgList(currentPage, searchText);
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Service added successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              setOn(false);
              // handleParentDialogClose();
            } else {
              Swal.fire({
                icon: "error",
                title: "Failed to save Service",
                text: response.data.message,
              });
            }
          });
        // .catch((error) => handleApiError(error));
      } else {
        if (!data.Id) {
          setLoaderOpen(false);
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "Invalid Service ID",
          });
          return;
        }

        const result = await Swal.fire({
          text: "Do you want to Update...?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, Update it!",
        });
        document.querySelector(".swal2-container").style.zIndex = "99999";

        if (!result.isConfirmed) return;

        axios
          .put(`${BASE_URL}DepartmentNoticeSer/${data.Id}`, formattedData)
          .then((response) => {
            setLoaderOpen(false);
            if (response.data.success === true) {
              clearFormData();
              // getAllDeptServData();
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Service Updated successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              setOn(false);
              getAllImgList(currentPage, searchText);
              // handleParentDialogClose();
            } else {
              Swal.fire({
                icon: "error",
                title: "Failed to update Service",
                text: response.data.message,
              });
            }
          });
        // .catch((error) => handleApiError(error));
      }
    } catch (error) {
      handleApiError(error);
    }
  };
 const handleApiError = (error) => {
    setLoaderOpen(false);
    console.error("Error:", error);
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: error.message || "Something went wrong",
    });
  };
  const getAllImgList = async (page = 0, searchText = "") => {
    try {
      setLoading(true);
      let apiUrl = `${BASE_URL}DepartmentNoticeSer/ByPage/NO/${page}/${limit}`;
      if (searchText) {
        apiUrl = `${BASE_URL}DepartmentNoticeSer/ByPage/search/${searchText}/NO/${page}/${limit}`;
      }
      const response = await axios.get(apiUrl);
      if (response.data && response.data.values) {
        setRows(
          response.data.values.map((item, index) => ({
            ...item,
            id: page * limit + index + 1, // ✅ Ensures SR.NO continues across pages
          }))
        );
        setTotalRows(response.data.count);

        if (searchText) {
          setTotalRows(response.data.count);
        }
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!searchText) {
      // fetchTotalRecords();
    }

    const handler = setTimeout(() => {
      getAllImgList(currentPage, searchText);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchText, currentPage]);

  const handleDelete = async (rowData) => {
    Swal.fire({
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoaderOpen(true);
        axios
          .delete(`${BASE_URL}DepartmentNoticeSer/${rowData.Id}`)
          .then((response) => {
            setLoaderOpen(false);

            if (response.data && response.data.success === true) {
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Department deleted successfully",
                showConfirmButton: false,
                timer: 1500,
              });

              getAllImgList(currentPage, searchText);
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
          })
          .catch((error) => {
            handleApiError(error);

          });
      }
    });
  };

  const handleUpdate = async (rowData) => {
    setSaveUpdateButton("UPDATE");
    setClearUpdateButton("RESET");
    setOn(true);
    try {
      setLoading(true);
      const apiUrl = `${BASE_URL}DepartmentNoticeSer/ById/${rowData.Id}`;
      const response = await axios.get(apiUrl);
      if (response.data) {
        const data = response.data.values;
        originalDataRef.current = JSON.parse(JSON.stringify(data));

        // Set the form fields with API response
        setData({
          Id: data.Id,
          ServicesEN: data.ServicesEN,
          ServicesMR: data.ServicesMR,
          DepartmentEN: data.DepartmentEN,
          DepartmentMR: data.DepartmentMR,
          SubDepartmentEN: data.SubDepartmentEN,
          SubDepartmentMR: data.SubDepartmentMR,
          TimeLimitEN: data.TimeLimitEN,
          TimeLimitMR: data.TimeLimitMR,
          DesignatedOfficerEN: data.DesignatedOfficerEN,
          DesignatedOfficerMR: data.DesignatedOfficerMR,
          FirstAppellateOfficerEN: data.FirstAppellateOfficerEN,
          FirstAppellateOfficerMR: data.FirstAppellateOfficerMR,
          SecondAppllateOfficerEN: data.SecondAppllateOfficerEN,
          SecondAppllateOfficerMR: data.SecondAppllateOfficerMR,
          PhoneNumbers: data.PhoneNumbers,
          Website: data.Website,
          OtherLink: data.OtherLink,
          AvailableOnPortalEN: data.AvailableOnPortalEN,
          AvailableOnPortalMR: data.AvailableOnPortalMR,
        });

        // Handle Address List
        setAddressList(
          data.Address
            ? data.Address.map((sp, index) => ({
                id: index + 1,
                Id: sp.Id || null,
                Address: sp.Address,
                AddressLink: sp.AddressLink,
              }))
            : []
        );

        // Handle Email List
        setEmailList(
          data.Email
            ? data.Email.map((sp, index) => ({
                id: index + 1,
                Id: sp.Id || null,
                Email: sp.Email,
              }))
            : []
        );
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const onchangeHandler = (event) => {
    const { name, value } = event.target;

    setData({
      ...data,
      [name]: value,
    });
  };
  const clearFormData = () => {
    if (ClearUpdateButton === "CLEAR") {
      setData({ DepartmentEN: "", DeptNameMR: "", Status: 1 });
      setAddressList([]);
      setEmailList([]);
      return;
    }

    if (ClearUpdateButton === "RESET" && originalDataRef.current) {
      const { Address, Email, ...restData } = originalDataRef.current;

      setData(restData); // Set all form fields at once

      setAddressList(
        Address?.map((sp, index) => ({
          id: index + 1,
          Id: sp.Id || null,
          Address: sp.Address,
          AddressLink: sp.AddressLink,
        })) || []
      );

      setEmailList(
        Email?.map((sp, index) => ({
          id: index + 1,
          Id: sp.Id || null,
          Email: sp.Email,
        })) || []
      );
    }
  };
  // ========================
  const handleClose = () => {
    setOn(false);
    setClearUpdateButton("CLEAR");
    clearFormData();
  };
  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setClearUpdateButton("CLEAR");
    setOn(true);
    clearFormData();
    // setData({ Name: "", DepartmentEN: "", DeptNameMR: "", Id: "", Status: 1 });
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
  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    if (name === "PhoneNumbers") {
      if (value.length > 10) {
        validationAlert("Phone number must be exactly 10 digits long.");
        return;
      } else if (value.includes("e")) {
        validationAlert("Please enter a valid number");
        return;
      }
    }
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };
  const yesNoOptions = [
    { key: "Yes", value: "Yes" },
    { key: "No", value: "No" },
  ];
  const columns = [
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
              color: "rgb(0, 90, 91)", // Apply color to the icon
              "&:hover": {
                backgroundColor: "rgba(0, 90, 91, 0.1)", // Optional hover effect
              },
            }}
          >
            <EditNoteIcon />
          </IconButton>
          <Button
            size="medium"
            sx={{ color: "red" }}
            onClick={() => handleDelete(params.row)}
          >
            <DeleteForeverIcon />
          </Button>
        </strong>
      ),
    },
    {
      field: "id",
      headerName: "Sr.No",
      width: 100,
      sortable: true,
    },
    {
      field: "ServicesEN",
      headerName: "Service Name English",
      width: 250,
      sortable: false,
    },
    {
      field: "ServicesMR",
      headerName: "Service Name Marathi",
      width: 250,
      sortable: false,
    },
    {
      field: "DepartmentEN",
      headerName: "Department Name",
      width: 250,
      sortable: false,
    },
    {
      field: "DepartmentMR",
      headerName: "Department Name Marathi",
      width: 250,
      sortable: false,
    },
    {
      field: "SubDepartmentEN",
      headerName: "Sub Department Name (English)",
      width: 250,
      sortable: false,
    },
    {
      field: "SubDepartmentMR",
      headerName: "Sub Department Name Marathi",
      width: 250,
      sortable: false,
    },
    {
      field: "TimeLimitEN",
      headerName: "Time Limit Days",
      width: 250,
      sortable: false,
    },
    {
      field: "TimeLimitMR",
      headerName: "Time Limit Days",
      width: 250,
      sortable: false,
    },
    {
      field: "FirstAppellateOfficerEN",
      headerName: "First Appellate Officer EN",
      width: 250,
      sortable: false,
    },
    {
      field: "FirstAppellateOfficerMR",
      headerName: "First Appellate Officer MR",
      width: 250,
      sortable: false,
    },
    {
      field: "SecondAppllateOfficerEN",
      headerName: "Second Appellate Officer EN",
      width: 250,
      sortable: false,
    },
    {
      field: "SecondAppllateOfficerMR",
      headerName: "Second Appellate Officer MR",
      width: 250,
      sortable: false,
    },

    {
      field: "AvailableOnPortalEN",
      headerName: "Available On PortalEN",
      width: 250,
      sortable: false,
    },
    {
      field: "AvailableOnPortalMR",
      headerName: "Available On PortalEN",
      width: 250,
      sortable: false,
    },
    {
      field: "PhoneNumbers",
      headerName: "Phone Numbers",
      width: 250,
      sortable: false,
    },
    {
      field: "Website",
      headerName: "Website",
      width: 250,
      sortable: false,
    },
    {
      field: "OtherLink",
      headerName: "Other Link",
      width: 250,
      sortable: false,
    },
  ];

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
      <Dialog
        elevation={7}
        component={Paper}
        boxShadow={20}
        open={on}
        onClose={handleClose}
        aria-labelledby="parent-dialog-title"
        aria-describedby="parent-dialog-description"
        fullScreen
      >
        <DialogTitle
          sx={{
            color: "white",
            background: (theme) =>
              theme.palette.customAppbar?.appbarcolor ||
              "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
          }}
        >
          <b>Services</b>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon
              style={{
                backgroundColor: "white",
                color: "black",
                borderRadius: 50,
                height: 32,
                width: 32,
                boxShadow: "0px 6px 6px 0px rgba(0, 0, 0, 0.25)",
              }}
            ></CloseIcon>
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            // bgcolor: "#E6E6FA",
            backgroundColor: (theme) => theme.palette.background.default,
            overflowY: { xs: "scroll", md: "auto" },
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              padding: 3,
              marginTop: 3,
              textAlign: "center",
              display: "inline-block",
            }}
          >
            <Grid container spacing={2} pt={3}>
              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  fullWidth
                  id="ServicesEN"
                  label="Service Name English"
                  name="ServicesEN"
                  value={data.ServicesEN || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ width: "100%", borderRadius: 10 }}
                  // You can also pass sx if you want further customization
                  sx={{ width: "100%" }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  id="ServicesMR"
                  label="Service Name Marathi"
                  name="ServicesMR"
                  value={data.ServicesMR || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  id="DepartmentEN"
                  label="Department Name English"
                  name="DepartmentEN"
                  value={data.DepartmentEN || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  id="DepartmentMR"
                  label="Department Name Marathi"
                  name="DepartmentMR"
                  value={data.DepartmentMR || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  id="SubDepartmentEN"
                  label="Sub Department Name English"
                  name="SubDepartmentEN"
                  value={data.SubDepartmentEN || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  id="SubDepartmentMR"
                  label="Sub Department Name Marathi"
                  name="SubDepartmentMR"
                  value={data.SubDepartmentMR || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  id="TimeLimitEN"
                  label="Time Limit Days EN"
                  name="TimeLimitEN"
                  value={data.TimeLimitEN || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  id="TimeLimitMR"
                  label="Time Limit Days MR"
                  name="TimeLimitMR"
                  value={data.TimeLimitMR || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  id="DesignatedOfficerEN"
                  label="Designate Officer (English)"
                  name="DesignatedOfficerEN"
                  value={data.DesignatedOfficerEN || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  id="DesignatedOfficerMR"
                  label="Designate Officer (Marathi)"
                  name="DesignatedOfficerMR"
                  value={data.DesignatedOfficerMR || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  id="FirstAppellateOfficerEN"
                  label="First Applellate Officer (English)"
                  name="FirstAppellateOfficerEN"
                  value={data.FirstAppellateOfficerEN || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  id="FirstAppellateOfficerMR"
                  label="First Applellate Officer (Marathi)"
                  name="FirstAppellateOfficerMR"
                  value={data.FirstAppellateOfficerMR || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  id="SecondAppllateOfficerEN"
                  label="Second Appellate Officer (English)"
                  name="SecondAppllateOfficerEN"
                  value={data.SecondAppllateOfficerEN || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  id="SecondAppllateOfficerMR"
                  label="Second Applellate Officer"
                  name="SecondAppllateOfficerMR"
                  value={data.SecondAppllateOfficerMR || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputSelectField
                  id="AvailableOnPortalEN"
                  label="Available On Portal EN"
                  name="AvailableOnPortalEN"
                  value={data.AvailableOnPortalEN || "No"} // Defaults to "No" if no value provided
                  onChange={onChangeHandler}
                  data={yesNoOptions}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  id="AvailableOnPortalMR"
                  label="Available On Portal MR"
                  name="AvailableOnPortalMR"
                  value={data.AvailableOnPortalMR || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  type="number"
                  id="PhoneNumbers"
                  label="Phone Numbers"
                  name="PhoneNumbers"
                  value={data.PhoneNumbers || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  id="Website"
                  label="Website"
                  name="Website"
                  value={data.Website || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputTextField1
                  size="small"
                  spacing={"5"}
                  fullWidth
                  id="OtherLink"
                  label="Other Link"
                  name="OtherLink"
                  value={data.OtherLink || ""}
                  onChange={onChangeHandler}
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={4} textAlign={"center"}>
                <CheckboxInputs
                  checked={data.Status === 1} // Ensure it's checked by default
                  label="Active"
                  id="Status"
                  onChange={(event) =>
                    onchangeHandler({
                      target: {
                        name: "Status",
                        value: event.target.checked ? 1 : 0, // Ensure value is set properly
                      },
                    })
                  }
                  value={data.Status}
                  name="Status"
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ width: "100%", marginTop: 3 }}>
            <div style={{ padding: "16px", maxWidth: "1850px" }}>
              {/* Add Service Provider Button */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={3}>
                  <Button
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
                      display: "flex",
                      alignItems: "center",
                      gap: 1, // Adjust spacing between icon and text
                    }}
                    onClick={handleAddAddress}
                  >
                    <AddIcon />
                    <Typography
                      variant="body1"
                      sx={{ flexGrow: 1, textAlign: "center" }}
                    >
                      Address
                    </Typography>
                  </Button>
                </Grid>
              </Grid>

              {/* DataGrid */}
              <DataGrid
                hideFooter
                className="datagrid-style"
                rows={addressList}
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: (theme) =>
                      theme.palette.custome.datagridcolor,
                  },
                  "& .MuiDataGrid-row:hover": {
                    boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)",
                  },
                }}
                getRowHeight={() => 60} // Adjust row height here
                columns={[
                  { field: "id", headerName: "ID", width: 70 },
                  {
                    field: "Address",
                    headerName: "Address",
                    flex: 1,
                    renderCell: (params) => (
                      <TextField
                        fullWidth
                        value={params.row.Address}
                        onChange={(e) =>
                          handleAddressChange(
                            params.row.id,
                            "Address",
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => e.stopPropagation()} // Prevent interference
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "4px",
                          },
                        }}
                      />
                    ),
                  },
                  {
                    field: "AddressLink",
                    headerName: "Address Link",
                    flex: 1,
                    renderCell: (params) => (
                      <TextField
                        fullWidth
                        value={params.row.AddressLink}
                        onChange={(e) =>
                          handleAddressChange(
                            params.row.id,
                            "AddressLink",
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          e.stopPropagation();
                        }}
                        sx={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      />
                    ),
                  },
                  {
                    field: "actions",
                    headerName: "Actions",
                    width: 100,
                    renderCell: (params) => (
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteAddress(params.row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    ),
                  },
                ]}
                pageSize={5}
                disableColumnFilter
                disableColumnMenu
                disableColumnSelector
              />

    
            </div>
          </Paper>
          <Paper elevation={3} sx={{ width: "100%", marginTop: 3 }}>
            <div style={{ padding: "16px", maxWidth: "1850px" }}>
              {/* Add Service Provider Button */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={3}>
                  <Button
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
                      display: "flex",
                      alignItems: "center",
                      gap: 1, // Spacing between icon and text
                    }}
                    onClick={handleAddEmail}
                  >
                    <AddIcon />
                    <Typography
                      variant="body1"
                      sx={{ flexGrow: 1, textAlign: "center" }}
                    >
                      Email
                    </Typography>
                  </Button>
                </Grid>
              </Grid>

              {/* DataGrid */}
              <DataGrid
                className="datagrid-style"
                hideFooter
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: (theme) =>
                      theme.palette.custome.datagridcolor,
                  },
                  "& .MuiDataGrid-row:hover": {
                    boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)",
                  },
                }}
                rows={EmailList}
                getRowHeight={() => 60} // Adjust row height here
                columns={[
                  { field: "id", headerName: "ID", width: 70 },
                  {
                    field: "Email",
                    headerName: "Email",
                    flex: 1,
                    renderCell: (params) => (
                      <TextField
                        fullWidth
                        value={params.row.Email || ""}
                        onChange={(e) =>
                          handleEmailChange(params.row.id, e.target.value)
                        }
                        sx={{
                          padding: "4px 8px",
                          // border: "1px solid #ccc",
                          borderRadius: "4px",
                          // backgroundColor: "#fff",
                        }}
                      />
                    ),
                  },
                  {
                    field: "actions",
                    headerName: "Actions",
                    width: 100,
                    renderCell: (params) => (
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteEmail(params.row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    ),
                  },
                ]}
                pageSize={5}
              />
              {/* Dialog for Add/Edit */}
              {/* <Dialog
                open={openServiceProviderDialog}
                onClose={() => setOpenServiceProviderDialog(false)}
                maxWidth="sm"
                fullWidth     
                         >
                <DialogTitle>
                  {editing ? "Update Email" : "Add Email"}
                </DialogTitle>
                <DialogContent>
                  <TextField
                    multiline
                    fullWidth
                    label="Enter Email"
                    value={newServiceProvider.serviceName}
                    onChange={(e) =>
                      setNewServiceProvider({
                        ...newServiceProvider,
                        serviceName: e.target.value,
                      })
                    }
                    sx={{ mt: 2 }}
                  />
                 
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenServiceProviderDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveServiceProvider}
                    variant="contained"
                    sx={{ p: 1, color: "white", backgroundColor: "#5C5CFF" }}
                  >
                    {editing ? "Update" : "Save"}
                  </Button>
                </DialogActions>
              </Dialog> */}
            </div>
          </Paper>
          <DialogActions sx={{ position: "sticky", bottom: 0, padding: 2 }}>
            {/* Clear Button - Positioned to the bottom-left */}
            <Button
              sx={{
                p: 1,
                px: 4,
                color: "white",
                background:
                  "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                borderRadius: "8px",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 4px 8px rgba(0, 90, 91, 0.3)",
                position: "absolute",
                bottom: 10,
                left: 10,
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
              onClick={clearFormData}
            >
              {ClearUpdateButton}
            </Button>

            {/* Save/Update Button - Positioned to the bottom-right */}
            <Button
              sx={{
                p: 1,
                px: 4,
                color: "white",
                background:
                  "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                borderRadius: "8px",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 4px 8px rgba(0, 90, 91, 0.3)",
                position: "absolute",
                bottom: 10,
                right: 10,
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
              disabled={!validateForm()}
              onClick={handleSave} // Handle save action
            >
              {SaveUpdateButton}
            </Button>
          </DialogActions>
        </DialogContent>
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
        elevation={4}
      >
        <Typography
          className="slide-in-text"
          width={"100%"}
          textAlign="center"
          textTransform="uppercase"
          fontWeight="bold"
          // color={"#5C5CFF"}
          padding={1}
          noWrap
        >
          Manage Services
        </Typography>
      </Grid>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} md={8} lg={8}>
          {/* <SearchInputField
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onClickClear={() => setSearchText("")}
          /> */}
        </Grid>

        <Grid
          item
          xs={12}
          md={4}
          lg={4}
          display="flex"
          justifyContent={{ xs: "center", md: "flex-end" }}
        >
          <Button
            onClick={handleOnSave}
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
            }}
          >
            <AddIcon />
            Add Services
          </Button>
        </Grid>
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
          rows={rows}
          columns={columns}
          getRowClassName={(params) =>
            params.row.isExpandedRow ? "expanded-row" : ""
          }
          sx={{
            height: "90%", // Set height in percentage
            minHeight: "500px",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: (theme) => theme.palette.custome.datagridcolor,
            },
            "& .MuiDataGrid-row:hover": {
              boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)",
            },
          }}
          // autoHeight
          pagination
          paginationMode="server"
          rowCount={totalRows}
          pageSizeOptions={[limit]}
          paginationModel={{ page: currentPage, pageSize: limit }}
          onPaginationModelChange={(newModel) => {
            setCurrentPage(newModel.page);
            getAllImgList(newModel.page, searchText);
          }}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 20 } },

            filter: {
              filterModel: {
                items: [],

                quickFilterValues: [], // Default empty
              },
            },
          }}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          slots={{ toolbar: GridToolbar }} // Enables search & export
          slotProps={{
            toolbar: {
              showQuickFilter: true,

              quickFilterProps: { debounceMs: 500 },
            },
          }}
          onFilterModelChange={(model) => {
            const quickFilterValue = model.quickFilterValues?.[0] || "";
            setSearchText(quickFilterValue);
            setCurrentPage(0); // ✅ Always reset to first page when searching
            getAllImgList(0, quickFilterValue);
          }}
        />
      </Grid>
    </>
  );
};

export default OfflineServices;
