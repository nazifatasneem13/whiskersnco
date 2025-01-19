import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Typography,
  Avatar,
  Button,
  Divider,
  Paper,
  Box,
} from "@mui/material";

const ArchivedChats = ({ open, onClose }) => {
  const [adopterChats, setAdopterChats] = useState([]);
  const [adopteeChats, setAdopteeChats] = useState([]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Define color constants
  const senderColor = "#DCF8C6"; // Light green for sent messages
  const receiverColor = "#FFFFFF"; // White for received messages
  const adopterColor = "#3f51b5"; // Blue for Adopter
  const adopteeColor = "#f50057"; // Pink for Adoptee

  // Fetch chats
  const fetchChats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch adopter chats
      const adopterResponse = await fetch(
        `http://localhost:4000/chats/archive-adopter-chat-list/${currentUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const adopterData = await adopterResponse.json();
      setAdopterChats(adopterData || []);

      // Fetch adoptee chats
      const adopteeResponse = await fetch(
        `http://localhost:4000/chats/archive-adoptee-chat-list/${currentUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const adopteeData = await adopteeResponse.json();
      setAdopteeChats(adopteeData || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }, [currentUser._id]);

  // Fetch messages
  const fetchMessages = useCallback(
    async (chatId) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:4000/messages/${chatId}?userId=${currentUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 403) {
          alert("You have been blocked by this user.");
          return;
        }

        const messagesData = await response.json();
        setMessages(messagesData || []);
      } catch (error) {
        console.error("Fetch Messages Error:", error);
      }
    },
    [currentUser._id]
  );

  useEffect(() => {
    fetchChats(); // Fetch chat lists on component mount
  }, [fetchChats]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat.chatId);
    setChatDialogOpen(true); // Open the chat dialog
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Archived Chats</DialogTitle>
      <DialogContent>
        {adopterChats.length === 0 && adopteeChats.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ marginTop: 2 }}>
            No chat exchanged between.
          </Typography>
        ) : (
          <>
            <Typography variant="subtitle1">Chat with Donator</Typography>
            <List>
              {adopterChats.map((chat) => (
                <ListItem
                  key={chat.chatId}
                  button
                  onClick={() => handleChatSelect(chat)}
                >
                  <Avatar sx={{ marginRight: 2, bgcolor: adopterColor }}>
                    {chat.name ? chat.name[0] : "A"}
                  </Avatar>
                  <ListItemText
                    primary={chat.name || "Unknown"}
                    secondary={chat.email}
                  />
                </ListItem>
              ))}
            </List>
            <Divider />
            <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
              Chat with Adopters
            </Typography>
            <List>
              {adopteeChats.map((chat) => (
                <ListItem
                  key={chat.chatId}
                  button
                  onClick={() => handleChatSelect(chat)}
                >
                  <Avatar sx={{ marginRight: 2, bgcolor: adopteeColor }}>
                    {chat.name ? chat.name[0] : "D"}
                  </Avatar>
                  <ListItemText
                    primary={chat.name || "Unknown"}
                    secondary={chat.email}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>

      {/* Chat Messages Dialog */}
      <Dialog
        open={chatDialogOpen}
        onClose={() => setChatDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedChat?.email || "Chat"}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              maxHeight: "50vh",
              overflowY: "auto",
              backgroundColor: "#f5f5f5",
              padding: 2,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message._id}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.senderId === currentUser._id
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: 1,
                }}
              >
                <Paper
                  sx={{
                    padding: 1,
                    maxWidth: "60%",
                    backgroundColor:
                      message.senderId === currentUser._id
                        ? senderColor
                        : receiverColor,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2">{message.content}</Typography>
                  <Typography variant="caption" color="gray">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ArchivedChats;
