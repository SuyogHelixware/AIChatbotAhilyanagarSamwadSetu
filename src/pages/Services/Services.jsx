import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../../Constant";
import InputTextField, {
  CheckboxInputs,
  InputDescriptionField,
} from "../../components/Component";
import Loader from "../../components/Loader";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@emotion/react";
import Autocomplete from "@mui/material/Autocomplete";
import { useForm, Controller } from "react-hook-form"; // import useForm and Controller

const OnlineServices = () => {
  const [loaderOpen, setLoaderOpen] = useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = useState("UPDATE");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [Departments, setDepartments] = useState([]);
  const [docTypes, setDocTypes] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [openDocTypeDialog, setOpenDocTypeDialog] = useState(false);
  const [openDocDialog, setOpenDocDialog] = useState(false);
  const [openServiceProviderDialog, setOpenServiceProviderDialog] =
    useState(false);
  const [docType, setdocType] = useState({ english: "", marathi: "" });
  const [newDocument, setNewDocument] = useState({ english: "", marathi: "" });
  const [ClearDocTypeButton, setClearDocTypeButton] = React.useState("RESET");
  const [saveDocTypeButton, setSaveDocTypeButton] = useState("SAVE");

  const [newServiceProvider, setNewServiceProvider] = useState({
    Id: "",
    serviceName: "",
    timeLimit: "",
    designatedOfficer: "",
    firstAppellateOfficer: "",
    secondAppellateOfficer: "",
  });
  const [editing, setEditing] = useState(false);
  const [selectedDocTypeIndex, setSelectedDocTypeIndex] = React.useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalRows, setTotalRows] = React.useState("");
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [selectedDocIndex, setSelectedDocIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ClearUpdateButton, setClearUpdateButton] = useState("CLEAR");
  const originalDataRef = useRef(null);
  const [editingDocType, setEditingDocType] = useState(null);
  const [selectedServiceProvider, setSelectedServiceProvider] = useState(null);
  const limit = 20; // Fixed page size
  const docRef = useRef(newDocument); // Store latest input without re-rendering

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ServiceNameEN: "",
      ServiceNameMR: "",
      DocLink: "",
      ApplyLink: "",
      DeptId: "",
      Status: 1,
      Documents: [],
      ServicesProvider: [],
    },
  });
  React.useEffect(() => {
    console.log("Component re-rendered");
  });
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
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
  const handleDeleteDocument = (docTypeIndex, docIndex) => {
    const updatedDocTypes = [...docTypes];
    updatedDocTypes[docTypeIndex].documents.splice(docIndex, 1);
    setDocTypes(updatedDocTypes);
  };
  // Filtered Document Types based on search
  const filteredDocTypes = docTypes.filter(
    (docType) =>
      docType.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      docType.marathi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to open the edit modal for a Document Type
  const handleEditDocType = (index) => {
    // selectedDocTypeIndexRef.current = index;
    setSelectedDocTypeIndex(index); // Store the index
    setdocType({ ...docTypes[index] }); // Populate the form with the selected Document Type
    setClearDocTypeButton("RESET");
    setSaveDocTypeButton("UPDATE");
    setOpenDocTypeDialog(true);
  };
  // const handleResetDocType = () => {
  //   if (selectedDocTypeIndexRef.current !== null) {
  //     // Revert to the original data from the docTypes array
  //     setdocType({ ...docTypes[selectedDocTypeIndexRef.current] });
  //   }
  // };
  const handleInputChange = useCallback(
    debounce((field, value) => {
      setNewServiceProvider((prev) => ({ ...prev, [field]: value }));
    }, 300), // Adjust delay as needed (300ms recommended)
    []
  );
  const handleDocTypeChange = useCallback(
    debounce((field, value) => {
      setdocType((prev) => ({ ...prev, [field]: value }));
    }, 100), // Adjust debounce delay (300ms recommended)
    []
  );

  const updateDocumentState = useCallback(
    debounce(() => {
      setNewDocument({ ...docRef.current });
    }, 300), // Adjust delay as needed
    []
  );
  const handleDocumentChange = (field, value) => {
    docRef.current = { ...docRef.current, [field]: value }; // Store latest input without triggering re-render
    updateDocumentState(); // Apply debounced update
  };
  const handleSaveOrUpdateDocType = () => {
    if (docType.english.trim() && docType.marathi.trim()) {
      if (saveDocTypeButton === "UPDATE") {
        // Update the existing Document Type using the stored index
        const updatedDocTypes = [...docTypes];
        if (selectedDocTypeIndex !== null) {
          updatedDocTypes[selectedDocTypeIndex] = { ...docType };
          setDocTypes(updatedDocTypes);
        }
      } else {
        // Save new Document Type
        setDocTypes([...docTypes, { ...docType, documents: [] }]);
      }
      setOpenDocTypeDialog(false);
      setdocType({ english: "", marathi: "" });
      setClearDocTypeButton("CLEAR");
      setSaveDocTypeButton("SAVE");
      setSelectedDocTypeIndex(null); // Reset the selected index after updating
    }
  };
  const handleDeleteDocType = (index) => {
    setDocTypes(docTypes.filter((_, i) => i !== index));
  };
  const handleSaveServiceProvider = () => {
    if (editing) {
      // Update existing row
      const updatedProviders = serviceProviders.map((provider) =>
        provider.srNo === selectedServiceProvider.srNo
          ? { ...provider, ...newServiceProvider }
          : provider
      );
      setServiceProviders(updatedProviders);
    } else {
      // Generate a new row with unique srNo for DataGrid and Id as null for backend
      const newProvider = {
        ...newServiceProvider,
        srNo: serviceProviders.length
          ? Math.max(...serviceProviders.map((sp) => sp.srNo || 0)) + 1
          : 1, // Unique srNo for DataGrid
        Id: null, // Ensure new row sends `null` to backend
      };
      setServiceProviders([...serviceProviders, newProvider]);
    }

    // Reset state
    setOpenServiceProviderDialog(false);
    setEditing(false);
    setNewServiceProvider({
      Id: "",
      serviceName: "",
      timeLimit: "",
      designatedOfficer: "",
      firstAppellateOfficer: "",
      secondAppellateOfficer: "",
    });
  };
  const handleEditServiceProvider = (identifier) => {
    const providerToEdit = serviceProviders.find(
      (sp) => sp.Id === identifier || sp.srNo === identifier
    );

    if (providerToEdit) {
      setSelectedServiceProvider(providerToEdit);
      setNewServiceProvider({ ...providerToEdit });
      setEditing(true);
      setOpenServiceProviderDialog(true);
    } else {
      console.error("Provider not found for identifier:", identifier);
    }
  };
  // Function to handle delete of Service Provider
  const handleDeleteServiceProvider = (identifier) => {
    setServiceProviders(
      (prevProviders) =>
        prevProviders
          .filter((sp) => sp.Id !== identifier && sp.srNo !== identifier)
          .map((sp, index) => ({ ...sp, srNo: index + 1 })) // Reassign `srNo`
    );
  };
  const handleOpenServiceProviderDialog = () => {
    // clearFormData();
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

  const clearDocTypeForm = () => {
    if (ClearDocTypeButton === "CLEAR") {
      setdocType({ english: "", marathi: "" });
    }
  };
  const clearDocument = () => {
    setNewDocument({ DocNameEN: "", DocTypeMR: "" });
  };
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
          .delete(`${BASE_URL}DepartmentSer/${id}`, {})
          .then((response) => {
            if (response.data.success === true) {
              setLoaderOpen(false);
              getAllDeptServData();
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

  const getAllDeptServData = async (page = 0, searchText = "") => {
    try {
      setLoading(true);
      let apiUrl = `${BASE_URL}DepartmentSer/ByPage/${page}/${limit}`;
      if (searchText) {
        apiUrl = `${BASE_URL}DepartmentSer/ByPage/search/${searchText}/${page}/${limit}`;
      }

      const response = await axios.get(apiUrl);

      if (response.data && response.data.values) {
        setData(
          response.data.values.map((item, index) => ({
            ...item,
            id: page * limit + index + 1,
          }))
        );
        setTotalRows(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        toast: true,
        title: "Failed",
        text: error,
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}Department/All`);
      const departmentList = response.data.values;
      setDepartments(departmentList);
    } catch (error) {
      console.error("Error fetching departments:", error);
      Swal.fire({
        icon: "error",
        toast: true,
        title: "Failed",
        text: error,
        showConfirmButton: true,
      });
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    getAllDeptServData();
  }, []);

  const clearFormData = () => {
    if (ClearUpdateButton === "CLEAR") {
      reset();
      setDocTypes([]);
      setServiceProviders([]);
      return;
    }

    if (ClearUpdateButton === "RESET" && originalDataRef.current) {
      const {
        Id,
        ServiceNameEN,
        ServiceNameMR,
        DocLink,
        ApplyLink,
        DeptId,
        Status,
        ServicesProvider,
        Documents,
      } = originalDataRef.current;

      reset({
        ServiceNameEN,
        ServiceNameMR,
        DocLink,
        ApplyLink,
        DeptId,
        Status,
        Documents,
        ServicesProvider,
      });

      setServiceProviders(ServicesProvider || []);
      setDocTypes(Documents || []);
    }
  };
  const handleParentDialogClose = () => {
    setClearUpdateButton("CLEAR");
    setSaveUpdateButton("SAVE");
    clearFormData();
    setOpen(false);
  };
  const handleSave = async () => {
    try {
      const selectedDept = Departments.find(
        (dept) => dept.Id === watch("DeptId")
      );

      const formattedDocuments = docTypes.map((docType) => ({
        Id: docType.Id || null,
        DocTypeEN: docType.english,
        DocTypeMR: docType.marathi,
        Status: 1,
        Documents: docType.documents.map((doc) => ({
          Id: doc.Id || null,
          DocNameEN: doc.english,
          DocNameMR: doc.marathi,
        })),
      }));

      const formattedServiceProviders = serviceProviders.map((sp) => ({
        Id: sp.Id || null,
        ServiceName: sp.serviceName,
        TimeLimitDays: sp.timeLimit,
        DesignatedOfficer: sp.designatedOfficer,
        FirstAppellateOfficer: sp.firstAppellateOfficer,
        SecondAppellateOfficer: sp.secondAppellateOfficer,
        Lang: "EN",
        Status: 1,
      }));

      const formattedData = {
        ...watch(),
        DeptId: watch("DeptId"),
        DeptNameEN: selectedDept ? selectedDept.DeptNameEN : "",
        Documents: formattedDocuments,
        ServicesProvider: formattedServiceProviders,
      };

      if (SaveUpdateButton === "SAVE") {
        axios
          .post(`${BASE_URL}DepartmentSer/`, formattedData)
          .then((response) => {
            setLoaderOpen(false);
            if (response.data.success) {
              getAllDeptServData();
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Service added successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              handleParentDialogClose(false);
            } else {
              Swal.fire({
                icon: "error",
                title: "Failed to save Service",
                text: response.data.message,
              });
            }
          })
          .catch((error) => handleApiError(error));
      } else {
        if (!watch("Id")) {
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

        if (!result.isConfirmed) return;

        axios
          .put(`${BASE_URL}DepartmentSer/${watch("Id")}`, formattedData)
          .then((response) => {
            setLoaderOpen(false);
            if (response.data.success) {
              getAllDeptServData();
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Service Updated successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              handleParentDialogClose(false);
            } else {
              Swal.fire({
                icon: "error",
                title: "Failed to update Service",
                text: response.data.message,
              });
            }
          })
          .catch((error) => handleApiError(error));
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

  const handleEditClick = async (row) => {
    setSaveUpdateButton("UPDATE");
    setClearUpdateButton("RESET");

    try {
      setLoading(true);
      const apiUrl = `${BASE_URL}DepartmentSer/ById/${row.Id}`;
      const response = await axios.get(apiUrl);

      if (response.data) {
        const data = response.data.values;
        originalDataRef.current = JSON.parse(JSON.stringify(data));

        reset({
          Id: data.Id,
          ServiceNameEN: data.ServiceNameEN,
          ServiceNameMR: data.ServiceNameMR,
          DocLink: data.DocLink,
          ApplyLink: data.ApplyLink,
          DeptId: data.DeptId,
          Status: data.Status,
        });

        setServiceProviders(data.ServicesProvider || []);
        setDocTypes(data.Documents || []);
        setOpen(true);
      }
    } catch (error) {
      console.error("Error fetching department service data:", error);
      Swal.fire({
        icon: "error",
        toast: true,
        title: "Failed",
        text: error,
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleParentDialogOpen = () => {
    setSaveUpdateButton("SAVE");
    setClearUpdateButton("CLEAR"); // ✅ Ensure it's set to "CLEAR"

    setTimeout(() => {
      // ✅ Delay to ensure state updates
      clearFormData();
      setOpen(true);
    }, 50);
  };
  const columns = [
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <strong>
          <IconButton
            sx={{
              color: "rgb(0, 90, 91)", // Apply color to the icon
              "&:hover": {
                backgroundColor: "rgba(0, 90, 91, 0.1)", // Optional hover effect
              },
            }}
            onClick={() => handleEditClick(params.row)}
          >
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
          Manage Services
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
          Add Services
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
            height: "90%", // Set height in percentage
            minHeight: "500px",

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: (theme) => theme.palette.custome.datagridcolor,
            },
            "& .MuiDataGrid-row:hover": {
              boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)",
            },
          }}
          rows={data}
          columns={columns}
          pagination
          paginationMode="server"
          rowCount={totalRows}
          pageSizeOptions={[limit]}
          paginationModel={{ page: currentPage, pageSize: limit }}
          onPaginationModelChange={(newModel) => {
            console.log("New Pagination Model:", newModel);
            setCurrentPage(newModel.page);
            getAllDeptServData(newModel.page, searchText);
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
            getAllDeptServData(0, quickFilterValue);
          }}
          getRowId={(row) => row.Id} // Ensure unique row ID from database
        />
      </Grid>

      <Dialog
        elevation={7}
        onSubmit={handleSubmit(handleSave)} // Handle submit via react-hook-form
        component={"form"}
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
            background: (theme) =>
              theme.palette.customAppbar?.appbarcolor ||
              "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
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
                <Controller
                  name="ServiceNameEN"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputDescriptionField
                      {...field}
                      label="Service Name English"
                      size="small"
                      fullWidth
                      error={!!errors.ServiceNameEN}
                      helperText={errors.ServiceNameEN?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="ServiceNameMR"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputDescriptionField
                      {...field}
                      label="Service Name Marathi"
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      error={!!errors.ServiceNameMR}
                      helperText={errors.ServiceNameMR?.message}
                    />
                  )}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Controller
                  name="DeptId"
                  control={control}
                  defaultValue={null} // Ensure default value is null
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      size="small"
                      options={Departments} // Your departments array
                      getOptionLabel={(option) =>
                        option.DeptNameEN || "Unknown Department"
                      } // Display dept name
                      isOptionEqualToValue={(option, value) =>
                        option.Id === value.Id
                      } // Compare options by Id
                      value={
                        Departments.find((dept) => dept.Id === field.value) ||
                        null // Ensure value matches by Id
                      }
                      onChange={(_, newValue) => {
                        setValue("DeptId", newValue ? newValue.Id : null); // Set the selected Id
                      }}
                      sx={{ width: "220px" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Department"
                          fullWidth
                          error={!!errors.DeptId}
                          helperText={errors.DeptId?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="DocLink"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputTextField
                      {...field}
                      label="Document Link"
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      error={!!errors.DocLink}
                      helperText={errors.DocLink?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="ApplyLink"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputTextField
                      {...field}
                      label="Apply Link"
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      error={!!errors.ApplyLink}
                      helperText={errors.ApplyLink?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} textAlign={"center"}>
                <Controller
                  name="Status"
                  control={control}
                  defaultValue={1} // Default to checked (1)
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
                      label="Active"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Paper>
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              // padding: 1,
              marginTop: 3,
              // textAlign: "center",
              // display: "inline-block",
            }}
          >
            <div
              style={{
                padding: "16px",
                // width: "100%",
                maxWidth: "1850px",
                // margin: "0 auto",
                // marginTop: "2%",
              }}
            >
              {/* Search Bar */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {/* Add Document Type Button */}
                <Grid item xs={12} sm={3}>
                  <Button
                    // variant="contained"

                    sx={{
                      p: 1,
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
                    // startIcon={<AddCircleIcon />}
                    onClick={() => {
                      setOpenDocTypeDialog(true);
                      clearDocTypeForm();
                    }}
                    // fullWidth
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
                    <Accordion
                      key={index}
                      sx={{
                        marginBottom: "8px",
                        width: "100%",
                        maxWidth: "1400vw",
                      }}
                    >
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
                                  sx={{
                                    color: "rgb(0, 90, 91)", // Apply color to the icon
                                    "&:hover": {
                                      backgroundColor: "rgba(0, 90, 91, 0.1)", // Optional hover effect
                                    },
                                  }}
                                  onClick={() => handleEditDocType(index)}
                                >
                                  <EditNoteIcon />
                                </IconButton>
                              </Grid>
                              <Grid item>
                                <Button
                                  variant="outlined"
                                  sx={{
                                    p: 1,
                                    color: "rgb(0, 90, 91)",
                                    background: "transparent",
                                    border: "1px solid rgb(0, 90, 91)",
                                    borderRadius: "8px",
                                    transition: "all 0.2s ease-in-out",
                                    "&:hover": {
                                      background: "rgba(0, 90, 91, 0.1)",
                                      transform: "translateY(2px)",
                                    },
                                  }}
                                  onClick={() => {
                                    setSelectedDocType(index);
                                    setOpenDocDialog(true);
                                    clearDocument();
                                    setSelectedDocIndex(null); // Reset to avoid lingering "Update" state
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
                                  boxShadow:
                                    "0px 4px 20px rgba(0, 0, 0.2, 0.2)",
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
                                        sx={{
                                          color: "rgb(0, 90, 91)", // Apply color to the icon
                                          "&:hover": {
                                            backgroundColor:
                                              "rgba(0, 90, 91, 0.1)", // Optional hover effect
                                          },
                                        }}
                                      >
                                        <EditNoteIcon
                                          sx={{
                                            color: "rgb(0, 90, 91)", // Apply color to the icon
                                            "&:hover": {
                                              backgroundColor:
                                                "rgba(0, 90, 91, 0.1)", // Optional hover effect
                                            },
                                          }}
                                        />
                                      </IconButton>
                                      <IconButton
                                        onClick={() =>
                                          handleDeleteDocument(
                                            index,
                                            params.row.id
                                          )
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
                <DialogTitle
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  {editingDocType !== null
                    ? "Edit Document Type"
                    : "Add Document Type"}
                  <IconButton onClick={() => setOpenDocTypeDialog(false)}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>

                <DialogContent>
                  <TextField
                    fullWidth
                    name="DocTypeEN"
                    label="Document Type (English)"
                    defaultValue={docType.english}
                    onChange={(e) =>
                      handleDocTypeChange("english", e.target.value)
                    }
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    fullWidth
                    name="DocTypeMR"
                    label="Document Type (Marathi)"
                    defaultValue={docType.marathi}
                    onChange={(e) =>
                      handleDocTypeChange("marathi", e.target.value)
                    }
                    sx={{ mt: 2 }}
                  />
                </DialogContent>

                <DialogActions
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    sx={{
                      p: 1,
                      color: "rgb(0, 90, 91)",
                      background: "transparent",
                      border: "1px solid rgb(0, 90, 91)",
                      borderRadius: "8px",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        background: "rgba(0, 90, 91, 0.1)",
                        transform: "translateY(2px)",
                      },
                    }}
                    // onClick={handleResetDocType}
                  >
                    {ClearDocTypeButton}
                  </Button>
                  <Button
                    sx={{
                      p: 1,
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
                    onClick={handleSaveOrUpdateDocType}
                    variant="contained"
                  >
                    {saveDocTypeButton}
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Add Document Dialog */}
              <Dialog
                open={openDocDialog}
                onClose={() => setOpenDocDialog(false)}
              >
                <DialogTitle sx={{ textAlign: "center" }}>
                  Add Document
                </DialogTitle>
                <DialogContent>
                  <TextField
                    fullWidth
                    label="Document Name (English)"
                    name="DocNameEN"
                    defaultValue={newDocument.english}
                    onChange={(e) =>
                      handleDocumentChange("english", e.target.value)
                    }
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    fullWidth
                    name="DocNameMR"
                    label="Document Name (Marathi)"
                    defaultValue={newDocument.marathi}
                    onChange={(e) =>
                      handleDocumentChange("marathi", e.target.value)
                    }
                    sx={{ mt: 2 }}
                  />
                </DialogContent>
                <DialogActions
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    onClick={() => setOpenDocDialog()}
                    sx={{
                      p: 1,
                      color: "rgb(0, 90, 91)",
                      background: "transparent",
                      border: "1px solid rgb(0, 90, 91)",
                      borderRadius: "8px",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        background: "rgba(0, 90, 91, 0.1)",
                        transform: "translateY(2px)",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddOrUpdateDocument}
                    variant="contained"
                    sx={{
                      p: 1,
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
                    {selectedDocIndex !== null ? "Update" : "Add"}
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Paper>
          <Paper elevation={3} sx={{ width: "100%", marginTop: 3 }}>
            <div style={{ padding: "16px", maxWidth: "1850px" }}>
              {/* Add Service Provider Button */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={3}>
                  <Button
                    sx={{
                      p: 1,
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
                    onClick={handleOpenServiceProviderDialog}
                  >
                    Add Service Provider
                  </Button>
                </Grid>
              </Grid>

              {/* DataGrid */}
              <DataGrid
                rows={serviceProviders.map((sp, index) => ({
                  ...sp,
                  srNo: index + 1, // Always assign a fresh serial number
                }))}
                hideFooter
                getRowId={(row) => row.Id || row.srNo} // Hybrid key: use Id, fallback to srNo
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
                    renderCell: (params) => (
                      <div>
                        <IconButton
                          color="rgb(0, 90, 91)"
                          onClick={() =>
                            handleEditServiceProvider(
                              params.row.Id || params.row.srNo
                            )
                          }
                          sx={{
                            color: "rgb(0, 90, 91)",
                            "&:hover": {
                              backgroundColor: "rgba(0, 90, 91, 0.1)",
                            },
                          }}
                        >
                          <EditNoteIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDeleteServiceProvider(
                              params.row.Id || params.row.srNo
                            )
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    ),
                  },
                ]}
              />

              {/* Dialog for Add/Edit */}
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
                    defaultValue={newServiceProvider.serviceName}
                    onChange={(e) =>
                      handleInputChange("serviceName", e.target.value)
                    }
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Time Limit"
                    defaultValue={newServiceProvider.timeLimit}
                    onChange={(e) =>
                      handleInputChange("timeLimit", e.target.value)
                    }
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Designated Officer"
                    defaultValue={newServiceProvider.designatedOfficer}
                    onChange={(e) =>
                      handleInputChange("designatedOfficer", e.target.value)
                    }
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="First Appellate Officer"
                    defaultValue={newServiceProvider.firstAppellateOfficer}
                    onChange={(e) =>
                      handleInputChange("firstAppellateOfficer", e.target.value)
                    }
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Second Appellate Officer"
                    defaultValue={newServiceProvider.secondAppellateOfficer}
                    onChange={(e) =>
                      handleInputChange(
                        "secondAppellateOfficer",
                        e.target.value
                      )
                    }
                    sx={{ mt: 2 }}
                  />
                </DialogContent>

                <DialogActions
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    sx={{
                      p: 1,
                      color: "rgb(0, 90, 91)",
                      background: "transparent",
                      border: "1px solid rgb(0, 90, 91)",
                      borderRadius: "8px",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        background: "rgba(0, 90, 91, 0.1)",
                        transform: "translateY(2px)",
                      },
                    }}
                    onClick={() => setOpenServiceProviderDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveServiceProvider}
                    variant="contained"
                    sx={{
                      p: 1,
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
                    {editing ? "Update" : "Save"}
                  </Button>
                </DialogActions>
              </Dialog>
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
                boxShadow: 5,
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
                boxShadow: 5,
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
              // disabled={!validateForm()}
              onClick={handleSave} // Handle save action
            >
              {SaveUpdateButton}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default OnlineServices;
