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

  // Define color constants
  const senderColor = "#DCF8C6"; // Light green for sent messages
  const receiverColor = "#FFFFFF"; // White for received messages
  const adopterColor = "#3f51b5"; // Blue for Adopter
  const adopteeColor = "#f50057"; // Pink for Adoptee

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
  }, [currentUser._id]);

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
      window.location.reload();
    } catch (error) {
      console.error("Update Status Error:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", maxHeight: "auto" }}>
      {/* Sidebar for Chat List */}
      <Box sx={{ width: "25%", borderRight: "1px solid #ddd", padding: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Chats
        </Typography>
        <Typography variant="subtitle1">Chat with Donator</Typography>
        {/*current user is adopter here */}
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
                primary={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {chat.email || "Unknown"}
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        bgcolor: adopterColor,
                        borderRadius: "50%",
                        marginLeft: 1,
                      }}
                      title="Adopter"
                    />
                  </Box>
                }
                secondary={chat.email}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
          Chat with Adopters
        </Typography>
        {/*current user is adoptee here */}
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
                primary={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {chat.name || "Unknown"}
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        bgcolor: adopteeColor,
                        borderRadius: "50%",
                        marginLeft: 1,
                      }}
                      title="Adoptee"
                    />
                  </Box>
                }
                secondary={chat.email}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: "auto",

          maxHeight: "auto",
          flexDirection: "column",
        }}
      >
        {selectedChat ? (
          <>
            <Typography variant="h6" sx={{ padding: 2 }}>
              Chat with {selectedChat.email}{" "}
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  bgcolor: adopterChats.some(
                    (chat) => chat.chatId === selectedChat.chatId
                  )
                    ? adopterColor
                    : adopteeColor,
                  borderRadius: "50%",
                  marginLeft: 1,
                }}
                title={
                  adopterChats.some(
                    (chat) => chat.chatId === selectedChat.chatId
                  )
                    ? "Adopter"
                    : "Adoptee"
                }
              />
            </Typography>

            <Box
              sx={{
                padding: 2,
                display: "flex",
                gap: 2,
                backgroundColor: "#f8bbd0",
                justifyContent: "flex-end",
              }}
            >
              <Typography variant="h6" sx={{ padding: 2 }}>
                Status Update
              </Typography>
              {/* Buttons for adoptee */}
              {adopteeChats.some(
                (chat) =>
                  chat.chatId === selectedChat.chatId &&
                  chat.status === "active" &&
                  selectedChat.status !== "sent"
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

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                padding: 2,
                backgroundColor: "#f5f5f5",
                minHeight: "50vh",
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
                      position: "relative",
                    }}
                  >
                    <Typography variant="body2">{message.content}</Typography>
                    {message.timestamp && (
                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          bottom: 2,
                          right: 8,
                          color: "gray",
                        }}
                      >
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </Typography>
                    )}
                  </Paper>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                borderTop: "1px solid #ddd",
                padding: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                maxHeight: "auto",
                backgroundColor: "#f5f5f5",
              }}
            >
              <TextField
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                fullWidth
                placeholder="Type your message..."
                variant="outlined"
                multiline
                maxRows={4}
              />
              <Button
                onClick={handleSendMessage}
                variant="contained"
                color="primary"
                sx={{ height: "fit-content" }}
              >
                Send
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
