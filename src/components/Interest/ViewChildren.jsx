/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartSolid,
  faShareNodes,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectUser } from "../../Features/userSlice";
import {
  HighlightedText,
  convertToLowercase,
  formatByInitialTime,
  getProfileDetails,
  handleLikeChatBox,
  handleUnlikeChatBox,
//   handleLikeChatBoxReply,
//   handleUnlikeChatBoxReply,
} from "../../Hooks";
import { RepliesThread, ReplyChatBoxModal } from ".";

export const ViewChildren = ({ chat, interest, users }) => {
  const loggedInUser = useSelector(selectUser);
  const [allChatBoxes, setAllChatBoxes] = useState([]);
  const [parentReply, setParentReply] = useState(null);
  const [threadReplies, setThreadReplies] = useState([]);
  //   const [path, setPath] = useState(null);

  const navigate = useNavigate();

  const [showReplyModal, setShowReplyModal] = useState(false);

  //   const location = useLocation();

  useEffect(() => {
    // Reset states when the page loads
    setAllChatBoxes([]);
    setParentReply(null);
    setThreadReplies([]);
  }, [chat]);

  useEffect(() => {
    if (!interest) return;
    if (!interest.chatBox) return;
    const chatBoxes = interest.chatBox.map((chatKid) => {
      return {
        ...chatKid,
        arrType: "parent",
      };
    });

    if (interest.replies.length === 0) {
      setAllChatBoxes(chatBoxes);
      return;
    }
    const replies = interest.replies.map((reply) => {
      return {
        ...reply,
        arrType: "child",
      };
    });

    const allChatBoxes = chatBoxes.concat(replies);
    setAllChatBoxes(allChatBoxes);
  }, [interest, chat]);

  useEffect(() => {
    if (!chat || !allChatBoxes) return;

    const findParent = (chatId) => {
      const parentReply = allChatBoxes.find((chatBox) => chatBox.id === chatId);
      if (!parentReply) return null;
      if (parentReply.arrType === "parent") return parentReply;

      // Set the onThread property of the reply to true
      const reply = allChatBoxes.find(
        (chatBox) => chatBox.id === parentReply.replyingToId
      );
      if (reply) reply.onThread = true;

      return findParent(parentReply.replyingToId);
    };

    const parentReply = findParent(chat.id);
    setParentReply(parentReply);

    // set chat onThread property to true
    const currentChat = allChatBoxes.find((chatBox) => chatBox.id === chat.id);
    if (currentChat) currentChat.onThread = true;

    // console.log(parentReply); // Move console.log here
  }, [chat, allChatBoxes]); // Include allChatBoxes in the dependency array

  useEffect(() => {
    // check allChatBoxes and return only the replies that has their onThread property set to true
    if (!allChatBoxes) return;
    const threadReplies = allChatBoxes.filter((chatBox) => chatBox.onThread);
    setThreadReplies(threadReplies);
  }, [allChatBoxes, chat]);

  console.log(threadReplies);
  //   console.log(parentReply);

  const renderThreadReplies = (parentId) => {
    const replies = threadReplies.filter(
      (reply) => reply.replyingToId === parentId
    );
    if (replies.length === 0) return null;

    return (
      <>
        {replies.map((reply) => (
          <RepliesThread
            key={reply.id}
            renderThreadReplies={renderThreadReplies}
            reply={reply}
            currentChatBox={chat}
            interest={interest}
            users={users}
          />
        ))}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-2 pb-10">
      {parentReply && (
        <div className="flex flex-col">
          <div
            className="flex gap-2 pt-3.5 pb-1.5 px-5 transition duration-300 ease-in-out hover:bg-gray-50 hover:cursor-pointer"
            onClick={() =>
              navigate(
                `/i/${convertToLowercase(interest.name)}/chat/${parentReply.id}`
              )
            }
          >
            <div className="flex flex-col gap-1.5 relative">
              <img
                onClick={(e) => (
                  e.stopPropagation(),
                  navigate(
                    `/${
                      getProfileDetails(parentReply.authorId, users)?.username
                    }`
                  )
                )}
                src={getProfileDetails(parentReply.authorId, users)?.photoURL}
                className="w-[40px] z-10 h-[40px] min-h-[40px] min-w-[40px] max-h-[40px] max-w-[40px] rounded-sm object-cover border-2 border-red-50 shadow-md sm:w-[35px] sm:h-[35px] sm:min-h-[35px] sm:min-w-[35px] sm:max-h-[35px] sm:max-w-[35px]"
              />
              <div className="absolute left-[1.13rem] top-9 w-1 h-full bg-gray-200 rounded-full mx-auto sm:w-1"></div>
            </div>
            <div className="w-full flex gap-1.5 flex-col">
              <div className="w-full flex justify-between items-start">
                <div
                  className="flex flex-col gap-0"
                  onClick={(e) => (
                    e.stopPropagation(),
                    navigate(
                      `/${
                        getProfileDetails(parentReply.authorId, users)?.username
                      }`
                    )
                  )}
                >
                  <div className="flex gap-1 items-center">
                    <h2 className="text-black font-inter font-semibold text-sm">
                      {getProfileDetails(parentReply.authorId, users)?.name}
                      {/* <span className="text-xs font-medium">
              @{user?.username}
            </span> */}
                    </h2>

                    <p className="text-gray-400">•</p>
                    <p className="text-gray-500 font-inter font-medium text-xs">
                      {formatByInitialTime(
                        parentReply?.createdAt.seconds * 1000
                      )}
                    </p>
                  </div>
                  <p className="text-gray-500 font-inter font-medium text-xs">
                    @{getProfileDetails(parentReply.authorId, users)?.username}
                  </p>
                </div>
                <button
                  title="More"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-gray-100"
                >
                  <FontAwesomeIcon
                    icon={faEllipsisH}
                    className="text-gray-900 h-[1.13rem] w-[1.13rem] group-hover:text-black transition duration-300 ease-in-out"
                  />
                </button>
              </div>
              <div className="text-black font-inter font-medium text-[0.95rem]">
                <HighlightedText content={parentReply.text} users={users} />
              </div>
              {/* images */}
              <div className="">
                {parentReply.images.length + parentReply.videos.length === 1 ? (
                  <div className="">
                    {parentReply.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt=""
                        className="w-full max-h-[400px] max-w-xl object-cover rounded-md"
                      />
                    ))}
                    {parentReply.videos.map((video, index) => (
                      <video
                        key={index}
                        src={video}
                        controls
                        className="w-full max-h-[400px] max-w-xl object-cover rounded-md"
                      />
                    ))}
                  </div>
                ) : parentReply.images.length + parentReply.videos.length === 2 ? (
                  <div className="flex gap-1">
                    {parentReply.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt=""
                        className="w-1/2 min-h-[180px] object-cover rounded-md"
                      />
                    ))}
                    {parentReply.videos.map((video, index) => (
                      <video
                        key={index}
                        src={video}
                        controls
                        className="w-1/2 min-h-[180px] object-cover rounded-md"
                      />
                    ))}
                  </div>
                ) : parentReply.images.length + parentReply.videos.length === 3 ? (
                  <div className="flex gap-1">
                    <div className="w-1/2">
                      {parentReply.images.length === 3 && (
                        <div className="flex flex-col gap-1">
                          {parentReply.images.slice(0, 2).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt=""
                              className="w-full h-[180px] object-cover rounded-md"
                            />
                          ))}
                        </div>
                      )}

                      {parentReply.videos.length === 3 && (
                        <div className="flex flex-col gap-1">
                          {parentReply.videos.slice(0, 2).map((video, index) => (
                            <video
                              key={index}
                              src={video}
                              controls
                              className="w-full h-[180px] object-cover rounded-md"
                            />
                          ))}
                        </div>
                      )}

                      {parentReply.images.length === 2 && (
                        <div className="flex flex-col gap-1">
                          {parentReply.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt=""
                              className="w-full h-[180px] object-cover rounded-md"
                            />
                          ))}
                        </div>
                      )}

                      {parentReply.videos.length === 2 && (
                        <div className="flex flex-col gap-1">
                          {parentReply.videos.map((video, index) => (
                            <video
                              key={index}
                              src={video}
                              controls
                              className="w-full h-[180px] object-cover rounded-md"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="w-1/2">
                      {parentReply.images.length === 1 && (
                        <img
                          src={parentReply.images[0]}
                          alt=""
                          className="w-full h-[360px] object-cover rounded-md"
                        />
                      )}

                      {parentReply.videos.length === 1 && (
                        <video
                          src={parentReply.videos[0]}
                          controls
                          className="w-full h-[360px] object-cover rounded-md"
                        />
                      )}

                      {parentReply.images.length === 3 && (
                        <img
                          src={parentReply.images[2]}
                          alt=""
                          className="w-full h-[360px] object-cover rounded-md"
                        />
                      )}

                      {parentReply.videos.length === 3 && (
                        <video
                          controls
                          src={parentReply.videos[2]}
                          className="w-full h-[360px] object-cover rounded-md"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-flow-row grid-cols-2 gap-1">
                    {parentReply.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt=""
                        className="w-full h-[180px] object-cover rounded-md"
                      />
                    ))}
                    {parentReply.videos.map((video, index) => (
                      <video
                        key={index}
                        src={video}
                        controls
                        className="w-full h-[180px] object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="w-full flex justify-between">
                <div
                  className="flex gap-5 w-max"
                  onClick={(e) => e.stopPropagation()}
                >
                  {parentReply?.likes?.includes(loggedInUser?.id) ? (
                    <div className="flex gap-0 items-center">
                      <button
                        title="Unlike"
                        className="group p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-red-100"
                        onClick={() =>
                          handleUnlikeChatBox(
                            loggedInUser.id,
                            interest,
                            parentReply,
                            interest.chatBox
                          )
                        }
                      >
                        <FontAwesomeIcon
                          icon={faHeartSolid}
                          className="text-red-500 h-[1.13rem] w-[1.13rem] group-hover:text-red-600 transition duration-300 ease-in-out"
                        />
                      </button>
                      <p className="text-gray-500 font-inter font-medium text-xs">
                        {parentReply?.likes?.length > 0
                          ? parentReply?.likes?.length
                          : ""}
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-0 items-center">
                      <button
                        title="Like"
                        onClick={() =>
                          handleLikeChatBox(
                            loggedInUser.id,
                            interest,
                            parentReply,
                            interest.chatBox
                          )
                        }
                        className="group p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-red-100"
                      >
                        <FontAwesomeIcon
                          icon={faHeart}
                          className="text-red-500 h-[1.13rem] w-[1.13rem] group-hover:text-red-600 transition duration-300 ease-in-out"
                        />
                      </button>
                      <p className="text-gray-500 font-inter font-medium text-xs">
                        {parentReply?.likes?.length > 0
                          ? parentReply?.likes?.length
                          : ""}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-0 items-center">
                    <button
                      title="Reply"
                      className="group p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-gray-100"
                        onClick={() => setShowReplyModal(true)}
                    >
                      <FontAwesomeIcon
                        icon={faComment}
                        className="text-gray-400 h-[1.13rem] w-[1.13rem] group-hover:text-gray-600 transition duration-300 ease-in-out"
                      />
                    </button>
                    <p className="text-gray-500 font-inter font-medium text-xs">
                      {parentReply?.comments?.length > 0
                        ? parentReply?.comments?.length
                        : ""}
                    </p>
                  </div>
                </div>

                <button
                  title="Share"
                  className="group p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FontAwesomeIcon
                    icon={faShareNodes}
                    className="text-gray-600 h-[1.13rem] w-[1.13rem] group-hover:text-gray-700 transition duration-300 ease-in-out"
                  />
                </button>
              </div>
            </div>
          </div>
          {threadReplies.length > 0 && renderThreadReplies(parentReply.id)}
        </div>
      )}
      <ReplyChatBoxModal
        isOpen={showReplyModal}
        setIsOpen={setShowReplyModal}
        chat={parentReply}
        interest={interest}
        users={users}
      />
    </div>
  );
};
