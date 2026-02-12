import {
  Box,
  Paper,
  Grid,
  Typography,
  Divider,
  Button,
  IconButton,
  Autocomplete,
  Tooltip,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import InputTextField, {
  InputDescriptionField,
  InputTextFieldTitle,
} from "../components/Component";
import { useTheme } from "@mui/styles";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";
import Swal from "sweetalert2";
export default function UserCreation() {
  const { control, handleSubmit, getValues, reset, setValue, watch } =
    useForm();

  const theme = useTheme();

  const hasFetched = useRef(false);

  const [allTemplates, setAllTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);

  const getMessageTemplates = async () => {
    try {
      const response = await axios.request({
        method: "get",
        maxBodyLength: Infinity,
        url: "/v3/707885182274627/message_templates",
        params: {
          fields: "name,components,language",
        },
        headers: {
          apikey: "8552af6c-8c67-11f0-98fc-02c8a5e042bd",
        },
      });

      const templates = response?.data?.data || [];
      setAllTemplates(templates);
      console.log("Full Response:", response.data);
    } catch (error) {
      console.error("Error fetching templates kt:", error);
    }
  };

  const handleTypeChange = (type) => {
    let result = [];

    if (type === "DOCUMENT") {
      result = allTemplates.filter((t) =>
        t.components?.some((c) => c.format === "DOCUMENT"),
      );
    }

    if (type === "IMG") {
      result = allTemplates.filter((t) =>
        t.components?.some((c) => c.format === "IMAGE"),
      );
    }

    if (type === "TEXT") {
      result = allTemplates.filter((t) =>
        t.components?.every((c) => c.type !== "HEADER"),
      );
    }

    setFilteredTemplates(result);
    setValue("template", null);
    setValue("Message", "");
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    getMessageTemplates();
  }, []);

  const handleSubmitForm = (data) => {
    const postObj = {
      title: data.Title,
      type: data.Type,
      templateName: data.template,
      message: data.Message,
    };

    console.log("POST OBJ:", postObj);

    // axios.post("/api/endpoint", postObj);
  };
const selectedType = watch("Type");

  return (
    <>
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
        elevation={1}
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
          Send Notifications
        </Typography>
      </Grid>
      <Box sx={{ p: 4 }}>
        <Paper
          sx={{
            maxWidth: 750,
            mx: "auto",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(handleSubmitForm)}
            sx={{
              p: 4,
              maxHeight: "70vh",
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                background: "#bbb",
                borderRadius: "8px",
              },
            }}
          >
            <Grid container spacing={3}>
              {/* ROW 1 */}
              <Grid item md={6} sm={6} xs={12}>
                <Controller
                  name="Title"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputTextFieldTitle
                      {...field}
                      label="ENTER TITLE"
                      id="Title"
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <Controller
                  name="MobileNoCSV"
                  control={control}
                  defaultValue={null}
                  rules={{
                    required: "CSV file is required",
                    validate: (file) =>
                      file?.type === "text/csv" ||
                      file?.name?.toLowerCase().endsWith(".csv") ||
                      "Only CSV files are allowed",
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      fullWidth
                      size="small"
                      label="UPLOAD MOBILE NO CSV FILE"
                      value={field.value?.name || ""}
                      placeholder="Choose file"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <Button
                            component="label"
                            variant="outlined"
                            size="small"
                            sx={{ ml: 1, textTransform: "none" }}
                          >
                            Upload
                            <input
                              type="file"
                              hidden
                              accept=".csv,.xls,.xlsx"
                              onChange={(e) => {
                                const file = e.target.files?.[0];

                                if (!file) {
                                  field.onChange(null);
                                  return;
                                }

                                const allowedMimeTypes = [
                                  "text/csv",
                                  "application/vnd.ms-excel",
                                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                ];

                                const allowedExtensions = [
                                  ".csv",
                                  ".xls",
                                  ".xlsx",
                                ];

                                const fileName = file.name.toLowerCase();

                                const isValid =
                                  allowedMimeTypes.includes(file.type) ||
                                  allowedExtensions.some((ext) =>
                                    fileName.endsWith(ext),
                                  );

                                if (!isValid) {
                                  Swal.fire({
                                    icon: "warning",
                                    title: "Invalid File Type",
                                    text: "Please upload only CSV or Excel files (.csv, .xls, .xlsx).",
                                    toast: true,
                                    position: "center",
                                    timer: 3000,
                                    showConfirmButton: false,
                                  });

                                  e.target.value = "";
                                  field.onChange(null);
                                  return;
                                }

                                field.onChange(file);
                              }}
                            />
                          </Button>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>        

                  {/* ROW 2 */}
              <Grid item md={6} sm={6} xs={12}>
                <Controller
                  name="Type"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => {
                    const options = [
                      { Name: "DOCUMENT" },
                      { Name: "IMG" },
                      { Name: "TEXT" },
                    ];

                    const selected =
                      options.find((o) => o.Name === field.value) || null;

                    return (
                      <Autocomplete
                        options={options}
                        getOptionLabel={(o) => o.Name}
                        value={selected}
                        isOptionEqualToValue={(o, v) => o?.Name === v?.Name}
                        onChange={(_, v) => {
                          const value = v ? v.Name : null;
                          field.onChange(value);
                          handleTypeChange(value);
                              if (value === "TEXT") {
            setValue("FileName", null);
          }
        
                        }}
                        
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="SELECT TYPE"
                            size="small"
                            fullWidth
                          />
                        )}
                      />
                    );
                  }}
                />
              </Grid>
              {(selectedType === "DOCUMENT" || selectedType === "IMG") && (
                 <Grid item md={6} sm={6} xs={12}>
                <Controller
                  name="FileName"
                  control={control}
                  defaultValue={null}
                  rules={{
                    required: "File is required",
                    validate: (file) => {
                      if (!file) return true;

                      const allowedTypes = [
                        "application/pdf",
                        "image/jpeg",
                        "image/png",
                        "image/jpg",
                        "image/gif",
                        "image/bmp",
                        "image/webp",
                      ];

                      return (
                        allowedTypes.includes(file.type) ||
                        "Only PDF or Image files are allowed"
                      );
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      fullWidth
                      size="small"
                      label="ATTACH FILE"
                      value={field.value?.name || ""}
                      placeholder="Choose file"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <Button
                            component="label"
                            variant="outlined"
                            size="small"
                            sx={{ ml: 1, textTransform: "none" }}
                          >
                            Upload
                            <input
                              type="file"
                              hidden
                              accept=".pdf,image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];

                                if (!file) {
                                  field.onChange(null);
                                  return;
                                }

                                const allowedTypes = [
                                  "application/pdf",
                                  "image/jpeg",
                                  "image/png",
                                  "image/jpg",
                                  "image/gif",
                                  "image/bmp",
                                  "image/webp",
                                ];

                                if (!allowedTypes.includes(file.type)) {
                                  Swal.fire({
                                    icon: "warning",
                                    title: "Invalid File",
                                    text: "Please upload only PDF or Image files.",
                                    toast: true,
                                    position: "center",
                                    timer: 3000,
                                    showConfirmButton: false,
                                  });

                                  e.target.value = "";
                                  field.onChange(null);
                                  return;
                                }

                                field.onChange(file);
                              }}
                            />
                          </Button>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              )}

              <Grid item md={6} sm={6} xs={12}>
                <Controller
                  name="template"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => {
                    const options = filteredTemplates.map((t) => ({
                      Name: t.name,
                      template: t,
                    }));

                    const selected =
                      options.find((o) => o.Name === field.value) || null;

                    return (
                      <Autocomplete
                        options={options}
                        getOptionLabel={(o) => o.Name}
                        value={selected}
                        isOptionEqualToValue={(o, v) => o?.Name === v?.Name}
                        onChange={(_, v) => {
                          //  set template name in form
                          field.onChange(v ? v.Name : null);

                          //  BODY text → MESSAGE
                          if (v?.template?.components) {
                            const bodyComponent = v.template.components.find(
                              (c) => c.type === "BODY",
                            );

                            setValue("Message", bodyComponent?.text || "", {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                            console.log("Message", bodyComponent?.text);
                          } else {
                            setValue("Message", "", {
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="SELECT TEMPLATE"
                            size="small"
                            fullWidth
                          />
                        )}
                      />
                    );
                  }}
                />
              </Grid>

              {/* MESSAGE */}
              <Grid item xs={12}>
                <Controller
                  name="Message"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="MESSAGE"
                      size="small"
                      multiline
                      rows={5}
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* FOOTER */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                size="small"
                onClick={() => reset()}
                sx={{
                  width: 80,
                  color: "#2196F3",
                  border: "1px solid #2196F3",
                  borderRadius: "8px",
                }}
              >
                Clear
              </Button>

              <Button
                size="small"
                type="submit"
                sx={{
                  width: 80,
                  color: "#fff",
                  backgroundColor: theme.palette.Button.background,
                  "&:hover": {
                    backgroundColor: theme.palette.Button.background,
                  },
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
