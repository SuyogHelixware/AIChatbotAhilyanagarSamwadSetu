 
 import React, { useState, useEffect, useMemo } from "react";
import { Collapse, IconButton, Box, Typography, Checkbox } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";

const CollapsibleMenuGrid = ({
  menuList = [],
  searchText,
  onSelectionChange,
  initialSelectedIds = [],
  disabledSubmenuIds = [],

  
}) => {
  // const [selected, setSelected] = useState(initialSelectedIds);

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

  //  const handleCheck = (submenu, parentMenu) => {
  //   if (disabledIds.includes(submenu.LineNum)) return;

  //   if (!selected.includes(submenu.LineNum)) {
  //     const payload = {
  //       ParentMenuId: parentMenu.Id,
  //       MenuId: submenu.Id,
  //       LineNum: submenu.LineNum,
  //       ParentMenu: parentMenu.Name,
  //       MenuName: submenu.Name,
  //       IsRead: true,
  //       IsAdd: true,
  //       IsEdit: true,
  //       IsDelete: false,
  //       oSpecialAccess: submenu?.oSubMenusSpeAccess || []
  //     };

  //     onSelect(payload);
  //     setSelected([...selected, submenu.LineNum]);
  //   }
  // };
  const filteredMenuList = useMemo(() => {
  if (!searchText) return menuList;

  const lower = searchText.toLowerCase();

  return menuList
    .map(menu => ({
      ...menu,
      oSubMenus: (menu.oSubMenus || []).filter(sub =>
        sub.Name.toLowerCase().includes(lower)
      ),
    }))
    .filter(menu =>
      menu.Name.toLowerCase().includes(lower) || (menu.oSubMenus?.length > 0)
    );
}, [menuList, searchText]);

  return (
    <Box sx={{ width: "100%" }}>
      {filteredMenuList.map((menu) => (
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
