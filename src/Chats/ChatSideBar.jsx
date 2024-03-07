/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  openNewMessageModal,
  selectOpenNewMessageModal,
} from "../Features/openNewMessageModalSlice";
import plusSquareSVG from "./square-plus-regular.svg";
import { db, collection, doc, updateDoc } from "../firebase/auth";
import { getProfileDetails, formatTimeAgo2 } from "../Hooks";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NewMessageModal } from "./NewMessageModal";

export const ChatSideBar = ({ loggedInUser, users, allChats }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const openModal = () => {
    dispatch(openNewMessageModal());
  };

  const showModal = useSelector(selectOpenNewMessageModal);

  // function formatTimestamp(timestamp) {
  //   const date = new Date(timestamp?.seconds * 1000); // Convert to milliseconds
  //   const now = new Date();
  //   const diff = now.getTime() - date.getTime();

  //   if (diff < 1000) {
  //     return "just now";
  //   } else if (diff < 60 * 1000) {
  //     const seconds = Math.floor(diff / 1000);
  //     return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  //   } else if (diff < 60 * 60 * 1000) {
  //     const minutes = Math.floor(diff / (60 * 1000));
  //     return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  //   } else if (diff < 24 * 60 * 60 * 1000) {
  //     const hours = Math.floor(diff / (60 * 60 * 1000));
  //     return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  //   } else {
  //     return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  //   }
  // }

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

  // filter out chats between the user and the user by checking if both conversats are the same
  const loggedInUserChatsWithOthers = loggedInUserChats.filter(
    (chat) => chat.chatData.conversants[0] !== chat.chatData.conversants[1]
  );

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
                  <h4 className="text-gray-900 font-inter font-semibold text-sm">
                    {loggedInUser.name}
                  </h4>
                  <p className="text-gray-600 text-xs font-normal font-inter">
                    @{loggedInUser.username}
                  </p>
                </div>
              </div>
            </div>
          </Link>
          {loggedInUserChatsWithOthers.length > 0 && (
            <>
              {/* Sort chats based on the timestamp of the first message */}
              {loggedInUserChatsWithOthers
                .sort((a, b) => {
                  if (a.messages[0]?.timestamp > b.messages[0]?.timestamp) {
                    return -1; // Return -1 if the first message of chat a has a higher timestamp
                  } else if (
                    a.messages[0]?.timestamp < b.messages[0]?.timestamp
                  ) {
                    return 1; // Return 1 if the first message of chat b has a higher timestamp
                  }
                  return 0; // Return 0 if timestamps are equal
                })
                .map((chat, index) => (
                  <Link
                    key={index}
                    to={`/messages/${chat.chatId}`}
                    className={`p-4 flex flex-col gap-4 border-b border-gray-200 box-border hover:bg-purple-50 transition duration-500 ease-in-out ${
                      location.pathname === `/messages/${chat.chatId}`
                        ? "bg-gray-50"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between">
                      <div className="flex gap-3">
                        <img
                          // check all conversants and get the user that is not the loggedInUser
                          src={
                            getProfileDetails(
                              chat.chatData.conversants.filter(
                                (id) => id !== loggedInUser.id
                              )[0],
                              users
                            )?.photoURL
                          }
                          // src={
                          //   user.userData.photoURL
                          //     ? user.userData.photoURL
                          //     : "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
                          // }
                          alt="avatar"
                          className="rounded-full h-10 w-10"
                        />
                        <div>
                          <h4 className="text-gray-900 font-inter font-semibold text-sm">
                            {
                              getProfileDetails(
                                chat.chatData.conversants.filter(
                                  (id) => id !== loggedInUser.id
                                )[0],
                                users
                              ).name
                            }
                          </h4>
                          <p className="text-gray-600 text-xs font-normal font-inter">
                            @
                            {
                              getProfileDetails(
                                chat.chatData.conversants.filter(
                                  (id) => id !== loggedInUser.id
                                )[0],
                                users
                              ).username
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col justify-end items-end gap-1">
                        <p className="text-gray-600 text-sm font-normal">
                          {/* get the messages with the lastest timestamp */}
                          {formatTimeAgo2(
                            new Date(
                              chat.messages.sort(
                                (a, b) => b.timestamp - a.timestamp
                              )[0].timestamp.seconds * 1000
                            )
                          )}
                        </p>
                        {/* Check the length of all messages in chat sent by other users */}
                        {chat.messages.filter(
                          (message) =>
                            message.receiverId === loggedInUser.id &&
                            !message.hasRead
                        ).length > 0 && (
                          <div className="flex items-center justify-center gap-1 bg-[#FF5841] min-h-5 min-w-5 px-1.5 py-0.5 rounded-full text-white font-inter text-xs">
                            {/* <div className="bg-purple-500 rounded-full h-3 w-3"> */}
                            {/* Visual indicator for unread messages */}
                            {/* </div> */}
                            {/* <span className="text-xs text-gray-500 text-center"> */}
                            {
                              chat.messages.filter(
                                (message) =>
                                  message.receiverId === loggedInUser.id &&
                                  !message.hasRead
                              ).length
                            }
                            {/* </span> */}
                          </div>
                        )}
                      </div>
                    </div>
                    <h5 className="text-gray-600 font-normal text-sm font-inter">
                      <span className="font-semibold">
                        {chat.messages[0]?.senderId === loggedInUser.id
                          ? "You: "
                          : ""}
                      </span>
                      {chat.messages[0]?.text ? (
                        // hasRead
                        <span
                          className={`${
                            chat.messages[0]?.senderId !== loggedInUser.id &&
                            !chat.messages[0]?.hasRead
                              ? "font-semibold text-black"
                              : "font-normal"
                          }`}
                        >
                          {chat.messages[0]?.text.length > 90
                            ? chat.messages[0]?.text.slice(0, 90) + "..."
                            : chat.messages[0]?.text}
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
            </>
          )}
        </div>
      </div>
      {showModal && (
        <NewMessageModal loggedInUser={loggedInUser} users={users} />
      )}
    </div>
  );
};
