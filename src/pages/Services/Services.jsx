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
  Grid,
  IconButton,
  List,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../../Constant";
import InputTextField, {
  CheckboxInputs,
  InputDescriptionField,
} from "../../components/Component";
import Loader from "../../components/Loader";
// import ServiceDocType from "./ServicesDocType";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@emotion/react";
import Autocomplete from "@mui/material/Autocomplete";

const OnlineServices = () => {
  const [loaderOpen, setLoaderOpen] = useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = useState("UPDATE");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [Departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    Id: null,
    ServiceNameEN: "",
    ServiceNameMR: "",
    DocLink: "",
    ApplyLink: "",
    // DocumentTypeIds: [],
    Documents: [],
    ServicesProvider: [],
    DeptId: "",
    Status: 1,
  });
  const [selectedDocTypeIndex, setSelectedDocTypeIndex] = React.useState(null);
  const [docTypes, setDocTypes] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]); // State for Service Providers
  const [searchQuery, setSearchQuery] = useState("");
  const [searchText, setSearchText] = React.useState(""); // ✅ Search input state
  const [openDocTypeDialog, setOpenDocTypeDialog] = useState(false);
  const [openDocDialog, setOpenDocDialog] = useState(false);
  const [openServiceProviderDialog, setOpenServiceProviderDialog] =
    useState(false); // Modal for Service Provider
  const [docType, setdocType] = useState({ english: "", marathi: "" });
  const [newDocument, setNewDocument] = useState({ english: "", marathi: "" });
  const [editing, setEditing] = useState(false);
  const [totalRows, setTotalRows] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [newServiceProvider, setNewServiceProvider] = useState({
    Id: "",
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
  const [loading, setLoading] = React.useState(false);
  const limit = 20; // Fixed page size
  const [ClearUpdateButton, setClearUpdateButton] = React.useState("CLEAR");
  const [ClearDocTypeButton, setClearDocTypeButton] = React.useState("RESET");
  const originalDataRef = React.useRef(null);
  const [saveDocTypeButton, setSaveDocTypeButton] = useState("SAVE");
  const selectedDocTypeIndexRef = useRef(null);
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
              getAllDeptServData(currentPage, searchText);
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
      console.log("Calling API with Page:", page); // ✅ Debugging line
      console.log("Search Text:", searchText);

      setLoading(true);
      // const token = await getApiToken();

      let apiUrl = `${BASE_URL}DepartmentSer/ByPage/${page}/${limit}`;

      if (searchText) {
        apiUrl = `${BASE_URL}DepartmentSer/ByPage/search/${searchText}/${page}/${limit}`;
      }

      console.log("Final API URL:", apiUrl); // ✅ Check if correct URL is formed

      const response = await axios.get(apiUrl, {
        // headers: {
        //   "Content-Type": "application/json",
        //   Authorization: token,
        // },
      });

      console.log("API Response:", response.data);

      if (response.data && response.data.values) {
        setData(
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
  const handleParentDialogOpen = () => {
    setSaveUpdateButton("SAVE");
    setClearUpdateButton("CLEAR"); // ✅ Ensure it's set to "CLEAR"

    setTimeout(() => {
      // ✅ Delay to ensure state updates
      clearFormData();
      setOpen(true);
    }, 50);
  };
  const handleParentDialogClose = () => {
    setClearUpdateButton("CLEAR");
    setSaveUpdateButton("SAVE");
    clearFormData();
    setOpen(false);
  };
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}Department/All`);
      const departmentList = response.data.values; // Store the response in a variable
      setDepartments(departmentList); // Update state with fetched data
      console.log("Fetched Departments:", departmentList); // Log fetched data
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

  const clearDocTypeForm = () => {
    if (ClearDocTypeButton === "CLEAR") {
      setdocType({ english: "", marathi: "" });
    }
  };
  const clearDocument = () => {
    setNewDocument({ DocNameEN: "", DocTypeMR: "" });
  };
  const clearFormData = () => {
    console.log("ClearUpdateButton value:", ClearUpdateButton);
    if (ClearUpdateButton === "CLEAR") {
      setFormData({
        ServiceNameEN: "",
        ServiceNameMR: "",
        DocLink: "",
        ApplyLink: "",
        DeptId: "",
        Status: 1,
        docTypes: [],
        serviceProviders: [],
      });
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

      setFormData({
        Id,
        ServiceNameEN,
        ServiceNameMR,
        DocLink,
        ApplyLink,
        DeptId,
        Status,
      });

      setServiceProviders(
        ServicesProvider?.map(
          ({
            Id,
            SerId,
            ServiceName,
            TimeLimitDays,
            DesignatedOfficer,
            FirstAppellateOfficer,
            SecondAppellateOfficer,
          }) => ({
            Id: Id || "",
            SerId: SerId || "",
            serviceName: ServiceName,
            timeLimit: TimeLimitDays,
            designatedOfficer: DesignatedOfficer,
            firstAppellateOfficer: FirstAppellateOfficer,
            secondAppellateOfficer: SecondAppellateOfficer,
          })
        ) || []
      );

      setDocTypes(
        Documents?.map(({ Id, DocTypeEN, DocTypeMR, Documents }) => ({
          Id: Id || null,
          english: DocTypeEN,
          marathi: DocTypeMR,
          documents:
            Documents?.map(({ Id, DocNameEN, DocNameMR }) => ({
              Id: Id || 0,
              english: DocNameEN,
              marathi: DocNameMR,
            })) || [],
        })) || []
      );
    }
  };
  useEffect(() => {
    getAllDeptServData();
  }, []);
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
    selectedDocTypeIndexRef.current = index;
    setSelectedDocTypeIndex(index);            // Store the index
    setdocType({ ...docTypes[index] });         // Populate the form with the selected Document Type
    setClearDocTypeButton("RESET");
    setSaveDocTypeButton("UPDATE");
    setOpenDocTypeDialog(true);
  };
  const handleResetDocType = () => {
    if (selectedDocTypeIndexRef.current !== null) {
      // Revert to the original data from the docTypes array
      setdocType({ ...docTypes[selectedDocTypeIndexRef.current] });
    }
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

  const validateForm = () => {
    const { ServiceNameEN, DocLink, DeptId } = formData;
    return ServiceNameEN && DocLink && DeptId;
  };
  const handleSave = async () => {
    setClearUpdateButton("CLEAR");

    try {
      const selectedDept = Departments.find(
        (dept) => dept.Id === formData.DeptId
      );

      // Ensure Documents are structured correctly
      const formattedDocuments = docTypes.map((docType) => ({
        Id: docType.Id || null,
        DocTypeEN: docType.english,
        DocTypeMR: docType.marathi,
        Status: 1, // Default active
        // SerId: formData.SerId || null,
        Documents: docType.documents.map((doc) => ({
          Id: doc.Id || null,
          DocNameEN: doc.english,
          DocNameMR: doc.marathi,
        })),
      }));

      // Ensure ServicesProvider is structured correctly
      const formattedServiceProviders = serviceProviders.map((sp) => ({
        Id: sp.Id || null,
        ServiceName: sp.serviceName,
        TimeLimitDays: sp.timeLimit,
        DesignatedOfficer: sp.designatedOfficer,
        FirstAppellateOfficer: sp.firstAppellateOfficer,
        SecondAppellateOfficer: sp.secondAppellateOfficer,
        Lang: "EN", // Assuming language is always English
        // SerId: sp.SerId ,
        Status: 1, // Default active
      }));

      const formattedData = {
        ...formData,
        DeptId: formData.DeptId,
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
              getAllDeptServData(currentPage, searchText);
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Service added successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              getAllDeptServData(currentPage, searchText);
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
        if (!formData.Id) {
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
          .put(`${BASE_URL}DepartmentSer/${formData.Id}`, formattedData)
          .then((response) => {
            setLoaderOpen(false);
            if (response.data.success) {
              clearFormData();
              getAllDeptServData(currentPage, searchText);
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Service Updated successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              getAllDeptServData(currentPage, searchText);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    console.log("Updated Service Providers:", serviceProviders);
  }, [serviceProviders]);

  const handleEditClick = async (row) => {
    console.log("Selected Row:", row);
    setSaveUpdateButton("UPDATE");
    setClearUpdateButton("RESET");

    try {
      setLoading(true);
      // const token = await getApiToken(); // Get authentication token

      const apiUrl = `${BASE_URL}DepartmentSer/ById/${row.Id}`;
      console.log("Fetching API URL:", apiUrl);

      const response = await axios.get(apiUrl, {
        // headers: {
        //   "Content-Type": "application/json",
        //   Authorization: token,
        // },
      });

      console.log("API Response:", response.data);

      if (response.data) {
        const data = response.data.values;
        originalDataRef.current = JSON.parse(JSON.stringify(data));

        // Set form data for the modal
        setFormData({
          Id: data.Id,
          ServiceNameEN: data.ServiceNameEN,
          ServiceNameMR: data.ServiceNameMR,
          DocLink: data.DocLink,
          ApplyLink: data.ApplyLink,
          DeptId: data.DeptId,
          Status: data.Status,
        });

        // Set service providers to state
        if (data.ServicesProvider) {
          const formattedProviders = data.ServicesProvider.map((sp) => ({
            Id: sp.Id || "",
            SerId: sp.SerId || "",
            serviceName: sp.ServiceName,
            timeLimit: sp.TimeLimitDays,
            designatedOfficer: sp.DesignatedOfficer,
            firstAppellateOfficer: sp.FirstAppellateOfficer,
            secondAppellateOfficer: sp.SecondAppellateOfficer,
          }));
          setServiceProviders(formattedProviders);
        } else {
          setServiceProviders([]); // Ensure it's cleared if empty
        }

        // Set Document Types and Documents
        if (data.Documents) {
          const formattedDocTypes = data.Documents.map((docType) => ({
            Id: docType.Id || null,
            english: docType.DocTypeEN,
            marathi: docType.DocTypeMR,
            documents: docType.Documents
              ? docType.Documents.map((doc) => ({
                  Id: doc.Id || 0,
                  english: doc.DocNameEN,
                  marathi: doc.DocNameMR,
                }))
              : [],
          }));
          setDocTypes(formattedDocTypes);
        } else {
          setDocTypes([]); // Ensure it's cleared if empty
        }
        // originalDataRef.current = data;
        setOpen(true); // Open modal
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
              {/* <Grid item xs={12} sm={4} width={200}></Grid> */}
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
                <Autocomplete
                  size="small"
                  options={Departments}
                  getOptionLabel={(option) => option.DeptNameEN} // Display department name
                  value={
                    Departments.find((dept) => dept.Id === formData.DeptId) ||
                    null
                  } // Set selected value
                  onChange={(event, newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      DeptId: newValue ? newValue.Id : "", // Store selected department Id
                    }));
                  }}
                  sx={{ width: "220px" }} // Reduced width
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Department"
                      fullWidth
                    />
                  )}
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
              {/* <Grid item xs={12} sm={4} width={200}></Grid> */}
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

              {/* <Grid item xs={12} sm={4} width={200}></Grid> */}
              <Grid item xs={12} sm={4} textAlign={"center"}>
                <CheckboxInputs
                  checked={formData.Status === 1} // Ensure it's checked by default
                  label="Active"
                  id="Status"
                  onChange={(event) =>
                    handleInputChange({
                      target: {
                        name: "Status",
                        value: event.target.checked ? 1 : 0, // Ensure value is set properly
                      },
                    })
                  }
                  value={formData.Status}
                  name="Status"
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
                    value={docType.english}
                    onChange={(e) =>
                      setdocType({ ...docType, english: e.target.value })
                    }
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    fullWidth
                    name="DocTypeMR"
                    label="Document Type (Marathi)"
                    value={docType.marathi}
                    onChange={(e) =>
                      setdocType({ ...docType, marathi: e.target.value })
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
                    onClick={handleResetDocType}
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
                    value={newDocument.english}
                    onChange={(e) =>
                      setNewDocument({
                        ...newDocument,
                        english: e.target.value,
                      })
                    }
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    fullWidth
                    name="DocNameMR"
                    label="Document Name (Marathi)"
                    value={newDocument.marathi}
                    onChange={(e) =>
                      setNewDocument({
                        ...newDocument,
                        marathi: e.target.value,
                      })
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
              disabled={!validateForm()}
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
