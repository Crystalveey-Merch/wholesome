/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  // onSnapshot,
  orderBy,
  query,
  limit,
  where,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { ChatSideBar } from ".";
import { db } from "../firebase/auth.js";
import { selectUser } from "../Features/userSlice";

export const Messages = ({ children, users }) => {
  const loggedInUser = useSelector(selectUser);
  const [otherUsers, setOtherUsers] = useState([]);

  // useEffect(() => {
  //   const chatsRef = collection(db, "chats");
  //   const unsuscribSideMessageData = onSnapshot(chatsRef, async (snapshot) => {
  //     // Check if chats collection exists
  //     if (snapshot.empty) {
  //       // Handle the case where the chats collection does not exist
  //       return;
  //     }

  //     const promises = snapshot.docs.map(async (doc) => {
  //       const conversants = doc.data().conversants;
  //       const otherUserId = conversants.find(
  //         (userId) => userId !== loggedInUser?.id
  //       );
  //       // const chatId =
  //       //   loggedInUser?.id < otherUserId
  //       //     ? `${loggedInUser.id}-${otherUserId}`
  //       //     : `${otherUserId}-${loggedInUser.id}`;

  //       const chatMessagesRef = collection(db, `chats/${doc.id}/messages`);

  //       // Get the last message from the chatMessages collection
  //       const lastMessageSnapshot = await getDocs(
  //         query(chatMessagesRef, orderBy("createdAt", "desc"), limit(1))
  //       );
  //       const lastMessage =
  //         lastMessageSnapshot.docs.length > 0
  //           ? lastMessageSnapshot.docs[0].data()
  //           : null;

  //       const lastMessageData = lastMessage
  //         ? {
  //             senderId: lastMessage.senderId,
  //             text: lastMessage.text,
  //             timestamp: lastMessage.timestamp,
  //           }
  //         : null;

  //       return {
  //         id: otherUserId,
  //         lastMessage: lastMessageData,
  //       };
  //     });

  //     const results = await Promise.all(promises);
  //     setOtherUsers(results);
  //   });

  //   return () => {
  //     unsuscribSideMessageData();
  //   };
  // }, [loggedInUser]);

  useEffect(() => {
    const fetchOtherUsers = async () => {
      const userChatsRef = collection(db, "userChats");
      const userChatsSnapshot = await getDocs(
        query(
          userChatsRef,
          where("participants", "array-contains", loggedInUser.id)
        )
      );

      const promises = userChatsSnapshot.docs.map(async (doc) => {
        const participants = doc.data().participants;
        const otherUserId = participants.find(userId => userId !== loggedInUser.id);
        // const chatId =
        //   loggedInUser.id < otherUserId
        //     ? `${loggedInUser.id}-${otherUserId}`
        //     : `${otherUserId}-${loggedInUser.id}`;
        
        const chatMessagesRef = collection(db, `chats/${doc.id}/messages`);
        const lastMessageSnapshot = await getDocs(
          query(chatMessagesRef, orderBy("timestamp", "desc"), limit(1))
        );
        const lastMessageData =
          lastMessageSnapshot.docs.length > 0
            ? lastMessageSnapshot.docs[0].data()
            : null;

        return {
          id: otherUserId,
          lastMessageData,
        };
      });

      const results = await Promise.all(promises);
      setOtherUsers(results);
    };

    if (loggedInUser) {
      fetchOtherUsers();
    }
  }, [loggedInUser]);

  const otherUsersData = otherUsers.map((user) => {
    const lastMessageData = user.lastMessageData;
    if (!lastMessageData) return null;

    return {
      ...user,
      lastMessageData,
    };
  }).filter(user => user !== null).sort(
    (a, b) =>
      b.lastMessageData.timestamp.toMillis() -
      a.lastMessageData.timestamp.toMillis()
  );

  return (
    <div className="flex place-self-end justify-self-end align-bottom justify-items-end h-[calc(100vh)] pt-24 overflow-hidden flex-row w-screen">
      {/* SideBar */}

      <div className="">
        <ChatSideBar
          loggedInUser={loggedInUser}
          users={users}
          otherUsers={otherUsersData}
        />
      </div>
      <div className="flex-1 overflow-auto w-full">
        {/* Component */}
        {children}
      </div>
    </div>
  );
};
