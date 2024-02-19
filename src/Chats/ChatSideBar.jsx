/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openNewMessageModal } from "../Features/openNewMessageModalSlice";
import plusSquareSVG from "./square-plus-regular.svg";

export const ChatSideBar = ({ loggedInUser, users, otherUsers }) => {
  const dispatch = useDispatch();

  const openModal = () => {
    dispatch(openNewMessageModal());
  };

  const [sortedUsersWithLastMessage, setSortedUsersWithLastMessage] = useState(
    []
  );

  const otherUsersIds = otherUsers.map((user) => user.id);

  useEffect(() => {
    if (!users.length || !otherUsers.length || !otherUsersIds.length) return;
    const sortedUsersWithLastMessage = users
      .filter((user) => otherUsersIds.includes(user.id))
      .map((user) => {
        const lastMessageData = otherUsers.reduce((acc, curr) => {
          if (curr.id === user.id) {
            acc = curr.lastMessageData;
          }
          return acc;
        }, null);
        return {
          ...user,
          lastMessageData,
        };
      })
      .filter((user) => user.lastMessageData !== null)
      .sort(
        (a, b) =>
          b.lastMessageData.timestamp.toMillis() -
          a.lastMessageData.timestamp.toMillis()
      );

    // Update state with the sorted array
    setSortedUsersWithLastMessage(sortedUsersWithLastMessage);
  }, [users, otherUsers, otherUsersIds]);

  console.log(sortedUsersWithLastMessage);

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp.seconds * 1000); // Convert to milliseconds
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 1000) {
      return "just now";
    } else if (diff < 60 * 1000) {
      const seconds = Math.floor(diff / 1000);
      return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
    } else if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    }
  }

  return (
    <div className="border-r border-gray-200 w-96 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-gray-200">
        <div className="text-lg font-semibold text-gray-900">Messages</div>
        <button className="p-0 bg-white" onClick={openModal}>
          <img src={plusSquareSVG} alt="edit" className="h-10 w-10 block" />
        </button>
        {/* <NewMessageModal v-if="showModal" @close="closeModal" /> */}
      </div>

      {/* Chat list  */}
      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-col pt-3">
          <Link
            to={`/messages/${loggedInUser.id}-${loggedInUser.id}`}
            active-class="bg-gray-50"
            class="p-4 flex flex-col gap-4 border-b border-gray-200 box-border hover:bg-purple-50 transition duration-500 ease-in-out"
          >
            <div className="flex justify-between">
              <div className="flex gap-3">
                <img
                  src={
                    loggedInUser.photoURL
                      ? loggedInUser.photoURL
                      : "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
                  }
                  alt="avatar"
                  className="rounded-full h-10 w-10"
                />
                <div>
                  <h4 className="text-gray-700 font-semibold text-sm">
                    {loggedInUser.name}
                  </h4>
                  <p className="text-gray-600 text-xs font-normal">
                    @{loggedInUser.username}
                  </p>
                </div>
              </div>
            </div>
          </Link>
          {otherUsers?.map((user) => (
            <Link
              key={user.id}
              to={`/messages/${user.id}-${loggedInUser.id}`}
              active-class="bg-gray-50"
              className={`p-4 flex flex-col gap-4 border-b border-gray-200 box-border hover:bg-purple-50 transition duration-500 ease-in-out ${
                location.pathname === `/messages/${user.id}-${loggedInUser.id}`
                  ? "bg-gray-50"
                  : ""
              }`}
            >
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <img
                    src={
                      user.photoURL
                        ? user.photoURL
                        : "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
                    }
                    alt="avatar"
                    className="rounded-full h-10 w-10"
                  />
                  <div>
                    <h4 className="text-gray-700 font-semibold text-sm">
                      {user.displayName}
                      {/* <span v-if="user.admin" className="relative" title="Admin">
                        <img
                          src="../assets/profileIcons/admin-tag.svg"
                          alt="admin"
                          className="h-6 w-6 inline-block"
                          title="Admin"
                        />
                        <p
                          className="absolute top-0.5 left-2 text-xs font-semibold text-white"
                        >
                          A
                        </p>
                      </span> */}
                    </h4>
                    <p className="text-gray-600 text-xs font-normal">
                      @{user.username}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-normal">
                  {formatTimestamp(user?.lastMessageData?.timestamp)}
                </p>
              </div>
              <h5 className="text-gray-600 font-normal text-sm">
                <span className="font-semibold">
                  {user?.lastMessageData?.senderId === loggedInUser.id
                    ? "You: "
                    : ""}
                </span>
                {user?.lastMessageData?.text ? (
                  <span>
                    {user?.lastMessageData?.text.length > 90
                      ? user?.lastMessageData?.text.slice(0, 90) + "..."
                      : user?.lastMessageData?.text}
                  </span>
                ) : (
                  <span>
                    <img
                      src="../assets/profileIcons/blank-photo.svg"
                      alt="image"
                      className="h-5 w-5 inline-block mr-1"
                    />
                    <span className="font-semibold">Photo</span>
                  </span>
                )}
              </h5>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
