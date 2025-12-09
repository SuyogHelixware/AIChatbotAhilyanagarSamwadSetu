import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Paper, Grid, Button } from "@mui/material";
import DocumentMaster from "./DocumentMaster";
import SubDocumentMaster from "./SubDocumentMaster";

export default function ManageDocPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box >
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
          mb: 4,
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
          Manage Documents
        </Typography>
      </Grid>

      <Paper elevation={1} sx={{ borderRadius: 3 }}>
        {/* <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            justifyContent: "flex-start",
            pl: 4,
          }}
        >
          <Tab label="Main Document" sx={{ fontWeight: "bold" }} />
          <Tab label="Sub Document" sx={{ fontWeight: "bold" }} />
          
        </Tabs> */}

 <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons={false}
          sx={{
            px: 2,
            minHeight: 50,

            "& .MuiTabs-flexContainer": {
              gap: 1.5,
            },

            // Indicator becomes a glowing underline
            "& .MuiTabs-indicator": {
              height: 4,
              borderRadius: 1,
            },
          }}
        >
          <Tab
            label="Main Document"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              borderRadius: 1,
              px: 3,

              // Default State
              opacity: 0.7,
              transition: "all 0.25s ease",

              // Hover
              "&:hover": {
                background: "rgba(0,0,0,0.04)",
                opacity: 1,
              },

              // Selected
              "&.Mui-selected": {
                background: "rgba(25,118,210,0.1)",
                color: "primary.main",
                opacity: 1,
                boxShadow: "0px 1px 3px rgba(0,0,0,0.12)",
              },
            }}
          />

          <Tab
            label="Sub Document"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              borderRadius: 2,
              px: 3,
              opacity: 0.7,
              transition: "all 0.25s ease",
              "&:hover": {
                background: "rgba(0,0,0,0.04)",
                opacity: 1,
              },
              "&.Mui-selected": {
                background: "rgba(25,118,210,0.1)",
                color: "primary.main",
                opacity: 1,
                boxShadow: "0px 1px 3px rgba(0,0,0,0.12)",
              },
            }}
          />
        </Tabs>

        {activeTab === 0 && <DocumentMaster />}
        {activeTab === 1 && <SubDocumentMaster />}

      </Paper>
    </Box>
  );
}
 