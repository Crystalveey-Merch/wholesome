/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { NewMessageModal } from "./NewMessageModal";
import { selectOpenNewMessageModal } from "../Features/openNewMessageModalSlice";
import { selectUser } from "../Features/userSlice";
import moment from "moment";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  collection,
  db,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  storage,
  where,
} from "../firebase/auth.js";

export const ChatView = ({ users }) => {
  const { chatId } = useParams();
  const loggedInUser = useSelector(selectUser);
  const [chatUser, setChatUser] = useState([]);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const showModal = useSelector(selectOpenNewMessageModal);

  let idOne = chatId.split("-")[0];
  let idTwo = chatId.split("-")[1];

  const navigate = useNavigate();

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

  useEffect(() => {
    const displayChat = async () => {
      const chatsRef = collection(db, "chats");

      const chatId = idOne < idTwo ? `${idOne}-${idTwo}` : `${idTwo}-${idOne}`;

      // Check if chat already exists between these two users
      const chatQuery = query(chatsRef, where("chatId", "==", chatId));
      const chatQuerySnapshot = await getDocs(chatQuery);

      let chatDocRef;
      if (chatQuerySnapshot.empty) {
        // chat does not exist
        setChats([]);
        return;
      } else {
        //  chat exists, get its messages subcollection
        chatDocRef = chatQuerySnapshot.docs[0].ref;
        const messagesRef = collection(chatDocRef, "messages");

        // Listen for new messages
        onSnapshot(messagesRef, (querySnapshot) => {
          const newMessages = [];
          querySnapshot.forEach((doc) => {
            newMessages.push(doc.data());
          });
          // sort messages by timestamp in ascending order
          newMessages.sort((a, b) => a.timestamp - b.timestamp);
          setChats(newMessages);
        });
      }
    };
    displayChat();
  }, [idOne, idTwo]);

  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadImageFile, setUploadImageFile] = useState(null);
  const imageInputRef = useRef(null);

  const [imageData, setImageData] = useState({ imageURL: "" });

  const openImagePicker = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    const chatId =
      idOne && idTwo
        ? idOne < idTwo
          ? `${idOne}-${idTwo}`
          : `${idTwo}-${idOne}`
        : "";
    console.log(chatId);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result);
        setShowImagePreview(true);
      };

      reader.readAsDataURL(file);
      setUploadImageFile(file);
    }
  };

  const cancelImageUpload = () => {
    setImagePreview("");
    setShowImagePreview(false);
    setUploadImageFile(null);
    setImageData(null);
  };

  const sendMessage = async () => {
    if (uploadImageFile) {
      const chatId =
        idOne && idTwo
          ? idOne < idTwo
            ? `${idOne}-${idTwo}`
            : `${idTwo}-${idOne}`
          : "";
      const storageRef = ref(
        storage,
        `chatImages/${chatId}/${uploadImageFile.name}`
      );
      const snapShot = await uploadBytes(storageRef, uploadImageFile);
      //remember to remove this console.log
      console.log(snapShot);
      const downloadURL = await getDownloadURL(storageRef);

      setImageData({ imageURL: downloadURL });
    }
    if (!message && !imageData?.imageURL) return;

    const chatId =
      idOne && idTwo
        ? idOne < idTwo
          ? `${idOne}-${idTwo}`
          : `${idTwo}-${idOne}`
        : "";

    const chatsRef = collection(db, "chats");
    const chatQuery = query(chatsRef, where("chatId", "==", chatId));
    const chatQuerySnapshot = await getDocs(chatQuery);

    let chatDocRef;
    if (chatQuerySnapshot.empty) {
      chatDocRef = doc(chatsRef);
      const chatData = {
        chatId,
        conversants: [idOne, idTwo],
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
      imageURL: imageData?.imageURL || null,
      timestamp,
    };

    await addDoc(messagesRef, messageData);

    setMessage("");
    setImageData(null);
    setImagePreview("");
    setShowImagePreview(false);
    setUploadImageFile(null);
  };

  if (!chatUser) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full relative min-h-screen bg-gray-50">
        <div style={{ position: "sticky", top: 0 }}>
          <div className="py-5 px-6 flex row justify-between border-b border-gray-200 bg-white shadow">
            <NavLink to={`/${chatUser.username}`} className="flex items-center">
              <img
                src={
                  chatUser.photoURL
                    ? chatUser.photoURL
                    : "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
                }
                className="w-14 h-14 rounded-full border"
              />
              <div>
                <h1 className="font-semibold text-lg ml-4">{chatUser.name}</h1>
                <p className="text-sm text-gray-500 ml-4">
                  @{chatUser.username}
                </p>
              </div>
            </NavLink>
            <button className="p-2 bg-none w-max h-max">
              {/* <img
                src="../../assets/dashboardIcons/dots-vertical.svg"
                alt="dots-vertical"
                className="w-5 h-5"
              /> */}
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-28 overflow-y-scroll h-[75vh]">
          <div className="text-center flex flex-col items-center justify-center gap-4">
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
                {chatUser.displayName}
              </h1>
              <p className="text-base text-gray-600">@{chatUser.username}</p>
            </div>
            <h3 className="text-sm text-gray-800 w-96">{chatUser.shortBio}</h3>
            <div className="flex gap-1 items-center">
              <h2 className="text-sm text-gray-600">
                Joined
                {new Date(
                  chatUser.createdAt?.seconds * 1000
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>

              <p>-</p>
              <h2 className="text-sm text-gray-600">
                {chatUser.followers?.length} followers
              </h2>
            </div>
          </div>
          <div className="mb-10 min-h-[300px]">
            <ul className="flex flex-col gap-8 px-10">
              {chats.map((message) => (
                <li key={message.timestamp}>
                  {message.senderId === loggedInUser.id ? (
                    <div className="flex flex-col gap-1.5 items-end">
                      {/* <div class="flex items-start">
                <p class="text-gray-700 text-sm font-medium text-left">You</p>
              </div>  */}
                      {message.text && (
                        <div className="bg-purple-600 py-2.5 px-3.5 rounded-lg max-w-[508px]">
                          <p className="text-white font-normal text-base">
                            {message.text}
                          </p>
                        </div>
                      )}
                      {message.imageURL && (
                        <img
                          src={message.imageURL}
                          className="w-72 h-60 rounded-lg mt-2"
                        />
                      )}
                      <p className="text-gray-600 text-xs font-normal">
                        {formatTime(message.timestamp?.seconds * 1000)}
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-3">
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
                            {/* <span v-if="chatUser.admin" class="relative" title="Admin">
                      <img
                        src="../../assets/profileIcons/admin-tag.svg"
                        alt="admin"
                        class="h-6 w-6 inline-block"
                        title="Admin"
                      />
                      <p
                        class="absolute top-0.5 left-2 text-xs font-semibold text-white"
                      >
                        A
                      </p>
                    </span> */}
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
                            className="w-72 h-60 rounded-lg mt-2"
                          />
                        )}
                        <p className="text-gray-600 text-xs font-normal">
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
        <div
          className={` bg-gray-50 border-t border-purple-300 py-3 ${
            showImagePreview && "h-52"
          }`}
          style={{ position: "sticky", bottom: 0 }}
        >
          <div className="flex justify-between px-20 relative items-end h-full">
            {showImagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-40 h-40 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={cancelImageUpload}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1.5"
                >
                  X
                </button>
              </div>
            )}
            <div className="absolute bottom-3 pl-1">
              <button
                type="button"
                onClick={openImagePicker}
                className="inline-flex justify-center p-2 text-purple-600 rounded-full cursor-pointer hover:text-purple-900 hover:bg-purple-100 transition duration-300 ease-in-out"
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
                className="p-2 text-purple-600 rounded-full cursor-pointer hover:text-purple-900 hover:bg-purple-100 transition duration-300 ease-in-out"
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
              </button>
            </div>
            <button
              type="submit"
              className={`absolute right-24 w-10 h-10 flex items-center justify-center rounded-md shadow-xl hover:bg-purple-100 transition duration-300 ease-in-out bottom-3 ${
                message.length === 0 && !showImagePreview
                  ? "text-purple-400 hover:text-purple-500 cursor-default"
                  : message.length > 0 ||
                    (showImagePreview
                      ? "text-purple-600 hover:text-purple-800"
                      : "")
              }`}
              onClick={sendMessage}
            >
              <span
                type="button"
                onClick={sendMessage}
                className={`inline-flex justify-center p-2 text-white rounded-full cursor-pointer ${
                  !message && !showImagePreview
                    ? "bg-gray-300"
                    : "bg-purple-600 hover:bg-purple-900"
                } transition duration-300 ease-in-out`}
              >
                Send
              </span>
            </button>
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <textarea
              placeholder="Type a message..."
              className="w-full bg-white font-normal text-base text-gray-900 rounded-lg py-2.5 shadow-sm focus:outline-none disabled:background-gray-50 disabled:border-gray-300 disabled:text-gray-500 after:bg-white transition duration-300 ease-in-out resize-none box-border pr-16 pl-24"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="rows"
              //   @input="handleInput"
            ></textarea>
          </div>
        </div>
      </div>
      {showModal && (
        <NewMessageModal loggedInUser={loggedInUser} users={users} />
      )}
    </>
  );
};
