/* eslint-disable react/prop-types */
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartSolid,
  faShareNodes,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import {
  HighlightedText,
  formatByInitialTime,
  getProfileDetails,
  handleLikeChatBox,
  handleUnlikeChatBox,
  getReplyDetails,
} from "../../Hooks";
import { useSelector } from "react-redux";
import { selectUser } from "../../Features/userSlice";
import { ReplyChatBoxModal, ReplyUnderParent } from ".";

export const ViewParent = ({ chat, interest, users }) => {
  const loggedInUser = useSelector(selectUser);
  const user = getProfileDetails(chat?.authorId, users);

  const [showReplyModal, setShowReplyModal] = useState(false);


  return (
    <div className="flex flex-col gap-2 pb-10">
      <div className="flex flex-col gap-0">
        <div className="w-full flex justify-between items-start pb-1">
          <div className="flex gap-3 items-center">
            <img
              src={user?.photoURL}
              className="w-[40px] h-[40px] min-h-[40px] min-w-[40px] max-h-[40px] max-w-[40px] rounded-sm object-cover border-2 border-red-50 shadow-md sm:w-[35px] sm:h-[35px] sm:min-h-[35px] sm:min-w-[35px] sm:max-h-[35px] sm:max-w-[35px]"
            />
            <div className="flex flex-col gap-0">
              <div className="flex gap-1 items-center">
                <h2 className="text-black font-inter font-semibold text-sm">
                  {user?.name}{" "}
                  {/* <span className="text-xs font-medium">
              @{user?.username}
            </span> */}
                </h2>
                <p className="text-gray-400">•</p>
                <p className="text-gray-500 font-inter font-medium text-xs">
                  {formatByInitialTime(chat?.createdAt.seconds * 1000)}
                </p>
              </div>
              <p className="text-gray-500 font-inter font-medium text-xs">
                @{user?.username}
              </p>
            </div>
          </div>
          <button className="p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-gray-50">
            <FontAwesomeIcon
              icon={faEllipsisH}
              className="text-gray-900 h-[1.13rem] w-[1.13rem] group-hover:text-black transition duration-300 ease-in-out"
            />
          </button>
        </div>
        <div className="flex flex-col gap-1 py-2">
          {" "}
          <div className="text-black font-inter font-medium text-[0.95rem]">
            <HighlightedText content={chat.text} users={users} />
          </div>
          <div className="">
            {chat.images.length + chat.videos.length === 1 ? (
              <div className="">
                {chat.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt=""
                    className="w-full max-h-[400px] max-wxl object-cover rounded-md"
                  />
                ))}
                {chat.videos.map((video, index) => (
                  <video
                    key={index}
                    src={video}
                    controls
                    className="w-full max-h-[400px] maxw-xl object-cover rounded-md"
                  />
                ))}
              </div>
            ) : chat.images.length + chat.videos.length === 2 ? (
              <div className="flex gap-1">
                {chat.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt=""
                    className="w-1/2 min-h-[180px] object-cover rounded-md"
                  />
                ))}
                {chat.videos.map((video, index) => (
                  <video
                    key={index}
                    src={video}
                    controls
                    className="w-1/2 min-h-[180px] object-cover rounded-md"
                  />
                ))}
              </div>
            ) : chat.images.length + chat.videos.length === 3 ? (
              <div className="flex gap-1">
                <div className="w-1/2">
                  {chat.images.length === 3 && (
                    <div className="flex flex-col gap-1">
                      {chat.images.slice(0, 2).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt=""
                          className="w-full h-[180px] object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}

                  {chat.videos.length === 3 && (
                    <div className="flex flex-col gap-1">
                      {chat.videos.slice(0, 2).map((video, index) => (
                        <video
                          key={index}
                          src={video}
                          controls
                          className="w-full h-[180px] object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}

                  {chat.images.length === 2 && (
                    <div className="flex flex-col gap-1">
                      {chat.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt=""
                          className="w-full h-[180px] object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}

                  {chat.videos.length === 2 && (
                    <div className="flex flex-col gap-1">
                      {chat.videos.map((video, index) => (
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
                  {chat.images.length === 1 && (
                    <img
                      src={chat.images[0]}
                      alt=""
                      className="w-full h-[360px] object-cover rounded-md"
                    />
                  )}

                  {chat.videos.length === 1 && (
                    <video
                      src={chat.videos[0]}
                      controls
                      className="w-full h-[360px] object-cover rounded-md"
                    />
                  )}

                  {chat.images.length === 3 && (
                    <img
                      src={chat.images[2]}
                      alt=""
                      className="w-full h-[360px] object-cover rounded-md"
                    />
                  )}

                  {chat.videos.length === 3 && (
                    <video
                      controls
                      src={chat.videos[2]}
                      className="w-full h-[360px] object-cover rounded-md"
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-flow-row grid-cols-2 gap-1">
                {chat.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt=""
                    className="w-full h-[180px] object-cover rounded-md"
                  />
                ))}
                {chat.videos.map((video, index) => (
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
          <div className="flex flex-col gap-1">
            <div className="w-full flex justify-between">
              <div className="flex gap-5">
                {chat?.likes?.includes(loggedInUser?.id) ? (
                  <div className="flex gap-0 items-center">
                    <button
                      title="Unlike"
                      className="group p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-red-50"
                      onClick={() =>
                        handleUnlikeChatBox(
                          loggedInUser.id,
                          interest,
                          chat,
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
                      {chat?.likes?.length > 0 ? chat?.likes?.length : ""}
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
                          chat,
                          interest.chatBox
                        )
                      }
                      className="group p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-red-50"
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="text-red-500 h-[1.13rem] w-[1.13rem] group-hover:text-red-600 transition duration-300 ease-in-out"
                      />
                    </button>
                    <p className="text-gray-500 font-inter font-medium text-xs">
                      {chat?.likes?.length > 0 ? chat?.likes?.length : ""}
                    </p>
                  </div>
                )}
                <div className="flex gap-0 items-center">
                  <button
                    title="Reply"
                    className="group p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-gray-50"
                    onClick={() => setShowReplyModal(true)}
                  >
                    <FontAwesomeIcon
                      icon={faComment}
                      className="text-gray-400 h-[1.13rem] w-[1.13rem] group-hover:text-gray-600 transition duration-300 ease-in-out"
                    />
                  </button>
                  <p className="text-gray-500 font-inter font-medium text-xs">
                    {chat?.comments?.length > 0 ? chat?.comments?.length : ""}
                  </p>
                </div>
              </div>

              <button
                title="Share"
                className="group p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-gray-50"
              >
                <FontAwesomeIcon
                  icon={faShareNodes}
                  className="text-gray-600 h-[1.13rem] w-[1.13rem] group-hover:text-gray-700 transition duration-300 ease-in-out"
                />
              </button>
            </div>
            <button className="w-max text-gray-500 text-start font-inter font-medium text-xs transition duration-300 ease-in-out hover:text-gray-600 hover:underline">
              View post activity
            </button>
          </div>
        </div>

        <hr className="border-gray-200" />
        {chat.comments.length > 0 && (
          <div className="flex flex-col gap-0">
            {chat.comments.map((reply, index) => (
              <ReplyUnderParent
                key={index}
                reply={getReplyDetails(reply.id, interest)}
                // chat={chat}
                interest={interest}
                users={users}
              />
            ))}
          </div>
        )}
      </div>
      <ReplyChatBoxModal
        isOpen={showReplyModal}
        setIsOpen={setShowReplyModal}
        chat={chat}
        interest={interest}
        users={users}
      />
    </div>
  );
};
