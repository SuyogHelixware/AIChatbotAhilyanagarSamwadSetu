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
  Card,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
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
import SearchIcon from "@mui/icons-material/Search";

export default function EmailSetup() {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loaderOpen, setLoaderOpen] = useState(false);

  //=====================================open List State====================================

  const [loading, setLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  // --------Sidebar -------------------------------------
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const fetchingRef = useRef(false);
  // ----------------------------------------------------
  const [attachmentLines, setAttachmentLines] = useState([]);
  const [fileName, setFileName] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const [DocEntry, setDocEntry] = useState("");
  const [searchTextList, setSearchTextList] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchListData = async () => {
    if (fetchingRef.current || !hasMore) return;
    fetchingRef.current = true;
    setLoading(true);
    const token = sessionStorage.getItem("BearerTokan");
    if (!token) {
      setLoading(false);
      fetchingRef.current = false;
      return;
    }

    try {
      setLoaderOpen(true);
      const response = await axios.get(`${BASE_URL}Email`, {
        params: {
          Page: page,
          Limit: 20,
          SearchText: debouncedSearch || "",
        },
        headers: {
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      });

      const newData = response.data.values;
      setLoaderOpen(false);

      if (newData.length === 0) {
        setHasMore(false);
      } else {
        // if (page === 0) {
        //   setListData(newData);
        // } else {
        //   setListData((prev) => [...prev, ...newData]);

        // }
        setListData((prev) => (page === 0 ? newData : [...prev, ...newData]));
      }
    } catch (error) {
      console.error(error);
      setLoaderOpen(false);
    }
    setLoaderOpen(false);

    setLoading(false);
    fetchingRef.current = false;
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTextList.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTextList]);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setListData([]);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchListData();
  }, [page]);

  useEffect(() => {
    setListData([]);
    setPage(0);
    setHasMore(true);
  }, []);

  const initial = {
    Subject: "",
    IsHtmlBody: "",
    BodyTemplate: "",
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name); // show name in UI

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result.split(",")[1];

      const newAttachment = {
        FileName: file.name,
        ContentType: file.type,
        Content: base64String,
      };

      // setAttachmentLines((prev) => [...prev, newAttachment]);
      setAttachmentLines([newAttachment]);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmitForm = async (data) => {
    // Validate To
    if (!data.To || data.To.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter To Recipient Email.",
      });
      return;
    }

    // Validate Subject
    if (!data.Subject || data.Subject.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Email Subject is required.",
      });
      return;
    }

    // Validate BodyTemplate (remove HTML tags check)
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = data.BodyTemplate || "";
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    if (!plainText.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Email body is required.",
      });
      return;
    }

    const payload = {
      CreatedDate: new Date().toISOString(),
      CreatedBy: sessionStorage.getItem("userId"),
      ToMail: String(data.To),
      CcMail: String(data.CC || ""),
      BccMail: String(data.BCC || ""),
      Subject: data.Subject,
      Body: data.BodyTemplate,
      IsHtmlBody: true,
      AttcLines: attachmentLines,
      IsSent: true,
    };

    console.log("Final Payload:", payload);
    // return;
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
          title: "Processing...",
          html: "E-Mail sending process started",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          timer: 3000,
        });

        reset(initial);
        setAttachmentLines([]);
        setFileName("");
        setPreviewHtml("");
        setEditorKey((prev) => prev + 1);
        setPage(0);
        setHasMore(true);
        setListData([]);
        fetchListData(0);
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
    <Box
      sx={{
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.mode === "light" ? "#F5F6FA" : "#080D2B",
      }}
    >
      {/* Header */}
      <Box
        py={0.6}
        border={"1px solid silver"}
        borderBottom={"none"}
        position={"relative"}
      >
        <Typography textAlign="center" fontWeight={600}>
          Send Email List
        </Typography>

        <IconButton
          edge="end"
          color="inherit"
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
      </Box>
      {/* -------------------------- */}
      {/* <TextField
        disabled
        size="small"
        placeholder="Search here..."
        value={searchTextList}
        onChange={(e) => setSearchTextList(e.target.value)}
        variant="outlined"
        sx={{
          elevation: 3,
          "& .MuiOutlinedInput-root": {
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? "#F5F6FA" : "#1e1e2f",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTextList && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  setSearchTextList("");
                  setPage(0);
                  setHasMore(true);
                  setListData([]);
                }}
                edge="end"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      /> */}

      {/* -------------------------- */}
      {/* Scrollable List */}
      <Box
        id="ListScroll"
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 1,
          border: "1px solid silver",
          pt: 2,
          scrollBehavior: "smooth",

          scrollbarWidth: "thin",
          scrollbarColor: "#888 transparent",

          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
        }}
        onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.target;

          if (
            scrollHeight - scrollTop - clientHeight < 5 &&
            hasMore &&
            !fetchingRef.current
          ) {
            setPage((prev) => prev + 1);
          }
        }}
      >
        {listData.map((item, index) => (
          <Card
            elevation={2}
            key={item.id || index}
            sx={{
              mb: 1.5,
              p: 2,
              borderRadius: 2,
              position: "relative",
              minHeight: 70,
              transition: "all 0.3s ease",

              "&:hover": {
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.grey[800],
                boxShadow: 6,
                transform: "translateY(-2px)",
              },
            }}
            onClick={() => setOldOData(item.Id)}
          >
            {/* Title */}
            <Tooltip title={item.ToMail} arrow>
              <Typography
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 12,
                  fontWeight: 600,
                  fontSize: 17,
                }}
              >
                {item.ToMail}
              </Typography>
            </Tooltip>
            {/* Total Count */}
            {/* Created Date */}
            <Typography
              sx={{
                position: "absolute",
                bottom: 8,
                left: 12,
                fontSize: 15,
                color: "primary.main",
              }}
            >
              {item.CreatedDate
                ? new Date(item.CreatedDate).toLocaleDateString("en-GB")
                : ""}
            </Typography>

            {/* Failed / Sent */}
            {/* <Typography
              sx={{
                position: "absolute",
                bottom: 8,
                right: 12,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              <Box component="span" sx={{ color: "error.main" }}>
              {item?.MsgFailedCnt ?? 0}
            </Box>
             || 
              <Box component="span" sx={{ color: "success.main" }}>
                {item?.IsSent ?? 0}
              </Box>
            </Typography> */}
          </Card>
        ))}

        {/* Loader */}
        {loading && (
          <Box textAlign="center" py={2}>
            <CircularProgress size={22} />
          </Box>
        )}

        {/* No More Data */}
        {!hasMore && (
          <Typography textAlign="center" py={2}>
            No More Data
          </Typography>
        )}
      </Box>
    </Box>
  );
  // ==============================
  const handlePreview = () => {
    const subject = getValues("Subject");
    const body = getValues("BodyTemplate");

    const previewTemplate = `
    <div style="font-family: Arial, sans-serif;">
      
      <div style="
        border-bottom:1px solid #ddd;
        padding-bottom:8px;
        margin-bottom:12px;
      ">
        <strong>Subject:</strong> ${subject || "(No Subject)"}
      </div>

      <div>
        ${body || "<p>No email body</p>"}
      </div>

    </div>
  `;

    setPreviewHtml(previewTemplate);
  };

  const setOldOData = async (Id) => {
    if (!Id) {
      return;
    }
    setPreviewHtml("");
    try {
      const token = sessionStorage.getItem("BearerTokan");
      const response = await axios.get(`${BASE_URL}Email?Id=${Id}`, {
        headers: {
          Authorization: token,
        },
      });

      const data = response.data.values;
      toggleDrawer();
      reset({
        ...data,
        BodyTemplate: data.Body || "",
        To: data.ToMail ? data.ToMail.split(",") : [],
        CC: data.CcMail ? data.CcMail.split(",") : [],
        BCC: data.BccMail ? data.BccMail.split(",") : [],
      });
      setEditorKey((prev) => prev + 1);
      setDocEntry(Id);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        text: "Your login session expired. Please login in again.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <>
      {/* ========================== */}

      {loading && <Loader open={loading} />}
      {loaderOpen && <Loader open={loaderOpen} />}

      {/* <Spinner open={loading} /> */}
      <Grid
        container
        width={"100%"}
        height="calc(98.5vh - 108px)"
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
              }, 
              position: "absolute",
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
              fontWeight={600}
            >
              Send Email
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
                <Box sx={{ height: "75vh", p: 1 }}>
                  {/* Compressed Accordion for Recipients */}
                  <Accordion
                    defaultExpanded={false}
                    sx={{
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      "&:before": { display: "none" },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon sx={{ color: "primary.main" }} />
                      }
                      sx={{
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
                          height: "54vh",
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
                                key={editorKey}
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
                                   height: 230px;
                                    overflow-y: auto;
                                     padding: 16px;
                                       `,
                                  },
                                }}
                              />
                            )}
                          />
                        </Box>

                        <Box
                          display="flex"
                          alignItems="center"
                          gap={2}
                          sx={{ p: 2 }}
                        >
                          <Button variant="outlined" component="label">
                            Attachment File
                            <input
                              type="file"
                              hidden
                              onChange={handleFileUpload}
                            />
                          </Button>
                          <Typography variant="body2">
                            {fileName ? `${fileName}` : "Attachment file"}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>

                    {/* ================= RIGHT : EMAIL PREVIEW ================= */}
                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={3}
                        sx={{
                          height: "54vh",
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
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                bottom: 0,
              }}
            >
              <Button
                size="small"
                onClick={() => {
                  reset(initial);
                  setAttachmentLines([]);
                  setFileName("");
                  setPreviewHtml("");
                  setEditorKey((prev) => prev + 1);
                  setDocEntry("");
                }}
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
                disabled={DocEntry}
              >
                SAVE
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
