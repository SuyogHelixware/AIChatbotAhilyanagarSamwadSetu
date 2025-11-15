// import React, { useState, useEffect } from "react";
// import { Collapse, IconButton, Box, Typography, Checkbox } from "@mui/material";
// import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";

// const CollapsibleMenuGrid = ({
//   menuList = [],
//   onSelectionChange,
//   existingSubMenus = [],
// }) => {
//   const [expandedRow, setExpandedRow] = useState(new Set());
//   const [selectedIds, setSelectedIds] = useState([]);

//   const toggleExpand = (id) => {
//     setExpandedRow((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) newSet.delete(id);
//       else newSet.add(id);
//       return newSet;
//     });
//   };
  
//   const handleCheck = (menu, subMenu = null, access = null) => {
//     setSelectedIds((prev) => {
//       let updated = new Set(prev);

//       const toggleIds = (ids, checked) => {
//         ids.forEach((id) => {
//           if (checked) updated.add(id);
//           else updated.delete(id);
//         });
//       };

//       // 🧠 Prevent selecting already pushed submenu or its access
//       if (subMenu && existingSubMenus.includes(subMenu.LineNum)) {
//         return Array.from(updated);
//       }
//       if (access && subMenu && existingSubMenus.includes(subMenu.LineNum)) {
//         return Array.from(updated);
//       }

//       // ✅ Parent Menu Clicked
//       if (menu && !subMenu && !access) {
//         const subIds = (menu.oSubMenus || [])
//           .filter((sub) => !existingSubMenus.includes(sub.LineNum)) // skip disabled
//           .map((sub) => sub.id);
//         const allIds = [menu.id, ...subIds];
//         const isParentChecked = allIds.every((id) => updated.has(id));
//         toggleIds(allIds, !isParentChecked);
//       }

//       // ✅ Submenu Clicked
//       else if (subMenu && !access) {
//         const allIds = [subMenu.id];
//         const isSubChecked = allIds.every((id) => updated.has(id));
//         toggleIds(allIds, !isSubChecked);

//         const allSubChecked = (menu.oSubMenus || [])
//           .filter((sub) => !existingSubMenus.includes(sub.LineNum))
//           .every((sub) => updated.has(sub.id));

//         if (allSubChecked) updated.add(menu.id);
//         else updated.delete(menu.id);
//       }

//       // ✅ Access-level Clicked
//       else if (access) {
//         const accessId = `${subMenu.id}_${access.LineNum}`;
//         if (updated.has(accessId)) updated.delete(accessId);
//         else updated.add(accessId);

//         const allAccessIds = (subMenu.oSubMenusSpeAccess || []).map(
//           (acc) => `${subMenu.id}_${acc.LineNum}`
//         );
//         const allAccessChecked = allAccessIds.every((id) => updated.has(id));
//         if (allAccessChecked) updated.add(subMenu.id);
//         else updated.delete(subMenu.id);
//       }

//       return Array.from(updated);
//     });
//   };

//   useEffect(() => {
//     if (onSelectionChange) {
//       onSelectionChange(selectedIds);
//     }
//   }, [selectedIds]);

//   useEffect(() => {
//     // expand all parent menus by default
//     const allMenuIds = new Set(menuList.map((menu) => menu.id));
//     setExpandedRow(allMenuIds);
//   }, [menuList]);

//   return (
//     <Box sx={{ width: "100%" }}>
//       {menuList.map((menu) => {
//         const isParentChecked = selectedIds.includes(menu.id);
//         return (
//           <Box
//             key={menu.id}
//             sx={{
//               mb: 1,
//               border: "1px solid #ddd",
//               borderRadius: 1,
//               p: 1,
//             }}
//           >
//             {/* Parent Menu */}
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               {Array.isArray(menu.oSubMenus) && menu.oSubMenus.length > 0 && (
//                 <IconButton size="small" onClick={() => toggleExpand(menu.id)}>
//                   {expandedRow.has(menu.id) ? (
//                     <KeyboardArrowDown />
//                   ) : (
//                     <KeyboardArrowRight />
//                   )}
//                 </IconButton>
//               )}
//               <Checkbox
//                 checked={isParentChecked}
//                 onChange={() => handleCheck(menu)}
//               />
//               <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                 {menu.Name}
//               </Typography>
//             </Box>

//             {/* SubMenus */}
//             <Collapse
//               in={expandedRow.has(menu.id)}
//               timeout="auto"
//               unmountOnExit
//             >
//               {/* <Collapse in={expandedRow === menu.id} timeout="auto" unmountOnExit> */}
//               {(menu.oSubMenus || []).map((sub) => {
//                 const isSubChecked = selectedIds.includes(sub.id);
//                 return (
//                   <Box key={sub.id} sx={{ pl: 5, py: 0.5 }}>
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <Checkbox
//                         checked={isSubChecked}
//                         onChange={() => handleCheck(menu, sub)}
//                         disabled={existingSubMenus.includes(sub.LineNum)} // ✅ correct
//                       />
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           textDecoration: existingSubMenus.includes(sub.LineNum)
//                             ? "line-through"
//                             : "none",
//                           color: existingSubMenus.includes(sub.LineNum)
//                             ? "gray"
//                             : "inherit",
//                         }}
//                       >
//                         {sub.Name}
//                       </Typography>
//                     </Box>

//                     {/* Special Access */}
//                     {(sub.oSubMenusSpeAccess || []).map((access) => {
//                       const accessId = `${sub.id}_${access.LineNum}`;
//                       const isAccessChecked = selectedIds.includes(accessId);
//                       return (
//                         <Box
//                           key={accessId}
//                           sx={{
//                             pl: 4,
//                             display: "flex",
//                             alignItems: "center",
//                           }}
//                         >
//                           <Checkbox
//                             checked={isAccessChecked}
//                             onChange={() => handleCheck(menu, sub, access)}
//                           />
//                           <Typography variant="body2" color="text.secondary">
//                             {access.Name}
//                           </Typography>
//                         </Box>
//                       );
//                     })}
//                   </Box>
//                 );
//               })}
//             </Collapse>
//           </Box>
//         );
//       })}
//     </Box>
//   );
// };

// export default CollapsibleMenuGrid;

 import React, { useState, useEffect, useMemo } from "react";
import { Collapse, IconButton, Box, Typography, Checkbox } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";

const CollapsibleMenuGrid = ({
  menuList = [],
  onSelectionChange,
  initialSelectedIds = [],
  disabledSubmenuIds = [],
}) => {
  const [expandedRow, setExpandedRow] = useState(new Set());
  const [selectedIds, setSelectedIds] = useState([]);

  const disabledSet = useMemo(
    () => new Set(disabledSubmenuIds.map((v) => Number(v))),
    [disabledSubmenuIds]
  );

  useEffect(() => {
    setSelectedIds(initialSelectedIds || []);
  }, [initialSelectedIds]);

  useEffect(() => {
    if (onSelectionChange) onSelectionChange(selectedIds);
  }, [selectedIds]);

  useEffect(() => {
    const allMenuIds = new Set(menuList.map((menu) => menu.id));
    setExpandedRow(allMenuIds);
  }, [menuList]);

  const toggleExpand = (id) => {
    setExpandedRow((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleCheck = (menu, sub = null, access = null) => {
    setSelectedIds((prev) => {
      const updated = new Set(prev);

      // ---- disable already selected submenu ----
      if (sub && disabledSet.has(Number(sub.LineNum))) return Array.from(updated);
      if (access && sub && disabledSet.has(Number(sub.LineNum)))
        return Array.from(updated);

      // Parent click
      if (menu && !sub && !access) {
        const subIds = (menu.oSubMenus || [])
          .filter((s) => !disabledSet.has(Number(s.LineNum)))
          .map((s) => s.id);
        const allIds = [menu.id, ...subIds];
        const allChecked = allIds.every((id) => updated.has(id));
        allIds.forEach((id) =>
          allChecked ? updated.delete(id) : updated.add(id)
        );
      }

      // Submenu click
      else if (sub && !access) {
        if (updated.has(sub.id)) updated.delete(sub.id);
        else updated.add(sub.id);
      }

      // Access click
      else if (access) {
        const accessId = `${sub.id}_${access.LineNum}`;
        if (updated.has(accessId)) updated.delete(accessId);
        else updated.add(accessId);
      }

      return Array.from(updated);
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      {menuList.map((menu) => (
        <Box
          key={menu.id}
          sx={{ mb: 1, border: "1px solid #ddd", borderRadius: 1, p: 1 }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {Array.isArray(menu.oSubMenus) && menu.oSubMenus.length > 0 && (
              <IconButton size="small" onClick={() => toggleExpand(menu.id)}>
                {expandedRow.has(menu.id) ? (
                  <KeyboardArrowDown />
                ) : (
                  <KeyboardArrowRight />
                )}
              </IconButton>
            )}
            <Checkbox
              checked={selectedIds.includes(menu.id)}
              onChange={() => handleCheck(menu)}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {menu.Name}
            </Typography>
          </Box>

          <Collapse in={expandedRow.has(menu.id)} timeout="auto" unmountOnExit>
            {(menu.oSubMenus || []).map((sub) => {
              const isChecked = selectedIds.includes(sub.id);
              const isDisabled = disabledSet.has(Number(sub.LineNum));

              return (
                <Box key={sub.id} sx={{ pl: 5, py: 0.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                      checked={isChecked}
                      onChange={() => handleCheck(menu, sub)}
                      disabled={isDisabled}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: isDisabled ? "line-through" : "none",
                        color: isDisabled ? "gray" : "inherit",
                      }}
                    >
                      {sub.Name}
                    </Typography>
                  </Box>

                  {(sub.oSubMenusSpeAccess || []).map((access) => {
                    const accessId = `${sub.id}_${access.LineNum}`;
                    const isAccessChecked = selectedIds.includes(accessId);
                    return (
                      <Box key={accessId} sx={{ pl: 4, display: "flex" }}>
                        <Checkbox
                          checked={isAccessChecked}
                          onChange={() => handleCheck(menu, sub, access)}
                          disabled={isDisabled}
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
      ))}
    </Box>
  );
};

export default CollapsibleMenuGrid;
