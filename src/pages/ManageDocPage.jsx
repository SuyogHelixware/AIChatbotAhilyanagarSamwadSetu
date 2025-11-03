import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Paper, Grid } from "@mui/material";
import DocumentMaster from "./DocumentMaster";
import SubDocumentMaster from "./SubDocumentMaster";
 
export default function ManageDocumentsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box p={2}>
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
          padding={1}
          noWrap
        >
          Manage Documents
        </Typography>
      </Grid>

      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          textColor="primary"
          indicatorColor="primary"
        //   centered
          sx={{
      justifyContent: "flex-start", 
      pl: 4,
    }}
        >
          <Tab label="Document Master" sx={{ fontWeight: "bold" }} />
          <Tab label="Sub Document Master" sx={{ fontWeight: "bold" }} />
        </Tabs>

        {activeTab === 0 && <DocumentMaster  />}
        {activeTab === 1 && <SubDocumentMaster />}
      </Paper>
    </Box>
  );
}
