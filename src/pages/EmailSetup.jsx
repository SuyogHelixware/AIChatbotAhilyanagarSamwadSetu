import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import * as React from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../Constant";
import Loader from "../components/Loader";
import {
  InputPasswordFieldmd,
  InputTextFieldmd,
} from "../components/Component";
import { Controller, useForm } from "react-hook-form"; // Importing React Hook Form
import dayjs from "dayjs";

const EmailSetup = () => {
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("SAVE");
  const [ClearUpdateButton, setClearUpdateButton] = React.useState("CLEAR");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [StorId, setStoreId] = React.useState();
  const originalDataRef = React.useRef(null);
  const [existingMailPassword, setExistingMailPassword] = React.useState("");

  // React Hook Form initialization

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Id: null,
      MailFromName: "",
      MailFromEmail: "",
      EnableQueue: "N",
      MailDriver: "1",
      MailHost: "",
      MailPort: "",
      MailEncry: "",
      MailUsername: "",
      MailPassword: "",
    },
  });

  const clearFormData = () => {
    console.log("Clear Form Data Called:", ClearUpdateButton);

    if (ClearUpdateButton === "CLEAR") {
      reset({
        mailFromName: "",
        mailFromEmail: "",
        enableEmailQueue: "",
        mailDriver: "",
        mailHost: "",
        mailPort: "",
        enableEncryption: "",
        mailUsername: "",
        mailPassword: "",
      });
      setValue("MailFromName", "");
      setValue("MailFromEmail", "");
      setValue("EnableEmailQueue", "");
      setValue("MailDriver", "Mail");
      setValue("MailHost", "");
      setValue("MailPort", "");
      setValue("EnableEncryption", "");
      setValue("MailUsername", "");
      setValue("MailPassword", "");
    }
    if (ClearUpdateButton === "RESET") {
      reset(originalDataRef.current);
    }
  };
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  React.useEffect(
    () => {
      handleUpdate(); // Pass `obj` in the function call
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const handleSubmitForm = async (formData) => {
    console.log("Form Submitted:", formData);
  
    if (SaveUpdateButton === "UPDATE") {
      const result = await Swal.fire({
        text: "Do you want to Update...?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update it!",
      });
  
      if (!result.isConfirmed) return;
    }
  
    const payload = {
      Id: formData.Id || null,
      Status: "1",
      CreatedDate: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
      ModifiedDate: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
      MailFromName: formData.MailFromName || "",
      MailFromEmail: formData.MailFromEmail || "",
      EnableQueue: formData.EnableQueue || "",
      MailDriver: formData.MailDriver || "",
      MailHost: formData.MailHost || "",
      MailPort: parseInt(formData.MailPort || ""),
      MailEncry: parseInt(formData.MailEncry || ""),
      MailUsername: formData.MailUsername || "",
      MailPassword: formData.MailPassword || ""
    };
  
    // if (SaveUpdateButton === "UPDATE") {
    //   payload.MailPassword =
    //     formData.MailPassword && formData.MailPassword.trim() !== ""
    //       ? formData.MailPassword
    //       : existingMailPassword; // Use stored password if no new password is entered
    // } else {
    //   if (formData.MailPassword && formData.MailPassword.trim() !== "") {
    //     payload.MailPassword = formData.MailPassword;
    //   }
    // }
  
    try {
      let response;
      setLoading(true);
  
      if (SaveUpdateButton === "UPDATE") {
        response = await axios.put(`${BASE_URL}EmailSetup/${formData.Id}`, payload);
      } else {
        response = await axios.post(`${BASE_URL}EmailSetup`, payload);
      }
  
      setLoading(false);
  
      const { success, message, values } = response.data;
  
      if (success) {
        // if (values?.length > 0) {
        //   setExistingMailPassword(values[0].MailPassword);
        // }
  
        // setValue("MailPassword", "");
  
        Swal.fire({
          title: "Success!",
          text:
            SaveUpdateButton === "UPDATE"
              ? "Record Updated successfully"
              : "Record Added successfully",
          icon: "success",
          confirmButtonText: "Ok",
          timer: 1000,
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: message,
          icon: "warning",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error while saving:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an issue with the request. Please try again.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };
  

  const handleUpdate = async (rowData) => {
    setSaveUpdateButton("UPDATE");
    setClearUpdateButton("RESET");
    setOn(true);

    try {
      setLoading(true);
      const apiUrl = `${BASE_URL}EmailSetup/All`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.values.length > 0) {
        const emailSetup = response.data.values[0];

        originalDataRef.current = emailSetup;
        setExistingMailPassword(emailSetup.MailPassword); 

        setValue("Id", emailSetup.Id);
        setStoreId(emailSetup.Id);
        setValue("MailFromName", emailSetup.MailFromName);
        setValue("MailFromEmail", emailSetup.MailFromEmail);
        setValue("EnableQueue", emailSetup.EnableQueue);
        setValue("MailDriver", emailSetup.MailDriver);
        setValue("MailHost", emailSetup.MailHost);
        setValue("MailPort", emailSetup.MailPort);
        setValue("MailEncry", emailSetup.MailEncry);
        setValue("MailUsername", emailSetup.MailUsername);
        setValue("MailPassword", emailSetup.MailPassword)
        setValue("Status", emailSetup.Status);

      }
    } catch (error) {
      console.error("Error fetching email setup data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader open={loading} />}
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
          Email Configuration
        </Typography>
      </Grid>
      <Grid
        container
        item
        lg={12}
        spacing={2}
        sx={{ height: "77vh", width: "100%", justifyContent:"center" }}
        onSubmit={handleSubmit(handleSubmitForm)}
        component={"form"}
      >
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
          mt: 2,
          ml:3
        }}
        spacing={2}
        elevation={4}
      >
        <Grid item md={4} xs={12} textAlign={"center"}>
          <Controller
            name="MailFromName"
            control={control}
            rules={{
              required: "Mail from name is required",
            }}
            render={({ field, fieldState: { error } }) => (
              <InputTextFieldmd
                label="MAIL FROM NAME"
                type="text"
                // inputProps={{ maxLength: 254 }}
                {...field}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
        </Grid>
        <Grid item md={4} xs={12} textAlign={"center"}>
          <Controller
            name="MailFromEmail"
            control={control}
            rules={{
              required: "Mail from Email is required", // Field is required
            }}
            render={({ field, fieldState: { error } }) => (
              <InputTextFieldmd
                label="MAIL FROM EMAIL"
                type="text"
                {...field}
                // inputProps={{ maxLength: 8 }}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Controller
            name="EnableQueue"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Enable Email Queue"
                fullWidth
                size="small"
                sx={{ maxWidth: 350, height: 40 }} // Matching InputTextField
                {...field}
              >
                <MenuItem value="Y">Yes</MenuItem>
                <MenuItem value="N">No</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Controller
            name="MailDriver"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Mail Driver"
                fullWidth
                size="small"
                sx={{ maxWidth: 350, height: 40 }} // Matching InputTextField
                {...field}
              >
                <MenuItem value="Mail">Mail</MenuItem>
                <MenuItem value="SMTP">SMTP</MenuItem>
              </TextField>
            )}
          />
        </Grid>

        <Grid item md={4} xs={12} textAlign={"center"}>
          <Controller
            name="MailHost"
            control={control}
            rules={{
              required: "Mail Host is required", // Field is required
            }}
            render={({ field, fieldState: { error } }) => (
              <InputTextFieldmd
                label="Mail Host"
                type="text"
                {...field}
                // inputProps={{ maxLength: 8 }}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
        </Grid>
        <Grid item md={4} xs={12} textAlign={"center"}>
          <Controller
            name="MailPort"
            control={control}
            rules={{
              required: "Mail Port is required", // Field is required
            }}
            render={({ field, fieldState: { error } }) => (
              <InputTextFieldmd
                label="Mail Port"
                type="number"
                {...field}
                // inputProps={{ maxLength: 8 }}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Controller
            name="MailEncry"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Mail Encryption"
                fullWidth
                size="small"
                sx={{ maxWidth: 350, height: 40 }} // Matching InputTextField
                {...field}
              >
                <MenuItem value="0">None </MenuItem>
                <MenuItem value="1">Auto</MenuItem>
                <MenuItem value="2">SSL On Connect</MenuItem>
                <MenuItem value="3">Start TLS</MenuItem>
                <MenuItem value="4">Start TLS When Available</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid item md={4} xs={12} textAlign={"center"}>
          <Controller
            name="MailUsername"
            control={control}
            rules={{
              required: "Mail Username is required",
            }}
            render={({ field, fieldState: { error } }) => (
              <InputTextFieldmd
                label="Mail Username"
                type="text"
                {...field}
                // inputProps={{ maxLength: 8 }}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
        </Grid>
        <Grid item md={4} xs={12} textAlign={"center"}>
          <Controller
            name="MailPassword"
            control={control}
            // rules={{
            //   required: "Mail from Email is required", // Field is required
            // }}
            render={({ field, fieldState: { error } }) => (
              <InputPasswordFieldmd
                label="Mail Password"
                type={showPassword ? "text" : "Password"}
                showPassword={showPassword}
                onClick={handleClickShowPassword}
                {...field}
                // inputProps={{ maxLength: 8 }}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
          {/* {SaveUpdateButton === "UPDATE" && (
            <Typography fontSize={"small"} color={"red"}>
              Leave blank here to keep current Password
            </Typography>
          )} */}
        </Grid>
        </Grid>
        <Grid
          item
          px={1}
          // md={12}
          xs={12}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            position: "sticky",
            bottom: "0px",
            marginBottom: "1px",
          }}
        >
          <Button
            variant="contained"
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
            onClick={clearFormData}
          >
            {ClearUpdateButton}
          </Button>
          <Button
            variant="contained"
            type="submit"
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
      </Grid>
    </>
  );
};

export default EmailSetup;
