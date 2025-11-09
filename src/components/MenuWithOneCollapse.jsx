 

 import React, { useState, useEffect } from "react";
import {
  Collapse,
  IconButton,
  Box,
  Typography,
  Checkbox,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";

const CollapsibleMenuGrid = ({ menuList = [], onSelectionChange , existingSubMenus = [] }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

//   const handleCheck = (menu, subMenu = null, access = null) => {
//   setSelectedIds((prev) => {
//     let updated = new Set(prev);

//     const toggleIds = (ids, checked) => {
//       ids.forEach((id) => {
//         if (checked) updated.add(id);
//         else updated.delete(id);
//       });
//     };

//     if (menu && !subMenu && !access) {
//       // 🔹 Parent checked → toggle parent + all subMenus (❌ NOT special access)
//       const subIds = (menu.oSubMenus || []).map((sub) => sub.id);
//       const allIds = [menu.id, ...subIds];
//       const isParentChecked = allIds.every((id) => updated.has(id));

//       toggleIds(allIds, !isParentChecked);
//     } 
//     else if (subMenu && !access) {
//       // 🔹 SubMenu checked → toggle only submenu (❌ NOT its special accesses)
//       const allIds = [subMenu.id];
//       const isSubChecked = allIds.every((id) => updated.has(id));

//       toggleIds(allIds, !isSubChecked);

//       // 🔹 Update parent checked status
//       const allSubChecked = (menu.oSubMenus || []).every((sub) =>
//         updated.has(sub.id)
//       );
//       if (allSubChecked) updated.add(menu.id);
//       else updated.delete(menu.id);
//     } 
//     else if (access) {
//       // 🔹 Single special access toggle only itself
//       const accessId = `${subMenu.id}_${access.LineNum}`;
//       if (updated.has(accessId)) updated.delete(accessId);
//       else updated.add(accessId);

//       // Optional: Update submenu checked state
//       const allAccessIds = (subMenu.oSubMenusSpeAccess || []).map(
//         (acc) => `${subMenu.id}_${acc.LineNum}`
//       );
//       const allAccessChecked = allAccessIds.every((id) => updated.has(id));
//       if (allAccessChecked) updated.add(subMenu.id);
//       else updated.delete(subMenu.id);
//     }

//     return Array.from(updated);
//   });
// };

  // Notify parent when selection changes
 
  const handleCheck = (menu, subMenu = null, access = null) => {
  setSelectedIds((prev) => {
    let updated = new Set(prev);

    // helper
    const toggleIds = (ids, checked) => {
      ids.forEach((id) => {
        if (checked) updated.add(id);
        else updated.delete(id);
      });
    };

    // ✅ Prevent selecting already pushed submenu
    if (subMenu && existingSubMenus.includes(subMenu.Id)) {
      return Array.from(updated); // do nothing if submenu already added
    }

    if (menu && !subMenu && !access) {
      // Parent checked → toggle only submenus that are NOT already pushed
      const subIds = (menu.oSubMenus || [])
        .filter((sub) => !existingSubMenus.includes(sub.Id))
        .map((sub) => sub.id);
      const allIds = [menu.id, ...subIds];
      const isParentChecked = allIds.every((id) => updated.has(id));
      toggleIds(allIds, !isParentChecked);
    } 
    else if (subMenu && !access) {
      // SubMenu checked → only if not already added
      const allIds = [subMenu.id];
      const isSubChecked = allIds.every((id) => updated.has(id));
      toggleIds(allIds, !isSubChecked);

      const allSubChecked = (menu.oSubMenus || [])
        .filter((sub) => !existingSubMenus.includes(sub.Id))
        .every((sub) => updated.has(sub.id));

      if (allSubChecked) updated.add(menu.id);
      else updated.delete(menu.id);
    } 
    else if (access) {
      // Special access toggle
      const accessId = `${subMenu.id}_${access.LineNum}`;
      if (updated.has(accessId)) updated.delete(accessId);
      else updated.add(accessId);

      const allAccessIds = (subMenu.oSubMenusSpeAccess || []).map(
        (acc) => `${subMenu.id}_${acc.LineNum}`
      );
      const allAccessChecked = allAccessIds.every((id) => updated.has(id));
      if (allAccessChecked) updated.add(subMenu.id);
      else updated.delete(subMenu.id);
    }

    return Array.from(updated);
  });
};

 
 
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedIds);
    }
  }, [selectedIds]);

  return (
    <Box sx={{ width: "100%" }}>
      {menuList.map((menu) => {
        const isParentChecked = selectedIds.includes(menu.id);
        return (
          <Box
            key={menu.id}
            sx={{
              mb: 1,
              border: "1px solid #ddd",
              borderRadius: 1,
              p: 1,
              background: "#fafafa",
            }}
          >
            {/* Parent Menu */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {Array.isArray(menu.oSubMenus) && menu.oSubMenus.length > 0 && (
                <IconButton size="small" onClick={() => toggleExpand(menu.id)}>
                  {expandedRow === menu.id ? (
                    <KeyboardArrowDown />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </IconButton>
              )}
              <Checkbox
                checked={isParentChecked}
                onChange={() => handleCheck(menu)}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {menu.Name}
              </Typography>
            </Box>

            {/* SubMenus */}
            <Collapse in={expandedRow === menu.id} timeout="auto" unmountOnExit>
              {(menu.oSubMenus || []).map((sub) => {
                const isSubChecked = selectedIds.includes(sub.id);
                return (
                  <Box key={sub.id} sx={{ pl: 5, py: 0.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {/* <Checkbox
                        checked={isSubChecked}
                        onChange={() => handleCheck(menu, sub)}
                        
                      />
                      <Typography variant="body2">{sub.Name}</Typography> */}
                      <Checkbox
  checked={isSubChecked}
  onChange={() => handleCheck(menu, sub)}
  disabled={existingSubMenus.includes(sub.Id)} 
/>
<Typography
  variant="body2"
  sx={{
    textDecoration: existingSubMenus.includes(sub.Id)
      ? "line-through"
      : "none",
    color: existingSubMenus.includes(sub.Id) ? "gray" : "inherit",
  }}
>
  {sub.Name}
</Typography>
                    </Box>

                    {/* Special Access */}
                    {(sub.oSubMenusSpeAccess || []).map((access) => {
                      const accessId = `${sub.id}_${access.LineNum}`;
                      const isAccessChecked = selectedIds.includes(accessId);
                      return (
                        <Box
                          key={accessId}
                          sx={{
                            pl: 4,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Checkbox
                            checked={isAccessChecked}
                            onChange={() => handleCheck(menu, sub, access)}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {access.Name}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                );
              })}
            </Collapse>
          </Box>
        );
      })}
    </Box>
  );
};

export default CollapsibleMenuGrid;
