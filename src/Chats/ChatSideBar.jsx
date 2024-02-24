/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  openNewMessageModal,
  selectOpenNewMessageModal,
} from "../Features/openNewMessageModalSlice";
import plusSquareSVG from "./square-plus-regular.svg";
import {
  db,
  collection,
  query,
  onSnapshot,
  where,
  doc,
  updateDoc,
} from "../firebase/auth";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NewMessageModal } from "./NewMessageModal";

export const ChatSideBar = ({ loggedInUser, users, allChats }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const openModal = () => {
    dispatch(openNewMessageModal());
  };

  const [chats, setChats] = useState([]);
  const [chatUserData, setChatUserData] = useState([]);

  const showModal = useSelector(selectOpenNewMessageModal);

  useEffect(() => {
    if (users.length > 0) {
      // Create chatIds for each user
      // const chatIds = users.map((user) => {
      //   return user.id > loggedInUser.id
      //     ? `${user.id}-${loggedInUser.id}`
      //     : `${loggedInUser.id}-${user.id}`;
      // });

      const chatsRef = collection(db, "chats");

      // Query chats where loggedInUser is involved
      const unsubscribe = onSnapshot(
        query(
          chatsRef,
          where("conversants", "array-contains", loggedInUser.id)
        ),
        (snapshot) => {
          snapshot.forEach((chatDoc) => {
            // Get the conversants of this chat
            const conversants = chatDoc.data().conversants;

            // Filter out the loggedInUser from the conversants
            const otherUserId = conversants.find(
              (id) => id !== loggedInUser.id
            );

            // Query messages for this chat
            const messagesRef = collection(chatDoc.ref, "messages");

            // Listen for new messages
            const unsubscribeMessages = onSnapshot(
              messagesRef,
              (querySnapshot) => {
                const newMessages = [];
                querySnapshot.forEach((doc) => {
                  newMessages.push(doc.data());
                });
                // Sort messages by timestamp
                newMessages.sort((a, b) => a.timestamp - b.timestamp);
                // Update the chats state
                setChats((prevChats) => ({
                  ...prevChats,
                  [otherUserId]: newMessages,
                }));
              }
            );

            // Cleanup function for message listener
            return () => {
              unsubscribeMessages();
            };
          });
        }
      );

      // Cleanup function for chat listener
      return () => {
        unsubscribe();
      };
    }
  }, [users, loggedInUser]);

  useEffect(() => {
    if (Object.keys(chats).length > 0 && users.length > 0) {
      const lastMessageData = [];

      // Iterate through the chats object
      Object.keys(chats).forEach((userId) => {
        // Check if the conversation is between the user and themselves
        if (userId === "undefined" || userId === loggedInUser.id) {
          return;
        }

        // Get all messages for the user
        const userMessages = chats[userId];

        // Get the last message for the user
        const lastMessage = userMessages[userMessages.length - 1];

        // Find the user data from the users array
        const otherUserData = users.find((user) => user.id === userId);

        // Combine user data with last message data and push to the array
        lastMessageData.push({
          id: userId,
          userData: otherUserData,
          lastMessage: lastMessage,
        });
      });

      // Now you have lastMessageData containing both user data and last message data
      // console.log("Last Message Data:", lastMessageData);
      setChatUserData(lastMessageData);
    }
  }, [chats, loggedInUser, users]);

  // console.log("chatUserData", chatUserData);

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp?.seconds * 1000); // Convert to milliseconds
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 1000) {
      return "just now";
    } else if (diff < 60 * 1000) {
      const seconds = Math.floor(diff / 1000);
      return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
    } else if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    }
  }

  // has true

  const loggedInUserChats = allChats.filter((chat) =>
    chat.chatData.conversants.includes(loggedInUser?.id)
  );

  const chatIds = loggedInUserChats
    .filter((chat) => chat.messages.length > 0) // Filter out chats without messages
    .filter((chat) => chat.messages[0].senderId !== loggedInUser?.id) // Filter out chats where the loggedInUser is the sender of the last message
    .map((chat) => chat.chatDocId);

  useEffect(() => {
    // Check screen size and pathname before updating chat hasSeen status
    if (
      window.innerWidth >= 767 ||
      (window.innerWidth < 767 && location.pathname === "/messages")
    ) {
      const chatsRef = collection(db, "chats");
      if (chatIds.length > 0) {
        chatIds.forEach((chatId) => {
          const chatRef = doc(chatsRef, chatId);
          const updateData = { hasSeen: true };
          updateDoc(chatRef, updateData);
        });
      }
    }
  }, [chatIds, location.pathname]);

  return (
    <div
      className={`border-r border-gray-200 w-96 flex flex-col h-full 2xl:w-[350px] xl:w-80 lg:w-72 md:w-[calc(100vw-1rem)] ${
        location.pathname === "/messages" ? "md:block" : "md:hidden"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-gray-200">
        <div className="text-lg font-semibold text-gray-900">Messages</div>
        <button className="p-0 bg-white" onClick={openModal}>
          <img src={plusSquareSVG} alt="edit" className="h-10 w-10 block" />
        </button>
        {/* <NewMessageModal v-if="showModal" @close="closeModal" /> */}
      </div>

      {/* Chat list  */}
      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-col pt-3">
          <Link
            to={`/messages/${loggedInUser.id}-${loggedInUser.id}`}
            // scroll to end of chat
            // onClick={() => {
            //   const chat = document.getElementById("chat");
            //   chat.scrollTop = chat.scrollHeight;
            // }}
            // active-class="bg-gray-50"
            className={`p-4 flex flex-col gap-4 border-b border-gray-200 box-border hover:bg-purple-50 transition duration-500 ease-in-out ${
              location.pathname ===
              `/messages/${loggedInUser.id}-${loggedInUser.id}`
                ? "bg-gray-50"
                : ""
            }`}
          >
            <div className="flex justify-between">
              <div className="flex gap-3">
                <img
                  src={
                    loggedInUser.photoURL
                      ? loggedInUser.photoURL
                      : "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
                  }
                  alt="avatar"
                  className="rounded-full h-10 w-10"
                />
                <div>
                  <h4 className="text-gray-700 font-semibold text-sm">
                    {loggedInUser.name}
                  </h4>
                  <p className="text-gray-600 text-xs font-normal">
                    @{loggedInUser.username}
                  </p>
                </div>
              </div>
            </div>
          </Link>
          {chatUserData.map((user) => (
            <Link
              key={user.userData.id}
              // scroll to bottom of page
              // onClick={() => window.scrollTo(0, document.body.scrollHeight)}
              to={`/messages/${user.userData.id}-${loggedInUser.id}`}
              // active-class="bg-gray-50"
              className={`p-4 flex flex-col gap-4 border-b border-gray-200 box-border hover:bg-purple-50 transition duration-500 ease-in-out ${
                location.pathname ===
                `/messages/${user.userData.id}-${loggedInUser.id}`
                  ? "bg-gray-50"
                  : ""
              }`}
            >
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <img
                    src={
                      user.userData.photoURL
                        ? user.userData.photoURL
                        : "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
                    }
                    alt="avatar"
                    className="rounded-full h-10 w-10"
                  />
                  <div>
                    <h4 className="text-gray-700 font-semibold text-sm">
                      {user.userData.name}
                      {/* <span v-if="user.admin" className="relative" title="Admin">
                        <img
                          src="../assets/profileIcons/admin-tag.svg"
                          alt="admin"
                          className="h-6 w-6 inline-block"
                          title="Admin"
                        />
                        <p
                          className="absolute top-0.5 left-2 text-xs font-semibold text-white"
                        >
                          A
                        </p>
                      </span> */}
                    </h4>
                    <p className="text-gray-600 text-xs font-normal">
                      @{user.userData.username}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-normal">
                  {formatTimestamp(user?.lastMessage?.timestamp)}
                </p>
              </div>
              <h5 className="text-gray-600 font-normal text-sm font-inter">
                <span className="font-semibold">
                  {user?.lastMessage?.senderId === loggedInUser.id
                    ? "You: "
                    : ""}
                </span>
                {user?.lastMessage?.text ? (
                  // hasRead
                  <span
                  // className={`${
                  //   user.lastMessage.senderId !== loggedInUser.id &&
                  //   !user.lastMessage.hasRead
                  //     ? "font-semibold text-black"
                  //     : "font-normal"
                  // }`}
                  >
                    {user?.lastMessage?.text.length > 90
                      ? user?.lastMessage?.text.slice(0, 90) + "..."
                      : user?.lastMessage?.text}
                  </span>
                ) : (
                  <span>
                    <FontAwesomeIcon icon={faImage} className="mr-2" />
                    <span className="font-semibold">Photo</span>
                  </span>
                )}
              </h5>
            </Link>
          ))}
        </div>
      </div>
      {showModal && (
        <NewMessageModal loggedInUser={loggedInUser} users={users} />
      )}
    </div>
  );
};
