/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { NewMessageModal } from "./NewMessageModal";
import { selectOpenNewMessageModal } from "../Features/openNewMessageModalSlice";
import { selectUser } from "../Features/userSlice";
import moment from "moment";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  collection,
  db,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  storage,
  updateDoc,
  query,
  where,
} from "../firebase/auth.js";
import { toast } from "react-toastify";
import { useAutosizeTextArea } from "../Hooks/useAutoSizeTextArea.js";
import EmojiPicker from "emoji-picker-react";

export const ChatView = ({ users, allChats }) => {
  const { chatId } = useParams();
  const loggedInUser = useSelector(selectUser);
  const [chatUser, setChatUser] = useState([]);
  const [message, setMessage] = useState("");
  //   const [chats, setChats] = useState([]);
  const [messageSending, setMessageSending] = useState(false);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const showModal = useSelector(selectOpenNewMessageModal);

  let idOne = chatId.split("-")[0];
  let idTwo = chatId.split("-")[1];

  const navigate = useNavigate();

  const messageRef = useRef(null);
  useAutosizeTextArea(messageRef.current, message);

  const handleAddEmoji = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  useEffect(() => {
    // Add event listener to close dropdown when clicking outside
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        // set to false if the emoji picker is open
        setOpenEmojiPicker(false);
      }
    }

    // Bind the event listener
    window.addEventListener("click", handleClickOutside);

    return () => {
      // Unbind the event listener on cleanup
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (idOne !== loggedInUser.id && idTwo !== loggedInUser.id) {
      navigate("/messages");
    }
  }, [idOne, idTwo, loggedInUser.id, navigate]);

  useEffect(() => {
    const otherUserId = idOne === loggedInUser.id ? idTwo : idOne;
    const chatUser = users.find((user) => user.id === otherUserId);
    setChatUser(chatUser);
  }, [idOne, idTwo, loggedInUser.id, users]);

  function formatTime(timestamp) {
    const now = moment();
    const messageTime = moment(timestamp);
    const diffInDays = now.diff(messageTime, "days");

    // If the message is from today, show just the time
    if (diffInDays === 0) {
      return messageTime.format("h:mm A");
    }

    // If the message is from within the last 7 days, show the day of the week and time
    if (diffInDays < 7) {
      return messageTime.format("ddd h:mm A");
    }

    // Otherwise, show the full date and time
    return messageTime.format("MMM D, YYYY h:mm A");
  }

  //   useEffect(() => {
  //     const chatsRef = collection(db, "chats");
  //     const chatId = idOne < idTwo ? `${idOne}-${idTwo}` : `${idTwo}-${idOne}`;

  //     // Check if chat already exists between these two users
  //     const chatQuery = query(chatsRef, where("chatId", "==", chatId));
  //     const unsubscribe = onSnapshot(chatQuery, async (chatQuerySnapshot) => {
  //       let chatDocRef;
  //       if (chatQuerySnapshot.empty) {
  //         // chat does not exist
  //         setChats([]);
  //         return;
  //       } else {
  //         //  chat exists, get its messages subcollection
  //         chatDocRef = chatQuerySnapshot.docs[0].ref;
  //         const messagesRef = collection(chatDocRef, "messages");

  //         // Listen for new messages
  //         const unsubscribeMessages = onSnapshot(messagesRef, (querySnapshot) => {
  //           const newMessages = [];
  //           querySnapshot.forEach((doc) => {
  //             newMessages.push(doc.data());
  //           });
  //           // sort messages by timestamp in ascending order
  //           newMessages.sort((a, b) => a.timestamp - b.timestamp);

  //           //   // Mark messages as read
  //           //   newMessages.forEach((message) => {

  //           setChats(newMessages);
  //         });

  //         // Cleanup function for message listener
  //         return () => {
  //           unsubscribeMessages();
  //         };
  //       }
  //     });

  //     // Cleanup function for chat listener
  //     return () => {
  //       unsubscribe();
  //     };
  //   }, [idOne, idTwo]);

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const imageInputRef = useRef(null);
  const [imageToSend, setImageToSend] = useState(null);

  const openImagePicker = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImageFile(file);
      setImageUrl(reader.result);
    };
  };

  const cancelImageUpload = () => {
    setImageFile(null);
    setImageUrl("");
  };

  const sendMessage = async () => {
    setMessageSending(true); // Set messageSending to true when message sending starts

    const chatId =
      idOne && idTwo
        ? idOne < idTwo
          ? `${idOne}-${idTwo}`
          : `${idTwo}-${idOne}`
        : "";

    // Check if imageFile exists before uploading
    if (imageFile) {
      try {
        const storageRef = ref(
          storage,
          `chat-images/${chatId}/${imageFile.name}`
        );
        const snapshot = await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setImageToSend(downloadURL); // Set the image URL to state
      } catch (error) {
        // Handle error during image upload
        console.error("Error uploading image:", error);
        toast.error("Error uploading image. Please try again.");
        setMessageSending(false); // Set messageSending to false on error
        return;
      }
    }

    // Check if there's no message or image to send
    if (!message && !imageToSend) {
      setMessageSending(false); // Set messageSending to false when no message is sent
      return;
    }

    const chatsRef = collection(db, "chats");
    const chatQuery = query(chatsRef, where("chatId", "==", chatId));
    const chatQuerySnapshot = await getDocs(chatQuery);

    let chatDocRef;
    if (chatQuerySnapshot.empty) {
      chatDocRef = doc(chatsRef);
      const chatData = {
        chatId,
        conversants: [idOne, idTwo],
        hasSeen: false,
      };
      await setDoc(chatDocRef, chatData);
    } else {
      chatDocRef = chatQuerySnapshot.docs[0].ref;
    }

    const messagesRef = collection(chatDocRef, "messages");
    const senderId = loggedInUser?.id;
    const receiverId = chatUser?.id;
    const senderName = loggedInUser?.name;
    const receiverName = chatUser?.name;
    const timestamp = serverTimestamp();
    const messageData = {
      senderId,
      receiverId,
      senderName,
      receiverName,
      text: message || null,
      imageURL: imageToSend || null,
      timestamp,
      hasRead: false,
      isDeleted: false,
    };

    await addDoc(messagesRef, messageData);

    // Update hasSeen to false for the chat after sending a new message
    await setDoc(chatDocRef, { hasSeen: false }, { merge: true });

    // Reset form state after message is sent
    setMessage("");
    setImageFile(null);
    setImageUrl("");
    setImageToSend(null);
    setMessageSending(false); // Set messageSending to false after message is sent
  };

  const currentChat = allChats.find(
    (chat) =>
      chat.chatData.conversants.includes(idOne) &&
      chat.chatData.conversants.includes(idTwo)
  );

  //   console.log(currentChat);

  //   const chatIds = currentChat
  //     .filter((chat) => chat.messages.length > 0) // Filter out chats without messages
  //     .filter((chat) => chat.messages[0].senderId !== loggedInUser?.id) // Filter out chats where the loggedInUser is the sender of the last message
  //     .map((chat) => chat.chatDocId);

  useEffect(() => {
    const chatsRef = collection(db, "chats");
    if (currentChat && currentChat.messages[0]?.senderId !== loggedInUser?.id) {
      const chatRef = doc(chatsRef, currentChat.chatDocId);
      const updateData = { hasSeen: true };
      updateDoc(chatRef, updateData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, currentChat]);

  const currentChatWhereUserIsReceiver = currentChat?.messages.filter(
    (chat) => chat.receiverId === loggedInUser.id
  );

  //now update all the messages where the loggedInUser is the receiver hasRead to true
  useEffect(() => {
    const chatsRef = collection(db, "chats");
    if (currentChatWhereUserIsReceiver) {
      currentChatWhereUserIsReceiver.forEach(async (message) => {
        const chatRef = doc(
          chatsRef,
          currentChat.chatDocId,
          "messages",
          message.id
        );
        const updateData = { hasRead: true };
        await updateDoc(chatRef, updateData);
      });
    }
  }, [currentChatWhereUserIsReceiver, currentChat]);

  //   console.log(currentChatWhereUserIsReceiver);

  const lastMessageRef = useRef(null);

  useEffect(() => {
    // Scroll to the last message when the component mounts
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        // inline: "nearest", // Ensure the element is aligned to the end of the container
        // Add a slight scroll offset of plus ten pixels
        // bottom: lastMessageRef.current.offsetTop + 80,
      });
    }
  }, [currentChat]);

  if (!chatUser) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="w-full relative bg-gray-50 min-h-[calc(100vh-140px)]"
        // style={{ height: "calc(100vh - 120px)" }}
      >
        <div className="sticky top-0 md:fixed md:top-[70px] sm:top-16 md:w-full">
          <div className="py-4 px-6 flex row items-center justify-between border-b border-gray-200 bg-white shadow sm:px-3">
            <div className="flex items-center gap-4">
              <div
                onClick={() => navigate("/messages")}
                className="hidden md:block cursor-pointer"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              <NavLink
                to={`/profile/${chatUser.id}`}
                className="flex items-center"
              >
                <img
                  src={
                    chatUser.photoURL
                      ? chatUser.photoURL
                      : "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
                  }
                  className="w-12 h-12 rounded-full border xl"
                />
                <div className="flex flex-col gap-0">
                  <h1 className="font-semibold text-black text-lg ml-4 font-inter">
                    {chatUser.name}
                  </h1>
                  <p className="text-sm text-[rgb(71,85,105)] font-inter ml-4">
                    @{chatUser.username}
                  </p>
                </div>
              </NavLink>
            </div>
            <div className="p-2 bg-none w-max h-max cursor-pointer">
              <FontAwesomeIcon icon={faEllipsisV} />
            </div>
          </div>
        </div>
        <div className="pt-10 flex flex-col gap-20 overflow-yscroll min-h-[15vh] sm:gap-16 md:pt-32">
          <div className="text-center flex flex-col items-center justify-center gap-3">
            <img
              src={
                chatUser.photoURL
                  ? chatUser.photoURL
                  : "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
              }
              className="w-20 h-20 rounded-full border"
            />
            <div className="flex flex-col">
              <h1 className="font-bold text-lg text-gray-900">
                {chatUser.name}
              </h1>
              <p className="text-base text-gray-600">@{chatUser.username}</p>
            </div>
            <h3 className="text-sm text-gray-800 w-96">{chatUser.shortBio}</h3>
            <div className="flex gap-1 items-center">
              {chatUser.createdAt && (
                <h2 className="text-sm text-gray-600">
                  Joined:{" "}
                  {new Date(chatUser.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h2>
              )}
              <p>-</p>
              <h2 className="text-sm text-gray-600">
                {chatUser.followers?.length} followers
              </h2>
            </div>
          </div>
          <div className="pb-0 min-h-[300px]">
            <ul className="flex flex-col gap-8 px-10 md:px-6 sm:px-4">
              {/* reverse the arrangement */}
              {currentChat?.messages
                .sort((a, b) => a.timestamp - b.timestamp)
                .map((message, index) => (
                  <li
                    key={index}
                    //   ref={index === chats.length - 1 ? lastMessageRef : null}
                  >
                    {message.senderId === loggedInUser.id ? (
                      <div className="flex flex-col gap-1.5 items-end pl-9">
                        {/* <div class="flex items-start">
                <p class="text-gray-700 text-sm font-medium text-left">You</p>
              </div>  */}
                        {message.text && (
                          <div className="bg-red-600 py-2.5 px-3.5 rounded-lg max-w-[508px]">
                            <p className="text-white font-normal text-base">
                              {message.text}
                            </p>
                          </div>
                        )}
                        {message.imageURL && (
                          <img
                            src={message.imageURL}
                            className="w-72 h-60 rounded-lg mt-2 object-cover md:w-60 md:h-56"
                          />
                        )}
                        <p className="text-gray-600 text-xs font-normal font-inter">
                          {formatTime(message.timestamp?.seconds * 1000)}{" "}
                          <span className="text-gray-400">
                            {message.hasRead && "read"}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div className="flex gap-3 pr-9">
                        <img
                          src={
                            chatUser.photoURL
                              ? chatUser.photoURL
                              : "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
                          }
                          className="w-10 h-10 rounded-full border"
                        />
                        <div className="flex flex-col gap-1.5 items-start">
                          <div className="flex justify-between gap-4">
                            <p className="text-gray-700 text-sm font-medium">
                              {chatUser.name}
                            </p>
                          </div>
                          {message.text && (
                            <div className="bg-gray-200 py-2.5 px-3.5 rounded-lg max-w-[508px]">
                              <p className="text-gray-700 font-normal text-base">
                                {message.text}
                              </p>
                            </div>
                          )}
                          {message.imageURL && (
                            <img
                              src={message.imageURL}
                              className="w-72 h-60 rounded-lg mt-2 object-cover md:w-60 md:h-56"
                            />
                          )}
                          <p className="text-gray-600 text-xs font-normal font-inter">
                            {formatTime(message.timestamp.seconds * 1000)}
                          </p>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div ref={lastMessageRef} className="h-16 md:h-24 bg-gray-50"></div>

        <div
          // className={` 3 ${
          //   imageUrl && "h-52"
          // }`}
          className="sticky bottom-4 md:fixed sm:bottom-2 md:w-full"
          //   style={{ position: "sticky", bottom: 16 }}
        >
          <div className="flex justify-between mx-20 relative items-end h-full xl:mx-10 lg:mx-3 sm:mx-2">
            {imageUrl && (
              <div className="absolute left-3 top-3">
                <img
                  src={imageUrl}
                  alt="preview"
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div
                  type="button"
                  onClick={cancelImageUpload}
                  className="absolute cursor-pointer top-1 right-1  text-white h-7 w-7 flex justify-center items-center bg-red-500 rounded-full"
                >
                  <FontAwesomeIcon icon={faCircleXmark} className="w-6 h-6" />
                </div>
              </div>
            )}
            <div className="absolute bottom-3 pl-1">
              <button
                type="button"
                onClick={openImagePicker}
                className="inline-flex justify-center p-2 text-red-600 rounded-full cursor-pointer hover:text-red-900 hover:bg-red-100 transition duration-300 ease-in-out md:p-1"
              >
                <svg
                  aria-hidden="true"
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Upload image</span>
              </button>
              <button
                type="button"
                className="p-2 text-red-600 rounded-full cursor-pointer hover:text-red-900 hover:bg-red-100 transition duration-300 ease-in-out md:p-1 sm:text-red-300"
                onClick={() => setOpenEmojiPicker((prev) => !prev)}
                ref={emojiPickerRef}
              >
                <svg
                  aria-hidden="true"
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Add emoji</span>
                {openEmojiPicker && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 bottom-14 w-max h-max sm:w-full"
                  >
                    <EmojiPicker
                      className="w-[350px] emoji-style h-max sm:w-full sm:hidden"
                      emojiStyle="google"
                      onEmojiClick={handleAddEmoji}
                    />
                  </div>
                )}
              </button>
            </div>
            <div
              type="submit"
              className={` absolute right-10 w-10 h-10 flex items-center justify-center rounded-md shadow-xl hover:bg-red100 transition duration-300 ease-in-out bottom-3 md:right-2 ${
                message.length === 0 && !imageFile
                  ? "bg-red-300 hover:bg-red-400 cursor-default"
                  : message.length > 0 || imageFile
                  ? "bg-red-600 hover:bg-red-800  cursor-pointer"
                  : messageSending &&
                    "bg-red-300 hover:bg-red-400 cursor-default"
              }`}
              disabled={message.length === 0 && !imageFile}
              onClick={sendMessage}
            >
              {messageSending ? (
                "..."
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#FFFFFF"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              )}
            </div>
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div
              className={`w-full bg-white h-max border border-r-gray-200 rounded-md pl-24 pr-20 md:pl-[70px] md:pr-12 ${
                imageUrl ? "pt-20" : "h-max"
              } `}
            >
              <textarea
                placeholder="Type a message..."
                className="w-full rounded-md border border-white px-2 py-4 resize-none overflow-hidden text-black focus:outline-none focus:ring-0 focus:ring-none focus:border-white transition duration-300 ease-in-out md:px-0"
                ref={messageRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <NewMessageModal loggedInUser={loggedInUser} users={users} />
      )}
    </>
  );
};
