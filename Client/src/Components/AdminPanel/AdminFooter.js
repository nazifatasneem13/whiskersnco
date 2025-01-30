import React from "react";
import { Box, Typography } from "@mui/material";

function AdminFooter() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "white",
        textAlign: "center",
        padding: 1,
        boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
      </Typography>
    </Box>
  );
}

export default AdminFooter;
