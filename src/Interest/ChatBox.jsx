/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HighlightedText,
  convertToLowercase,
  formatByInitialTime,
  getProfileDetails,
  handleLikeChatBox,
  handleUnlikeChatBox,
} from "../Hooks";
import { selectUser } from "../Features/userSlice";
import { CreateChatBoxModal } from "../components/Interest";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartSolid,
  faShareNodes,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ChatBox = ({ interests, users }) => {
  const { name } = useParams();
  const [interest, setInterest] = useState([]);
  const loggedInUser = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!name) return;
    const interest = interests.find(
      (interest) => convertToLowercase(interest.name) === name
    );
    setInterest(interest);
  }, [name, interests]);

  const [showChatModal, setShowChatModal] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <button
        className="p-4 border border-gray-100 rounded-xl bg-white flex gap-4 items-center justify-start"
        onClick={() => setShowChatModal(true)}
      >
        <button onClick={() => navigate(`/${loggedInUser?.username}`)}>
          <img
            src={loggedInUser?.photoURL}
            alt="profile pic"
            className="w-[40px] h-[40px] min-h-10 min-w-10 max-h-[40px] max-w-[40px] rounded-sm object-cover border-2 border-red-50 shadow-md"
          />
        </button>

        <div className="w-full h[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 border border-gray-100 rounded-2xl hover:border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-0 focus:border-gray-300 focus:ring-transparent transition duration-300 ease-in-out">
          <p className="text-black font-inter text-sm text-start">
            Start a conversation...
          </p>
        </div>
      </button>
      <div className="flex flex-col gap-5 pb-10">
        {interest?.chatBox?.length > 0 ? (
          interest?.chatBox?.map((chat) => {
            const user = getProfileDetails(chat?.authorId, users);
            return (
              <div
                key={chat.id}
                className="p-4 border border-gray-100 rounded-xl bg-white flex gap-2.5"
              >
                <img
                  src={user?.photoURL}
                  className="w-[40px] h-[40px] min-h-10 min-w-10 max-h-[40px] max-w-[40px] rounded-sm object-cover border-2 border-red-50 shadow-md"
                />
                <div className="w-full flex gap-1.5 flex-col">
                  <div className="w-full flex justify-between items-start">
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
                    <button className="p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-gray-50">
                      <FontAwesomeIcon
                        icon={faEllipsisH}
                        className="text-gray-900 h-[1.13rem] w-[1.13rem] group-hover:text-black transition duration-300 ease-in-out"
                      />
                    </button>
                  </div>
                  <div className="text-black font-inter font-medium text-[0.95rem]">
                    <HighlightedText content={chat.text} users={users} />
                  </div>
                  <div className="w-full flex justify-between">
                    <div className="flex gap-5">
                      {chat?.likes?.includes(loggedInUser?.id) ? (
                        <div className="flex gap-0 items-center">
                          <button
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
                            {chat.likes.length > 0 ? chat.likes.length : ""}
                          </p>
                        </div>
                      ) : (
                        <div className="flex gap-0 items-center">
                          <button
                            onClick={() =>
                              handleLikeChatBox(loggedInUser.id, interest, chat, interest.chatBox)
                            }
                            className="group p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-red-50"
                          >
                            <FontAwesomeIcon
                              icon={faHeart}
                              className="text-red-500 h-[1.13rem] w-[1.13rem] group-hover:text-red-600 transition duration-300 ease-in-out"
                            />
                          </button>
                          <p className="text-gray-500 font-inter font-medium text-xs">
                            {chat.likes.length > 0 ? chat.likes.length : ""}
                          </p>
                        </div>
                      )}
                      <button className="group p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-gray-50">
                        <FontAwesomeIcon
                          icon={faComment}
                          className="text-gray-400 h-[1.13rem] w-[1.13rem] group-hover:text-gray-600 transition duration-300 ease-in-out"
                        />
                      </button>
                    </div>

                    <button className="group p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-gray-50">
                      <FontAwesomeIcon
                        icon={faShareNodes}
                        className="text-gray-600 h-[1.13rem] w-[1.13rem] group-hover:text-gray-700 transition duration-300 ease-in-out"
                      />
                    </button>

                    {/* <div className="flex gap-3 items-center">
                      <FontAwesomeIcon
                        icon={faHeartSolid}
                        className="text-gray-400 text-sm"
                      />
                      <FontAwesomeIcon
                        icon={faComment}
                        className="text-gray-400 text-sm"
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-base font-inter font-semibold text-black">
              {interest.name} has no chatbox yet.{" "}
              <span className="text-[#3a4e4d]">Be the first contributor</span>
            </p>
          </div>
        )}
      </div>
      <CreateChatBoxModal
        isOpen={showChatModal}
        setIsOpen={setShowChatModal}
        interest={interest}
      />
    </div>
  );
};
