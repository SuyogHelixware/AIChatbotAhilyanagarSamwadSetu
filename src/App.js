import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";
import { ModeContextProvider, useThemeMode } from "./Dashboard/Theme";
import Routing from "./Routes/Routing.jsx";
import CustomCursor from "./components/CustomCursor.jsx";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976D2" },
    secondary: { main: "#f50057" },
    background: { default: "#EFF3F6", paper: "#F5F6FA" },
    text: { primary: "#333333", secondary: "#666666ff" },
    divider: "#dddddd",
    custome: { datagridcolor: "#e6f2fcff" },
    customAppbar: { appbarcolor: "#2196F3" },
    Button: { background: "#2196F3" },
    DHeaderbg: { background:"linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)" },
    DHeaderColor: { color: "#0d47a1" },


  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1976D2" },
    secondary: { main: "#f48fb1" },
    background: { default: "#171821", paper: "#21222D" },
    text: { primary: "#ffffff", secondary: "#bbbbbb" },
    divider: "#555555",
    custome: { datagridcolor: "#171821" },
    customAppbar: { appbarcolor: "#393A44" },
    Button: { background: "#393A44" },
        DHeaderbg: { background: "#393A44" },
        DHeaderColor: { color: "#fff" },


  },
});

// function App() {
//   const [themeMode, setThemeMode] = useState("light");

//   const LightMode = () => {
//     setThemeMode("light");
//   };

//   const DarkMode = () => {
//     setThemeMode("dark");
//   };
//   return (
//     <ModeContextProvider value={{ themeMode, LightMode, DarkMode }}>
//       <ThemeProvider theme={themeMode === "light" ? lightTheme : darkTheme}>
//         <div className="App">
//           <Routing/>
//         </div>
//       </ThemeProvider>
//     </ModeContextProvider>
//   );
// }
function ThemedApp() {
  const { themeMode } = useThemeMode();

  return (
    <ThemeProvider theme={themeMode === "light" ? lightTheme : darkTheme}>
      <div className="App">
        <Routing />
      </div>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ModeContextProvider>
      <ThemedApp />
            {/* <CustomCursor /> */}

    </ModeContextProvider>
  );
}
export default App;
