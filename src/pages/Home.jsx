import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import * as React from "react";
import CountUp from "react-countup";

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
                "&:hover": {
                  // backgroundColor: "#A4C1FF",
                  // color:"white",
                },
              }}
              elevation={7}
            >
              Total Registered Users
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
                "&:hover": {
                  // backgroundColor: "#A4C1FF",
                  // color:"white",
                },
              }}
              elevation={7}
            >
              Total Gazetted Officers
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
                "&:hover": {
                  // backgroundColor: "#A4C1FF",
                  // color:"white",
                },
              }}
              elevation={7}
            >
               Total Uploaded Document
              <h2>
                <CountUp start={0} end={50} duration={2.75} separator="," />
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
                "&:hover": {
                  // backgroundColor: "#A4C1FF",
                  // color:"white",
                },
              }}
              elevation={7}
            >
             Total Services
              <h2>
                <CountUp start={0} end={60} duration={2.75} separator="," />
              </h2>{" "}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={7} sx={{ borderRadius: 3, py: 3 }}>
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
                colors={["#005A5B", "#9CD8C4"]}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={7} sx={{ borderRadius: 3, py: 3 }}>
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
            <Paper elevation={7} sx={{ borderRadius: 3, py: 3 }}>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 10, label: "series A" },
                      { id: 1, value: 15, label: "series B" },
                      { id: 2, value: 20, label: "series C" },
                    ],
                  },
                ]}
                height={280}
                colors={["#005A5B", "#338687 ", "#9CD8C4"]}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={7} sx={{ borderRadius: 3, py: 3 }}>
              <BarChart
                series={[
                  { data: pData, label: "pv", id: "pvId" },
                  { data: uData, label: "uv", id: "uvId" },
                ]}
                xAxis={[{ data: xLabels, scaleType: "band" }]}
                height={280}
                colors={["#9CD8C4", "#005A5B"]}
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
