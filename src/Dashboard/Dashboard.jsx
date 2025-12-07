// import ApprovalIcon from "@mui/icons-material/Approval";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import CommentIcon from "@mui/icons-material/Comment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
// import GroupsIcon from "@mui/icons-material/Groups";
import GroupIcon from "@mui/icons-material/Group";
import LightModeIcon from "@mui/icons-material/LightMode";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import SettingsIcon from "@mui/icons-material/Settings";
import logoDarkTheme from "../assets/darkThemeLogo.png";
// import SmartphoneIcon from "@mui/icons-material/Smartphone";
// import EmailIcon from "@mui/icons-material/Email";
// import BusinessIcon from "@mui/icons-material/Business";
import DescriptionIcon from "@mui/icons-material/Description";
// import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
// import { MdMiscellaneousServices } from "react-icons/md";
import ChecklistIcon from "@mui/icons-material/Checklist";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import profile from "../assets/avtar.png";

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
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/ApaleSarkar.png";
import "../Dashboard/Dashboard.css";
// import avatar from "../assets/avtar.png";
import { isLogin } from "./Auth";

import { Tooltip } from "@mui/material";
import { useThemeMode } from "./Theme";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import DehazeIcon from "@mui/icons-material/Dehaze";
import PrintIcon from "@mui/icons-material/Print";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { keyframes } from "@mui/system";
import { useState } from "react";
import LoginPageLoader from "../pages/LoginPageLoader";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MarkChatReadOutlinedIcon from "@mui/icons-material/MarkChatReadOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const drawerWidth = 220;
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
  // background: "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",

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
  // const router = useLocation();
  const [open, setOpen] = React.useState(true);
  const [openList, setOpenList] = React.useState(false);
  const [on, setOn] = React.useState(false);
  const { themeMode, LightMode, DarkMode } = useThemeMode();
  const [loading, setLoading] = React.useState(true);
  const [openCollapse, setOpenCollapse] = React.useState(null);
  const [themestatus, setThemeStatus] = useState(() => {
    const CurrentTheme = localStorage.getItem("Theme");
    return CurrentTheme === "dark" ? false : true;
  });
  const [list, setList] = React.useState(false);
  const location = useLocation();

  const [openProcessTransactions, setOpenProcessTransactions] =
    React.useState(false);
  const [userType, setUserType] = useState(null);
  const { roleAccess } = useThemeMode();

  // const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [userData, setUserData] = React.useState({
    Name: "",
    Phone: "",
    Address: "",
    Email: "",
    Avatar: "",
    _id: "",
  });
  // Helper: toggle collapse (only one open at a time)
  const handleOpenCollapse = (menuLabel) => {
    setOpenCollapse((prev) => (prev === menuLabel ? null : menuLabel));
  };

  const allMenus = [
    // {
    //   label: "Dashboard",
    //   icon: <DashboardIcon />,
    //   path: "home",
    //   menuId: 1,
    // },
    // {
    //   label: "Sampadan Dashboard",
    //   icon: <DashboardIcon />,
    //   path: "BhusampadanDashboard",
    //   menuId: 1,
    // },
    // {
    //   label: "SJYGandhi Dashboard",
    //   icon: <DashboardIcon />,
    //   path: "SJYGandhiDashboard",
    //   menuId: 1,
    // },
    {
      label: "Dashboards",
      icon: <HomeOutlinedIcon />,
      menuId: 1,
      children: [
        {
          label: "Admin",
          icon: <DehazeIcon />,
          path: "home",

          menuId: 1,
        },
        {
          label: "Land Acquisition",
          icon: <DehazeIcon />,
          path: "LandAcquisition",
          menuId: 13,
        },
        {
          label: "Sanjay Gandhi",
          icon: <DehazeIcon />,
          path: "SJYGandhiDashboard",
          menuId: 14,
        },
      ],
    },
    {
      label: "User Creation",
      icon: <PersonOutlineIcon />,
      path: "manage-user",
      menuId: 3,
    },
    {
      label: "Role Creation",
      icon: <ManageAccountsOutlinedIcon />,
      path: "RoleCreation",
      menuId: 12,
    },
    //   {
    //   label: "Department",
    //   icon: <BusinessIcon />,
    //   path: "department",
    //    menuId: 6,
    // },
    //  {
    //   label: "Services",
    //   icon: <SmartphoneIcon />,
    //   path: "Services",
    //   allowed: ["A"],
    // },
    //  {
    //   label: "Offline Services",
    //   icon: <MiscellaneousServicesIcon />,
    //   path: "OfflineServices",
    //    menuId: 8,
    // },
    //  {
    //   label: "Online Services",
    //   icon: <MiscellaneousServicesIcon />,
    //   path: "OfflineServices",
    //    menuId: 7,
    // },
    //  {
    //   label: "Email Configuration",
    //   icon: <EmailIcon />,
    //   path: "EmailSetup",
    //   menuId: 2,
    // },
    {
      label: "Documents Master",
      icon: <DescriptionOutlinedIcon />,
      path: "ManageDocPage",
      menuId: 5,
    },
    // {
    //   label: "Documents Master",
    //   icon: <DescriptionIcon />,
    //   path: "DocumentMaster",
    //   menuId: 5,
    // },
    {
      label: "Gazetted Master",
      icon: <ChecklistIcon />,
      path: "Gazetted-Master",
      menuId: 4,
    },
    {
      label: "Upload Documents",
      icon: <DriveFolderUploadIcon />,
      path: "Upload-Document",
      menuId: 9,
    },
    {
      label: "Sanjay Gandhi",
      icon: <MarkChatReadOutlinedIcon />,
      path: "SanjayGandhi",
      menuId: 10,
    },
    {
      label: "Rehabilitation",
      icon: <CorporateFareIcon />,
      path: "Rehabilitation",
      menuId: 11,
    },
    //  {
    //   label: "LandAcquistion Report",
    //   icon: <DriveFolderUploadIcon />,
    //   path: "LandAcquistionReport",
    //   menuId: 9,
    // },
    //   {
    //   label: "SJY Gandhi Report",
    //   icon: <DriveFolderUploadIcon />,
    //   path: "SJYGandhiReport",
    //   menuId: 9,
    // },

    {
      label: "Reports",
      icon: <LocalPrintshopOutlinedIcon />,
      menuId: 5,
      children: [
        {
          label: "LandAcquistion",
          icon: <LocalPrintshopOutlinedIcon />,
          path: "LandAcquistionReport",
          menuId: 15,
        },
        {
          label: "Sanjay Gandhi",
          icon: <LocalPrintshopOutlinedIcon />,
          path: "SJYGandhiReport",
          menuId: 16,
        },
      ],
    },
  ];

  const handleOn = () => {
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

  const handleDrawerOpen = () => {
    setOpen(!open);
    handleClickTransaction();
    setOpenCollapse(null);
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
          {fullscreen ? <FullscreenIcon  sx={{ color: "white" }}  /> : <FullscreenExitIcon  sx={{ color: "white" }} />}
        </IconButton>
      ),
      name: "Screen Size",
    },
  ];

  React.useEffect(() => {
    const dataStr = sessionStorage.getItem("userData");
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        setUserType(data.UserType || "U");
      } catch {
        setUserType("U");
      }
    } else {
      setUserType("U");
    }
  }, []);

  const visibleMenus = React.useMemo(() => {
    if (!Array.isArray(roleAccess) || roleAccess.length === 0) return [];

    const allowedMenuIds = roleAccess
      .filter((item) => item.IsRead)
      .map((item) => item.MenuId);

    return allMenus
      .map((menu) => {
        if (menu.children) {
          const visibleChildren = menu.children.filter((child) =>
            allowedMenuIds.includes(child.menuId)
          );
          if (visibleChildren.length > 0)
            return { ...menu, children: visibleChildren };
          return null;
        }
        return allowedMenuIds.includes(menu.menuId) ? menu : null;
      })
      .filter(Boolean);
  }, [roleAccess]);

  //   const visibleMenus = React.useMemo(() => {
  //   if (!Array.isArray(roleAccess) || roleAccess.length === 0) return [];
  //   const allowedMenuIds = roleAccess
  //     .filter((item) => item.IsRead)
  //     .map((item) => item.MenuId);
  //   return allMenus.filter((menu) => allowedMenuIds.includes(menu.menuId));
  // }, [roleAccess]);
  // ===(below logic are if menuId not present in case visible menu)=======(Above logic if menuId not present to not visible all user this menu)===============

  // const visibleMenus = React.useMemo(() => {
  //   if (!Array.isArray(roleAccess) || roleAccess.length === 0) return [];

  //   const allowedMenuIds = roleAccess
  //     .filter((item) => item.IsRead)
  //     .map((item) => item.MenuId);

  //   //  - OR have no menuId at all (undefined / null)
  //   return allMenus.filter(
  //     (menu) =>
  //       !menu.menuId || allowedMenuIds.includes(menu.menuId)
  //   );
  // }, [roleAccess]);
  // =============================

  React.useEffect(() => {
    if (!Array.isArray(visibleMenus)) return;
    // find any menu that has children whose path matches current pathname
    const active = visibleMenus.find(
      (menu) =>
        Array.isArray(menu.children) &&
        menu.children.some((c) => location.pathname === `/dashboard/${c.path}`)
    );
    if (active) {
      setOpenCollapse(active.label);
    } else {
      // optional: close all if no child matches
      // setOpenCollapse(null);
    }
  }, [location.pathname, visibleMenus]);

  // const getButtonStyle = (isSelected) => ({
  //   "&.Mui-selected": {
  //     background:
  //       "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
  //     borderRadius: 1,
  //     "& .MuiListItemIcon-root, & .MuiTypography-root": {
  //       color: "#FFFFFF",
  //     },
  //   },
  //   "& .MuiListItemText-primary": {
  //     color: theme.palette.text.primary,
  //   },
  // });

  //  Show loader or nothing until userType known
  if (!userType) return null;

  return (
    <>
      {loading ? (
        <LoginPageLoader />
      ) : (
        <Box
          sx={{
            display: "flex",
            backgroundColor: (theme) => theme.palette.background.default,
          }}
        >
          <CssBaseline />
          <Modal open={on} onClose={handleClose}>
            <Paper elevation={7} sx={{ ...style, width: 300 }}>
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
                    src={profile}
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
                      background: "#2196F3",
                      //      background: (theme) =>
                      // theme.palette.customAppbar.appbarcolor || "#2196F3",

                      borderRadius: "3px",
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
                      alignItems={"start"}
                    >
                      <MenuItem sx={{ fontSize: 13 }}>
                        <b>Name : {userData.Name}</b>
                      </MenuItem>
                      <MenuItem sx={{ fontSize: 13, paddingTop: 0 }}>
                        <b>Mob :</b> {userData.Phone}
                      </MenuItem>
                      <MenuItem sx={{ fontSize: 13, paddingTop: 0 }}>
                        <b>Email :</b> {userData.Email}
                      </MenuItem>
                      <MenuItem sx={{ fontSize: 13, paddingTop: 0 }}>
                        <b>Gaz Officer :</b> {userData.GazOfficer}
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
                          boxShadow: 4,
                          borderRadius: 2,
                          background: "#2196F3",

                          color: "white",
                          fontSize: 11,
                          fontWeight: "bold",

                          "&:hover": {
                            background: "#2196F3",
                            color: "white",
                            boxShadow: 2,
                          },
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
                sx={{ color: "white", letterSpacing: "2px" }}
              >
                Ahilyanagar Samwad Setu
              </Typography>

              <SpeedDial
                ariaLabel="SpeedDial"
                direction="left"
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: 90,
                  "& .MuiFab-root": {
                    boxShadow: "none !important",
                    backgroundColor: "transparent !important",
                  },
                }}
                icon={<RotatingIcon />}
                FabProps={{
                  sx: {
                    background: "#2196F3",
                    color: "white",
                    "&:hover": {
                      background: "#2196F3",
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
                      background: "#2196F3",
                      color: "white",
                      "&:hover": {
                        background: "#bac7d3ff",
                      },
                    }}
                  />
                ))}
              </SpeedDial>

              <Tooltip title={userData.Username}>
                <IconButton
                  size="small"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleOn}
                  color="inherit"
                >
                  <Avatar
                    src={profile}
                    alt="User Logo"
                    sx={{ width: 40, height: 41 }}
                  />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>

          <Drawer variant="permanent" open={open} PaperProps={{ elevation: 2 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: 8,
              }}
            >
              <IconButton onClick={handleDrawerOpen}>
                <ChevronLeftIcon />
              </IconButton>
            </div>

            <Grid style={{ height: 90 }}>
              <img
                src={themestatus ? logo : logoDarkTheme}
                alt="logo"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  paddingTop: 10,
                }}
              />
            </Grid>

            <Grid
              sx={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                "&:hover": { overflowY: "auto", scrollbarWidth: "thin" },
              }}
            >
              {visibleMenus.map((menu) => {
                const hasChildren =
                  Array.isArray(menu.children) && menu.children.length > 0;

                if (hasChildren) {
                  return (
                    <div key={menu.label}>
                      <ListItemButton
                        onClick={() => handleOpenCollapse(menu.label)}
                        sx={{ pl: 1.5 }}
                      >
                        <ListItemIcon
                          sx={{ minWidth: "36px", marginRight: "8px" }}
                        >
                          {menu.icon}
                        </ListItemIcon>
                        <ListItemText primary={menu.label} />
                        {openCollapse === menu.label ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItemButton>

                      <Collapse
                        in={openCollapse === menu.label}
                        timeout="auto"
                        unmountOnExit
                      >
                        {menu.children.map((sub) => (
                          <Link
                            to={`/dashboard/${sub.path}`}
                            key={sub.path}
                            className="link_style"
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              display: "block",
                            }}
                            // close the collapse when a child is clicked
                            onClick={() => setOpenCollapse(null)}
                          >
                            <ListItemButton
                              // sx={{ pl: 2 }}
                              selected={
                                location.pathname === `/dashboard/${sub.path}`
                              }
                              sx={{
                                pl: 1,
                                m: 1.5,
                                borderRadius: "8px",
                                "&.Mui-selected": {
                                  backgroundColor: "#e0e0e0", // grey bg
                                  // backgroundColor: "#EEF2F5",

                                  // backgroundColor: (theme) => theme.palette.custome.datagridcolor,

                                  color: "#1976d2", // blue text
                                },
                                "&.Mui-selected:hover": {
                                  backgroundColor: "#d5d5d5",
                                },
                              }}
                            >
                              <ListItemIcon
                                sx={{ minWidth: "36px", marginRight: "9px" }}
                              >
                                {sub.icon}
                              </ListItemIcon>
                              <ListItemText primary={sub.label} />
                            </ListItemButton>
                          </Link>
                        ))}
                      </Collapse>
                    </div>
                  );
                }

                // Normal, single menu (no children)
                return (
                  <Link
                    key={menu.path}
                    to={`/dashboard/${menu.path}`}
                    className="link_style"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                    }}
                    onClick={() => setOpenCollapse(null)}
                  >
                    <ListItemButton
                      selected={location.pathname === `/dashboard/${menu.path}`}
                      sx={{
                        m: 1,
                        pl: 1,
                        borderRadius: "8px",
                        "&.Mui-selected": {
                          backgroundColor: "#e0e0e0", // grey bg
                          color: "#1976d2", // blue text
                        },
                        "&.Mui-selected:hover": {
                          backgroundColor: "#EEF2F5",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: "35px", marginRight: "9px" }}
                      >
                        {menu.icon}
                      </ListItemIcon>
                      <ListItemText primary={menu.label} />
                    </ListItemButton>
                  </Link>
                );
              })}
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

            {/* <Grid
              style={{
                position: "fixed",
                bottom: "55px",
                right: "0px",
                transform: "translateZ(4px)",
                flexGrow: 1,
                zIndex: 99,
                background: "#2196F3",
              }}
            >
              <SpeedDial
                ariaLabel="SpeedDial"
                sx={{
                  position: "absolute",
                  bottom: 25,
                  right: 16,
                }}
                icon={<RotatingIcon />}
                FabProps={{
                  sx: {
                    background: "#2196F3",
                    color: "white",
                    "&:hover": {
                      background: "#2196F3",
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
                      background: "#2196F3",
                      color: "white",
                      "&:hover": {
                        background: "#bac7d3ff",
                      },
                    }}
                  />
                ))}
              </SpeedDial>
            </Grid> */}
            <Outlet />
          </Box>
        </Box>
      )}
    </>
  );
}
