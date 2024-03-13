import { arrayUnion, db, doc, updateDoc } from "../../firebase/auth.js";
import { convertToLowercase } from "../convertString.js";

const handleLikeChatBoxReply = async (
  loggedInUserId,
  interest,
  replies,
  reply
) => {
  try {
    // Ensure that interest, chat, and reply are valid objects
    if (!interest || !reply) {
      throw new Error("Invalid data provided.");
    }

    const interestRef = doc(db, "interests", interest.id);

    const newNotification = {
      type: "like",
      likeType: "chatBoxReply",
      chatBoxId: reply.chatBoxId,
      interestId: interest.id,
      id: loggedInUserId + "-" + Date.now(),
      content: `${reply.text}`,
      fromUserId: loggedInUserId,
      createdAt: new Date(),
      hasRead: false,
      hasSeen: false,
      hasDeleted: false,
      link: `/interest/${convertToLowercase(interest.name)}`,
    };

    await updateDoc(interestRef, {
      replies: replies.map((replyS) =>
        replyS.id === reply.id
          ? {
              ...replyS,
              likes: [...replyS.likes, loggedInUserId],
            }
          : replyS
      ),
    });

    // Add a new notification to chatBox author's notifications
    const replyAuthorRef = doc(db, "users", reply.authorId);
    if (reply?.authorId !== loggedInUserId) {
      await updateDoc(replyAuthorRef, {
        notifications: arrayUnion(newNotification),
      });
    }
  } catch (error) {
    console.error("Error handling like chat box reply:", error);
  }
};

const handleUnlikeChatBoxReply = async (
  loggedInUserId,
  interest,
  replies,
  reply
) => {
  try {
    // Ensure that interest, chat, and reply are valid objects
    if (!interest || !reply) {
      throw new Error("Invalid data provided.");
    }

    const interestRef = doc(db, "interests", interest.id);

    await updateDoc(interestRef, {
      replies: replies.map((replyS) =>
        replyS.id === reply.id
          ? {
              ...replyS,
              likes: replyS.likes.filter((like) => like !== loggedInUserId),
            }
          : replyS
      ),
    });
  } catch (error) {
    console.error("Error handling unlike chat box reply:", error);
  }
};

export { handleLikeChatBoxReply, handleUnlikeChatBoxReply };