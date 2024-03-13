/* eslint-disable react/prop-types */
import { useState } from "react";
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
  handleLikeChatBoxReply,
  handleUnlikeChatBoxReply,
} from "../../Hooks";
import { ReplyChatBoxModal2 } from ".";

export const RepliesThread = ({
  renderThreadReplies,
  reply,
  currentChatBox,
  interest,
  users,
}) => {
  const navigate = useNavigate();
  const loggedInUser = useSelector(selectUser);

  const [showReplyModal, setShowReplyModal] = useState(false);

  return (
    <div>
      {/* Render reply content */}
      {/* {currentChatBox?.id === reply.id ? (
        <div></div>
      ) : (
        <a href={`/i/${convertToLowercase(interest.name)}/chat/${reply.id}`}>
          <div className="px-3 py-3 bg-gray-50 rounded-md">
            <p className="text-black font-inter font-normal text-sm">
              {reply.text}
            </p>
          </div>
        </a>
      )} */}
      <div
        className={`flex gap-2 pt-3.5 pb-1.5 transition duration-300 ease-in-out ${
          currentChatBox?.id === reply.id
            ? "px-3"
            : "px-5 hover:bg-gray-50 hover:cursor-pointer"
        }`}
        onClick={() => {
          currentChatBox?.id === reply.id
            ? null
            : navigate(
                `/i/${convertToLowercase(interest.name)}/chat/${reply.id}`
              );
          //   setAllChatBoxes([]),
        }}
      >
        <div className="flex flex-col gap-1.5 relative">
          <img
            onClick={(e) => (
              e.stopPropagation(),
              navigate(`/${getProfileDetails(reply.authorId, users)?.username}`)
            )}
            src={getProfileDetails(reply.authorId, users)?.photoURL}
            className="w-[40px] z-10 h-[40px] min-h-[40px] min-w-[40px] max-h-[40px] max-w-[40px] rounded-sm object-cover border-2 border-red-50 shadow-md sm:w-[35px] sm:h-[35px] sm:min-h-[35px] sm:min-w-[35px] sm:max-h-[35px] sm:max-w-[35px]"
          />
          {currentChatBox?.id === reply.id ? null : (
            <div className="absolute left-[1.13rem] top-9 w-1 h-full bg-gray-200 rounded-full mx-auto sm:w-1"></div>
          )}
        </div>
        <div className="w-full flex gap-1.5 flex-col">
          <div className="w-full flex justify-between items-start">
            <div
              className="flex flex-col gap-0"
              onClick={(e) => (
                e.stopPropagation(),
                navigate(
                  `/${getProfileDetails(reply.authorId, users)?.username}`
                )
              )}
            >
              <div className="flex gap-1 items-center">
                <h2 className="text-black font-inter font-semibold text-sm">
                  {getProfileDetails(reply.authorId, users)?.name}
                  {/* <span className="text-xs font-medium">
              @{user?.username}
            </span> */}
                </h2>

                <p className="text-gray-400">•</p>
                <p className="text-gray-500 font-inter font-medium text-xs">
                  {formatByInitialTime(reply?.createdAt.seconds * 1000)}
                </p>
              </div>
              <p className="text-gray-500 font-inter font-medium text-xs">
                @{getProfileDetails(reply.authorId, users)?.username}
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
            <HighlightedText content={reply.text} users={users} />
          </div>
          <div className="">
            {reply.images.length + reply.videos.length === 1 ? (
              <div className="">
                {reply.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt=""
                    className="w-full max-h-[400px] max-w-xl object-cover rounded-md"
                  />
                ))}
                {reply.videos.map((video, index) => (
                  <video
                    key={index}
                    src={video}
                    controls
                    className="w-full max-h-[400px] max-w-xl object-cover rounded-md"
                  />
                ))}
              </div>
            ) : reply.images.length + reply.videos.length === 2 ? (
              <div className="flex gap-1">
                {reply.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt=""
                    className="w-1/2 min-h-[180px] object-cover rounded-md"
                  />
                ))}
                {reply.videos.map((video, index) => (
                  <video
                    key={index}
                    src={video}
                    controls
                    className="w-1/2 min-h-[180px] object-cover rounded-md"
                  />
                ))}
              </div>
            ) : reply.images.length + reply.videos.length === 3 ? (
              <div className="flex gap-1">
                <div className="w-1/2">
                  {reply.images.length === 3 && (
                    <div className="flex flex-col gap-1">
                      {reply.images.slice(0, 2).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt=""
                          className="w-full h-[180px] object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}

                  {reply.videos.length === 3 && (
                    <div className="flex flex-col gap-1">
                      {reply.videos.slice(0, 2).map((video, index) => (
                        <video
                          key={index}
                          src={video}
                          controls
                          className="w-full h-[180px] object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}

                  {reply.images.length === 2 && (
                    <div className="flex flex-col gap-1">
                      {reply.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt=""
                          className="w-full h-[180px] object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}

                  {reply.videos.length === 2 && (
                    <div className="flex flex-col gap-1">
                      {reply.videos.map((video, index) => (
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
                  {reply.images.length === 1 && (
                    <img
                      src={reply.images[0]}
                      alt=""
                      className="w-full h-[360px] object-cover rounded-md"
                    />
                  )}

                  {reply.videos.length === 1 && (
                    <video
                      src={reply.videos[0]}
                      controls
                      className="w-full h-[360px] object-cover rounded-md"
                    />
                  )}

                  {reply.images.length === 3 && (
                    <img
                      src={reply.images[2]}
                      alt=""
                      className="w-full h-[360px] object-cover rounded-md"
                    />
                  )}

                  {reply.videos.length === 3 && (
                    <video
                      controls
                      src={reply.videos[2]}
                      className="w-full h-[360px] object-cover rounded-md"
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-flow-row grid-cols-2 gap-1">
                {reply.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt=""
                    className="w-full h-[180px] object-cover rounded-md"
                  />
                ))}
                {reply.videos.map((video, index) => (
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
              {reply?.likes?.includes(loggedInUser?.id) ? (
                <div className="flex gap-0 items-center">
                  <button
                    title="Unlike"
                    className="group p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-red-100"
                    onClick={() =>
                      handleUnlikeChatBoxReply(
                        loggedInUser.id,
                        interest,
                        interest.replies,
                        reply
                      )
                    }
                  >
                    <FontAwesomeIcon
                      icon={faHeartSolid}
                      className="text-red-500 h-[1.13rem] w-[1.13rem] group-hover:text-red-600 transition duration-300 ease-in-out"
                    />
                  </button>
                  <p className="text-gray-500 font-inter font-medium text-xs">
                    {reply?.likes?.length > 0 ? reply?.likes?.length : ""}
                  </p>
                </div>
              ) : (
                <div className="flex gap-0 items-center">
                  <button
                    title="Like"
                    onClick={() =>
                      handleLikeChatBoxReply(
                        loggedInUser.id,
                        interest,
                        interest.replies,
                        reply
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
                    {reply?.likes?.length > 0 ? reply?.likes?.length : ""}
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
                  {reply?.replies?.length > 0 ? reply?.replies?.length : ""}
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

      {/* Render child replies recursively */}
      {renderThreadReplies(reply.id)}
      <ReplyChatBoxModal2
        isOpen={showReplyModal}
        setIsOpen={setShowReplyModal}
        reply={reply}
        interest={interest}
        users={users}
      />
    </div>
  );
};
