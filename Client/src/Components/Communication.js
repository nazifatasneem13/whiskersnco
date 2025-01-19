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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block"; // Import Block Icon
import ProfileModal from "./ProfileModal";
import ArchivedChats from "./ArchivedChats";
import axios from "axios";
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

  //review
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  //profile modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [archiveModalOpen, setarchiveModalOpen] = useState(false);
  const [archiveData, setarchiveData] = useState({});

  // Fetch profile data and open modal
  const handleOpenProfile = async (email) => {
    console.log("Email sent to backend:", email); // Debug log

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:4000/users/getuserprofile/profile`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfileData(response.data);
      setProfileModalOpen(true);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      if (error.response && error.response.status === 404) {
        alert("User profile not found.");
      } else {
        alert("An error occurred while fetching the profile.");
      }
    }
  };

  const handleCloseProfile = () => {
    setProfileModalOpen(false);
    setProfileData({});
  };
  const handleOpenArchive = async () => {
    setarchiveModalOpen(true);
  };
  const handleCloseArchive = () => {
    setarchiveModalOpen(false);
  };
  // Function to handle opening the review dialog
  const openReviewDialog = (status) => {
    setCurrentStatus(status);
    setReviewDialogOpen(true);
  };

  // Function to handle submitting the review
  const submitReview = async () => {
    if (reviewText.trim()) {
      await handleStatusUpdate(currentStatus, reviewText.trim()); // Include reviewText in the status update
    }
    setReviewDialogOpen(false);
    setReviewText("");
  };

  // Fetch adopter and adoptee chat lists and messages
  const fetchChatsAndMessages = useCallback(async () => {
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

      // Fetch messages if a chat is selected
      if (selectedChat) {
        const response = await fetch(
          `http://localhost:4000/messages/${selectedChat.chatId}?userId=${currentUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 403) {
          alert("You have been blocked by this user.");
          setSelectedChat(null);
          return;
        }
        const messagesData = await response.json();
        setMessages(messagesData || []);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }, [currentUser._id, selectedChat]);

  // Fetch chats and messages initially and every 5 seconds
  useEffect(() => {
    fetchChatsAndMessages(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchChatsAndMessages(); // Fetch every 5 seconds
    }, 5000);

    // Cleanup interval on component unmount or selectedChat change
    return () => clearInterval(intervalId);
  }, [fetchChatsAndMessages]);

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
  const handleStatusUpdate = async (status, review = "") => {
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
            review: review, // Ensure review is passed
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        window.location.reload();
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

    await handleStatusUpdate("blocked");
    window.location.reload();
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
        <Divider />

        <Typography
          variant="subtitle1"
          sx={{ marginTop: 8, padding: 2, cursor: "pointer", color: "blue" }}
          onClick={() => handleOpenArchive()}
        >
          Archived Chats
        </Typography>
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
            <Typography
              variant="h6"
              sx={{ padding: 2, cursor: "pointer", color: "blue" }}
              onClick={() => handleOpenProfile(selectedChat.email)}
            >
              {selectedChat.email}

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

              {/* Button for Adoptee to mark as "Sent" */}
              {adopteeChats.some(
                (chat) =>
                  chat.chatId === selectedChat.chatId &&
                  chat.status === "active" &&
                  selectedChat.status !== "sent"
              ) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => openReviewDialog("sent")}
                >
                  Sent
                </Button>
              )}

              {/* Button for Adopter to mark as "Delivered" */}
              {adopterChats.some(
                (chat) => chat.chatId === selectedChat.chatId
              ) &&
                selectedChat.status === "sent" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openReviewDialog("delivered")}
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
      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
      >
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder="Write your review here (max 200 words)"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            inputProps={{ maxLength: 200 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button onClick={submitReview} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <ProfileModal
        open={profileModalOpen}
        onClose={handleCloseProfile}
        profileData={profileData}
      />
      <ArchivedChats open={archiveModalOpen} onClose={handleCloseArchive} />
    </Box>
  );
};

export default Communication;
