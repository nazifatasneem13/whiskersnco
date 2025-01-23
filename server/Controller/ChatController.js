const Chat = require("../Model/Chat");
const Message = require("../Model/Message");
const User = require("../Model/user.model");
const AdoptForm = require("../Model/AdoptFormModel");
const Review = require("../Model/review");
const Pet = require("../Model/PetModel");
const Notification = require("../Model/Notification");

const updateChatStatus = async (req, res) => {
  try {
    const { chatId, petId, status, userId, review } = req.body;

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

      //Hasblocked
      const adopteeId = chat.adopteeId;
      const adoptee = await User.findById(adopteeId);
      if (!adoptee) {
        return res.status(404).json({ error: "Adoptee not found." });
      }

      adoptee.Hasblocked.push(adopterId);
      await adoptee.save();
      await Pet.findByIdAndUpdate(petId, { status: "Approved" }, { new: true });
      // Delete only AdoptForms related to the adopter for this petId
      const result = await Chat.deleteMany({
        petId: petId.toString(),
        adopteeId: userId,
        adopterId: adopterId,
      });
      //chat.status = "blocked";
      //await chat.save();

      // Optionally, delete existing messages for privacy
      await Message.deleteMany({ chatId: chat._id });

      console.log(
        `${result.deletedCount} AdoptForms deleted for petId ${petId} and email ${adopterEmail}`
      );
      return res.status(200).json({ message: "User blocked successfully." });
    }

    //handle review
    if (status === "sent") {
      if (review) {
        console.log("Review for adopter:", review);

        try {
          const adopter = await User.findById(chat.adopterId);
          if (!adopter) {
            return res.status(404).json({ error: "Adopter not found" });
          }

          // Save review for adopter
          const newReview = await Review.create({
            reviewingId: adopter._id,
            reviewerId: userId, // Adoptee who is reviewing
            petId,
            status: "Bydonator",
            content: review,
          });

          console.log("Saved review for adopter:", newReview);
        } catch (error) {
          console.error("Error saving review for adopter:", error);
          return res
            .status(500)
            .json({ error: "Failed to save review for adopter." });
        }
      }
    } else if (status === "delivered") {
      if (review) {
        console.log("Review for donator:", review);

        try {
          const adoptee = await User.findById(chat.adopteeId);
          if (!adoptee) {
            return res.status(404).json({ error: "Donator not found" });
          }

          // Save review for donator
          const newReview = await Review.create({
            reviewingId: adoptee._id,
            reviewerId: userId, // Adopter who is reviewing
            status: "Byadoptor",
            petId,
            content: review,
          });

          console.log("Saved review for donator:", newReview);
        } catch (error) {
          console.error("Error saving review for donator:", error);
          return res
            .status(500)
            .json({ error: "Failed to save review for donator." });
        }
      }
    }

    // Handle other statuses
    if (status === "sent") {
      // Adoptee sends the pet

      const pet = await Pet.findByIdAndUpdate(
        petId,
        { status: "Sent" },
        { new: true }
      );
      chat.status = "sent";
      await chat.save();
      // Notify both users
      await Notification.create({
        userId: chat.adopteeId, // Adoptee (donator)
        message: `You have sent ${pet.name} to the adopter.`,
      });
      await Notification.create({
        userId: chat.adopterId, // Adopter
        message: `The donator has sent ${pet.name} to you.`,
      });
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
      const pet = await Pet.findByIdAndUpdate(
        petId,
        {
          email: adopterEmail,
          phone: adopterPhone,
          status: "Delivered",
        },
        { new: true }
      );
      await Notification.create({
        userId: chat.adopteeId, // Adoptee (donator)
        message: `${pet.name} has been successfully delivered to the adopter.`,
      });
      await Notification.create({
        userId: chat.adopterId, // Adopter
        message: `You have successfully received ${pet.name}.`,
      });

      const result = await AdoptForm.deleteMany({ petId: petId.toString() });

      console.log(
        `${result.deletedCount} AdoptForms deleted for petId ${petId}`
      );
    } else if (status === "passive") {
      // Cancel the chat
      const pet = await Pet.findByIdAndUpdate(
        petId,
        { status: "Approved" },
        { new: true }
      );
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

      // Notify both users
      await Notification.create({
        userId: chat.adopteeId, // Adoptee (donator)
        message: `The adoption process for ${pet.name} has been canceled.`,
      });
      await Notification.create({
        userId: chat.adopterId, // Adopter
        message: `The adoption process for ${pet.name} has been canceled by the donator.`,
      });
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
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const recipientId =
      chat.adopterId.toString() === senderId.toString()
        ? chat.adopteeId
        : chat.adopterId;
    const recipient = await User.findById(recipientId);
    const sender = await User.findById(senderId);
    // Create a notification for the recipient
    await Notification.create({
      userId: recipientId,
      message: `New message from ${sender.email}`,
    });

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

const getArchivedAdopterChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({
      adopterId: userId,
      $or: [{ status: "sent" }, { status: "delivered" }],
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

const getArchivedAdopteeChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({
      adopteeId: userId,
      status: "delivered",
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

module.exports = {
  getAdopterChats,
  getAdopteeChats,
  getMessages,
  sendMessage,
  updateChatStatus,
  blockUser,
  getArchivedAdopterChats,
  getArchivedAdopteeChats,
};
