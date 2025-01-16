const Chat = require("../Model/Chat");
const Message = require("../Model/Message");
const User = require("../Model/user.model");
const AdoptForm = require("../Model/AdoptFormModel");

const Pet = require("../Model/PetModel");

const updateChatStatus = async (req, res) => {
  try {
    const { chatId, petId, status, userId } = req.body;

    // Validate required fields
    if (!chatId || !petId || !status || !userId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Validate status
    const validStatuses = ["active", "passive", "sent", "delivered", "blocked"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status." });
    }

    // Find the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    // Handle 'blocked' status
    if (status === "blocked") {
      // Verify that the userId is the adoptee in the chat
      if (chat.adopteeId.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ error: "Only adoptees can block adopters." });
      }

      const adopterId = chat.adopterId;

      // Fetch the adopter user
      const adopter = await User.findById(adopterId);
      if (!adopter) {
        return res.status(404).json({ error: "Adopter not found." });
      }

      // Check if already blocked
      if (adopter.blockedBy.includes(userId)) {
        return res.status(400).json({ error: "User is already blocked." });
      }

      // Add adoptee's ID to adopter's blockedBy array
      adopter.blockedBy.push(userId);

      await adopter.save();

      // Delete only AdoptForms related to the adopter for this petId
      const result = await Chat.deleteMany({
        petId: petId.toString(),
        adopteeId: userId,
        adopterId: adopterId,
      });
      console.log(
        `${result.deletedCount} AdoptForms deleted for petId ${petId} and email ${adopterEmail}`
      );

      //Hasblocked
      const adoptee = await User.findById(userId);
      if (!adoptee) {
        return res.status(404).json({ error: "Adoptee not found." });
      }

      adoptee.Hasblocked.push(adopterId);
      await adoptee.save();
      // Update chat status to 'blocked'
      chat.status = "blocked";
      await chat.save();

      // Optionally, delete existing messages for privacy
      await Message.deleteMany({ chatId: chat._id });
      await Pet.findByIdAndUpdate(petId, { status: "Approved" }, { new: true });
      return res.status(200).json({ message: "User blocked successfully." });
    }

    // Handle other statuses
    if (status === "sent") {
      // Adoptee sends the pet
      await Pet.findByIdAndUpdate(petId, { status: "Sent" }, { new: true });
      chat.status = "sent";
      await chat.save();
    } else if (status === "delivered") {
      chat.status = "delivered";
      await chat.save();

      // Retrieve adopter details from User model using adopterId
      const adopter = await User.findById(chat.adopterId);
      if (!adopter) {
        return res.status(404).json({ error: "Adopter not found" });
      }

      const adopterEmail = adopter.email;

      // Retrieve phone number from AdoptForm using adopter email and petId
      const adoptForm = await AdoptForm.findOne({
        email: adopterEmail,
        petId: petId.toString(),
      });

      if (!adoptForm) {
        return res.status(404).json({ error: "AdoptForm not found" });
      }

      const adopterPhone = adoptForm.phoneNo;

      // Update the pet model with adopter's email and phone number
      await Pet.findByIdAndUpdate(
        petId,
        {
          email: adopterEmail,
          phone: adopterPhone,
          status: "Delivered",
        },
        { new: true }
      );

      // Optionally delete the chat after delivery is confirmed
      await Chat.findByIdAndDelete(chatId);
      const result = await AdoptForm.deleteMany({ petId: petId.toString() });

      console.log(
        `${result.deletedCount} AdoptForms deleted for petId ${petId}`
      );
    } else if (status === "passive") {
      // Cancel the chat
      await Pet.findByIdAndUpdate(petId, { status: "Approved" }, { new: true });
      chat.status = "passive";
      await chat.save();
      const adopter = await User.findById(chat.adopterId);
      if (!adopter) {
        return res.status(404).json({ error: "Adopter not found." });
      }

      const adopterEmail = adopter.email;

      // Delete only AdoptForms related to the adopter for this petId
      const result = await AdoptForm.deleteMany({
        petId: petId.toString(),
        email: adopterEmail,
      });
      console.log(
        `${result.deletedCount} AdoptForms deleted for petId ${petId} and email ${adopterEmail}`
      );
    } else {
      return res
        .status(400)
        .json({ error: "Invalid action for the user's role in the chat." });
    }

    res.status(200).json({ message: "Chat status updated successfully." });
  } catch (error) {
    console.error("Error updating chat status:", error);
    res.status(500).json({ error: "Failed to update chat status." });
  }
};

const getAdopterChats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch chats with statuses "active" or "sent" for the adopter
    const chats = await Chat.find({
      adopterId: userId,
      status: { $in: ["active", "sent"] }, // Include both statuses
    })
      .populate("adopteeId", "name email")
      .populate("petId", "name");

    // Map the results to include the necessary details
    const adopterChats = chats.map((chat) => ({
      chatId: chat._id,
      name: chat.adopteeId.name,
      email: chat.adopteeId.email,
      petName: chat.petId.name,
      petId: chat.petId._id,
      status: chat.status,
    }));

    res.status(200).json(adopterChats);
  } catch (error) {
    console.error("Error fetching adopter chats:", error);
    res.status(500).json({ error: "Failed to fetch adopter chats" });
  }
};

const getAdopteeChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({
      adopteeId: userId,
      status: "active",
    })
      .populate("adopterId", "name email")
      .populate("petId", "name");

    const adopteeChats = chats.map((chat) => ({
      chatId: chat._id,
      name: chat.adopterId.name,
      email: chat.adopterId.email,
      petName: chat.petId.name,
      petId: chat.petId._id,
      status: chat.status,
    }));

    res.status(200).json(adopteeChats);
  } catch (error) {
    console.error("Error fetching adoptee chats:", error);
    res.status(500).json({ error: "Failed to fetch adoptee chats" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
const sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, content } = req.body;

    const newMessage = await Message.create({ chatId, senderId, content });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};
const blockUser = async (req, res) => {
  try {
    const { blockedUserId } = req.body;
    const currentUserId = req.user._id; // Assuming you have authentication middleware

    if (currentUserId.toString() === blockedUserId) {
      return res.status(400).json({ error: "You cannot block yourself." });
    }

    // Add currentUserId to blockedUser's blockedBy array
    const blockedUser = await User.findById(blockedUserId);
    if (!blockedUser) {
      return res.status(404).json({ error: "User to block not found." });
    }

    // Check if already blocked
    if (blockedUser.blockedBy.includes(currentUserId)) {
      return res.status(400).json({ error: "User is already blocked." });
    }

    blockedUser.blockedBy.push(currentUserId);
    await blockedUser.save();

    // Update chat statuses between currentUser and blockedUser to 'blocked'
    await Chat.updateMany(
      {
        $or: [
          { adopterId: currentUserId, adopteeId: blockedUserId },
          { adopterId: blockedUserId, adopteeId: currentUserId },
        ],
      },
      { status: "blocked" }
    );

    // Optionally, delete existing messages
    await Message.deleteMany({
      chatId: {
        $in: (
          await Chat.find({
            $or: [
              { adopterId: currentUserId, adopteeId: blockedUserId },
              { adopterId: blockedUserId, adopteeId: currentUserId },
            ],
          })
        ).map((chat) => chat._id),
      },
    });

    res.status(200).json({ message: "User blocked successfully." });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ error: "Failed to block user." });
  }
};
module.exports = {
  getAdopterChats,
  getAdopteeChats,
  getMessages,
  sendMessage,
  updateChatStatus,
  blockUser,
};
