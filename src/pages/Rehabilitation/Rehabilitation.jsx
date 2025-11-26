// import AddIcon from "@mui/icons-material/Add";
// import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
// import EditNoteIcon from "@mui/icons-material/EditNote";
// import CloseIcon from "@mui/icons-material/Close";
// import { GridToolbar } from "@mui/x-data-grid";
// import {
//   Button,
//   Checkbox,
//   FormControlLabel,
//   Grid,
//   IconButton,
//   MenuItem,
//   Modal,
//   Paper,
//   Select,
//   TextField,
//   Tooltip,
//   Typography,
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import axios from "axios";
// import * as React from "react";
// import Swal from "sweetalert2";

// // import { CheckboxInputs, InputDescriptionField } from "../components/Component";
// import { Controller, useForm } from "react-hook-form"; // Importing React Hook Form
// import dayjs from "dayjs";
// import Loader from "../../components/Loader";
// import { BASE_URL } from "../../Constant";
// import { useThemeMode } from "../../Dashboard/Theme";

// const Rehabilitation = () => {
//   const [loaderOpen, setLoaderOpen] = React.useState(false);
//   const [DocumentData, setDocumentData] = React.useState([]);
//   const [on, setOn] = React.useState(false);
//   const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
//   const [ClearUpdateButton, setClearUpdateButton] = React.useState("RESET");
//   const [totalRows, setTotalRows] = React.useState("");
//   const [currentPage, setCurrentPage] = React.useState(0);
//   const [loading, setLoading] = React.useState(false);
//   const [searchText, setSearchText] = React.useState("");
//   const limit = 20;
//   const originalDataRef = React.useRef(null);

//   const firstLoad = React.useRef(true);

//   const [CreateSubDocRows, setCreateSubDocRows] = React.useState([]);
//   const [selectionModel, setSelectionModel] = React.useState([]);
//   const [selectedRows, setSelectedRows] = React.useState([]);

//   const { checkAccess } = useThemeMode();

//   const canAdd = checkAccess(11, "IsAdd");
//   const canEdit = checkAccess(11, "IsEdit");
//   const canDelete = checkAccess(11, "IsDelete");

//   const [DammyData, setDammyData] = React.useState([
//     { id: 1, NameMR: "Driving License", isNew: false },
//     { id: 2, NameMR: "Aadhar Card", isNew: false },
//     { id: 3, NameMR: "Pan Card", isNew: false },
//     { id: "custom-1", NameMR: "", isNew: true },
//   ]);

//   // React Hook Form initialization
//   const {
//     register,
//     handleSubmit,
//     control,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       NameEN: "",
//       NameMR: "",
//       Remark: "",
//       MobileNo: "",
//       Status: 1,
//     },
//   });
//   const clearFormData = () => {
//     if (ClearUpdateButton === "CLEAR") {
//       reset({
//         NameEN: "",
//         NameMR: "",
//         MobileNo: "",
//         Remark: "",
//         Status: 1,
//       });
//     }
//     if (ClearUpdateButton === "RESET") {
//       reset(originalDataRef.current);
//     }
//   };

//   const handleClose = () => setOn(false);

//   const handleOnSave = () => {
//     setSaveUpdateButton("SAVE");
//     setClearUpdateButton("CLEAR");
//     clearFormData();
//     setValue("NameEN", "");
//     setValue("NameMR", "");
//     setValue("MobileNo", "");
//     setValue("Remark", "");
//     setOn(true);
//     setCreateSubDocRows([]);
//   };

//   const validationAlert = (message) => {
//     Swal.fire({
//       position: "center",
//       icon: "warning",
//       toast: true,
//       title: message,
//       showConfirmButton: false,
//       timer: 1500,
//     });
//   };

//   const handleSubmitForm = async (formData) => {
//     try {
//       const requiredFields = ["NameEN", "MobileNo"];
//       const emptyRequiredFields = requiredFields.filter(
//         (field) => !formData[field]?.trim()
//       );

//       if (emptyRequiredFields.length > 0) {
//         validationAlert("Please fill in all required fields");
//         return;
//       }

//       // 🔹 Validate DataGrid checked rows (selectedRows)
//       const emptyCheckedRows = DammyData.filter(
//         (row) => selectedRows.includes(row.id) && !row.NameMR?.trim()
//       );

//       if (emptyCheckedRows.length > 0) {
//         validationAlert("Please Type issue for selected rows");
//         return;
//       }

//       const payload = {
//         Id: null || formData.Id,
//         CreatedDate: dayjs().format("YYYY-MM-DD"),
//         CreatedBy: sessionStorage.getItem("userId"),
//         ModifiedBy: sessionStorage.getItem("userId"),
//         ModifiedDate: dayjs().format("YYYY-MM-DD"),
//         NameEN: formData.NameEN,
//         NameMR: formData.NameMR,
//         Remark: formData.Remark || "",
//         MobileNo: formData.MobileNo || "",
//         Status: formData.Status || "1",

//         SubDocs: CreateSubDocRows.filter((row) => row.NameMR).map(
//           (row, index) => ({
//             LineNum: 0,
//             Id: 0,
//             Status: 1,
//             CreatedDate: dayjs().format("YYYY-MM-DD"),
//             CreatedBy: sessionStorage.getItem("userId"),
//             ModifiedDate: dayjs().format("YYYY-MM-DD"),
//             ModifiedBy: sessionStorage.getItem("userId"),
//             // NameEN: row.NameMR,
//             NameEN: row.NameEN,
//             NameMR: row.NameMR,
//             MobileNo: row.MobileNo,
//             Remark: row.Remark || "",
//           })
//         ),
//       };
//       let response;

//       if (SaveUpdateButton === "SAVE") {
//         setLoaderOpen(true);
//         response = await axios.post(`${BASE_URL}DocsMastertemp`, payload);
//       } else {
//         if (!formData.Id) {
//           Swal.fire({
//             position: "center",
//             icon: "error",
//             toast: true,
//             title: "Update Failed",
//             text: "Invalid Document ID",
//             showConfirmButton: true,
//           });
//           return;
//         }

//         const result = await Swal.fire({
//           text: "Do you want to Update...?",
//           icon: "warning",
//           showCancelButton: true,
//           confirmButtonColor: "#3085d6",
//           cancelButtonColor: "#d33",
//           confirmButtonText: "Yes, Update it!",
//         });

//         if (!result.isConfirmed) {
//           return;
//         }

//         setLoaderOpen(true);
//         response = await axios.put(
//           `${BASE_URL}DocsMaster/${formData.Id}`,
//           payload
//         );
//       }

//       setLoaderOpen(false);

//       if (response.data.success) {
//         Swal.fire({
//           position: "center",
//           icon: "success",
//           toast: true,
//           title:
//             SaveUpdateButton === "SAVE"
//               ? "Document Added Successfully"
//               : "Document Updated Successfully",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//         handleClose();

//         getAllDocumentList(currentPage, searchText);
//       } else {
//         throw new Error(response.data.message || "Unexpected error");
//       }
//     } catch (error) {
//       setLoaderOpen(false);
//       Swal.fire({
//         position: "center",
//         icon: "error",
//         toast: true,
//         title: "Failed",
//         text: error.message || "Something went wrong",
//         showConfirmButton: true,
//       });
//     }
//   };

//   const getAllDocumentList = async (page = 0, searchText = "") => {
//     try {
//       setLoading(true);

//       const params = {
//         Status: 1,
//         Page: page,
//         ...(limit ? { Limit: limit } : {}),
//         ...(searchText ? { SearchText: searchText } : {}),
//       };

//       const response = await axios.get(`${BASE_URL}DocsMastertemp`, { params });
//       //   if (response.data && response.data.values) {
//       //     setDocumentData(
//       //       response.data.values.map((item, index) => ({
//       //         ...item,
//       //         id: item.Id || index + 1,
//       //       }))
//       //     );
//       //   }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   React.useEffect(() => {
//     if (firstLoad.current) {
//       getAllDocumentList();
//       firstLoad.current = false;
//     }
//   }, []);

//   // =========================

//   const handleDelete = async (rowData) => {
//     Swal.fire({
//       text: "Are you sure you want to delete?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         setLoaderOpen(true);
//         try {
//           const response = await axios.delete(
//             `${BASE_URL}DocsMaster/${rowData.Id}`
//           );
//           setLoaderOpen(false);
//           if (response.data && response.data.success) {
//             Swal.fire({
//               position: "center",
//               icon: "success",
//               toast: true,
//               title: "Document deleted successfully",
//               showConfirmButton: false,
//               timer: 1500,
//             });

//             getAllDocumentList(currentPage, searchText);
//           } else {
//             Swal.fire({
//               position: "center",
//               icon: "error",
//               toast: true,
//               title: "Failed",
//               text: `Unexpected response: ${JSON.stringify(response.data)}`,
//               showConfirmButton: true,
//             });
//           }
//         } catch (error) {
//           setLoaderOpen(false);
//           Swal.fire({
//             position: "center",
//             icon: "error",
//             toast: true,
//             title: "Failed",
//             text: error.message || "Something went wrong",
//             showConfirmButton: true,
//           });
//         }
//       }
//     });
//   };

//   const columns = [
//     // {
//     //   field: "actions",
//     //   headerName: "Action",
//     //   width: 150,
//     //   headerAlign: "center",
//     //   align: "center",
//     //   sortable: false,
//     //   renderCell: (params) => (
//     //     <strong>
//     //       <IconButton
//     //         color="primary"
//     //         sx={{
//     //           color: "rgb(0, 90, 91)",
//     //           "&:hover": {
//     //             backgroundColor: "rgba(0, 90, 91, 0.1)",
//     //           },
//     //         }}
//     //         onClick={() => handleUpdate(params.row)}
//     //       >
//     //         <EditNoteIcon />
//     //       </IconButton>
//     //       <Button
//     //         size="medium"
//     //         sx={{ color: "red" }}
//     //         onClick={() => handleDelete(params.row)}
//     //       >
//     //         <DeleteForeverIcon />
//     //       </Button>
//     //     </strong>
//     //   ),
//     // },
//     {
//       field: "actions",
//       headerName: "Action",
//       width: 150,
//       headerAlign: "center",
//       align: "center",
//       sortable: false,
//       renderCell: (params) => (
//         <strong>
//           <Tooltip
//             title={!canEdit ? "You don't have Edit permission" : ""}
//             placement="top"
//           >
//             <span>
//               <IconButton
//                 color="primary"
//                 disabled={!canEdit}
//                 sx={{
//                   color: canEdit ? "rgb(0, 90, 91)" : "grey",
//                   "&:hover": {
//                     backgroundColor: canEdit
//                       ? "rgba(0, 90, 91, 0.1)"
//                       : "transparent",
//                   },
//                 }}
//                 onClick={() => handleUpdate(params.row)}
//               >
//                 <EditNoteIcon />
//               </IconButton>
//             </span>
//           </Tooltip>

//           <Tooltip
//             title={!canDelete ? "You don't have Delete permission" : ""}
//             placement="top"
//           >
//             <span>
//               <Button
//                 size="medium"
//                 disabled={!canDelete}
//                 sx={{ color: canDelete ? "red" : "grey" }}
//                 onClick={() => handleDelete(params.row)}
//               >
//                 <DeleteForeverIcon />
//               </Button>
//             </span>
//           </Tooltip>
//         </strong>
//       ),
//     },

//     {
//       field: "srNo",
//       headerName: "SR NO",
//       width: 80,
//       sortable: false,
//       headerAlign: "center",
//       align: "center",
//       renderCell: (params) =>
//         params.api.getSortedRowIds().indexOf(params.id) + 1,
//     },

//     {
//       field: "NameEN",
//       headerName: "NAME",
//       width: 200,
//       headerAlign: "center",
//       align: "center",
//       sortable: false,
//       renderCell: (params) => (
//         <Tooltip title={params.value || ""} arrow placement="top-start">
//           <Typography
//             noWrap
//             sx={{
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               whiteSpace: "nowrap",
//               width: "100%",
//             }}
//           >
//             {params.value}
//           </Typography>
//         </Tooltip>
//       ),
//     },
//     {
//       field: "NameMR",
//       headerName: "CONTACT NUMBER",
//       width: 300,
//       headerAlign: "center",
//       align: "center",
//       sortable: false,
//       renderCell: (params) => (
//         <Tooltip title={params.value || ""} arrow placement="top-start">
//           <Typography
//             noWrap
//             sx={{
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               whiteSpace: "nowrap",
//               width: "100%",
//             }}
//           >
//             {params.value}
//           </Typography>
//         </Tooltip>
//       ),
//     },

//     {
//       field: "Remark",
//       headerName: "REMARK",
//       width: 500,
//       sortable: false,
//       renderCell: (params) => (
//         <Tooltip title={params.value || ""} arrow placement="top-start">
//           <Typography
//             noWrap
//             sx={{
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               whiteSpace: "nowrap",
//               width: "100%",
//             }}
//           >
//             {params.value}
//           </Typography>
//         </Tooltip>
//       ),
//     },
//   ];

//   const columnssubDoc = [
//     {
//       field: "srNo",
//       headerName: "SR NO",
//       width: 90,
//       sortable: false,
//       headerAlign: "center",
//       align: "center",
//       renderCell: (params) =>
//         params.api.getSortedRowIds().indexOf(params.id) + 1,
//     },

//     {
//       field: "NameMR",
//       headerName: "ISSUES ",
//       flex: 1,
//       sortable: false, // ⛔ disable sorting here
//       alignItems: "center",
//       renderCell: (params) => {
//         const { row } = params;
//         if (row.isNew) {
//           return (
//             <TextField
//               variant="outlined"
//               size="small"
//               fullWidth
//               value={row.NameMR || ""}
//               placeholder="Type Custom Issue..."
//               onChange={(e) =>
//                 handleInputChange(row.id, "NameMR", e.target.value)
//               }
//               onKeyDown={(e) => {
//                 // ✅ Allow typing space by preventing grid from hijacking it
//                 if (e.key === " ") {
//                   e.stopPropagation();
//                 }
//               }}
//             />
//           );
//         }

//         return (
//           <div style={{ opacity: 0.7, padding: "6px 8px" }}>{row.NameMR}</div>
//         );
//       },
//     },
//   ];

//   const handleUpdate = async (rowData) => {
//     setSaveUpdateButton("UPDATE");
//     setClearUpdateButton("RESET");
//     setOn(true);
//     try {
//       setLoading(true);
//       const apiUrl = `${BASE_URL}DocsMaster/${rowData.Id}`;
//       const response = await axios.get(apiUrl);
//       if (response.data.values) {
//         const Document = response.data.values;
//         originalDataRef.current = Document;
//         setValue("Id", Document.Id);
//         setValue("NameEN", Document.NameEN);
//         setValue("NameMR", Document.NameMR);
//         setValue("Remark", Document.Remark);
//         setValue("Status", Document.Status);

//         const subDocs = (Document.SubDocs || []).map((subDoc, index) => ({
//           id: subDoc.id || subDoc.DocEntry || index + 1,
//           ...subDoc,
//         }));

//         setCreateSubDocRows(subDocs);
//       }
//     } catch (error) {
//       console.error("Error fetching Document data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddRow = () => {
//     setDammyData((prevRows) => [
//       ...prevRows,
//       {
//         id: Date.now(), // unique id
//         NameMR: "",
//         isNew: true, // editable only for this
//       },
//     ]);
//   };
//   const handleInputChange = (id, field, value) => {
//     setDammyData((prevRows) =>
//       prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
//     );
//   };

//   return (
//     <>
//       {loaderOpen && <Loader open={loaderOpen} />}
//       <Modal
//         open={on}
//         // onClose={handleClose}
//         sx={{
//           backdropFilter: "blur(5px)",
//           backgroundColor: "rgba(0, 0, 0, 0.3)",
//         }}
//       >
//         <Paper
//           elevation={10}
//           sx={{
//             width: "100%",
//             maxWidth: 500,
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             justifyContent: "center",
//             overflow: "auto",
//             maxHeight: "90vh",
//           }}
//         >
//           <Grid
//             container
//             component="form"
//             spacing={3}
//             padding={3}
//             flexDirection="column"
//             onSubmit={handleSubmit(handleSubmitForm)}
//           >
//             {/* HEADER */}
//             <Grid
//               item
//               xs={12}
//               display="flex"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography fontWeight="bold" textAlign={"center"}>
//                 REHABILITATION
//               </Typography>
//               <IconButton onClick={handleClose}>
//                 <CloseIcon />
//               </IconButton>
//             </Grid>

//             {/* FORM FIELDS */}
//             <Grid container item xs={12} spacing={2}>
//               <Grid item xs={12} sm={6} lg={6}>
//                 <Controller
//                   name="NameEN"
//                   control={control}
//                   rules={{ required: "This field is required" }}
//                   render={({ field, fieldState }) => (
//                     <TextField
//                       {...field}
//                       fullWidth
//                       label="NAME"
//                       size="small"
//                       InputLabelProps={{ shrink: true }}
//                       error={!!fieldState.error}
//                       helperText={fieldState.error?.message}
//                     />
//                   )}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} lg={6}>
//                 <Controller
//                   name="MobileNo"
//                   control={control}
//                   rules={{
//                     required: "Mobile number is required",
//                     pattern: {
//                       value: /^[0-9]{10}$/,
//                       message: "Enter a valid 10-digit number",
//                     },
//                   }}
//                   render={({ field, fieldState }) => (
//                     <TextField
//                       {...field}
//                       label=" ENTER MOBILE NO"
//                       size="small"
//                       error={!!fieldState.error}
//                       helperText={fieldState.error?.message}
//                       inputProps={{
//                         maxLength: 10,
//                         inputMode: "numeric",
//                         pattern: "[0-9]*",
//                       }}
//                       onChange={(e) => {
//                         const value = e.target.value.replace(/\D/g, "");
//                         if (value.length <= 10) {
//                           field.onChange(value);
//                         }
//                       }}
//                       InputProps={{
//                         startAdornment: (
//                           <span style={{ marginRight: 8 }}>+91</span>
//                         ),
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <Controller
//                   name="Remark"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       fullWidth
//                       multiline
//                       minRows={2}
//                       label="REMARK"
//                       size="small"
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12}></Grid>
//             </Grid>

//             {/* ========================================================== */}
//             <Grid item xs={12} display="flex" alignItems="center">
//               <Button
//                 variant="outlined"
//                 size="small"
//                 sx={{
//                   height: "36px",
//                   color: "rgb(0, 90, 91)",
//                   border: "1px solid rgb(0, 90, 91)",
//                   borderRadius: "8px",
//                   "&:hover": {
//                     backgroundColor: "rgba(0,90,91,0.1)",
//                   },
//                 }}
//                 onClick={handleAddRow}
//               >
//                 <AddIcon />
//                 Add Row
//               </Button>
//             </Grid>

//             {/* DATAGRID SECTION */}

//             <div style={{ height: 300 }}>
//               <DataGrid
//                 className="datagrid-style"
//                 rows={DammyData}
//                 columns={columnssubDoc}
//                 pageSize={5}
//                 rowsPerPageOptions={[5]}
//                 onRowSelectionModelChange={(newSelection) =>
//                   setSelectedRows(newSelection)
//                 }
//                 checkboxSelection
//                 hideFooter
//                 getRowId={(row) => row.id}
//                 sx={{
//                   "& .MuiDataGrid-columnHeaders": {
//                     backgroundColor: (theme) =>
//                       theme.palette.custome?.datagridcolor || "#f5f5f5",
//                   },
//                   "& .MuiDataGrid-row:hover": {
//                     boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
//                   },
//                 }}
//               />
//             </div>

//             {/* ======================================== */}
//             <Grid item xs={12} sm={12}></Grid>
//             <Grid
//               item
//               xs={12}
//               md={12}
//               display="flex"
//               justifyContent="space-between"
//               alignItems="center"
//               sx={{
//                 position: "absolute",
//                 bottom: 10,
//                 left: 10,
//                 right: 10,
//                 mt: "10px",
//               }}
//             >
//               <Button
//                 size="small"
//                 onClick={() => clearFormData()}
//                 sx={{
//                   p: 1,
//                   width: 80,
//                   color: "rgb(0, 90, 91)",
//                   background: "transparent",
//                   border: "1px solid rgb(0, 90, 91)",
//                   borderRadius: "8px",
//                   transition: "all 0.2s ease-in-out",
//                   "&:hover": {
//                     background: "rgba(0, 90, 91, 0.1)",
//                     transform: "translateY(2px)",
//                   },
//                 }}
//               >
//                 {ClearUpdateButton}
//               </Button>
//               <Button
//                 type="submit"
//                 size="small"
//                 sx={{
//                   marginTop: 1,
//                   p: 1,
//                   width: 80,
//                   color: "white",
//                   background:
//                     "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
//                   boxShadow: 5,
//                   "&:hover": {
//                     transform: "translateY(2px)",
//                     boxShadow: "0 2px 4px rgba(0, 90, 91, 0.2)",
//                   },
//                 }}
//               >
//                 {SaveUpdateButton}
//               </Button>
//             </Grid>
//             {/* </form> */}
//             <Grid />
//           </Grid>
//         </Paper>
//       </Modal>
//       <Grid
//         container
//         md={12}
//         lg={12}
//         component={Paper}
//         textAlign={"center"}
//         sx={{
//           width: "100%",
//           px: 5,
//           display: "flex",
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "space-between",
//           mb: 2,
//         }}
//         elevation={4}
//       >
//         <Typography
//           className="slide-in-text"
//           width={"100%"}
//           textAlign="center"
//           textTransform="uppercase"
//           fontWeight="bold"
//           padding={1}
//           noWrap
//         >
//           Rehabilitation
//         </Typography>
//       </Grid>
//       <Grid container spacing={2} marginBottom={1} justifyContent="flex-end">
//         <Grid textAlign={"end"} marginBottom={1}>
//           <Tooltip
//             title={!canAdd ? "You don't have Add permission" : ""}
//             placement="top"
//           >
//             <span>
//               <Button
//                 onClick={handleOnSave}
//                 disabled={!canAdd}
//                 type="text"
//                 size="medium"
//                 sx={{
//                   pr: 2,
//                   mb: 0,
//                   mt: 2,
//                   color: "white",
//                   background:
//                     "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
//                   borderRadius: "8px",
//                   transition: "all 0.2s ease-in-out",
//                   boxShadow: "0 4px 8px rgba(0, 90, 91, 0.3)",
//                   "&:hover": {
//                     //  boxShadow: "0 2px 4px rgba(0, 90, 91, 0.2)",

//                     transform: canAdd ? "translateY(2px)" : "none",
//                     boxShadow: canAdd
//                       ? "0 2px 4px rgba(0, 90, 91, 0.2)"
//                       : "0 4px 8px rgba(0,0,0,0.1)",
//                   },
//                   "& .MuiButton-label": {
//                     display: "flex",
//                     alignItems: "center",
//                   },
//                   "& .MuiSvgIcon-root": {
//                     marginRight: "10px",
//                   },
//                 }}
//               >
//                 <AddIcon />
//                 Add Rehabilitation
//               </Button>
//             </span>
//           </Tooltip>
//         </Grid>
//       </Grid>
//       <Grid
//         container
//         item
//         lg={12}
//         component={Paper}
//         sx={{ height: "74vh", width: "100%" }}
//       >
//         <DataGrid
//           className="datagrid-style"
//           sx={{
//             height: "100%",
//             minHeight: "500px",
//             "& .MuiDataGrid-columnHeaders": {
//               backgroundColor: (theme) => theme.palette.custome.datagridcolor,
//             },
//             "& .MuiDataGrid-row:hover": {
//               boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)",
//             },
//           }}
//           rows={DocumentData}
//           columns={columns}
//           // autoHeight
//           pagination
//           paginationMode="server"
//           rowCount={totalRows}
//           pageSizeOptions={[limit]}
//           paginationModel={{ page: currentPage, pageSize: limit }}
//           onPaginationModelChange={(newModel) => {
//             console.log("New Pagination Model:", newModel);
//             setCurrentPage(newModel.page);
//             // getAllImgList(newModel.page, searchText);
//             getAllDocumentList();
//           }}
//           loading={loading}
//           initialState={{
//             pagination: { paginationModel: { pageSize: 8 } },
//             filter: {
//               filterModel: {
//                 items: [],
//                 quickFilterValues: [],
//               },
//             },
//           }}
//           disableColumnFilter
//           disableRowSelectionOnClick
//           disableColumnSelector
//           disableDensitySelector
//           slots={{ toolbar: GridToolbar }}
//           slotProps={{
//             toolbar: {
//               showQuickFilter: true,

//               quickFilterProps: { debounceMs: 500 },
//             },
//           }}
//           onFilterModelChange={(model) => {
//             const quickFilterValue = model.quickFilterValues?.[0] || "";
//             setSearchText(quickFilterValue);
//             setCurrentPage(0);

//             getAllDocumentList(0, quickFilterValue);
//           }}
//           getRowId={(row) => row.Id}
//         />
//       </Grid>
//     </>
//   );
// };

// export default Rehabilitation;

import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputBase,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Select,
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

import { BASE_URL } from "../../Constant";
import { useThemeMode } from "../../Dashboard/Theme";

// import Loader from "../components/Loader";
import Loader from "../../components/Loader";
import InputTextField, {
  DatePickerField,
  InputDescriptionField,
} from "../../components/Component";
import LazyAutocomplete from "../../components/Autocomplete";

import DescriptionIcon from "@mui/icons-material/Description";
import MissingDocsModal from "../../components/MissingDocsModal";

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

  const [subDocMap, setSubDocMap] = React.useState({});
  const [isMobileDisabled, setIsMobileDisabled] = React.useState(false);
  const [openRow, setOpenRow] = React.useState([]);

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
  const [scrollLockDocs, setScrollLockDocs] = React.useState(false);
  const [dLoading, setDLoading] = React.useState(false);
  const [docSearch, setDocSearch] = React.useState("");

  const [selectedRow, setSelectedRow] = React.useState(null);
  const [openMissingModal, setOpenMissingModal] = React.useState(false);
  const handleClosemissingModal = () => setOpenMissingModal(false);
const [SubDoclist, setSubDoclist] = React.useState({});

  console.log("dff", SubDoclist);

  // ======================

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

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      initial,
    },
  });

  React.useEffect(() => {
    if (rows.length > 0 && DocmasterList.length > 0) {
      setSubDocMap((prev) => {
        const updatedMap = { ...prev };

        rows.forEach((row) => {
          // Find available docs for this DocType
          const selectedDoc = DocmasterList.find(
            (doc) => doc.NameMR === row.DocType
          );
          const defaultSubDocs = selectedDoc?.SubDocs || [];

          // Get already saved custom/manual values
          const existing = updatedMap[row.id] || [];

          // Merge default + existing custom items (unique by NameMR)
          const merged = Array.from(
            new Map(
              [...defaultSubDocs, ...existing].map((item) => [
                item.NameMR,
                item,
              ])
            ).values()
          );

          updatedMap[row.id] = merged;
        });

        return updatedMap;
      });
    }
  }, [rows, DocmasterList]);

  const handleOpenMissingModal = (row) => {
    setSelectedRow(row);
    setOpenMissingModal(true);
  };

  const DocColumns = [
    {
      field: "srNo",
      headerName: "SR NO",
      width: 55,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.api.getSortedRowIds().indexOf(params.id) + 1,
    },

    {
      field: "action",
      headerName: "Action",
      width: 140,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const isDisabled = params.row.isDisabled;

        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                  <DeleteIcon fontSize="small" />
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

    {
      field: "FileName",
      headerName: "DOCUMENT NAME",
      flex: 1,
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const { id, field, api, value, row } = params;
        const isDisabled = row.isDisabled;
        const handleChange = (event) => {
          const newValue = event.target.value;
          api.updateRows([{ id, [field]: newValue }]);
          setRows((prev) =>
            prev.map((row) =>
              row.id === id ? { ...row, [field]: newValue } : row
            )
          );
        };
        const displayValue = value ? value.replace(/\.[^/.]+$/, "") : "";
        return (
          <Tooltip title={displayValue || ""} arrow placement="top">
            <TextField
              value={displayValue ?? ""}
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
      flex: 1,
      width: 200,
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
          <DatePickerField
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
      width: 200,

      renderCell: (params) => {
        const { id, field, value, api } = params;

        const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
        const stored = userData.GazOfficer || "";
        const isEditable = userData.UserType === "A" || !stored.trim();

        // ----------------- LOCKED FIELD -----------------
        if (!isEditable) {
          // ✅ Update the row immediately if value is missing
          if (value !== stored) {
            api.updateRows([{ id, [field]: stored }]);
            setRows((prev) =>
              prev.map((r) => (r.id === id ? { ...r, [field]: stored } : r))
            );
          }

          return (
            <Tooltip title={stored || ""} arrow placement="top">
              <TextField
                value={stored}
                disabled
                variant="standard"
                sx={{ width: 280 }}
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
            />
          </Tooltip>
        );
      },
    },

    {
      field: "DocType",
      headerName: "DOCUMENT TYPE",
      flex: 1,
      renderCell: (params) => {
        const { id, field, value, api, row } = params;

        return (
          <LazyAutocomplete
            id={id}
            field={field}
            value={value}
            list={DocmasterList}
            displayField="NameMR"
            disabled={row.isDisabled}
            searchValue={docSearch}
            onSearch={(txt) => {
              setDocSearch(txt);
              setDPage(0);
              setHasMoreDocs(true);
              DocMasterList({ page: 0, search: txt });
            }}
            api={api}
            setRows={setRows}
            loading={dLoading}
            onLazyLoad={DocMasterList}
            page={dPage}
            setPage={setDPage}
            hasMore={hasMoreDocs}
          />
        );
      },
    },

    //   {
    //   field: "MissingDocs",
    //   headerName: "MISSING DOCUMENTS",
    //   flex: 1,
    //   renderCell: (params) => {
    //     const existingDocs = SubDoclist[params.row.id] || [];
    //     const displayText = existingDocs.map((d) => d.NameMR).join(", ");

    //     return (
    //       <Tooltip title={displayText || "No documents"} arrow placement="top">
    //         <div
    //           style={{
    //             padding: "6px 8px",
    //             color: "#555",
    //             whiteSpace: "nowrap",
    //             overflow: "hidden",
    //             textOverflow: "ellipsis",
    //             cursor: displayText ? "pointer" : "default",
    //           }}
    //         >
    //           {displayText}
    //         </div>
    //       </Tooltip>
    //     );
    //   },
    // },

    {
      field: "MissingDocs",
      headerName: "MISSING DOCUMENTS",
      flex: 1,
      renderCell: (params) => {
        const { id, field, api, row } = params;
        const existingDocs = SubDoclist[id] || [];
        const displayValue = existingDocs.map((d) => d.NameMR).join(", ");

        const handleChange = (event) => {
          const newValue = event.target.value;
          // Optional: update in SubDoclist if you want editable
          // Here we prevent editing by skipping updates
          // If you want editable, uncomment below:
          // setSubDoclist(prev => ({
          //   ...prev,
          //   [id]: newValue.split(",").map(name => ({ NameMR: name.trim() }))
          // }));
          api.updateRows([{ id, [field]: newValue }]);
        };

        return (
          <Tooltip title={displayValue || "No documents"} arrow placement="top">
            <TextField
              value={displayValue}
              onChange={handleChange} // Keep this if you want editable
              onKeyDown={(e) => e.stopPropagation()}
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{
                readOnly: true, // make field readonly
              }}
            />
          </Tooltip>
        );
      },
    },

    // ---------------------
    {
      field: "MissingDocsView",
      headerName: "CUSTOME DOC",
      width: 100,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
        const isDisabled = params.row.isDisabled;

        return (
          <Tooltip title="Add Custom Documents" arrow>
            <span>
              <IconButton
                size="small"
                color="warning"
                disabled={isDisabled}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDisabled) handleOpenMissingModal(params.row);
                }}
              >
                <DescriptionIcon fontSize="small" />
              </IconButton>
            </span>
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
                  color: canEdit ? "rgb(0, 90, 91)" : "grey",
                  "&:hover": {
                    backgroundColor: canEdit
                      ? "rgba(0, 90, 91, 0.1)"
                      : "transparent",
                  },
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
                sx={{ color: canDelete ? "red" : "grey" }}
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

    // { field: "id", headerName: "Sr.No", width: 80, sortable: true },
    {
      field: "srNo",
      headerName: "SR NO",
      width: 80,
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

    // const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
    const currentUser = userSession.Username || userSession.userId || "";

    const newRows = await Promise.all(
      validFiles.map(async (file, index) => {
        const ext = file.name.split(".").pop().toLowerCase();
        return {
          id: Date.now() + index,
          name: file.name,
          type: ext,
          SrcPath: "",
          File: file,
          FileExt: ext,
          FileName: file.name,
          IssuedBy: "",
          DocType: "",
          Status: 1,
          CreatedDate: dayjs().format("YYYY-MM-DD"),
          ModifiedDate: dayjs().format("YYYY-MM-DD"),
          DocReqDate: dayjs().format("YYYY-MM-DD"),
          CreatedBy: currentUser,
          ModifiedBy: currentUser,
          UserId: currentUser,
        };
      })
    );

    setRows((prev) => [...prev, ...newRows]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
              FileName: file.name,
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

      // if (Array.isArray(row.MissingDocs) && row.MissingDocs.length > 0) {
      //   row.MissingDocs.forEach((docType, i) => {
      //     formData.append(`oDocLines[${index}].MissingDocs[${i}]`, docType);
      //   });
      // }
     const docs = SubDoclist[row.Id] || [];  // get missing docs for this line

if (docs.length > 0) {
  docs.forEach((doc, i) => {
    formData.append(`oDocLines[${index}].MissingDocs[${i}]`, doc.NameMR);
  });
}
  console.log("OBJ" , formData);
  
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

      // Get User Data (for Username)
      const userData = sessionStorage.getItem("userData");
      let username = null;

      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          username = parsedData?.Username ?? null;
        } catch (e) {
          console.error("Error parsing userData:", e);
        }
      }

      // Build query params
      const params = {
        Status: "1",
        Page: page,
        Limit: limit,
        CreatedBy: username,
        ...(searchText ? { SearchText: searchText } : {}),
      };

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

      if (data.values) {
        setDocmasterList(data.values);
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
    };
    setRows((prev) => [...prev, newRow]);
  };

  return (
    <>
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
            Height: 3000,
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
              <Typography fontWeight="bold"> UPLOAD DOCUMENT</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>

            <Grid item xs={6} md={4}>
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
            <Grid item xs={6} md={4}>
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
                    // fullWidth
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
            <Grid item xs={6} md={4}>
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
            <Grid item xs={6} md={4}>
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

            <Grid
              item
              xs={6}
              md={4}
              sx={{ display: "flex", justifyContent: "flex-center" }}
            >
              <Button
                variant="contained"
                size="small"
                component={isAddMissing ? undefined : "label"}
                sx={{
                  width: 130,
                  height: 40,
                  color: "white",
                  background:
                    "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                  fontSize: "0.79rem",
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

            {/* Checkbox Field */}
            <Grid item xs={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAddMissing}
                    onChange={(e) => setIsAddMissing(e.target.checked)}
                    size="medium"
                    sx={{ color: "rgb(0, 90, 91)" }}
                  />
                }
                label="Add Missing Document"
              />
            </Grid>

            <Grid item xs={12} style={{ height: 450, paddingBottom: 40 }}>
              <DataGrid
                rows={updatedRows}
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

      {/* <MissingDocsModal
        open={openMissingModal}
        onClose={() => setOpenMissingModal(false)}
        openRow={selectedRow}
        subDocMap={subDocMap}
        onSaveMissingRows={({ rowId, selectedDocs }) => {
          setSubDoclist((prev) => {
            const existing = prev[rowId] || [];
            const merged = [
              ...existing,
              ...selectedDocs.map((name) => ({ NameMR: name })),
            ];

            const unique = merged.reduce((acc, doc) => {
              if (!acc.some((d) => d.NameMR === doc.NameMR)) acc.push(doc);
              return acc;
            }, []);

            return { ...prev, [rowId]: unique };
          });
        }}
        SaveUpdateButton="Save"
      /> */}
      <MissingDocsModal
        open={openMissingModal}
        onClose={() => setOpenMissingModal(false)}
        openRow={selectedRow}
        subDocMap={subDocMap}
        //  onSaveMissingRows={({ rowId, allDocs = [], selectedDocs = [] }) => {
        //   setSubDoclist((prev) => {
        //     const newList = allDocs.map((name) => ({
        //       NameMR: name,
        //       checked: selectedDocs.includes(name),
        //     }));

        //     return { ...prev, [rowId]: newList };
        //   });
        // }}
        onSaveMissingRows={({ rowId, selectedDocs }) => {
          setSubDoclist((prev) => ({
            ...prev,
            [rowId]: selectedDocs.map((name) => ({ NameMR: name })),
          }));
        }}
        SaveUpdateButton="Save"
      />

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
          Rehabilitation
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
              Add Rehabilitation
            </Button>
          </span>
        </Tooltip>
      </Grid>
      <Grid
        container
        item
        lg={12}
        component={Paper}
        sx={{ height: "76vh", width: "100%" }}
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
          rows={Documentlist}
          columns={Maincolumns}
          pagination
          paginationMode="server"
          rowCount={totalRows}
          pageSizeOptions={[limit]}
          paginationModel={{ page: currentPage, pageSize: limit }}
          onPaginationModelChange={(newModel) => setCurrentPage(newModel.page)}
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
      </Grid>
    </>
  );
};
export default UploadDocument;
