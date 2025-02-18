//======================================Services=========================
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../../Constant";
import InputTextField, {
  CheckboxInputs,
  InputDescriptionField,
} from "../../components/Component";
import Loader from "../../components/Loader";
// import ServiceDocType from "./ServicesDocType";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@emotion/react";
// import PostNatalExercise from "./PostNatalExercise";
// import PostNatalMedication from "./PostNatalMedication";
// import PostNatalPrecaution from "./PostNatalPrecaution";
// import PostNatalVaccination from "./PostNatalVaccination";
const PostNatal = () => {
  const [loaderOpen, setLoaderOpen] = useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = useState("UPDATE");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [Departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    ServiceNameEN: "",
    ServiceNameMR: "",
    DocLink: "",
    ApplyLink: "",
    DocumentTypeIds: [],
    DeptId: "",
   
    Status: 1,
  });

  const [docTypes, setDocTypes] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]); // State for Service Providers
  const [searchQuery, setSearchQuery] = useState("");
  const [openDocTypeDialog, setOpenDocTypeDialog] = useState(false);
  const [openDocDialog, setOpenDocDialog] = useState(false);
  const [openServiceProviderDialog, setOpenServiceProviderDialog] =
    useState(false); // Modal for Service Provider
  const [newDocType, setNewDocType] = useState({ english: "", marathi: "" });
  const [newDocument, setNewDocument] = useState({ english: "", marathi: "" });
  const [editing, setEditing] = useState(false);

  const [newServiceProvider, setNewServiceProvider] = useState({
    serviceName: "",
    timeLimit: "",
    designatedOfficer: "",
    firstAppellateOfficer: "",
    secondAppellateOfficer: "",
  });
  const [selectedServiceProvider, setSelectedServiceProvider] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [editingDocType, setEditingDocType] = useState(null);
  const [selectedDocIndex, setSelectedDocIndex] = useState(null);
  const [editServiceProvider, setEditServiceProvider] = useState(null); // State to hold the row being edited
  const theme = useTheme();

  const handleDelete = async (id) => {
   
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
          .delete(`${BASE_URL}DepartmentSer/${id}`, {
          
          })
          .then((response) => {
            if (response.data.success === true) {
              setLoaderOpen(false);
              setData(data.filter((user) => user.Id !== id));
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Service deleted Successfully",
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              setLoaderOpen(false);
              Swal.fire({
                icon: "error",
                toast: true,
                title: "Failed",
                text: "Failed to Delete Service",
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

  const columns = [
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <strong>
          <IconButton color="primary" onClick={() => handleClick(params.row)}>
            <EditNoteIcon />
          </IconButton>
          <Button
            size="medium"
            sx={{ color: "red" }}
            onClick={() => handleDelete(params.row.Id)}
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
      field: "ServiceNameEN",
      headerName: "Services Name",
      width: 250,
      sortable: false,
    },
    {
      field: "ServiceNameMR",
      headerName: "Services Name Marathi",
      width: 250,
      sortable: false,
    },
    {
      field: "DocLink",
      headerName: "Document Link",
      width: 250,
      sortable: false,
    },
    {
      field: "ApplyLink",
      headerName: "Apply Link",
      width: 250,
      sortable: false,
    },
    {
      field: "DeptId",
      headerName: "Department",
      width: 250,
      sortable: false,
      valueGetter: (params) => {
        const department = Departments.find(
          (dept) => dept.Id === params.row.DeptId
        );
        return department ? department.DeptNameEN : "Unknown";
      },
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
  };

  const activeButtonStyle = {
    ...buttonStyles,
    backgroundColor: "green",
  };

  const inactiveButtonStyle = {
    ...buttonStyles,
    backgroundColor: "red",
  };
   // Function to delete a Document Type
   const handleDeleteDocType = (index) => {
    setDocTypes(docTypes.filter((_, i) => i !== index));
  };
  // Function to delete a Document
  const handleDeleteDocument = (docTypeIndex, docIndex) => {
    const updatedDocTypes = [...docTypes];
    updatedDocTypes[docTypeIndex].documents.splice(docIndex, 1);
    setDocTypes(updatedDocTypes);
  };
  const handleOpenServiceProviderDialog = () => {
    setSelectedServiceProvider(null); // Clear selected service provider
    setNewServiceProvider({
      serviceName: "",
      timeLimit: "",
      designatedOfficer: "",
      firstAppellateOfficer: "",
      secondAppellateOfficer: "",
    });
    setEditing(false);
    setOpenServiceProviderDialog(true);
  };
  const handleParentDialogOpen = () => {
    setOpen(true);
    setSaveUpdateButton("SAVE");
  };
  const handleParentDialogClose = () => {
    clearFormData();
    setOpen(false);
  };

  const handleSaveServiceProvider = () => {
    if (editing) {
      const updatedProviders = serviceProviders.map((provider) =>
        provider.id === selectedServiceProvider.id
          ? newServiceProvider
          : provider
      );
      setServiceProviders(updatedProviders);
    } else {
      const newProvider = {
        ...newServiceProvider,
        id: serviceProviders.length + 1,
      };
      setServiceProviders([...serviceProviders, newProvider]);
    }
    setOpenServiceProviderDialog(false);
  };

  // Function to add a new Document Type
  const handleAddDocType = () => {
    if (newDocType.english.trim() && newDocType.marathi.trim()) {
      setDocTypes([...docTypes, { ...newDocType, documents: [] }]);
      setNewDocType({ english: "", marathi: "" });
      setOpenDocTypeDialog(false);
    }
  };

  const handleAddOrUpdateDocument = () => {
    if (newDocument.english.trim() && newDocument.marathi.trim()) {
      const updatedDocTypes = [...docTypes];
      if (selectedDocIndex !== null) {
        // Update existing document
        updatedDocTypes[selectedDocType].documents[selectedDocIndex] =
          newDocument;
      } else {
        // Add new document
        updatedDocTypes[selectedDocType].documents.push(newDocument);
      }
      setDocTypes(updatedDocTypes);
      setNewDocument({ english: "", marathi: "" });
      setSelectedDocIndex(null);
      setOpenDocDialog(false);
    }
  };
  

  // Filtered Document Types based on search
  const filteredDocTypes = docTypes.filter(
    (docType) =>
      docType.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      docType.marathi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to open the edit modal for a Document Type
  const handleEditDocType = (index) => {
    setEditingDocType(index);
    setNewDocType({ ...docTypes[index] });
    setOpenDocTypeDialog(true);
  };

  // Function to update Document Type after editing
  const handleUpdateDocType = () => {
    if (newDocType.english.trim() && newDocType.marathi.trim()) {
      const updatedDocTypes = docTypes.map((docType, index) =>
        index === editingDocType
          ? {
              ...docType,
              english: newDocType.english,
              marathi: newDocType.marathi,
            }
          : docType
      );
      setDocTypes(updatedDocTypes);
      setOpenDocTypeDialog(false);
      setEditingDocType(null);
      setNewDocType({ english: "", marathi: "" });
    }
  }; 

  // Function to handle edit modal for Service Provider
  const handleEditServiceProvider = (index) => {
    setEditServiceProvider({ ...serviceProviders[index], index });
    setOpenServiceProviderDialog(true);
  };


  // Function to handle delete of Service Provider
  const handleDeleteServiceProvider = (index) => {
    setServiceProviders(serviceProviders.filter((_, i) => i !== index));
  };
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}Department/All`);
      const departmentList = response.data.values; // Store the response in a variable
      setDepartments(departmentList); // Update state with fetched data
      console.log("Fetched Departments:", departmentList); // Log fetched data
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const clearFormData = () => {
    setFormData({
      ServiceNameEN: "",
      ServiceNameMR: "",
      DocLink: "",
      ApplyLink: "",
      DeptId: "",
      Status: 1,
    });
  };


  const getAllDeptServData = async () => {
    // const token = await getApiToken();
    axios
      .get(`${BASE_URL}DepartmentSer/All`, {
      })
      .then((response) => {
        setData(response.data.values);
      });
  };

  useEffect(() => {
    getAllDeptServData();
  }, []);


  const handleSave = async () => {
    try {
      // Find the department object based on selected DeptId
      const selectedDept = Departments.find(
        (dept) => dept.Id === formData.DeptId
      );

      const formattedData = {
        ...formData,
        DeptId: formData.DeptId, // Keep the ID for backend
        DeptNameEN: selectedDept ? selectedDept.DeptNameEN : "", // Store name for frontend display
      };

      setLoaderOpen(true);

      if (SaveUpdateButton === "SAVE") {
        // **Save (POST) Request**
        handleParentDialogClose();
        axios
          .post(`${BASE_URL}DepartmentSer/`, formattedData, {
          })
          .then((response) => {
            setLoaderOpen(false);
            if (response.data.success) {
              getAllDeptServData();
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Service Saved Successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              const newPostData = response.data.values;
              setData((prevData) => [...prevData, newPostData]);
              handleParentDialogClose();
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                toast: true,
                title: "Failed to save Service",
                text: response.data.message,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((error) => {
            setLoaderOpen(false);
            Swal.fire({
              icon: "error",
              toast: true,
              title: "Error saving Service",
              text: error.message,
              showConfirmButton: true,
            });
          });
      } else {
        // **Update (PUT) Request**
        if (!formData.Id) {
          setLoaderOpen(false);
          Swal.fire({
            position: "center",
            icon: "error",
            toast: true,
            title: "Update Failed",
            text: "Invalid Service ID",
            showConfirmButton: true,
          });
          return;
        }

        setLoaderOpen(false);
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

        axios
          .put(`${BASE_URL}DepartmentSer/${formData.Id}`, formattedData, {
            
          })
          .then((response) => {
            setLoaderOpen(false);
            if (response.data.success) {
              clearFormData();
              getAllDeptServData();
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Service Updated Successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              handleParentDialogClose();
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                toast: true,
                title: "Failed to update Service",
                text: response.data.message,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((error) => {
            setLoaderOpen(false);
            Swal.fire({
              icon: "error",
              toast: true,
              title: "Error updating Service",
              text: error.message,
              showConfirmButton: true,
            });
          });
      }
    } catch (error) {
      setLoaderOpen(false);
      console.error("Error:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        toast: true,
        title: "Failed",
        text: error.message || "Something went wrong",
        showConfirmButton: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClick = (row) => {
    setSaveUpdateButton("UPDATE");
    setOpen(true);
    setFormData({
      ...row,
     
    });
  };




  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
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
          Services
        </Typography>
      </Grid>

      <Grid textAlign={"end"} marginBottom={1}>
        <Button
          onClick={handleParentDialogOpen}
          type="text"
          size="medium"
          sx={{
            pr: 2,
            mb: 2,
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
          Add Services
        </Button>
      </Grid>

      <Grid container item height={500} lg={12} component={Paper}>
        <DataGrid
          className="datagrid-style"
          rows={data.map((data, id) => ({ ...data, id: id + 1 }))}
          // rowHeight={70}
          getRowId={(row) => row.Id}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 100,
              },
            },
          }}
          pageSizeOptions={[100]}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: (theme) => theme.palette.custome.datagridcolor,
            },
            "& .MuiDataGrid-row:hover": {
              boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)",
            },
          }}
        />
      </Grid>

      <Dialog
        elevation={7}
        component={Paper}
        boxShadow={20}
        open={open}
        onClose={handleParentDialogClose}
        aria-labelledby="parent-dialog-title"
        aria-describedby="parent-dialog-description"
        fullScreen
      >
        <DialogTitle
          sx={{
            color: "white",
            backgroundColor: (theme) =>
              theme.palette.customAppbar?.appbarcolor || "#5C5CFF",
          }}
        >
          <b>Services</b>
          <IconButton
            aria-label="close"
            onClick={handleParentDialogClose}
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
                <InputDescriptionField
                  size="small"
                  fullWidth
                  id="ServiceNameEN"
                  label="Service Name English"
                  name="ServiceNameEN"
                  value={formData.ServiceNameEN}
                  onChange={handleInputChange}
                />
              </Grid>
              {/* --------------------------------------------- */}
              <Grid item xs={12} sm={4} width={200}></Grid>
              {/* --------------------------------------------- */}
              <Grid item xs={12} sm={4}>
                <InputDescriptionField
                  size="small"
                  fullWidth
                  id="ServiceNameMR"
                  label="Service Name Marathi"
                  name="ServiceNameMR"
                  multiline
                  rows={2}
                  value={formData.ServiceNameMR}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputTextField
                  size="small"
                  fullWidth
                  id="DocLink"
                  label="Document Link"
                  name="DocLink"
                  multiline
                  rows={2}
                  value={formData.DocLink}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4} width={200}></Grid>
              <Grid item xs={12} sm={4}>
                <InputTextField
                  size="small"
                  fullWidth
                  id="ApplyLink"
                  label="Apply Link"
                  name="ApplyLink"
                  multiline
                  rows={2}
                  value={formData.ApplyLink}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl size="small" sx={{ width: "220px" }}>
                  <InputLabel id="department-label">
                    Select Department
                  </InputLabel>
                  <Select
                    id="DeptId"
                    labelId="department-label"
                    name="DeptId"
                    value={formData.DeptId}
                    onChange={handleInputChange}
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 150, maxWidth: 400 } },
                    }}
                  >
                    {Departments.length > 0 ? (
                      Departments.map((dept) => (
                        <MenuItem key={dept.Id} value={dept.Id}>
                          {dept.DeptNameEN}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No departments available</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} width={200}></Grid>
              <Grid item xs={12} sm={4} textAlign={"center"}>
                <CheckboxInputs
                  checked={data.Status === 1}
                  label="Active"
                  id="Status"
                  onChange={(event) =>
                    handleInputChange({
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
            </Grid>
          </Paper>
            <Paper
        elevation={3}
        sx={{
          width: "100%",
          padding: 1,
          marginTop: 3,
          textAlign: "center",
          display: "inline-block",
        }}
      >
        <div
          style={{
            padding: "6px",
            width: "100%",
            maxWidth: "1350px",
            // margin: "0 auto",
            // marginTop: "2%",
          }}
        >
          {/* Search Bar */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={12}>
              {/* <TextField
          fullWidth
          placeholder="Search Document Type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        /> */}
            </Grid>

            {/* Add Document Type Button */}
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={() => setOpenDocTypeDialog(true)}
                fullWidth
              >
                Add Document Type
              </Button>
            </Grid>
          </Grid>

          {/* Scrollable List */}
          {/* <Paper sx={{ maxHeight: 600, overflowY: "auto", p: 1 }}> */}
          {filteredDocTypes.length === 0 ? (
            <Typography textAlign="center" color="textSecondary">
              No Document Types Found
            </Typography>
          ) : (
            <List>
              {filteredDocTypes.map((docType, index) => (
                <Accordion key={index} sx={{ marginBottom: "8px", width: "100%" }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Grid container spacing={2} style={{ width: "100%" }}>
                      {/* Left side for Document Type names (English & Marathi) */}
                      <Grid item xs={12} sm={8}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="h6">
                              {docType.english}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="subtitle1"
                              color="textSecondary"
                            >
                              {docType.marathi}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Right side for Edit/Delete Icons and Add Document Button */}
                      <Grid item xs={12} sm={4}>
                        <Grid
                          container
                          spacing={1}
                          alignItems="center"
                          justifyContent="flex-end"
                        >
                          <Grid item>
                            <IconButton
                              onClick={() => handleDeleteDocType(index)}
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Grid>
                          <Grid item>
                            <IconButton
                              color="primary"
                              onClick={() => handleEditDocType(index)}
                            >
                              <EditNoteIcon />
                            </IconButton>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<AddCircleIcon />}
                              onClick={() => {
                                setSelectedDocType(index);
                                setOpenDocDialog(true);
                              }}
                            >
                              Add Document
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    {/* Documents List */}
                    {docType.documents.length === 0 ? (
                      <Typography color="textSecondary">
                        No Documents
                      </Typography>
                    ) : (
                      <div style={{ width: "100%" }}>
                        <DataGrid
                          rows={docType.documents.map((doc, index) => ({
                            id: index, // Unique ID for each row
                            english: doc.english,
                            marathi: doc.marathi,
                          }))}
                          className="datagrid-style"
                          sx={{
                            "& .MuiDataGrid-columnHeaders": {
                              backgroundColor: (theme) =>
                                theme.palette.custome.datagridcolor,
                            },
                            "& .MuiDataGrid-row:hover": {
                              boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)",
                            },
                          }}
                          columns={[
                            {
                              field: "english",
                              headerName: "Document (English)",
                              flex: 1,
                            },
                            {
                              field: "marathi",
                              headerName: "Document (Marathi)",
                              flex: 1,
                            },
                            {
                              field: "actions",
                              headerName: "Actions",
                              width: 150,
                              renderCell: (params) => (
                                <>
                                  <IconButton
                                    onClick={() => {
                                      setSelectedDocType(index);
                                      setSelectedDocIndex(params.row.id);
                                      setNewDocument({
                                        english: params.row.english,
                                        marathi: params.row.marathi,
                                      });
                                      setOpenDocDialog(true);
                                    }}
                                  >
                                    <EditNoteIcon color="primary" />
                                  </IconButton>
                                  <IconButton
                                    onClick={() =>
                                      handleDeleteDocument(index, params.row.id)
                                    }
                                  >
                                    <DeleteIcon color="error" />
                                  </IconButton>
                                </>
                              ),
                            },
                          ]}
                          hideFooter
                          pageSize={5} // You can customize the number of rows per page
                          rowsPerPageOptions={[5, 10, 20]}
                        />
                      </div>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          )}
          {/* </Paper> */}

          {/* Add / Edit Document Type Dialog */}
          <Dialog
            open={openDocTypeDialog}
            onClose={() => setOpenDocTypeDialog(false)}
          >
            <DialogTitle>
              {editingDocType !== null
                ? "Edit Document Type"
                : "Add Document Type"}
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Document Type (English)"
                value={newDocType.english}
                onChange={(e) =>
                  setNewDocType({ ...newDocType, english: e.target.value })
                }
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                label="Document Type (Marathi)"
                value={newDocType.marathi}
                onChange={(e) =>
                  setNewDocType({ ...newDocType, marathi: e.target.value })
                }
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDocTypeDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={
                  editingDocType !== null
                    ? handleUpdateDocType
                    : handleAddDocType
                }
                variant="contained"
              >
                {editingDocType !== null ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Add Document Dialog */}
          <Dialog open={openDocDialog} onClose={() => setOpenDocDialog(false)}>
            <DialogTitle>Add Document</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Document Name (English)"
                value={newDocument.english}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, english: e.target.value })
                }
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                label="Document Name (Marathi)"
                value={newDocument.marathi}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, marathi: e.target.value })
                }
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDocDialog(false)}>Cancel</Button>
              <Button onClick={handleAddOrUpdateDocument} variant="contained">
                {selectedDocIndex !== null ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Paper>
      <Paper elevation={3} sx={{ width: "100%", marginTop: 3 }}>
        <div style={{ padding: "16px", maxWidth: "1850px" }}>
          {/* Add Service Provider Section */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={handleOpenServiceProviderDialog}
                fullWidth
              >
                Add Service Provider
              </Button>
            </Grid>
          </Grid>

          {/* Service Providers DataGrid */}
          <DataGrid
            rows={serviceProviders.map((sp) => ({
              id: sp.id,
              srNo: sp.id,
              serviceName: sp.serviceName,
              timeLimit: sp.timeLimit,
              designatedOfficer: sp.designatedOfficer,
              firstAppellateOfficer: sp.firstAppellateOfficer,
              secondAppellateOfficer: sp.secondAppellateOfficer,
            }))}
            hideFooter
            sx={{ height: "40vh" }}
            columns={[
              { field: "srNo", headerName: "Sr. No.", flex: 0.5 },
              { field: "serviceName", headerName: "Service Name", flex: 1 },
              { field: "timeLimit", headerName: "Time Limit", flex: 1 },
              {
                field: "designatedOfficer",
                headerName: "Designated Officer",
                flex: 1,
              },
              {
                field: "firstAppellateOfficer",
                headerName: "First Appellate Officer",
                flex: 1,
              },
              {
                field: "secondAppellateOfficer",
                headerName: "Second Appellate Officer",
                flex: 1,
              },
              {
                field: "actions",
                headerName: "Actions",
                sortable: false,
                renderCell: (params) => (
                  <div>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditServiceProvider(params.row)}
                    >
                      <EditNoteIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteServiceProvider(params.row.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ),
                flex: 0.5,
              },
            ]}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
          />

          {/* Add / Edit Service Provider Dialog */}
          <Dialog
            open={openServiceProviderDialog}
            onClose={() => setOpenServiceProviderDialog(false)}
          >
            <DialogTitle>
              {editing ? "Update Service Provider" : "Add Service Provider"}
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Service Name"
                value={newServiceProvider.serviceName}
                onChange={(e) =>
                  setNewServiceProvider({
                    ...newServiceProvider,
                    serviceName: e.target.value,
                  })
                }
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                label="Time Limit"
                value={newServiceProvider.timeLimit}
                onChange={(e) =>
                  setNewServiceProvider({
                    ...newServiceProvider,
                    timeLimit: e.target.value,
                  })
                }
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                label="Designated Officer"
                value={newServiceProvider.designatedOfficer}
                onChange={(e) =>
                  setNewServiceProvider({
                    ...newServiceProvider,
                    designatedOfficer: e.target.value,
                  })
                }
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                label="First Appellate Officer"
                value={newServiceProvider.firstAppellateOfficer}
                onChange={(e) =>
                  setNewServiceProvider({
                    ...newServiceProvider,
                    firstAppellateOfficer: e.target.value,
                  })
                }
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                label="Second Appellate Officer"
                value={newServiceProvider.secondAppellateOfficer}
                onChange={(e) =>
                  setNewServiceProvider({
                    ...newServiceProvider,
                    secondAppellateOfficer: e.target.value,
                  })
                }
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenServiceProviderDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveServiceProvider} variant="contained">
                {editing ? "Update" : "Save"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Paper>

          <DialogActions>
            <Button
              sx={{
                p: 1,
                px: 4,
                color: "white",
                backgroundColor: "#5C5CFF",

                boxShadow: 5,
                position: "fixed",
                bottom: 10,
                right: 10,
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
              onClick={handleSave}
              // disabled={!validateForm()}
            >
              {SaveUpdateButton}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    
    </>
  );
};
export default PostNatal;
