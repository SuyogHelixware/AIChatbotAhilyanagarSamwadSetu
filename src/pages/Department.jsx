//=================Added Pagination============
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CloseIcon from "@mui/icons-material/Close";
import { GridToolbarQuickFilter, GridToolbarContainer } from "@mui/x-data-grid";

import {
  Box,
  Button,
  debounce,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
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
import { CheckboxInputs } from "../components/Component";
import SearchInputField from "../components/SearchInputField";

const Department = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [imgData, setImgData] = React.useState([]);
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [totalRows, setTotalRows] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState(""); // ✅ Search input state
  const limit = 20; // Fixed page size

  const [data, setData] = React.useState({
    DeptNameEN: "",
    DeptNameMR: "",
    Id: "",
  });


  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }
  const clearFormData = () => {
    setData({
      Id: "",
      DeptNameEN: "",
      DeptNameMR: "",
      Status: 1,
    });
  };

  // ========================
  const getApiToken = async () => {
    const data = sessionStorage.getItem("userData");
    if (data !== null) {
      const fetchedData = JSON.parse(data);
      return fetchedData.Token;
    }
  };
  // ========================

  const handleClose = () => {
    setOn(false);
  };

  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setOn(true);
    clearFormData();
    setData({ Name: "", DeptNameEN: "", DeptNameMR: "", Id: "" });
  };

  const onChangeHandler = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
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
  const handleSubmitForm = async () => {
    try {
      const token = await getApiToken(); 
  
      const requiredFields = ["DeptNameEN", "DeptNameMR"];
      const emptyRequiredFields = requiredFields.filter(
        (field) => !data[field]?.trim()
      );
  
      if (emptyRequiredFields.length > 0) {
        validationAlert("Please fill in all required fields");
        return;
      }
  
      const payload = {
        DeptNameEN: data.DeptNameEN,
        DeptNameMR: data.DeptNameMR,
        Status: data.Status === true || data.Status === 1 ? 1 : 0, // Ensure only 1 or 0 is sent
      };
      console.log(payload)
      let response;
  
      if (SaveUpdateButton === "SAVE") {
        setLoaderOpen(true);
        response = await axios.post(`${BASE_URL}Department`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
      } else {
        if (!data.Id) {
          Swal.fire({
            position: "center",
            icon: "error",
            toast: true,
            title: "Update Failed",
            text: "Invalid Department ID",
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
            // customClass: {
            //   popup: "swal-popup", // Custom class for overriding styles
            // },
            // didOpen: () => {
            //   document.querySelector(".swal-popup").style.zIndex = "2000"; // Ensure Swal is above the modal
            // },
          });
          
  
        if (!result.isConfirmed) {
          return; 
        }
  
        setLoaderOpen(true); 
  
        response = await axios.put(
          `${BASE_URL}Department/${data.Id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
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
              ? "Post Added Successfully"
              : "Post Updated Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        handleClose();
        getAllImgList();
      } else {
        throw new Error(response.data.message || "Unexpected error");
      }
    } catch (error) {
      setLoaderOpen(false);
      console.error("Submit Error:", error);
  
      if (error.message !== "Update cancelled") {
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
  };
  

  const fetchTotalRecords = async () => {
    try {
      const token = await getApiToken();
      const response = await axios.get(`${BASE_URL}Department/All`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.data && response.data.values) {
        setTotalRows(response.data.values.length);
        console.log("Total records fetched:", response.data.values.length);
      }
    } catch (error) {
      console.error("Error fetching total records:", error);
    }
  };

  const getAllImgList = async (page = 0, searchText = "") => {
    try {
      setLoading(true);
      const token = await getApiToken();

      let apiUrl = `${BASE_URL}Department/ByPage/${page}/${limit}`;

      if (searchText) {
        apiUrl = `${BASE_URL}Department/ByPage/search/${searchText}/${page}/${limit}`;
      }

      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      console.log("API Response:", response.data);

      if (response.data && response.data.values) {
        setImgData(
          response.data.values.map((item, index) => ({
            ...item,
            id: index + 1,
          }))
        );

        if (searchText) {
          setTotalRows(response.data.count || response.data.values.length);
          console.log(totalRows)
        } else {
          fetchTotalRecords(); // Fetch total rows when not searching
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!searchText) {
      fetchTotalRecords(); // ✅ Fetch total count only when NOT searching
    }
  
    const handler = setTimeout(() => {
      getAllImgList(currentPage, searchText);
    }, 300);
  
    return () => clearTimeout(handler);
  }, [searchText, currentPage]);
  
 
  const handleDelete = async (rowData) => {
    const token = await getApiToken();
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
          .delete(`${BASE_URL}Department/${rowData.Id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          })
          .then((response) => {
            setLoaderOpen(false);

            console.log("Delete API Response:", response.data);

            if (response.data && response.data.success === true) {
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Department deleted successfully",
                showConfirmButton: false,
                timer: 1500,
              });

              getAllImgList();
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
            setLoaderOpen(false);
            Swal.fire({
              position: "center",
              icon: "error",
              toast: true,
              title: "Failed",
              text: error.message || "Something went wrong",
              showConfirmButton: true,
            });
          });
      }
    });
  };

  const columns = [
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <strong>
          <IconButton color="primary" onClick={() => handleUpdate(params.row)}>
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

    { field: "id", headerName: "SR.NO", width: 90, sortable: true },
    {
      field: "DeptNameEN",
      headerName: "Department Name",
      width: 250,
      sortable: false,
    },
    {
      field: "DeptNameMR",
      headerName: "Department Name Marathi",
      width: 250,
      sortable: false,
    },

    {
      field: "Status",
      headerName: "Status",
      width: 100,
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
            {isActive ? "Active" : "Inactive"}
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

  const handleUpdate = (rowData) => {
    console.log("Clicked Row Data:", rowData);
    setSaveUpdateButton("UPDATE");
    setOn(true);
    setData({
      DeptNameEN: rowData.DeptNameEN,
      DeptNameMR: rowData.DeptNameMR,
      Id: rowData.Id,
      Status: rowData.Status === true || rowData.Status === 1 ? 1 : 0, // Normalize the value
    });
  };

  const onchangeHandler = (event) => {
    const { name, value } = event.target;

    setData({
      ...data,
      [name]: value,
    });
  };
  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
      <Modal
        open={on}
        onClose={handleClose}
        sx={{
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          // zIndex: 1200, 
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: "90%",
            maxWidth: 400,
            // bgcolor: "#E6E6FA",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            item
            xs={12}
            spacing={4}
            display={"flex"}
            flexDirection={"column"}
            padding={3}
            justifyContent={"center"}
          >
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight="bold">Add Department</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>

            {/* <Grid item xs={12}>
              <FormControl
                sx={{ width: "110px" }}
                size="small"
                disabled={SaveUpdateButton === "SAVE"}
              >
                <InputLabel id="demo-select-large-Choose-Lang">
                  Select Lang
                </InputLabel>

                <Select
                  id="Category"
                  label="Category"
                  name="Category"
                  onChange={onChangeHandler}
                  value={data.Category}
                  disabled={SaveUpdateButton === "SAVE"}
                >
                  <MenuItem key="en" value="en">
                    English
                  </MenuItem>
                  <MenuItem key="mr" value="mr">
                    Marathi
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid> */}

            <Grid item xs={12}>
              <TextField
                size="small"
                spacing={"5"}
                fullWidth
                id="DeptNameEN"
                label="Department Name English"
                name="DeptNameEN"
                value={data.DeptNameEN || ""}
                onChange={onChangeHandler}
                autoFocus
                style={{ borderRadius: 10, width: "100%" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                size="small"
                spacing={"5"}
                fullWidth
                id="DeptNameMR"
                label="Department Name Marathi"
                name="DeptNameMR"
                value={data.DeptNameMR || ""}
                onChange={onChangeHandler}
                autoFocus
                style={{ borderRadius: 10, width: "100%" }}
              />
            </Grid>

            <Grid item md={3} sm={3} xs={12} textAlign={"left"} ml={3}>
              <CheckboxInputs
                checked={data.Status === 1}
                label="Active"
                id="Status"
                onChange={(event) =>
                  onchangeHandler({
                    target: {
                      name: "Status",
                      id: "Status",
                      value: event.target.checked ? 1 : 0,
                    },
                  })
                }
                value={data.Status}
                name="Status"
              />
            </Grid>

            <Grid item xs={12} md={12} textAlign={"end"}>
              <Button
                type="submit"
                size="small"
                onClick={handleSubmitForm}
                sx={{
                  marginTop: 1,
                  p: 1,
                  width: 80,
                  color: "white",
                  boxShadow: 5,
                  backgroundColor: "#5C5CFF",
                  "&:hover": {
                    backgroundColor: "#E6E6FA",
                    border: "1px solid #5C5CFF",
                    color: "#5C5CFF",
                  },
                }}
              >
                {SaveUpdateButton}
              </Button>
            </Grid>
            <Grid />
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
          // color={"#5C5CFF"}
          padding={1}
          noWrap
        >
          Manage Department
        </Typography>
      </Grid>
      <Grid container spacing={2} marginBottom={1}>
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
            type="text"
            size="medium"
            sx={{
              pr: 2,
              color: "white",
              backgroundColor: "#5C5CFF",
              boxShadow: 5,
              "&:hover": {
                backgroundColor: "#E6E6FA",
                border: "1px solid #5C5CFF",
                color: "#5C5CFF",
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
            Add Department
          </Button>
        </Grid>
      </Grid>
      <Paper
        sx={{
          marginTop: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        elevation={7}
      >
        <Box sx={{  width: "100%", elevation: 4 }}>
        <DataGrid
  className="datagrid-style"
  rows={imgData}
  columns={columns}
  autoHeight
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
  slots={{ toolbar: CustomToolbar }}
  filterMode="server"
  onFilterModelChange={(model) => {
    const quickFilterValue = model.quickFilterValues?.[0] || "";
    setSearchText(quickFilterValue);
    setCurrentPage(0);
    getAllImgList(0, quickFilterValue); 
  }}
  sx={{
    height: "20vh",
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: (theme) => theme.palette.custome.datagridcolor,
    },
    "& .MuiDataGrid-row:hover": {
      boxShadow: "0px 4px 20px rgba(0, 0.2, 0.2, 0.2)",
    },
  }}
/>

        </Box>
      </Paper>
      ;
    </>
  );
};

export default Department;
