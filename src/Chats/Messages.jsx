/* eslint-disable react/prop-types */
// import { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   // onSnapshot,
//   orderBy,
//   query,
//   limit,
//   where,
//   onSnapshot,
//   } from "firebase/firestore";
import { useSelector } from "react-redux";
import { ChatSideBar } from ".";
// import { db } from "../firebase/auth.js";
import { selectUser } from "../Features/userSlice";

export const Messages = ({ children, users }) => {
  const loggedInUser = useSelector(selectUser);
  // const [otherUsersData, setOtherUsersData] = useState([]);

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

  // useEffect(() => {
  //   const fetchOtherUsers = async () => {
  //     const userChatsRef = collection(db, "chats");
  //     const userChatsSnapshot = await getDocs(
  //       query(
  //         userChatsRef,
  //         where("conversants", "array-contains", loggedInUser.id)
  //       )
  //     );

  //     const promises = userChatsSnapshot.docs.map(async (doc) => {
  //       const conversants = doc.data().conversants;
  //       const otherUserId = conversants?.find(
  //         (userId) => userId !== loggedInUser.id
  //       );
  //       // const chatId =
  //       //   loggedInUser.id < otherUserId
  //       //     ? `${loggedInUser.id}-${otherUserId}`
  //       //     : `${otherUserId}-${loggedInUser.id}`;

  //       const chatMessagesRef = collection(db, `chats/${doc.id}/messages`);
  //       const lastMessageSnapshot = await getDocs(
  //         query(chatMessagesRef, orderBy("timestamp", "desc"), limit(1))
  //       );
  //       const lastMessageData =
  //         lastMessageSnapshot.docs.length > 0
  //           ? lastMessageSnapshot.docs[0].data()
  //           : null;

  //       return {
  //         id: otherUserId,
  //         lastMessageData,
  //       };
  //     });

  //     const results = await Promise.all(promises);
  //     setOtherUsers(results);
  //   };

  //   if (loggedInUser) {
  //     fetchOtherUsers();
  //   }
  // }, [loggedInUser]);

  // useEffect(() => {
  //   const getOtherUsersChats = async () => {
  //     const userChatsRef = collection(db, "chats");

  //     // Listen for real-time updates
  //     const unsubscribe = onSnapshot(
  //       query(
  //         userChatsRef,
  //         where("conversants", "array-contains", loggedInUser.id)
  //       ),
  //       async (snapshot) => {
  //         // Handle snapshot updates
  //         const otherUsers = [];
  //         const promises = snapshot.docs.map(async (doc) => {
  //           // Fetch data for each document in the snapshot
  //           const conversants = doc.data().conversants;
  //           const otherUserId = conversants.find(
  //             (userId) => userId !== loggedInUser.id
  //           );

  //           const chatMessagesRef = collection(db, `chats/${doc.id}/messages`);

  //           // Get the last message from the chatMessages collection
  //           const querySnapshot = await getDocs(
  //             query(chatMessagesRef, orderBy("timestamp", "desc"), limit(1))
  //           );
  //           const lastMessage =
  //             querySnapshot.docs.length > 0
  //               ? querySnapshot.docs[0].data()
  //               : null;

  //           const lastMessageData = lastMessage
  //             ? {
  //                 senderId: lastMessage.senderId,
  //                 text: lastMessage.text,
  //                 timestamp: lastMessage.timestamp,
  //               }
  //             : null;

  //           return {
  //             id: otherUserId,
  //             lastMessageData,
  //           };
  //         });

  //         const results = await Promise.all(promises);
  //         otherUsers.push(...results);

  //         const otherUsersIds = otherUsers.map((user) => user.id);
  //         const usersWithLastMessage = users
  //           .filter((user) => otherUsersIds.includes(user.id))
  //           .map((user) => {
  //             const lastMessageData = otherUsers.reduce((acc, curr) => {
  //               if (curr.id === user.id) {
  //                 acc = curr.lastMessageData;
  //               }
  //               return acc;
  //             }, null);
  //             return {
  //               ...user,
  //               lastMessageData,
  //             };
  //           })
  //           .filter((user) => user.lastMessageData !== null)
  //           .sort(
  //             (a, b) =>
  //               b.lastMessageData.timestamp.toMillis() -
  //               a.lastMessageData.timestamp.toMillis()
  //           );
  //         setOtherUsersData(usersWithLastMessage);
  //       }
  //     );

  //     // Return the unsubscribe function to perform cleanup
  //     return unsubscribe;
  //   };

  //   if (loggedInUser) {
  //     getOtherUsersChats();
  //   }

  //   // Cleanup function will be called when the component unmounts
  //   return () => {};
  // }, [loggedInUser, users]);

  // console.log(otherUsersData);

  // const otherUsersData = otherUsers
  //   .map((user) => {
  //     const lastMessageData = user.lastMessageData;
  //     if (!lastMessageData) return null;

  //     return {
  //       ...user,
  //       lastMessageData,
  //     };
  //   })
  //   .filter((user) => user !== null)
  //   .sort(
  //     (a, b) =>
  //       b.lastMessageData.timestamp.toMillis() -
  //       a.lastMessageData.timestamp.toMillis()
  //   );

  return (
    <div className="flex place-self-end justify-self-end align-bottom justify-items-end h-[calc(100vh)] pt-20 overflow-hidden flex-row w-screen md:pt-16">
      {/* SideBar */}

      <div className="">
        <ChatSideBar
          loggedInUser={loggedInUser}
          users={users}
          // otherUsersData={otherUsersData}
        />
      </div>
      <div className="flex-1 overflow-auto w-full">
        {/* Component */}
        {children}
      </div>
    </div>
  );
};
