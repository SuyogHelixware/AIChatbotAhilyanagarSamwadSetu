import { GridToolbarQuickFilter, GridToolbarExport } from "@mui/x-data-grid";

function CustomToolbar() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px" }}>
      <GridToolbarQuickFilter
        quickFilterProps={{ debounceMs: 300 }}
        placeholder="Search..."
      />

      <GridToolbarExport
        csvOptions={{ fileName: "File", delimiter: "," }}
      />
    </div>
  );
}

export default CustomToolbar;
