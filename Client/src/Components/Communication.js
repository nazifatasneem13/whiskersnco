import React, { useState, useEffect, useCallback } from "react";
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
  IconButton,
  Tooltip,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block"; // Import Block Icon

const Communication = () => {
  const [adopterChats, setAdopterChats] = useState([]);
  const [adopteeChats, setAdopteeChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
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
        setAdopterChats(adopterData || []);

        // Fetch adoptee chats
        const adopteeResponse = await fetch(
          `http://localhost:4000/chats/adoptee-chat-list/${currentUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const adopteeData = await adopteeResponse.json();
        setAdopteeChats(adopteeData || []);
      } catch (error) {
        console.error("Fetch Chats Error:", error);
      }
    };

    fetchChats();
  }, [currentUser._id]);

  // Extract fetchMessages to reuse in multiple useEffect hooks
  const fetchMessages = useCallback(async () => {
    if (selectedChat) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:4000/messages/${selectedChat.chatId}?userId=${currentUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 403) {
          // Access blocked
          alert("You have been blocked by this user.");
          setSelectedChat(null);
          return;
        }
        const data = await response.json();
        setMessages(data || []);
      } catch (error) {
        console.error("Fetch Messages Error:", error);
      }
    }
  }, [selectedChat, currentUser._id]);

  // Fetch messages when selectedChat changes
  useEffect(() => {
    fetchMessages();
  }, [selectedChat, fetchMessages]);

  // Set up interval to fetch messages every 5 seconds when a chat is selected
  useEffect(() => {
    if (!selectedChat) return;

    const intervalId = setInterval(() => {
      fetchMessages();
    }, 5000); // 5,000 milliseconds = 5 seconds

    // Cleanup interval on component unmount or when selectedChat changes
    return () => clearInterval(intervalId);
  }, [selectedChat, fetchMessages]);

  // Handle selecting a chat
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/chats/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  // Handle status updates (including blocking)
  const handleStatusUpdate = async (status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/chats/update-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chatId: selectedChat.chatId,
            petId: selectedChat.petId,
            status,
            userId: currentUser._id, // Pass userId in the request body
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        if (status === "blocked") {
          // If blocked, reset the selected chat
          setSelectedChat(null);
        } else {
          window.location.reload();
        }
      } else {
        alert(data.error || "Failed to update status.");
      }
    } catch (error) {
      console.error("Update Status Error:", error);
    }
  };

  // Handle blocking a user (Only for Adoptees)
  const handleBlockUser = async () => {
    if (!selectedChat) return;

    const confirmBlock = window.confirm(
      `Are you sure you want to block ${selectedChat.email}? This action cannot be undone.`
    );
    if (!confirmBlock) return;

    // Use handleStatusUpdate with 'blocked' status
    await handleStatusUpdate("blocked");
  };

  // Determine if the current user is the adoptee in the selected chat
  const isAdoptee =
    selectedChat &&
    adopteeChats.some((chat) => chat.chatId === selectedChat.chatId);

  return (
    <Box sx={{ display: "flex", maxHeight: "auto" }}>
      <Box sx={{ width: "25%", borderRight: "1px solid #ddd", padding: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Chats
        </Typography>
        <Typography variant="subtitle1">Chat with Donator</Typography>

        <List>
          {adopterChats.map((chat) => (
            <ListItem
              key={chat.chatId}
              button
              onClick={() => handleChatSelect(chat)}
              selected={selectedChat?.chatId === chat.chatId}
            >
              <Avatar sx={{ marginRight: 2, bgcolor: adopterColor }}>
                {chat.name ? chat.name[0] : "A"}
              </Avatar>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {chat.name || "Unknown"}
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
        <List>
          {adopteeChats.map((chat) => (
            <ListItem
              key={chat.chatId}
              button
              onClick={() => handleChatSelect(chat)}
              selected={selectedChat?.chatId === chat.chatId}
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
          display: "flex",
          flexDirection: "column",
          maxHeight: "auto",
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

              {/* Block Button (Only for Adoptees) */}
              {isAdoptee && (
                <Tooltip title="Block User">
                  <IconButton
                    color="error"
                    onClick={handleBlockUser}
                    sx={{ marginLeft: 2 }}
                  >
                    <BlockIcon />
                  </IconButton>
                </Tooltip>
              )}
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
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
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
