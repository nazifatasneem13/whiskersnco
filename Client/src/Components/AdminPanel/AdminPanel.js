import React from "react";
import { Box } from "@mui/material";
import AdminNavBar from "./AdminNavBar";
import AdminFooter from "./AdminFooter";
import AdminScreen from "./AdminScreen";

const AdminPanel = () => {
  return (
    <Box
      sx={{
        width: "110vw", // Full viewport width
        height: "110vh", // Full viewport height
        display: "flex",
        flexDirection: "column", // Stack children vertically
        overflow: "hidden", // Prevent scrolling
      }}
    >
      <AdminNavBar />
      <Box
        sx={{
          flex: 1, // Take up remaining space between NavBar and Footer
          overflowY: "auto", // Allow scrolling for content
        }}
      >
        <AdminScreen />
      </Box>
      <AdminFooter />
    </Box>
  );
};

export default AdminPanel;
