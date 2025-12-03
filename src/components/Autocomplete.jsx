import React from "react";
import { Autocomplete, TextField, Tooltip } from "@mui/material";

// 🔁 Reusable Infinite Scroll List
const ListBoxLazy = React.forwardRef(function ListBoxLazy(props, ref) {
  const {
    children,
    loading,
    onLazyLoad,
    hasMore,
    page,
    pageSetter,
    search,
    ...other
  } = props;

  const handleScroll = (event) => {
    const list = event.currentTarget;
    const bottom = list.scrollHeight - (list.scrollTop + list.clientHeight);
    if (bottom < 30 && !loading && hasMore) {
      const next = page + 1;
      pageSetter(next);
      onLazyLoad({ page: next, search });
    }
  };

  return (
    <ul
      {...other}
      ref={ref}
      style={{ maxHeight: 240, overflow: "auto" }}
      onScroll={handleScroll}
    >
      {children}
    </ul>
  );
});

export default function LazyAutocomplete({
  id,
  field,
  value,
  list,
  displayField,
  disabled,
  width = 300,
  onSearch,
  searchValue,
  setRows,
  api,
  onLazyLoad,
  loading,
  page,
  setPage,
  hasMore,
    onChangeValue,   

}) {
  const selectedObj = list.find((x) => x[displayField] === value) || null;
 
//   const handleChange = (_, newValue) => {
//   if (!newValue) return;

//   const updatedValue = newValue[displayField];

//   // INTERNAL grid update
//   api.updateRows([{ id, [field]: updatedValue }]);
//   setRows((p) =>
//     p.map((r) =>
//       r.id === id ? { ...r, [field]: updatedValue } : r
//     )
//   );

//   // EXTERNAL callback (for parent)
//   if (typeof onChangeValue === "function") {
//     onChangeValue(newValue);
//   }
// };

const handleChange = (_, newValue, reason) => {

  // When click on  clear
  if (reason === "clear") {
    api.updateRows([{ id, [field]: "" }]);
    setRows((p) =>
      p.map((r) => (r.id === id ? { ...r, [field]: "" } : r))
    );

    if (onChangeValue) onChangeValue(null);
    return;
  }

  if (!newValue) return;

  const updatedValue = newValue[displayField];

  api.updateRows([{ id, [field]: updatedValue }]);
  setRows((p) =>
    p.map((r) =>
      r.id === id ? { ...r, [field]: updatedValue } : r
    )
  );

  if (onChangeValue) onChangeValue(newValue);
};

  return (
    <Tooltip title={value || ""} arrow placement="top">
      <Autocomplete
        // disablePortal
        disablePortal={false} // Allow dropdown to escape modal
        disabled={disabled}
        ListboxComponent={(props) => (
          <ListBoxLazy
            {...props}
            loading={loading}
            onLazyLoad={onLazyLoad}
            hasMore={hasMore}
            page={page}
            pageSetter={setPage}
            search={searchValue}
          />
        )}
        value={selectedObj}
        onChange={handleChange}
        /* Prevent Blank On Close */
        // onClose={() => {
        //   if (value) api.updateRows([{ id, [field]: value }]);
        // }}
        onClose={(_, reason) => {
  if (reason === "clear") return;  
}}

        options={list}
        getOptionLabel={(o) => o[displayField] || ""}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder={`Select ${field}...`}
            onChange={(e) => onSearch(e.target.value)}
          />
        )}
        sx={{ width }}
        loading={loading}
        PopperProps={{
           placement: "auto",  

          modifiers: [
            {
              name: "flip",
              enabled: true,  
            },
            {
              name: "preventOverflow",
              options: {
                boundary: "viewport",  
              },
            },
          ],
        }}
        
        renderOption={(props, option) => (
          <li
            {...props}
            style={{
              whiteSpace: "normal",
              wordWrap: "break-word",
              lineHeight: "18px",
              padding: "6px 8px",
            }}
          >
            {option[displayField]}
          </li>
        )}
        
        PaperProps={{
          style: {
            width: width + 250,
            maxWidth: width + 300,
            minWidth: width + 200,
            whiteSpace: "normal",
            wordWrap: "break-word",
          },
        }}
      />
    </Tooltip>
  );
}
