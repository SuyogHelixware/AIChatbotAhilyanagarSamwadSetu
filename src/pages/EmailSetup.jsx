import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";

import { Email, People } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Loader from "../components/Loader";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuButtonUnderline,
  MenuControlsContainer,
  RichTextEditor,
} from "mui-tiptap";
import EmailChipInput from "../components/EmailChipInput";
import Swal from "sweetalert2";
import { BASE_URL } from "../Constant";
import axios from "axios";

export default function EmailSetup() {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [SaveUpdateName, setSaveUpdateName] = useState("SAVE");
  //=====================================open List State====================================

  const [loading, setLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  const initial = {
    Subject: "",
    Body: "",
    IsHtmlBody: "",
    BodyTemplate:"",
    AttcLines: [],
    To: [],
    CC: [],
    BCC: [],
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const { control, handleSubmit, reset, setValue, watch, getValues } = useForm({
    defaultValues: initial,
  });

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(",")[1]; // remove data prefix
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitForm = async (data) => {
  
    const payload = {
       CreatedDate: new Date().toISOString(),
       CreatedBy: sessionStorage.getItem("userId"),
      ToMail: data.To,
      CcMail: data.CC || "",
      BccMail: data.BCC || "",
      Subject: data.Subject,
      Body: data.BodyTemplate,
      IsHtmlBody: true,
      // AttcLines: attachmentLines,
     
      IsSent: true,
      // AttachCnt: attachmentLines.length || [0],
    };

    console.log("Final Payload:", payload);

    try {
      const token = sessionStorage.getItem("BearerTokan");
      const formattedToken = token;

      setLoading(true);
      let response = await axios.post(`${BASE_URL}Email/Send`, payload, {
        headers: {
          Authorization: formattedToken,
  "Content-Type": "application/json",
        },
      });

      console.log("Campaign POST", response);
      setLoading(false);
      if (response.data.success) {
        Swal.fire({
          title: "Success!",
          text: "Email sent successfully",
          icon: "success",
          confirmButtonText: "Ok",
          timer: 1000,
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to send email",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error sending email:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while sending the email.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const sidebarContent = (
    <>
      <Grid
        item
        width={"100%"}
        py={0.5}
        alignItems={"center"}
        border={"1px solid silver"}
        borderBottom={"none"}
        position={"relative"}
        sx={{
          backgroundColor:
            theme.palette.mode === "light" ? "#F5F6FA" : "#080D2B",
        }}
      >
        <Typography
          textAlign={"center"}
          alignContent={"center"}
          height={"100%"}
        >
          Email Notification List
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="close"
          onClick={() => setDrawerOpen(false)}
          sx={{
            position: "absolute",
            right: "10px",
            top: "0px",
            display: { lg: "none", xs: "block" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Grid>

      <Grid
        container
        item
        width={"100%"}
        height={"100%"}
        border={"1px silver solid"}
        sx={{
          backgroundColor:
            theme.palette.mode === "light" ? "#F5F6FA" : "#080D2B",
        }}
      >
        <Grid item md={12} sm={12} width={"100%"} height={`100%`}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              px: 1,
              overflow: "scroll",
              overflowX: "hidden",
              typography: "body1",
            }}
            id="ListScroll"
          >
            <Grid
              item
              padding={1}
              md={12}
              sm={12}
              width={"100%"}
              sx={{
                position: "sticky",
                top: "0",
                backgroundColor:
                  theme.palette.mode === "light" ? "#F5F6FA" : "#080D2B",
              }}
            >
              {/* <SearchInputField
                onChange={(e) => handleOpenListSearch(e.target.value)}
                value={openListquery}
                onClickClear={handleOpenListClear}
              /> */}
            </Grid>
            {/* <InfiniteScroll
              style={{ textAlign: "center", justifyContent: "center" }}
              // dataLength={openListData.length}
              // hasMore={hasMoreOpen}
              // next={fetchMoreOpenListData}
              // loader={
              //   <BeatLoader 
              //     color={theme.palette.mode === "light" ? "black" : "white"}
              //   />
              // }
              scrollableTarget="ListScroll"
              endMessage={<Typography>No More Records</Typography>}
            > */}
            {/* {openListData.map((item, i) => (
                <CardComponent
                  key={i}
                  title={item.TemplateName}
                  subtitle={item.Email}
                  isSelected={selectedData === item.DocEntry}
                  searchResult={openListquery}
                />
              ))} */}
            {/* </InfiniteScroll> */}
          </Box>
        </Grid>
      </Grid>
    </>
  );
  // ==============================

  const handlePreview = () => {
    const html = getValues("BodyTemplate"); // get current editor HTML
    setPreviewHtml(html);
  };

  return (
    <>
      {/* ========================== */}

      {loading && <Loader open={loading} />}

      {/* <Spinner open={loading} /> */}
      <Grid
        container
        width={"100%"}
        height="calc(100vh - 110px)"
        position={"relative"}
        component={"form"}
        onSubmit={handleSubmit(handleSubmitForm)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <Grid
          container
          item
          height="100%"
          sm={12}
          md={6}
          lg={3}
          className="sidebar"
          sx={{
            position: { lg: "relative", xs: "absolute" },
            top: 0,
            left: 0,
            transition: "left 0.3s ease",
            zIndex: 1000,
            display: { lg: "block", xs: `${drawerOpen ? "block" : "none"}` },
          }}
        >
          {sidebarContent}
        </Grid>
        {/* User Creation Form Grid */}

        <Grid
          container
          item
          width="100%"
          height="100%"
          sm={12}
          md={12}
          lg={9}
          position="relative"
        >
          {/* Hamburger Menu for smaller screens */}

          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{
              display: {
                lg: "none",
              }, // Show only on smaller screens
              position: "absolute",
              // top: "10px",
              left: "10px",
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            // onClick={clearFormData}
            sx={{
              display: {}, // Show only on smaller screens
              position: "absolute",
              // top: "10px",
              right: "10px",
            }}
          >
            <AddIcon />
          </IconButton> */}

          <Grid
            item
            width={"100%"}
            py={0.5}
            alignItems={"center"}
            border={"1px solid silver"}
            borderBottom={"none"}
          >
            <Typography
              textAlign={"center"}
              alignContent={"center"}
              height={"100%"}
            >
              Email Notification
            </Typography>
          </Grid>

          <Grid
            container
            item
            width={"100%"}
            height={"100%"}
            border={"1px silver solid"}
          >
            <Grid
              container
              item
              padding={1}
              md={12}
              sm={12}
              height="calc(100% - 40px)"
              overflow={"scroll"}
              sx={{ overflowX: "hidden" }}
              position={"relative"}
            >
              <Box
                width={"100%"}
                sx={{
                  "& .MuiTextField-root": { m: 1 },
                }}
                noValidate
                autoComplete="off"
              >
                <Box sx={{ height: "80vh", p: 2 }}>
                  {/* Compressed Accordion for Recipients */}
                  <Accordion
                    defaultExpanded={false}
                    sx={{
                      // mb: 2,
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      "&:before": { display: "none" },
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon sx={{ color: "primary.main" }} />
                      }
                      sx={{
                        backgroundColor: theme.palette.grey[50],
                        borderRadius: 2,
                        "& .MuiAccordionSummary-content": {
                          alignItems: "center",
                        },
                      }}
                    >
                      <People sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        Recipients
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 1 }}>
                      <Grid container spacing={1}>
                        <Grid container spacing={2}>
                          <EmailChipInput
                            label="To"
                            name="To"
                            control={control}
                            theme={theme}
                          />

                          <EmailChipInput
                            label="CC"
                            name="CC"
                            control={control}
                            theme={theme}
                          />

                          <EmailChipInput
                            label="BCC"
                            name="BCC"
                            control={control}
                            theme={theme}
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                  <Grid item xs={12}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 1,
                        mt: 2,
                        mb: 2,
                        borderRadius: 1,
                        backgroundColor: theme.palette.grey[25],
                        width: "100%",
                        pr: 4,
                      }}
                    >
                      <Controller
                        name="Subject"
                        control={control}
                        rules={{
                          required: "Subject is required",
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            label="ADD SUBJECT"
                            placeholder="Enter mail subject"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Paper>
                  </Grid>
                  {/* Existing 50-50 Column Section */}
                  <Grid container spacing={2}>
                    {/* ================= LEFT : EMAIL BODY ================= */}
                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={3}
                        sx={{
                          height: "55vh",
                          borderRadius: 2,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {/* Header */}
                        <Box
                          sx={{
                            p: 2,
                            borderBottom: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Email sx={{ color: "primary.main" }} />
                            <Typography fontWeight={600}>EMAIL BODY</Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            flex: 1,
                            p: 2,
                            overflow: "auto",
                          }}
                        >
                          <Controller
                            name="BodyTemplate"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <RichTextEditor
                                extensions={[StarterKit]}
                                content={field.value}
                                onUpdate={({ editor }) => {
                                  field.onChange(editor.getHTML());
                                }}
                                renderControls={() => (
                                  <MenuControlsContainer>
                                    <MenuButtonBold />
                                    <MenuButtonItalic />
                                    <MenuButtonUnderline />
                                  </MenuControlsContainer>
                                )}
                                editorProps={{
                                  attributes: {
                                    style: `
                                   height: 300px;
                                    overflow-y: auto;
                                     padding: 16px;
                                       `,
                                  },
                                }}
                              />
                            )}
                          />
                        </Box>
                      </Paper>
                    </Grid>

                    {/* ================= RIGHT : EMAIL PREVIEW ================= */}
                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={3}
                        sx={{
                          height: "55vh",
                          p: 2,
                          borderRadius: 2,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography fontWeight={600}>EMAIL PREVIEW</Typography>

                        <Button
                          variant="contained"
                          size="small"
                          sx={{ mt: 1, alignSelf: "flex-start" }}
                          onClick={handlePreview}
                        >
                          Preview
                        </Button>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
                          {previewHtml ? (
                            <Box
                              dangerouslySetInnerHTML={{ __html: previewHtml }}
                            />
                          ) : (
                            <Typography color="text.secondary">
                              No email body to preview
                            </Typography>
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              px={2}
              sx={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                position: "sticky",
                bottom: 0,
              }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  sx={{
                    p: 1,
                    width: 80,
                    color: "white",
                    backgroundColor: theme.palette.Button.background,
                    "&:hover": {
                      transform: "translateY(2px)",
                      backgroundColor: theme.palette.Button.background,
                    },
                  }}
                >
                  {SaveUpdateName}
                </Button>

                {/* <Button variant="contained">SEND</Button> */}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
