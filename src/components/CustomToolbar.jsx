import { GridToolbarQuickFilter, GridToolbarExport } from "@mui/x-data-grid";

function CustomToolbar() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px" }}>
       <GridToolbarExport
        csvOptions={{ fileName: "File", delimiter: "," }}
      />
      
      <GridToolbarQuickFilter
        quickFilterProps={{ debounceMs: 300 }}
        placeholder="Search..."
      />

     
    </div>
  );
}

export default CustomToolbar;
