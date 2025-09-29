// import ApprovalIcon from "@mui/icons-material/Approval";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import CommentIcon from "@mui/icons-material/Comment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
// import GroupsIcon from "@mui/icons-material/Groups";
import LightModeIcon from "@mui/icons-material/LightMode";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import logoDarkTheme from "../assets/darkThemeLogo.png";
import SettingsIcon from "@mui/icons-material/Settings";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import DescriptionIcon from "@mui/icons-material/Description";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import { MdMiscellaneousServices } from "react-icons/md";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import ChecklistIcon from "@mui/icons-material/Checklist";

import {
  Avatar,
  Button,
  Collapse,
  Grid,
  MenuItem,
  Modal,
  Paper,
  useMediaQuery,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/ApaleSarkar.png";
import "../Dashboard/Dashboard.css";
// import avatar from "../assets/avtar.png";
import { Bunny_Image_URL } from "../Constant";
import { isLogin } from "./Auth";

import { Tooltip } from "@mui/material";
import { useThemeMode } from "./Theme";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { keyframes } from "@mui/system";
import { useState } from "react";
import LoginPageLoader from "../pages/LoginPageLoader";

const drawerWidth = 250;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100%)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      borderRight: "none",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      borderRight: "none",
    },
  }),
}));
const style = {
  position: "absolute",
  top: 15,
  right: 10,
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  marginTop: 7,
};

const rotateIcon = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled component with rotation animation
const RotatingIcon = styled(SettingsIcon)(({ theme }) => ({
  animation: `${rotateIcon} 5s linear infinite`,
}));

export default function Dashboard() {
  const [fullscreen, setFullscreen] = React.useState(false);
  const Navigate = useNavigate();

  const router = useLocation();
  const [open, setOpen] = React.useState(true);
  const [openList, setOpenList] = React.useState(false);
  const [on, setOn] = React.useState(false);
  const { themeMode, LightMode, DarkMode } = useThemeMode();
  const [loading, setLoading] = React.useState(true);
  const [themestatus, setThemeStatus] = useState(() => {
    const CurrentTheme = localStorage.getItem("Theme");
    return CurrentTheme === "dark" ? false : true;
  });

  // const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [userData, setUserData] = React.useState({
    Name: "",
    Phone: "",
    Address: "",
    Email: "",
    BloodGroup: "",
    Avatar: "",
    _id: "",
  });

  // const [openMenu, setOpenMenu] = React.useState(false);
  const [list, setList] = React.useState(false);

  const [openProcessTransactions, setOpenProcessTransactions] =
    React.useState(false);

  const handleOn = () => {
    // console.log(`${Bunny_Image_URL}/Users/${userData._id}/${userData.Avatar}`);
    setOn(true);
  };
  const handleClose = () => {
    setOn(false);
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ------------------Full Screen-------------------
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setFullscreen(false));
    }
  };
  // ---------------------------------------

  React.useEffect(() => {
    const userData = sessionStorage.getItem("userData");
    // console.log(JSON.parse(userData));
    setUserData(JSON.parse(userData));
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  //Use for Theme Storage
  React.useEffect(() => {
    const CurrentTheme = localStorage.getItem("Theme");

    if (CurrentTheme === "dark") {
      setThemeStatus(false);
      DarkMode(); // Apply dark mode immediately
    } else {
      setThemeStatus(true);
      LightMode(); // Apply light mode immediately
    }
  }, [DarkMode, LightMode]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [DarkMode, LightMode]);

  const themechange = () => {
    if (themestatus) {
      localStorage.setItem("Theme", "dark");
      DarkMode();
      setThemeStatus(false);
    } else {
      localStorage.setItem("Theme", "light");
      LightMode();
      setThemeStatus(true);
    }
  };

  const location = useLocation();

  const handleDrawerOpen = () => {
    // setDrawerOpen(true);
    setOpen(!open);
    handleClickTransaction();
  };

  const handleClickMasters = () => {
    if (!open) {
      setOpen(true);
    }
    setOpenList(!openList);
    if (openProcessTransactions) {
      setOpenProcessTransactions(!openProcessTransactions);
    }
    handleClickTransaction();
  };
  const handleClickTransaction = () => {
    setOpenProcessTransactions(!openProcessTransactions);
    if (openList) {
      setOpenList(!openList);
    } else if (list) {
      setList(!list);
    }
  };

  const menuId = "primary-search-account-menu";

  // const handleUploadProfile = () => {
  //   setOpen(true);
  // };

  React.useEffect(() => {
    if (!isLogin()) {
      Navigate("/");
    }
  });
  // const themeChange = (e) => {
  //   const themestatus = e.currentTarget.checked;
  //   if (themestatus) {
  //     DarkMode();
  //   } else {
  //     LightMode();
  //   }
  // };

  const actions = [
    {
      icon: (
        <IconButton
          size="large"
          aria-label="toggle theme"
          color="inherit"
          onClick={themechange}
        >
          {themeMode === "dark" ? <LightModeIcon /> : <ModeNightIcon />}
        </IconButton>
      ),
      name: "Change Theme",
    },

    {
      icon: (
        <IconButton onClick={toggleFullscreen}>
          {fullscreen ? <FullscreenIcon /> : <FullscreenExitIcon />}
        </IconButton>
      ),
      name: "Screen",
    },
  ];

  return (
    <>
      {loading ? (
        <LoginPageLoader />
      ) : (
        <Box
          sx={{
            display: "flex",
            //  backgroundColor: "#F5F6FA",
            backgroundColor: (theme) => theme.palette.background.default,
          }}
        >
          <CssBaseline />
          <Modal open={on} onClose={handleClose}>
            <Paper elevation={10} sx={{ ...style, width: 300 }}>
              <center>
                <Grid
                  container
                  item
                  height={"100%"}
                  width={"100%"}
                  justifyContent={"center"}
                  alignItems="center"
                  position="relative"
                >
                  <Avatar
                    alt="Avatar"
                    // src={`${Bunny_Image_URL}/Users/${userData._id}/${userData.Avatar}`}
                    sx={{
                      width: 80,
                      height: 80,
                      position: "absolute",
                      top: "calc(28% - 50px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 1,
                      border: "1px solid black",
                    }}
                  />
                  <Grid
                    item
                    height={100}
                    width={"100%"}
                    style={{
                      backgroundColor: "#5C5CFF",
                      background:
                        "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                    }}
                  />
                  <Paper
                    style={{
                      width: "270px",
                      marginTop: -40,
                      borderRadius: 10,
                      position: "relative",
                      marginLeft: 15,
                      marginRight: 15,
                      zIndex: 0,
                    }}
                  >
                    <Grid
                      paddingTop={7}
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                    >
                      <MenuItem sx={{ fontSize: 13 }}>
                        <b>Name : {userData.Username}</b>
                      </MenuItem>
                      {/* <MenuItem sx={{ fontSize: 13, paddingTop: 0 }}>
                        <b>Mob :</b> {userData.Phone}
                      </MenuItem> */}

                      <MenuItem sx={{ fontSize: 13, paddingTop: 0 }}>
                        <b>Email :</b> {userData.Email}
                      </MenuItem>
                    </Grid>

                    <Grid
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      paddingBottom={2}
                    >
                      <Button
                        onClick={() => {
                          Navigate("/");
                          sessionStorage.clear();
                        }}
                        sx={{
                          boxShadow: 9,
                          borderRadius: 10,
                          backgroundColor: "#70b2d9",

                          background:
                            "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",

                          color: "white",
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        Log Out
                      </Button>
                    </Grid>
                  </Paper>
                </Grid>
              </center>
            </Paper>
          </Modal>

          <AppBar position="fixed" open={open}>
            <Toolbar
              sx={{
                width: "100vw",
                backgroundColor: (theme) =>
                  theme.palette.customAppbar?.appbarcolor || "defaultColor",
                boxShadow: "0px 5px 7px rgba(0, 0, 0, 0.1)",
                elevation: 8,
                display: "flex",
              }}
            >
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  color: "white",
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                textAlign="center"
                width="100%"
                className="flash-animation"
                sx={{ elevation: 6, color: "white" }}
              >
                Ahilyanagar Samwad Setu
              </Typography>

              <Tooltip title={userData.Username}>
                <IconButton
                  size="small"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleOn}
                  color="inherit"
                >
                  <Avatar
                  // src={
                  //   `${Bunny_Image_URL}/Users/${userData._id}/${userData.Avatar}`
                  //   || (
                  //     <AccountCircle />
                  //   )
                  // }
                  />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open} PaperProps={{ elevation: 7 }}>
            <DrawerHeader>
              <IconButton>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Grid
              style={{
                height: 90,
                // backgroundColor: "white",
              }}
            >
              <img
                src={themestatus ? logo : logoDarkTheme} // Use logoDarkTheme for dark mode and logo for light mode
                alt="logo"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  paddingTop: 10,
                  // borderRadius:30,
                }}
              />
            </Grid>
            <Grid
              sx={{
                width: "100%",
                // maxWidth: 340,
                height: "100%",
                // backgroundColor: "White",
                overflow: "hidden",
                "&:hover": {
                  overflowY: "auto",
                  scrollbarWidth: "thin",
                  // scrollbarColor: "#888 transparent",
                },
              }}
            >
              <List
                sx={{
                  width: "100%",
                  maxWidth: 340,
                  height: "100%",
                  ...(open && {
                    margin: "0 0",
                  }),
                }}
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                <div className="dashboard-menu">
                  <Link to="home" className="link_style">
                    <ListItemButton
                      onClick={handleClickTransaction}
                      selected={location.pathname === "/dashboard/home"}
                      sx={{
                        "&.Mui-selected": {
                          background:
                            "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: "33px", marginRight: "8px" }}
                        onClick={handleDrawerOpen}
                      >
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Dashboard" />
                    </ListItemButton>
                  </Link>
                  <Link to="manage-user" className="link_style">
                    <ListItemButton
                      onClick={handleClickTransaction}
                      selected={location.pathname === "/dashboard/manage-user"}
                      sx={{
                        "&.Mui-selected": {
                          background:
                            "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: "33px", marginRight: "8px" }}
                        onClick={handleDrawerOpen}
                      >
                        <ManageAccountsIcon />
                      </ListItemIcon>
                      <ListItemText primary="User" />
                    </ListItemButton>
                  </Link>
                  {/* <Link to="department" className="link_style">
                    <ListItemButton
                      onClick={handleClickTransaction}
                      selected={location.pathname === "/dashboard/department"}
                      sx={{
                        "&.Mui-selected": {
                          background:
                            "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: "33px", marginRight: "8px" }}
                        onClick={handleDrawerOpen}
                      >
                        <BusinessIcon />
                      </ListItemIcon>
                      <ListItemText primary="Department" />
                    </ListItemButton>
                  </Link>

                  <Link to="Services" className="link_style">
                    <ListItemButton
                      onClick={handleClickTransaction}
                      selected={location.pathname === "/dashboard/Services"}
                      sx={{
                        "&.Mui-selected": {
                          background:
                            "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: "33px", marginRight: "8px" }}
                        onClick={handleDrawerOpen}
                      >
                        <SmartphoneIcon />
                      </ListItemIcon>
                      <ListItemText primary="Online Services" />
                    </ListItemButton>
                  </Link>

                  <Link to="OfflineServices" className="link_style">
                    <ListItemButton
                      onClick={handleClickTransaction}
                      selected={
                        location.pathname === "/dashboard/OfflineServices"
                      }
                      sx={{
                        "&.Mui-selected": {
                          background:
                            "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: "33px", marginRight: "8px" }}
                        onClick={handleDrawerOpen}
                      >
                        <MiscellaneousServicesIcon />
                      </ListItemIcon>
                      <ListItemText primary="Offline Services" />
                    </ListItemButton>
                  </Link>

                  <Link to="DocumentMaster" className="link_style">
                    <ListItemButton
                      onClick={handleClickTransaction}
                      selected={
                        location.pathname === "/dashboard/DocumentMaster"
                      }
                      sx={{
                        "&.Mui-selected": {
                          background:
                            "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: "33px", marginRight: "8px" }}
                        onClick={handleDrawerOpen}
                      >
                        <DescriptionIcon />
                      </ListItemIcon>
                      <ListItemText primary="Documents Master" />
                    </ListItemButton>
                  </Link>
                  <Link to="EmailSetup" className="link_style">
                    <ListItemButton
                      onClick={handleClickTransaction}
                      selected={location.pathname === "/dashboard/EmailSetup"}
                      sx={{
                        "&.Mui-selected": {
                          background:
                            "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: "33px", marginRight: "8px" }}
                        onClick={handleDrawerOpen}
                      >
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText primary="Email Configuration" />
                    </ListItemButton>
                  </Link> */}

                  <Link to="Gazetted-Master" className="link_style">
                    <ListItemButton
                      onClick={handleClickTransaction}
                      selected={
                        location.pathname === "/dashboard/Gazetted-Master"
                      }
                      sx={{
                        "&.Mui-selected": {
                          background:
                            "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: "33px", marginRight: "8px" }}
                        onClick={handleDrawerOpen}
                      >
                        <ChecklistIcon />
                      </ListItemIcon>
                      <ListItemText primary="Gazetted Master" />
                    </ListItemButton>
                  </Link>

                  <Link to="Upload-Document" className="link_style">
                    <ListItemButton
                      onClick={handleClickTransaction}
                      selected={
                        location.pathname === "/dashboard/Upload-Document"
                      }
                      sx={{
                        "&.Mui-selected": {
                          background:
                            "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: "33px", marginRight: "8px" }}
                        onClick={handleDrawerOpen}
                      >
                        <DriveFolderUploadIcon />
                      </ListItemIcon>
                      <ListItemText primary="Upload Documents" />
                    </ListItemButton>
                  </Link>
                  {/* <Link to="LoginPage1" className="link_style">
                    <ListItemButton
                      onClick={handleClickTransaction}
                      selected={
                        location.pathname === "../pages/LoginPage1.jsx"
                      }
                      sx={{
                        "&.Mui-selected": {
                          background:
                            "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: "33px", marginRight: "8px" }}
                        onClick={handleDrawerOpen}
                      >
                        <MiscellaneousServicesIcon />
                      </ListItemIcon>
                      <ListItemText primary="LoginPage1" />
                    </ListItemButton>
                  </Link>
                  <Link to="LoginPage2" className="link_style">
                    <ListItemButton
                      onClick={handleClickTransaction}
                      selected={
                        location.pathname === "/dashboard/LoginPage2"
                      }
                      sx={{
                        "&.Mui-selected": {
                          background:
                            "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: "33px", marginRight: "8px" }}
                        onClick={handleDrawerOpen}
                      >
                        <MiscellaneousServicesIcon />
                      </ListItemIcon>
                      <ListItemText primary="LoginPage2" />
                    </ListItemButton>
                  </Link>
                  <Link to="LoginPage3" className="link_style">
                    <ListItemButton
                      onClick={handleClickTransaction}
                      selected={
                        location.pathname === "/dashboard/LoginPage3"
                      }
                      sx={{
                        "&.Mui-selected": {
                          background:
                            "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: "33px", marginRight: "8px" }}
                        onClick={handleDrawerOpen}
                      >
                        <MiscellaneousServicesIcon />
                      </ListItemIcon>
                      <ListItemText primary="LoginPage3" />
                    </ListItemButton>
                  </Link>
                  <Link to="LoginPage4" className="link_style">
                    <ListItemButton
                      onClick={handleClickTransaction}
                      selected={
                        location.pathname === "/dashboard/LoginPage4"
                      }
                      sx={{
                        "&.Mui-selected": {
                          background:
                            "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: "33px", marginRight: "8px" }}
                        onClick={handleDrawerOpen}
                      >
                        <MiscellaneousServicesIcon />
                      </ListItemIcon>
                      <ListItemText primary="LoginPage4" />
                    </ListItemButton>
                  </Link> */}
                </div>
              </List>
            </Grid>
          </Drawer>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              ...(open && { width: `calc(100% - ${drawerWidth}px)` }),

              ...(!open && {
                width: theme.spacing(7),
                [theme.breakpoints.up("sm")]: {
                  width: theme.spacing(9),
                },
              }),
            }}
          >
            <DrawerHeader />
            <Grid
              style={{
                position: "fixed",
                bottom: "55px",
                right: "0px",
                transform: "translateZ(4px)",
                flexGrow: 1,
                zIndex: 99,
                background:
                  "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
              }}
            >
              <SpeedDial
                ariaLabel="SpeedDial"
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                }}
                icon={<RotatingIcon />}
                FabProps={{
                  sx: {
                    background:
                      "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                    color: "white", // Ensures the icon is visible
                    "&:hover": {
                      background:
                        "linear-gradient(to right, rgb(0, 80, 81), rgb(20, 130, 135))", // Slightly darker on hover
                    },
                  },
                }}
              >
                {actions.map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    sx={{
                      background:
                        "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
                      color: "white",
                      "&:hover": {
                        background:
                          "linear-gradient(to right, rgb(0, 80, 81), rgb(20, 130, 135))",
                      },
                    }}
                  />
                ))}
              </SpeedDial>
            </Grid>

            <Outlet />
          </Box>
        </Box>
      )}
    </>
  );
}
