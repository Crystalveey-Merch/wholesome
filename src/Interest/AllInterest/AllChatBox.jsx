/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../Features/userSlice";
import { Link } from "react-router-dom";
import { ChatBoxBox } from "../../components/Interest";
import { getProfileDetails } from "../../Hooks";

export const AllChatBox = ({ interests, users }) => {
  const loggedInUser = useSelector(selectUser);
  const [allChatBox, setAllChatBox] = useState([]);
  const [userInterests, setUserInterests] = useState([]);

  useEffect(() => {
    if (loggedInUser) {
      const userInterests = interests.filter((interest) =>
        interest.members.some((member) => member.userId === loggedInUser.id)
      );
      setUserInterests(userInterests);
    }
  }, [interests, loggedInUser]);

  useEffect(() => {
    if (userInterests.length > 0) {
      const allChatBox = [];
      userInterests.forEach((interest) => {
        if (interest.chatBox) {
          interest.chatBox.forEach((chatBox) => {
            allChatBox.push({ ...chatBox, interestId: interest.id });
          });
        }
      });
      setAllChatBox(allChatBox);
    }
  }, [userInterests]);

  // console.log(allChatBox);

  return (
    <div className="pt-10 pb-20">
      <div className="flex justify-center items-center w-full">
        {loggedInUser === null ? (
          <div className="flex justify-center flex-col items-center h-[400px] gap-5">
            <h4 className="text-3xl font-semibold text-gray-900">
              You are not logged in
              <span className="ml-2 text-2xl font-semibold text-gray-900">
                😢
              </span>
            </h4>
            <p className="text-gray-500 text-center">
              Log in to see the chatbox from your interests.
              <br />
              <span>
                You can log in{" "}
                <Link to="/login" className="text-blue-500 hover:underline">
                  here
                </Link>
                .
              </span>
            </p>
          </div>
        ) : (
          <div className="w-full max-w-3xl flex flex-col gap-5 pb-10 xl:mx-auto">
            {allChatBox.length > 0 ? (
              allChatBox
                .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
                .map((chat) => {
                  const user = getProfileDetails(chat?.authorId, users);
                  return (
                    <ChatBoxBox
                      key={chat.id}
                      chat={chat}
                      interest={interests.find(
                        (interest) => interest.id === chat.interestId
                      )}
                      user={user}
                      users={users}
                    />
                  );
                })
            ) : (
              <div className="flex justify-center flex-col items-center h-[400px] gap-5">
                <h4 className="text-3xl font-semibold text-gray-900">
                  No chatbox found
                  <span className="ml-2 text-2xl font-semibold text-gray-900">
                    😢
                  </span>
                </h4>
                <p className="text-gray-500 text-center">
                  Join more interest group to see chatbox from your interests.
                  <br />
                  <span>
                    You can join an interest group{" "}
                    <Link
                      to="/i/discover"
                      className="text-blue-500 hover:underline"
                    >
                      here
                    </Link>
                    .
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
