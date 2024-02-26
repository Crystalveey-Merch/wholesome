/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { closeNewMessageModal } from "../Features/openNewMessageModalSlice";

export const NewMessageModal = ({ loggedInUser, users }) => {
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(closeNewMessageModal());
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users?.filter((user) => {
    return (
      user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div
      className="fixed z-10 left-0 top-0 w-full h-full overflow-auto bg-[rgba(0,0,0,0.4)] flex justify-center items-center sm:top-16 sm:justify-start sm:items-start"
      onClick={closeModal}
    >
      <div
        className="bg-[#fefefe] h-[500px] p-6 border border-[#fefefe] w-[600px] rounded-xl flex flex-col gap-4 sm:h-[calc(100vh-100px)] sm:w-full sm:rounded-none"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow:
            "0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)",
        }}
      >
        <div className="flex justify-between items-center border-b-gray-200 border-b pb-6">
          <h1 className="text-2xl font-semibold text-gray-900">New Message</h1>
          <button onClick={closeModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-1">
          {/* search svg */}
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-red-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <input
            className="w-full border-none focus:ring-0 focus:outline-none shadow-none bg-gray-50 text-gray-900 pl-2 text-lg"
            placeholder="Search for people"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="max-h-[400px] overflow-y-scroll sm:max-h-[calc(100vh-100px)]">
          {filteredUsers.map((user) => (
            <Link
              //   v-for="user in filteredUsers"
              key={user.id}
              //   :to="{
              //     name: 'ChatRoom',
              //     params: { idone: loggedInUser.id, idtwo: user.id },
              //   }"
              to={`/messages/${loggedInUser.id}-${user.id}`}
              class="flex items-center gap-4 py-4"
              onClick={closeModal}
            >
              <img
                src={
                  user.photoURL
                    ? user.photoURL
                    : "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
                }
                alt="avatar"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col">
                <p className="font-medium text-gray-900 font-inter">
                  {user.name ? user.name : ""}
                  {/* <span v-if="user.admin" className="relative" title="Admin">
                    <img
                      src="../../assets/profileIcons/admin-tag.svg"
                      alt="admin"
                      className="h-6 w-6 inline-block"
                      title="Admin"
                    />
                    <p className="absolute top-1 left-2 text-xs font-semibold text-white">
                      A
                    </p>
                  </span> */}
                </p>
                <p className="text-gray-500 text-sm font-inter">
                  {user.username}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
