import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Checkbox,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const MissingDocsModal = ({
  open,
  onClose,
  openRow,
  subDocMap,
  onSaveMissingRows,
  SaveUpdateButton = "Save",
}) => {
  const [modalRows, setModalRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // useEffect(() => {
  //   if (!openRow) return;
  //   const existingDocs = subDocMap[openRow.id] || [];
  //   // All rows in modal are either existing (non-editable) or new
  //   const rows = existingDocs.map((doc, idx) => ({
  //     id: `existing-${idx}`,
  //     NameMR: doc.NameMR,
  //     isNew: false,
  //   }));
  //   setModalRows(rows);
  //  }, [openRow, subDocMap]);

  useEffect(() => {
  if (!openRow) return;

  const rowId = openRow.id;
  const existingDocs = subDocMap[rowId] || [];

  const existingRows = existingDocs.map((doc, idx) => ({
    id: `existing-${idx}`,
    NameMR: doc.NameMR,
    isNew: false,
  }));

  setModalRows((prev) => {
    // Keep only custom rows from previous state
    const customRows = prev.filter((r) => r.isNew === true);

    // Merge existing + custom rows
    return [...existingRows, ...customRows];
  });
}, [openRow, subDocMap]);

   const handleAddRow = () => {
  const newRow = { id: `new-${Date.now()}`, NameMR: "", isNew: true };
  setModalRows((prev) => [...prev, newRow]);
  
};


  const handleCheckboxChange = (id, checked) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((rId) => rId !== id));
    }
  };


  const handleInputChange = (id, value) => {
    setModalRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, NameMR: value } : r))
    );
  };

 
  const handleSave = () => {
  const selectedDocs = modalRows
    .filter((r) => selectedRows.includes(r.id) && r.NameMR.trim() !== "")
    .map((r) => r.NameMR);

  onSaveMissingRows({
    rowId: openRow.id,
    selectedDocs
  });
  console.log("New" , selectedDocs);

  onClose();
};


  const columns = [
    {
      field: "select",
      headerName: "SELECT",
      width: 90,
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={(e) =>
            handleCheckboxChange(params.row.id, e.target.checked)
          }
        />
      ),
    },
    {
      field: "NameMR",
      headerName: "DOCUMENT",
      flex: 1,
      renderCell: (params) =>
        params.row.isNew ? (
          <TextField
            value={params.row.NameMR}
            onChange={(e) => handleInputChange(params.row.id, e.target.value)}
            fullWidth
            size="small"
          />
        ) : (
          <div>{params.row.NameMR}</div>
        ),
    },
  ];

  return (
    <Modal open={open} onClose={onClose} sx={{ backdropFilter: "blur(5px)" }}>
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 500,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflow: "auto",
          maxHeight: "90vh",
        }}
      >
        <Grid container spacing={3} padding={3} flexDirection="column">
          <Grid item xs={12} display="flex" justifyContent="space-between">
            <Typography fontWeight="bold">ADD MISSING DOCS</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleAddRow}
              sx={{
                height: 36,
                borderRadius: 1,
              }}
            >
              <AddIcon /> Add Row
            </Button>
          </Grid>

          <div style={{ height: 300, width: "100%", maxWidth: "100%" }}>
            <DataGrid
              rows={modalRows}
              columns={columns}
              pageSize={5}
              hideFooter
              getRowId={(row) => row.id}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: (theme) =>
                    theme.palette.custome.datagridcolor,
                },
                "& .MuiDataGrid-row:hover": {
                  boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)",
                },
                "& .disabled-row": {
                  pointerEvents: "auto",
                  opacity: 0.7,
                },
              }}
              className="datagrid-style"
            />
          </div>

          <Grid item xs={12} display="flex" justifyContent="end">
            <Button
              onClick={handleSave}
              sx={{
                p: 1,
                width: 80,
                color: "white",
                background:
                  "linear-gradient(to right, rgb(0, 90, 91), rgb(22, 149, 153))",
              }}
            >
              {SaveUpdateButton}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

export default MissingDocsModal;
