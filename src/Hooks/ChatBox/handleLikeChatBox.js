import { arrayUnion, db, doc, updateDoc } from "../../firebase/auth.js";
import { convertToLowercase } from "../convertString.js";

const handleLikeChatBox = async (loggedInUserId, interest, chat, chatBox) => {
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
  const chatBoxAurthorRef = doc(db, "users", chat.authorId);
  if (chat.authorId !== loggedInUserId) {
    await updateDoc(chatBoxAurthorRef, {
      notifications: arrayUnion(newNotification),
    });
  }
};

const handleUnlikeChatBox = async (loggedInUserId, interest, chat, chatBox) => {
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
}

export { handleLikeChatBox, handleUnlikeChatBox };
