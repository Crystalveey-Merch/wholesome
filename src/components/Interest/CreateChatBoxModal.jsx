/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { useSelector } from "react-redux";
import { selectUser } from "../../Features/userSlice";
// import { useNavigate } from "react-router-dom";
import {
  faXmarkCircle,
  faImage,
  faSquarePollVertical,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAutosizeTextArea } from "../../Hooks";
import { db, doc, updateDoc, arrayUnion } from "../../firebase/auth";
import { toast } from "react-toastify";

export const CreateChatBoxModal = ({ isOpen, setIsOpen, interest }) => {
//   const navigate = useNavigate();
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
    p: "24px",
    zIndex: 100,
  };

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  const textRef = useRef(null);
  useAutosizeTextArea(textRef.current, text);

  const postType = "default";

  const handleCreateChatBox = async () => {
    setLoading(true);

    if (postType === "default" && text.trim() === "") {
      toast.error("Chatbox can't be empty");
      setLoading(false);
      return;
    }

    const interestRef = doc(db, "interests", interest.id);

    const newChatBox = {
      text,
      authorId: loggedInUser.id,
      images: [],
      likes: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      isDeleted: false,
      type: postType,
      id: loggedInUser.id + Date.now(),
    };

    try {
      await updateDoc(interestRef, {
        chatBox: arrayUnion(newChatBox),
      });
      setLoading(false);
      setIsOpen(false);
      setText("");
      toast.success("Chatbox created successfully");
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
          <div className="flex flex-col gap-6">
            <div className="border-b border-gray-200 pb-3 flex justify-between items-center">
              <h3 className="text-lg font-inter font-semibold text-black">
                Create Chatbox
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500"
              >
                <FontAwesomeIcon icon={faXmarkCircle} className="h-6 w-6" />
              </button>
            </div>
            <div className="flex gap-2">
              <img
                src={loggedInUser?.photoURL}
                className="w-[40px] h-[40px] min-h-10 min-w-10 max-h-[40px] max-w-[40px] rounded-sm object-cover border-2 border-red-50 shadow-md"
              />
              <div className="flex flex-col gap-0">
                <h1 className="text-lg font-inter font-semibold text-black">
                  {loggedInUser?.name}
                </h1>
                <p className="text-gray-500 text-xs font-inter">
                  @{loggedInUser?.username}
                </p>
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-scroll scroll-bar-beauty sm:max-h-[calc(100vh-100px)]">
              <textarea
                placeholder="What's on your mind?"
                className="w-full rounded-md font-inter text-base border bggray-200 border-white px-0.5 py-4 resize-none overflow-hidden text-black focus:outline-none focus:ring-0 focus:ring-none focus:border-white transition duration-300 ease-in-out md:px-0"
                ref={textRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-5">
                <button className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faImage}
                    className="text-green-500 h-5 w-5 opacity-50 cursor-default"
                  />
                </button>
                <button className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faSquarePollVertical}
                    className="text-yellow-500 h-5 w-5 opacity-50 cursor-default"
                  />
                </button>
                <button className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faFaceSmile}
                    className="text-orange-500 h-5 w-5 opacity-50 cursor-default"
                  />
                </button>
              </div>
              <hr className="border-gray-200" />
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
              Post
            </button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};
