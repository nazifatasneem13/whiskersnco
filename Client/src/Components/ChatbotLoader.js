import React from "react";
import { Dialog, DialogContent, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const ChatbotPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    // Go back to whatever page we came from
    navigate(-1);
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      fullWidth
      maxWidth="md" // Adjust width (sm, md, lg, xl) to your preference
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "8px",
        }}
      >
        {/* Close button in the top-right corner */}
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ padding: 0 }}>
        <iframe
          src="https://www.chatbase.co/chatbot-iframe/jjBSL01_Hf4kxGXbKAZYi"
          width="100%"
          style={{
            height: "70vh", // or "calc(100vh - some offset)"
            border: "none",
          }}
          title="Chatbase Bot"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotPage;
