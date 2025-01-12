import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";

const Communication = () => {
  const [adopterChats, setAdopterChats] = useState([]); // Chats where user is adopter
  const [adopteeChats, setAdopteeChats] = useState([]); // Chats where user is adoptee
  const [selectedChat, setSelectedChat] = useState(null); // Currently selected chat
  const [messages, setMessages] = useState([]); // Messages for the selected chat
  const [messageInput, setMessageInput] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Fetch adopter and adoptee chat lists
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch adopter chats
        const adopterResponse = await fetch(
          `http://localhost:4000/chats/adopter-chat-list/${currentUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const adopterData = await adopterResponse.json();
        setAdopterChats(adopterData || []); // Ensure it's an array

        // Fetch adoptee chats
        const adopteeResponse = await fetch(
          `http://localhost:4000/chats/adoptee-chat-list/${currentUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const adopteeData = await adopteeResponse.json();
        setAdopteeChats(adopteeData || []); // Ensure it's an array
      } catch (error) {
        console.error("Fetch Chats Error:", error);
      }
    };

    fetchChats();
  }, []);

  // Fetch messages for the selected chat
  useEffect(() => {
    if (selectedChat) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `http://localhost:4000/messages/${selectedChat.chatId}`
          );
          const data = await response.json();
          setMessages(data || []); // Ensure it's an array
        } catch (error) {
          console.error("Fetch Messages Error:", error);
        }
      };

      fetchMessages();
    }
  }, [selectedChat]);

  // Handle selecting a chat
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      const response = await fetch("http://localhost:4000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: selectedChat.chatId,
          senderId: currentUser._id,
          content: messageInput,
        }),
      });

      const newMessage = await response.json();
      setMessages((prev) => [...prev, newMessage]);
      setMessageInput("");
    } catch (error) {
      console.error("Send Message Error:", error);
    }
  };

  // Handle status updates
  const handleStatusUpdate = async (status) => {
    try {
      const response = await fetch(
        `http://localhost:4000/chats/update-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: selectedChat.chatId,
            petId: selectedChat.petId,
            status,
          }),
        }
      );
    } catch (error) {
      console.error("Update Status Error:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar for Chat List */}
      <Box sx={{ width: "25%", borderRight: "1px solid #ddd", padding: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Chats
        </Typography>
        <Typography variant="subtitle1">Adopter Chats</Typography>
        <List>
          {adopterChats.map((chat) => (
            <ListItem
              key={chat.chatId}
              button
              onClick={() => handleChatSelect(chat)}
            >
              <Avatar sx={{ marginRight: 2 }}>
                {chat.name ? chat.name[0] : "?"}
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
          Adoptee Chats
        </Typography>
        <List>
          {adopteeChats.map((chat) => (
            <ListItem
              key={chat.chatId}
              button
              onClick={() => handleChatSelect(chat)}
            >
              <Avatar sx={{ marginRight: 2 }}>
                {chat.name ? chat.name[0] : "?"}
              </Avatar>
              <ListItemText
                primary={chat.name || "Unknown"}
                secondary={chat.email}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Chat Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedChat ? (
          <>
            <Typography variant="h6" sx={{ padding: 2 }}>
              Chat with {selectedChat.name}
            </Typography>
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                padding: 2,
                backgroundColor: "#f5f5f5",
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
                  }}
                >
                  <Paper
                    sx={{
                      padding: 1,
                      marginBottom: 1,
                      maxWidth: "60%",
                    }}
                  >
                    {message.content}
                  </Paper>
                </Box>
              ))}
            </Box>
            <Box sx={{ padding: 2, borderTop: "1px solid #ddd" }}>
              <TextField
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                fullWidth
                placeholder="Type your message..."
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </Box>
            <Box sx={{ padding: 2, display: "flex", gap: 2 }}>
              {/* Buttons for adoptee */}
              {adopteeChats.some(
                (chat) =>
                  chat.chatId === selectedChat.chatId &&
                  chat.status === "active" &&
                  selectedChat.status !== "sent" // Explicitly ensure it's not "sent"
              ) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleStatusUpdate("sent")}
                >
                  Sent
                </Button>
              )}

              {/* Buttons for adopter */}
              {adopterChats.some(
                (chat) => chat.chatId === selectedChat.chatId
              ) &&
                selectedChat.status === "sent" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleStatusUpdate("delivered")}
                  >
                    Delivered
                  </Button>
                )}

              <Button
                variant="contained"
                color="error"
                onClick={() => handleStatusUpdate("passive")}
              >
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", marginTop: 5 }}>
            Select a chat to start messaging
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Communication;
