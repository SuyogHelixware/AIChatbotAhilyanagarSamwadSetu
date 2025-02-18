
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useState } from "react";
import "./App.css";
import { ModeContextProvider } from "./Dashboard/Theme";
import Routing from "./Routes/Routing.jsx";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976D2" },
    secondary: { main: "#f50057" },
    background: { default: "#F5F6FA", paper: "#F5F6FA"},
    text: { primary: "#333333", secondary: "#666666" },
    divider: "#dddddd",
    custome: { datagridcolor: "#E6E6FA" },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1976D2" },
    secondary: { main: '#f48fb1' },
    background: { default: "#171821", paper: "#21222D" },
    text: { primary: "#ffffff", secondary: "#bbbbbb" },
    divider: "#555555",
    custome: { datagridcolor: "#171821" },
    customAppbar: { appbarcolor: "#393A44" },
  },
});

function App() {
  const [themeMode, setThemeMode] = useState("light");

  const LightMode = () => {
    setThemeMode("light");
  };

  const DarkMode = () => {
    setThemeMode("dark");
  };
  return (
    <ModeContextProvider value={{ themeMode, LightMode, DarkMode }}>
      <ThemeProvider theme={themeMode === "light" ? lightTheme : darkTheme}>
        <div className="App">
          <Routing/>
        </div>
      </ThemeProvider>
    </ModeContextProvider>
  );
}
export default App;
