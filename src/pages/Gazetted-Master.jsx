import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Button,
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
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { BASE_URL } from "../Constant";
import Loader from "../components/Loader";
import dayjs from "dayjs";

const GazettedMaster = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [OfficersList, setOfficersList] = React.useState([]);
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [ClearUpdateButton, setClearUpdateButton] = React.useState("RESET");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const limit = 20; 
  const originalDataRef = React.useRef(null);
  const firstLoad = React.useRef(true);

  // React Hook Form initialization
  const {
    
    handleSubmit,
    control,
    setValue,
    reset,
    // formState: {  },
  } = useForm({
    defaultValues: {
      Name: "",
      Status: 1,
    },
  });
  const clearFormData = () => {
    if (ClearUpdateButton === "CLEAR") {
      reset({
        Name: "",
        Status: 1,
      });
    }
    if (ClearUpdateButton === "RESET") {
      reset(originalDataRef.current);
    }
  };

  const handleClose = () => setOn(false);

  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setClearUpdateButton("CLEAR");
    clearFormData();
    setValue("Name", "");
    setOn(true);
  };

  const handleSubmitForm = async (formData) => {
    try {
      const payload = {
        UserId: sessionStorage.getItem("userId") ,
         CreatedDate: dayjs().format("YYYY-MM-DD"),
        CreatedBy: sessionStorage.getItem("userId"),
        ModifiedBy: sessionStorage.getItem("userId"),
 ModifiedDate: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS"),

        Id: null || formData.Id,
        Name: formData.Name,
      };
      let response;

      if (SaveUpdateButton === "SAVE") {
        setLoaderOpen(true);
        response = await axios.post(`${BASE_URL}GazOfficers`, payload);
      } else {
        if (!formData.Id) {
          Swal.fire({
            position: "center",
            icon: "error",
            toast: true,
            title: "Update Failed",
            text: "Invalid  ID",
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
        });

        if (!result.isConfirmed) {
          return;
        }

        setLoaderOpen(true);
        response = await axios.put(
          `${BASE_URL}GazOfficers/${formData.Id}`,
          payload
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
              ? "Gazetted officer Added Successfully"
              : "Gazetted officer Updated Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        handleClose();
        getAllOfficerList(currentPage, searchText);
      } else {
        throw new Error(response.data.message || "Unexpected error");
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
  };

  const getAllOfficerList = async (page = 0, searchText = "") => {
    try {
      setLoading(true);

      const params = {
        Status: 1,
        Page: page,
        ...(limit ? { Limit: limit } : {}),
        ...(searchText ? { SearchText: searchText } : {}),
      };

      const response = await axios.get(`${BASE_URL}GazOfficers`, { params });
      if (response.data && response.data.values) {
        setOfficersList(
          response.data.values.map((item, index) => ({
            ...item,
            id: item.Id,
          }))
        );
        // setTotalRows(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (firstLoad.current) {
      getAllOfficerList();
      firstLoad.current = false;
    }
  }, []);
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
            `${BASE_URL}GazOfficers/${rowData.Id}`
          );
          setLoaderOpen(false);
          if (response.data && response.data.success) {
            Swal.fire({
              position: "center",
              icon: "success",
              toast: true,
              title: "Gazetted Officer deleted successfully",
              showConfirmButton: false,
              timer: 1500,
            });
            getAllOfficerList(currentPage, searchText);
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

  const columns = [
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <strong>
          <IconButton
            color="primary"
            sx={{
              color: "rgb(0, 90, 91)", 
              "&:hover": {
                backgroundColor: "rgba(0, 90, 91, 0.1)", 
              },
            }}
            onClick={() => handleUpdate(params.row)}
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
      field: "srNo",
      headerName: "SR NO",
      width: 60,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.api.getSortedRowIds().indexOf(params.id) + 1,
    },
       {
      field: "Name",
      headerName: "Name",
      width: 600,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title={params.value || ""} arrow>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
  ];

  const handleUpdate = async (rowData) => {
    setSaveUpdateButton("UPDATE");
    setClearUpdateButton("RESET");
    setOn(true);
    try {
      setLoading(true);
      const apiUrl = `${BASE_URL}GazOfficers/${rowData.Id}`;
      const response = await axios.get(apiUrl);
      if (response.data && response.data.values) {
        const department = response.data.values;
        originalDataRef.current = department;
       
        reset({
          Id: department.Id ?? "",
          Name: department.Name ?? "",
          // Status: department.Status ?? "", 
        });
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
      <Modal
        open={on}
        onClose={handleClose}
        sx={{
          backdropFilter: "blur(5px)",
          // backgroundColor: "rgba(0, 0, 0, 0.3)",
          // zIndex: 1200,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: "90%",
            maxWidth: 400,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            justifyContent: "center",
            overflow: "auto",
            maxHeight: "90vh",
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
            marginBottom={"14px"}
            onSubmit={handleSubmit(handleSubmitForm)}
            component={"form"}
          >
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography fontWeight="bold" textAlign={"center"}>
                ADD GAZETTED
              </Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
            {/* <form onSubmit={handleSubmit(handleSubmitForm)}> */}

            <Grid item xs={12}>
              <Controller
                name="Name"
                control={control}
                defaultValue=""
                rules={{
                  required: "Name is required",
                  maxLength: {
                    value: 100,
                    message: "Name cannot exceed 100 characters",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Tooltip title={field.value || ""} arrow placement="top">
                    <TextField
                      {...field}
                      inputRef={field.ref}
                      label="ENTER OFFICER NAME"
                      size="small"
                      inputProps={{ maxLength: 100 }}
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  </Tooltip>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4} textAlign={"center"}></Grid>

            <Grid
              item
              xs={12}
              md={12}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                position: "absolute",
                bottom: 10,
                left: 10,
                right: 10,
                mt: "10px",
              }}
            >
              <Button
                size="small"
                onClick={() => clearFormData()} 
                sx={{
                  p: 1,
                  width: 80,
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
                {ClearUpdateButton}
              </Button>
              <Button
                type="submit"
                size="small"
                // onClick={handleSubmitForm}
                sx={{
                  marginTop: 1,
                  p: 1,
                  width: 80,
                  color: "white",
                  background:
                    "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                  boxShadow: 5,
                  "&:hover": {
                    transform: "translateY(2px)",
                    boxShadow: "0 2px 4px rgba(0, 90, 91, 0.2)",
                  },
                }}
              >
                {SaveUpdateButton}
              </Button>
            </Grid>
            {/* </form> */}
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
          Manage Gazetted Master
        </Typography>
      </Grid>
      <Grid container spacing={2} marginBottom={1} justifyContent="flex-end">
        <Grid textAlign={"end"} marginBottom={1}>
          <Button
            onClick={handleOnSave}
            type="text"
            size="medium"
            sx={{
              pr: 2,
              mb: 0,
              mt: 2,
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
            Add Gazetted
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        item
        lg={12}
        component={Paper}
        sx={{ height: "85vh", width: "100%" }}
      >
        <DataGrid
          className="datagrid-style"
          sx={{
            height: "100%",
            minHeight: "500px",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: (theme) => theme.palette.custome.datagridcolor,
            },
            "& .MuiDataGrid-row:hover": {
              boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)",
            },
          }}
          rows={OfficersList}
          columns={columns}
          pagination
          paginationMode="server"
          // rowCount={totalRows}
          // pageSizeOptions={[10, 20, 50]}
          paginationModel={{ page: currentPage, pageSize: limit }}
          onPaginationModelChange={(newModel) => {
            setCurrentPage(newModel.page);
            getAllOfficerList(newModel.page, searchText, newModel.pageSize);
          }}
          loading={loading}
          disableColumnFilter
          hideFooterSelectedRowCount
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
            setCurrentPage(0); // reset to first page when searching
            getAllOfficerList(0, quickFilterValue, limit);
          }}
          getRowId={(row) => row.Id} // Use database Id
        />
      </Grid>
    </>
  );
};
export default GazettedMaster;
