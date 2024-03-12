/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { useSelector } from "react-redux";
import { selectUser } from "../../Features/userSlice";

import {
  faXmarkCircle,
  faImage,
  faSquarePollVertical,
  faFaceSmile,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getProfileDetails,
  useAutosizeTextArea,
  convertToLowercase,
} from "../../Hooks";
import { db, doc, updateDoc, arrayUnion, storage } from "../../firebase/auth";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ReplyChatContent } from ".";

export const ReplyChatBoxModal = ({
  isOpen,
  setIsOpen,
  chat,
  interest,
  users,
}) => {
  const loggedInUser = useSelector(selectUser);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(100% - 64px)",
    maxWidth: "580px",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "10px",
    p: "20px",
    zIndex: 100,
    // responsive
    "@media (max-width: 639px)": {
      width: "calc(100% - 0px)",
      height: "calc(100% - 0px)",
      borderRadius: "0px",
      p: "10px",
    },
  };

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const textRef = useRef(null);
  useAutosizeTextArea(textRef.current, text);

  const handleAddEmoji = (emojiObject) => {
    setText((text) => text + emojiObject.emoji);
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

  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState([]);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const openImagePicker = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const openVideoPicker = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    }
  };

  const handleImageFileChange = (e) => {
    if (
      imageFiles.length + videoFiles.length + e.target.files.length > 4 ||
      mediaPreviewUrls.length + e.target.files.length > 4
    ) {
      toast.error("You can only upload 4 media files at a time");
      return;
    }
    const files = Array.from(e.target.files || []);
    const previewUrls = [];
    const newFiles = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        previewUrls.push(reader.result);
        if (previewUrls.length === files.length) {
          setMediaPreviewUrls([...mediaPreviewUrls, ...previewUrls]);
        }
      };
      reader.readAsDataURL(file);
      newFiles.push(file);
    });

    setImageFiles([...imageFiles, ...newFiles]);
  };

  const handleVideoFileChange = (e) => {
    if (
      imageFiles.length + videoFiles.length + e.target.files.length > 4 ||
      mediaPreviewUrls.length + e.target.files.length > 4
    ) {
      toast.error("You can only upload 4 media files at a time");
      return;
    }
    const files = Array.from(e.target.files || []);
    const previewUrls = [];
    const newFiles = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        previewUrls.push(reader.result);
        if (previewUrls.length === files.length) {
          setMediaPreviewUrls([...mediaPreviewUrls, ...previewUrls]);
        }
      };
      reader.readAsDataURL(file);
      newFiles.push(file);
    });

    setVideoFiles([...videoFiles, ...newFiles]);
  };

  const cancelMediaFile = (index) => {
    const updatedPreviewUrls = [...mediaPreviewUrls];
    updatedPreviewUrls.splice(index, 1);
    setMediaPreviewUrls(updatedPreviewUrls);

    if (index < imageFiles.length) {
      const updatedImageFiles = [...imageFiles];
      updatedImageFiles.splice(index, 1);
      setImageFiles(updatedImageFiles);
    } else {
      const updatedVideoFiles = [...videoFiles];
      const videoIndex = index - imageFiles.length;
      updatedVideoFiles.splice(videoIndex, 1);
      setVideoFiles(updatedVideoFiles);
    }
  };

  const postType = "default";
  const level = "replies";

  const handleCreateChatBox = async () => {
    setLoading(true);

    if (postType === "default" && text.trim() === "") {
      toast.error("Chatbox can't be empty");
      setLoading(false);
      return;
    }

    const interestRef = doc(db, "interests", interest.id);

    // Upload media files and get their download URLs
    const imageDownloadUrls = await Promise.all(
      imageFiles.map(async (file) => {
        const imageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(imageRef, file);
        const downloadUrl = await getDownloadURL(imageRef);
        return downloadUrl;
      })
    );

    // Upload video files and get their download URLs
    const videoDownloadUrls = await Promise.all(
      videoFiles.map(async (file) => {
        const videoRef = ref(storage, `videos/${file.name}`);
        await uploadBytes(videoRef, file);
        const downloadUrl = await getDownloadURL(videoRef);
        return downloadUrl;
      })
    );

    const newChatBox = {
      text,
      authorId: loggedInUser.id,
      images: imageDownloadUrls,
      videos: videoDownloadUrls,
      likes: [],
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      isDeleted: false,
      type: postType,
      level,
      id: loggedInUser.id + Date.now(),
      replyingToId: chat.id,
    };

    const newNotification = {
      type: "reply",
      replyType: "chat",
      chatId: chat.id,
      interestId: interest.id,
      id: loggedInUser.id + "-" + Date.now(),
      content: `${chat.text}`,
      fromUserId: loggedInUser.id,
      createdAt: new Date(),
      hasRead: false,
      hasSeen: false,
      hasDeleted: false,
      link: `/i/${convertToLowercase(interest.name)}/chat/${chat.id}`,
    };

    // const newComment = {
    //   text,
    //   authorId: loggedInUser.id,
    //   images: imageDownloadUrls,
    //   videos: videoDownloadUrls,
    //   likes: [],
    //   replies: [],
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   isEdited: false,
    //   isDeleted: false,
    //   type: postType,
    //   level,
    //   id: loggedInUser.id + Date.now(),
    //   replyingToId: chat.id,
    // };

    try {
      await updateDoc(interestRef, {
        replies: arrayUnion(newChatBox),
      });

      await updateDoc(interestRef, {
        // also update newReply to the chat
        chatBox: interest.chatBox.map((chatS) =>
          chatS.id === chat.id
            ? {
                ...chatS,
                comments: [...chatS.comments, newChatBox],
              }
            : chatS
        ),
      });

      //   add notification to the author of the chat
      const chatAuthorRef = doc(db, "users", chat.authorId);
      if (chat.authorId !== loggedInUser.id) {
        await updateDoc(chatAuthorRef, {
          notifications: arrayUnion(newNotification),
        });
      }

      setLoading(false);
      setIsOpen(false);
      setText("");
      setMediaPreviewUrls([]);
      setImageFiles([]);
      setVideoFiles([]);
      toast.success("Reply is successfully posted");
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={isOpen}>
        <Box sx={style}>
          <div className="flex flex-col gap-6sm:h-full">
            <div className="border-b border-gray-200 pb-3 flex justify-between items-center">
              <h3 className="text-lg font-inter font-semibold text-black">
                Reply
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500"
              >
                <FontAwesomeIcon icon={faXmarkCircle} className="h-6 w-6" />
              </button>
            </div>
            <div className="flex pt-4 flex-col gap-1.5 h-full max-h-[75vh] overflow-y-scroll scroll-bar-beauty ">
              <div className="flex gap-1">
                <div className="flex flex-col gap-1.5">
                  {" "}
                  <img
                    src={getProfileDetails(chat?.authorId, users)?.photoURL}
                    className="w-[40px] h-[40px] min-h-[40px] min-w-[40px] max-h-[40px] max-w-[40px] rounded-sm object-cover border-2 border-red-50 shadow-md sm:w-[35px] sm:h-[35px] sm:min-h-[35px] sm:min-w-[35px] sm:max-h-[35px] sm:max-w-[35px]"
                  />
                  {/* long line to connect */}
                  <div className="w-1 h-full bg-gray-200 rounded-full mx-auto sm:w-1"></div>
                </div>

                <ReplyChatContent chat={chat} users={users} />
              </div>
              <div className="flex gap-1">
                <div className="flex">
                  <img
                    src={loggedInUser?.photoURL}
                    className="w-[40px] h-[40px] min-h-10 min-w-10 max-h-[40px] max-w-[40px] rounded-sm object-cover border-2 border-red-50 shadow-md"
                  />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <div className="flex flex-col gap-0">
                    <h1 className="text-base font-inter font-semibold text-black sm:text-[0.95rem]">
                      {loggedInUser?.name}
                    </h1>
                    {/* <p className="text-gray-500 text-xs font-inter">
                    @{loggedInUser?.username}
                  </p> */}
                  </div>
                  <div className="max-h-[400px] overflow-y-scroll scroll-bar-beauty w-full sm:max-h-[calc(100vh-300px)]">
                    <textarea
                      placeholder={`Reply to ${
                        getProfileDetails(chat?.authorId, users)?.name
                      }`}
                      className="w-full rounded-md font-inter text-base border bggray-200 border-white px-0.5 py-1 resize-none overflow-hidden text-black focus:outline-none focus:ring-0 focus:ring-none focus:border-white transition duration-300 ease-in-out md:px-0"
                      ref={textRef}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    {/* media uploads */}
                    <div
                      className={`w-full p-2 h-max flex flex-shrink 2xl:p2 sm:p1 ${
                        mediaPreviewUrls.length === 1
                          ? "bg-slate50 flex flex-shrink w-full"
                          : mediaPreviewUrls.length > 1
                          ? " gap-4 bg-slate50 sm:gap-1"
                          : mediaPreviewUrls.length === 2
                          ? "flex flex-shrink"
                          : mediaPreviewUrls.length === 3
                          ? "flex flex-shrink"
                          : mediaPreviewUrls.length === 4
                          ? " grid grid-cols-2 grid-flow-row"
                          : ""
                      }`}
                      style={{
                        display: mediaPreviewUrls.length > 2 ? "grid" : "flex",
                        gridTemplateColumns:
                          mediaPreviewUrls.length > 2
                            ? "repeat(2, minmax(0, 1fr))"
                            : "",
                        gridAutoFlow: mediaPreviewUrls.length > 2 ? "row" : "",
                      }}
                    >
                      {mediaPreviewUrls.map((url, index) => (
                        <div
                          key={index}
                          className={`relative object-cover w-full rounded-lg
                                 ${
                                   mediaPreviewUrls.length === 1
                                     ? ""
                                     : mediaPreviewUrls.length === 2
                                     ? "max-w[65%]"
                                     : mediaPreviewUrls.length === 3
                                     ? ""
                                     : ""
                                 }
                                `}
                        >
                          <div className="relative">
                            {url.includes("image") && (
                              <img
                                src={url}
                                alt={`Preview ${index}`}
                                // className={`max-h-[500px] object-cover rounded-lg ${mediaPreviewUrls.length === 1 ? "w-[95%]" : mediaPreviewUrls.length === 2 ? "w-[50%]" : mediaPreviewUrls.length === 3 ? "w-[33%]" : ""}`}
                                className="w-full h-full max-h-[350px] object-cover rounded-lg object-top shadow-md"
                              />
                            )}
                          </div>
                          <div>
                            {url.includes("video") && (
                              <video
                                src={url}
                                className="w-full h-full object-cover rounded-lg object-top shadow-md"
                                controls
                              />
                            )}
                          </div>
                          <button
                            onClick={() => cancelMediaFile(index)}
                            className="absolute top-2 right-2 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white shadow-md hover:bg-gray-900 transition duration-500 ease-in-out"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5 z-10 pt-4">
              <div className="flex flex-col gap-4 relative">
                <div className="flex items-center gap-5">
                  <button
                    className="flex items-center gap-2"
                    onClick={openImagePicker}
                    title="add image"
                  >
                    <FontAwesomeIcon
                      icon={faImage}
                      className="text-green-500 h-5 w-5"
                    />
                  </button>
                  <button
                    className="flex items-center gap-2"
                    onClick={openVideoPicker}
                    title="add video"
                  >
                    <FontAwesomeIcon
                      icon={faVideo}
                      className="text-red-500 h-5 w-5"
                    />
                  </button>
                  <button className="flex items-center gap-2" title="add poll">
                    <FontAwesomeIcon
                      icon={faSquarePollVertical}
                      className="text-yellow-500 h-5 w-5 opacity-50 cursor-default"
                    />
                  </button>
                  <button
                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                    ref={emojiPickerRef}
                    className="flex items-center gap-2"
                    title="add emoji"
                  >
                    <FontAwesomeIcon
                      icon={faFaceSmile}
                      className="text-orange-500 h-5 w-5"
                    />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    onChange={handleImageFileChange}
                    className="hidden"
                    id="image-input"
                    multiple
                  />
                  <input
                    type="file"
                    accept="video/*"
                    ref={videoInputRef}
                    onChange={handleVideoFileChange}
                    className="hidden"
                    id="video-input"
                    multiple
                  />
                </div>
                <hr className="border-gray-200" />
                {openEmojiPicker && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-60 -top-32 bg-white w-max h-max sm:w-full"
                  >
                    <EmojiPicker
                      className="w-[350px] z-20 emoji-style bg-white h-max sm:w-full sm:hidden"
                      emojiStyle="google"
                      onEmojiClick={handleAddEmoji}
                    />
                  </div>
                )}
              </div>
              <button
                className={`bg-[#ff5841] text-white font-inter font-semibold text-base py-2.5 rounded-md focus:outline-none focus:ring-0 focus:ring-none focus:border-white transition duration-300 ease-in-out ${
                  text.trim() === "" || loading
                    ? "opacity-50 cursor-default"
                    : "cursor-pointer"
                }`}
                onClick={handleCreateChatBox}
                disabled={text.trim() === "" || loading}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};
