/* eslint-disable react/prop-types */
// import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../Features/userSlice.js";
import { getProfileDetails } from "../../Hooks/index.js";
// import { openSearchModal } from "../../Features/searchModalSlice.js";
import {
  openCreateModal,
  // selectOpenCreateModal,
} from "../../Features/openCreateModalSlice.js";
import {
  selectOpenSideBar,
  toggleSideBar,
} from "../../Features/openSideBarSlice.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots as solidComment,
  faBell as solidBell,
  faUser,
  faPlus,
  // faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { faCommentDots, faBell } from "@fortawesome/free-regular-svg-icons";
// import { signOut } from "firebase/auth";
// import { auth } from "../../firebase/auth.js";
// import { toast } from "react-toastify";
// import devAvatar from "../../assets/avatar-default.png";
import { ProfileDropdown } from "../Profile/ProfileDropdown.jsx";
import { SearchModal } from "../../Userpage/SearchModal.jsx";

export const DashboardHeader = ({ users, allChats, posts, activities }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const sideBarState = useSelector(selectOpenSideBar);

  const handleMenu = () => {
    const barLinks = document.querySelector(".bar-links");
    barLinks?.classList.toggle("open");

    const barItems = document.querySelectorAll(".bar-item");
    barItems.forEach((item) => {
      item.addEventListener("click", () => {
        barLinks?.classList.remove("open");
        dispatch(toggleSideBar());
      });
    });
    dispatch(toggleSideBar());
  };

  // const userSignout = async () => {
  //   if (window.confirm("Are you sure you want to log out?")) {
  //     try {
  //       await signOut(auth);
  //       dispatch(logout);
  //       localStorage.removeItem("user");
  //       window.location.href = "/login";
  //       toast.success("Logout successful");
  //     } catch (error) {
  //       alert(error.message);
  //     }
  //   }
  // };

  const unseenNotifications = getProfileDetails(
    user?.id,
    users
  )?.notifications.filter((notification) => !notification.hasSeen);

  // first find the user's chats
  const loggedInUserChats = allChats.filter((chat) =>
    chat.chatData.conversants.includes(user?.id)
  );

  // filter out chats between the user and the user by checking if both conversats are the same
  const loggedInUserChatsWithOthers = loggedInUserChats.filter(
    (chat) => chat.chatData.conversants[0] !== chat.chatData.conversants[1]
  );

  // console.log("loggedInUserChats", loggedInUserChats);
  // console.log("loggedInUserChatsWithOthers", loggedInUserChatsWithOthers);

  // check unseen by checking if ChatData hasSeen is false and if the user is not the sender of the last message of the chat
  const unseenChats = loggedInUserChatsWithOthers.filter(
    (chat) => !chat.chatData.hasSeen
  );

  // get the last message of the chat which has been moved to the top of the chat
  const lastMessageSent = unseenChats.map((chat) => {
    const lastMessage = chat.messages[0];
    return lastMessage;
  });

  const removeMessageSentByUser = lastMessageSent.filter(
    (message) => message?.senderId !== user?.id
  );

  // const showCreateModal = useSelector(selectOpenCreateModal);
  const setCreateModalOpen = () => {
    dispatch(openCreateModal());
  };
  console.log("removeMessageSentByUser", sideBarState);

  return (
    <header className="fixed z-40 font-inter top-0 left-0 w-full px-10  flex justify-between py-5 items-center bg-white border-b border-gray-200 lg:px-4 md:px-6 sm:px-3">
      <div className="xl:flex xl:gap-2 xl:items-center">
        <button
          id="menu-btn"
          onClick={handleMenu}
          className={`h-max w-max  ${
            sideBarState ? "" : ""
          } hidden xl:block focus:outline-none z-30 `}
        >
          {sideBarState ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="#000000"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.7}
              stroke="#000000"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
        <Link to="/" className="block md:hidden">
          <h2 className="font-bold font-inter text-2xl text-[#ff5841] lg:text-[1.1rem]">
            Wholesquare
          </h2>
        </Link>
        <Link to="/" className="hidden">
          <h2 className="font-bold font-inter text-2xl text-[#ff5841] lg:text-[1.1rem]">
            W
          </h2>
        </Link>
      </div>
      {/* <button
        onClick={openSearch}
        className="hidden items-center p-2 rounded-md hover:bg-gray-100"
      >
        <FontAwesomeIcon
          icon={faSearch}
          className="text-[#3c4248] h-[18px] w-[18px]"
        />
      </button> */}
      <SearchModal users={users} posts={posts} activities={activities} />

      <div className="flex gap-3 items-center">
        {user && (
          <div className="flex gap-3 items-center sm:hidden">
            <button
              onClick={setCreateModalOpen}
              className="flex gap-2 items-center p-2 rounded-md hover:bg-gray-100"
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="text-[#3c4248] text-2xl"
              />
              <p className="text-[#3c4248] text-xs font-bold">Create</p>
            </button>
            <Link
              to="/messages"
              // to="/"
              className="relative flex text-center z-0 bg-white  border-0  p-2 rounded-md hover:bg-gray-100 sm:hover:bg-none "
            >
              <FontAwesomeIcon
                icon={
                  location.pathname.includes("/messages")
                    ? solidComment
                    : faCommentDots
                }
                className={`h-5 w-5
                ${
                  location.pathname.includes("/messages")
                    ? "text-[#FF5841]"
                    : "text-[#3c4248]"
                }`}
              />
              {/* show notifications that has their hasSeen as false */}
              {removeMessageSentByUser?.length > 0 && (
                <div className="absolute top-1.5 right-1.5 font-inter bg-[#FF5841] text-white h-5 w-5 flex justify-center items-center text-xs rounded-full">
                  {removeMessageSentByUser.length}
                </div>
              )}
            </Link>
            <Link
              to="/notifications"
              // to="/"
              className="relative flex text-center  bg-white p-2 rounded-md  border-0 hover:bg-gray-100 sm:hover:bg-none sm:hdden"
            >
              <FontAwesomeIcon
                icon={
                  location.pathname.includes("/notifications")
                    ? solidBell
                    : faBell
                }
                className={`h-5 w-5
                ${
                  location.pathname === "/notifications"
                    ? "text-[#FF5841]"
                    : "text-[#3c4248]"
                }`}
              />
              {/* show notifications that has their hasSeen as false */}
              {unseenNotifications?.length > 0 && (
                <div className="absolute top-1.5 right-1.5 font-inter bg-[#FF5841] text-white h-5 w-5 flex justify-center items-center text-xs rounded-full">
                  {unseenNotifications.length}
                </div>
              )}
            </Link>
          </div>
        )}
        {/* <ProfileDropdown /> */}
        {user ? (
          <div className="flex">
            {user ? (
              // <div className="dropdown dropdown-end">
              //   <label tabIndex={0} className="btn-primary   flex-row ">
              //     <div className="h-12 w-12 rounded-full bg-gray-50 border-4 cursor-pointer transition duration-500 ease-in-out flex items-center justify-center border-purple-50 hover:border-purple-100  lg:h-10 lg:w-10">
              //       <img
              //         src={user?.photoURL}
              //         alt="Photo"
              //         className="h-10 w-10 rounded-full lg:h-8 lg:w-8"
              //       />
              //     </div>
              //   </label>

              //   <ul
              //     tabIndex={0}
              //     className="menu menu-compact dropdown-content mt-3 w-72 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              //   >
              //     <li>
              //       <div className="w-full flex gap-3 px-1 py-3 border-b-2 border-gray-50 cursor-pointer">
              //         <div className="relative w-max h-max">
              //           <img
              //             alt="avatar"
              //             src={user?.photoURL || devAvatar}
              //             className="h-10 w-10 rounded-full"
              //           />
              //           <p className="h-3 w-3 absolute bg-green-500 rounded-full border-white border-2 bottom-0 right-0"></p>
              //         </div>

              //         <div>
              //           <p className="font-semibold text-sm text-gray-700">
              //             {user?.name}
              //           </p>
              //           <p className="text-gray-600 font-inter text-xs">
              //             {user?.email}
              //           </p>
              //         </div>
              //       </div>
              //     </li>
              //     {/* <li className="">
              //       <Link to="/settings/account" className="justify-between">
              //         Dashboard
              //       </Link>
              //     </li> */}
              //     <li>
              //       <Link to="/messages" className="justify-between">
              //         Messages
              //       </Link>
              //     </li>
              //     <li>
              //       <a>Settings</a>
              //     </li>
              //     <div
              //       onClick={userSignout}
              //       className="cursor-pointer bg-red-500 p-2 rounded-xl"
              //     >
              //       <a className="text-white ">Logout</a>
              //     </div>
              //   </ul>
              // </div>
              <ProfileDropdown />
            ) : (
              ""
            )}
          </div>
        ) : (
          <Link to="/login">
            {" "}
            <FontAwesomeIcon icon={faUser} />{" "}
          </Link>
        )}
      </div>
    </header>
  );
};
