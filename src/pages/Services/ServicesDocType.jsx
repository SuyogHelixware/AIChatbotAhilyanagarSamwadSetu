import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Paper,
  Grid,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { DataGrid } from "@mui/x-data-grid";

const ServicesDocType = () => {
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
  //   // Function to add a Document to a specific Document Type
  //   const handleAddDocument = () => {
  //     if (newDocument.english.trim() && newDocument.marathi.trim()) {
  //       const updatedDocTypes = docTypes.map((docType, index) =>
  //         index === selectedDocType
  //           ? {
  //               ...docType,
  //               documents: [...docType.documents, newDocument],
  //             }
  //           : docType
  //       );
  //       setDocTypes(updatedDocTypes);
  //       setNewDocument({ english: "", marathi: "" });
  //       setOpenDocDialog(false);
  //     }
  //   };

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
  // Function to add a new Service Provider
  const handleAddServiceProvider = () => {
    if (
      newServiceProvider.serviceName.trim() &&
      newServiceProvider.timeLimit.trim() &&
      newServiceProvider.designatedOfficer.trim() &&
      newServiceProvider.firstAppellateOfficer.trim() &&
      newServiceProvider.secondAppellateOfficer.trim()
    ) {
      setServiceProviders([...serviceProviders, newServiceProvider]);
      setNewServiceProvider({
        serviceName: "",
        timeLimit: "",
        designatedOfficer: "",
        firstAppellateOfficer: "",
        secondAppellateOfficer: "",
      });
      setOpenServiceProviderDialog(false);
    }
  };

  // Function to handle edit modal for Service Provider
  const handleEditServiceProvider = (index) => {
    setEditServiceProvider({ ...serviceProviders[index], index });
    setOpenServiceProviderDialog(true);
  };

  // Function to handle update of Service Provider data
  const handleUpdateServiceProvider = () => {
    if (
      editServiceProvider.serviceName.trim() &&
      editServiceProvider.timeLimit.trim() &&
      editServiceProvider.designatedOfficer.trim() &&
      editServiceProvider.firstAppellateOfficer.trim() &&
      editServiceProvider.secondAppellateOfficer.trim()
    ) {
      const updatedProviders = [...serviceProviders];
      updatedProviders[editServiceProvider.index] = { ...editServiceProvider };
      setServiceProviders(updatedProviders);
      setOpenServiceProviderDialog(false);
      setEditServiceProvider(null);
    }
  };

  // Function to handle delete of Service Provider
  const handleDeleteServiceProvider = (index) => {
    setServiceProviders(serviceProviders.filter((_, i) => i !== index));
  };

  return (
    <>
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
        <div
          style={{
            padding: "16px",
            width: "100%",
            maxWidth: "1350px",
            margin: "0 auto",
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
                <Accordion key={index} sx={{ marginBottom: "8px" }}>
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
      <Paper elevation={3} sx={{ width: "100%", padding: 3, marginTop: 3 }}>
        <div style={{ padding: "16px", maxWidth: "1350px", margin: "0 auto" }}>
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
      
    </>
  );
};

export default ServicesDocType;
