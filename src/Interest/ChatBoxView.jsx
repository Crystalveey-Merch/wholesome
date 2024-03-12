/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RightBar } from ".";
import { convertToLowercase } from "../Hooks";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ViewParent, ViewChildren } from "../components/Interest";

export const ChatBoxView = ({ interests, users }) => {
  const { name, chatBoxId } = useParams();
  const [interest, setInterest] = useState([]);
  const [allChatBoxes, setAllChatBoxes] = useState([]);
  const [currentChatBox, setCurrentChatBox] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!name) return;
    const interest = interests.find(
      (interest) => convertToLowercase(interest.name) === name
    );
    setInterest(interest);
  }, [name, interests]);

  // set all chatboxes by putting chatBoxes and replies in one array
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
  }, [interest]);
  console.log(allChatBoxes);

  useEffect(() => {
    if (!chatBoxId) return;
    const chatBox = allChatBoxes.find((chatBox) => chatBox.id === chatBoxId);
    setCurrentChatBox(chatBox);
  }, [chatBoxId, allChatBoxes]);
  console.log(currentChatBox);

  if (!interest) return null;

  return (
    <div className="flex gap-10 py-6 w-full justify-between font-inter px-10 pb-3 md:px-4 sm:py-2">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-3xl flex flex-col gap-4">
          {" "}
          <button
            className="p-2 h-10 w-10 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-gray-50"
            onClick={() => navigate(`/i/${convertToLowercase(interest.name)}`)}
          >
            <FontAwesomeIcon icon={faArrowLeftLong} className="h-5 w-5" />
          </button>
          {currentChatBox && (
            <div className="">
              {currentChatBox.arrType === "parent" ? (
                <ViewParent
                  chat={currentChatBox}
                  interest={interest}
                  users={users}
                />
              ) : (
                <ViewChildren
                  chat={currentChatBox}
                  interest={interest}
                  users={users}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="z-10 sticky block top-0 h-max lg:hidden">
        <RightBar interest={interest} />
      </div>
    </div>
  );
};
