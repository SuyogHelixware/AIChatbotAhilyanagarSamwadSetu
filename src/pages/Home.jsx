import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import * as React from "react";
import CountUp from "react-countup";
import { useThemeMode } from "../Dashboard/Theme";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  "Page A",
  "Page B",
  "Page C",
  "Page D",
  "Page E",
  "Page F",
  "Page G",
];

export default function Home() {
  const { checkAccess } = useThemeMode();

  const canAdd = checkAccess(11, "IsAdd");
  // const canEdit = checkAccess(11, "IsEdit");
  // const canDelete = checkAccess(11, "IsDelete");

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRadius: 3,
                height: 130,
                transition: "background-color 0.3s ease",
                alignItems: "center",
              }}
              elevation={1}
            >
              {/* Total Registered Users */}
              <Box display="flex" alignItems="center" gap={1}>
                <PersonOutlineIcon fontSize="large" />
                Total Registered Users
              </Box>
              <h2>
                <CountUp start={0} end={150} duration={2.75} separator="," />
              </h2>{" "}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRadius: 3,
                height: 130,
                transition: "background-color 0.3s ease",
                alignItems: "center",

                
              }}
              elevation={1}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <PeopleAltOutlinedIcon fontSize="large" />
              Total Gazetted Officers
              </Box>
              <h2>
                <CountUp start={0} end={80} duration={2.75} separator="," />
              </h2>{" "}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRadius: 3,
                height: 130,
                transition: "background-color 0.3s ease",
                                 alignItems: "center",

              }}
              elevation={1}
            >

              <Box display="flex" alignItems="center" gap={1}>
                <DescriptionOutlinedIcon fontSize="large" />
              Total Uploaded Document
              </Box>
              <h2>
                <CountUp start={0} end={18} duration={2.75} separator="," />
              </h2>{" "}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRadius: 3,
                height: 130,
                transition: "background-color 0.3s ease",
                                alignItems: "center",

              }}
              elevation={1}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <HomeWorkOutlinedIcon fontSize="large" />
              Total Department
              </Box>
              <h2>
                <CountUp start={0} end={3} duration={2.75} separator="," />
              </h2>{" "}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ borderRadius: 3, py: 3 }}>
              <BarChart
                series={[
                  { data: [35, 44, 30, 45, 30] },
                  { data: [51, 6, 20, 30, 60] },
                ]}
                xAxis={[
                  { data: ["Q1", "Q2", "Q3", "Q4", "Q5"], scaleType: "band" },
                ]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                height={280}
                colors={["#2196F3", "#9CD8C4"]}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ borderRadius: 3, py: 3 }}>
              <LineChart
                xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
                series={[
                  {
                    data: [2, 3, 5.5, 8.5, 1.5, 5, 1, 4, 3, 8],
                    showMark: ({ index }) => index % 2 === 0,
                  },
                ]}
                height={280}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ borderRadius: 3, py: 3 }}>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 6, label: "Total Department" },
                      { id: 1, value: 15, label: "Total Officers" },
                      { id: 2, value: 20, label: "Total Register Users" },
                    ],
                  },
                ]}
                height={280}
                colors={["#2196F3", "#3b97b3ff ", "#9CD8C4"]}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ borderRadius: 3, py: 3 }}>
              <BarChart
                series={[
                  { data: pData, label: "pv", id: "pvId" },
                  { data: uData, label: "uv", id: "uvId" },
                ]}
                xAxis={[{ data: xLabels, scaleType: "band" }]}
                height={280}
                colors={["#9CD8C4", "#2196F3"]}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
// import React from 'react';

// const Home = () => {
//     return (
//         <>

//         </>
//     );
// }

// export default Home;
