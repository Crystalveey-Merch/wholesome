import { arrayUnion, db, doc, updateDoc } from "../../firebase/auth.js";
import { convertToLowercase } from "../convertString.js";

const handleLikeChatBox = async (loggedInUserId, interest, chat, chatBox) => {
  try {
    // Ensure that interest, chat, and chatBox are valid objects
    if (!interest || !chat || !chatBox) {
      throw new Error("Invalid data provided.");
    }

    const interestRef = doc(db, "interests", interest.id);

    const newNotification = {
      type: "like",
      likeType: "chatBox",
      chatBoxId: chat.id,
      interestId: interest.id,
      id: loggedInUserId + "-" + Date.now(),
      content: `${chat.text}`,
      fromUserId: loggedInUserId,
      createdAt: new Date(),
      hasRead: false,
      hasSeen: false,
      hasDeleted: false,
      link: `/interest/${convertToLowercase(interest.name)}`,
    };

    await updateDoc(interestRef, {
      chatBox: chatBox.map((chatS) =>
        chatS.id === chat.id
          ? {
              ...chatS,
              likes: [...chatS.likes, loggedInUserId],
            }
          : chatS
      ),
    });

    // Add a new notification to chatBox author's notifications
    const chatBoxAuthorRef = doc(db, "users", chat.authorId);
    if (chat?.authorId !== loggedInUserId) {
      await updateDoc(chatBoxAuthorRef, {
        notifications: arrayUnion(newNotification),
      });
    }
  } catch (error) {
    console.error("Error handling like chat box:", error);
  }
};

const handleUnlikeChatBox = async (loggedInUserId, interest, chat, chatBox) => {
  try {
    // Ensure that interest, chat, and chatBox are valid objects
    if (!interest || !chat || !chatBox) {
      throw new Error("Invalid data provided.");
    }

    const interestRef = doc(db, "interests", interest.id);

    await updateDoc(interestRef, {
      chatBox: chatBox.map((chatS) =>
        chatS.id === chat.id
          ? {
              ...chatS,
              likes: chatS.likes.filter((like) => like !== loggedInUserId),
            }
          : chatS
      ),
    });
  } catch (error) {
    console.error("Error handling unlike chat box:", error);
  }
};

export { handleLikeChatBox, handleUnlikeChatBox };
