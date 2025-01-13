import React from "react";
import { Container } from "@mui/material";
import AdminNavBar from "./AdminNavBar";
import AdminFooter from "./AdminFooter";
import AdminScreen from "./AdminScreen";

const AdminPanel = () => {
  return (
    <Container maxWidth="auto" sx={{ mt: 10, mb: 4 }}>
      <AdminNavBar />
      <AdminScreen />
      <AdminFooter />
    </Container>
  );
};

export default AdminPanel;
