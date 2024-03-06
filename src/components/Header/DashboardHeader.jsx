/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../Features/userSlice.js";
import { getProfileDetails } from "../../Hooks/index.js";
import { openSearchModal } from "../../Features/searchModalSlice.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots as solidComment,
  faBell as solidBell,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faCommentDots, faBell } from "@fortawesome/free-regular-svg-icons";
import { ProfileDropdown } from "../Profile/ProfileDropdown.jsx";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/auth.js";
import { toast } from "react-toastify";

export const DashboardHeader = ({ users, allChats }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenu = () => {
    const headerLinks = document.querySelector(".nav-links");
    headerLinks?.classList.toggle("open");

    const linkItems = document.querySelectorAll(".nav-item");
    linkItems.forEach((item) => {
      item.addEventListener("click", () => {
        headerLinks?.classList.remove("open");
        setMenuOpen(false);
      });
    });
    setMenuOpen((prev) => !prev);
  };

  const preventScroll = () => {
    if (menuOpen) {
      document.body.classList.add("is-side-menu-open");
    } else {
      document.body.classList.remove("is-side-menu-open");
    }
  };

  useEffect(() => {
    preventScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  const userSignout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await signOut(auth);
        dispatch(logout);
        localStorage.removeItem("user");
        window.location.href = "/login";
        toast.success("Logout successful");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const openSearch = () => {
    dispatch(openSearchModal());
  };

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

  return (
    <header className="fixed font-inter top-0 left-0 w-full z-30 px-36  flex justify-between py-5 items-center bg-white border-b border-gray-200 2xl:px-20 lg:px-10 md:px-6">
      <Link to="/">
        <h2 className="font-bold font-inter text-2xl text-[#ff5841] lg:text-xl">
          Wholesquare
        </h2>
      </Link>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          onClick={openSearch}
          placeholder="Search Wholesquare"
          className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-[400px] pl-10 p-2.5 transition duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 md:w-[300px] sm:w-[185px]"
        />
      </div>
      <div className="flex gap-3 items-center">
        <Link
          to="/messages"
          // to="/"
          className="relative flex text-center z-0 bg-white  border-0 btn hover:bg-gray-100 sm:hover:bg-none "
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
                    : "text-[#919EAB]"
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
          className="relative flex text-center  bg-white  border-0 btn hover:bg-gray-100 sm:hover:bg-none sm:hidden"
        >
          <FontAwesomeIcon
            icon={
              location.pathname.includes("/notifications") ? solidBell : faBell
            }
            className={`h-5 w-5
                ${
                  location.pathname === "/notifications"
                    ? "text-[#FF5841]"
                    : "text-[#919EAB]"
                }`}
          />
          {/* show notifications that has their hasSeen as false */}
          {unseenNotifications?.length > 0 && (
            <div className="absolute top-1.5 right-1.5 font-inter bg-[#FF5841] text-white h-5 w-5 flex justify-center items-center text-xs rounded-full">
              {unseenNotifications.length}
            </div>
          )}
        </Link>
        {/* <ProfileDropdown /> */}
        {user ? (
          <div className="flex">
            {user ? (
              <div className="dropdown dropdown-end ">
                <label tabIndex={0} className="btn-primary   flex-row ">
                  <div className="w-10 h-10  m-1 bg-white border rounded-full overflow-hidden cursor-pointer">
                    <img
                      src={user?.photoURL}
                      alt="Photo"
                      className="rounded-full w-full h-full object-cover"
                    />
                  </div>
                </label>

                <ul
                  tabIndex={0}
                  className="menu menu-compact dropdown-content mt-3 p-4 shadow bg-white rounded-box w-60"
                >
                  <li>
                    <p className="lowercase  left text-m ">{user?.email}</p>
                  </li>

                  <li className="">
                    <Link to="/dashboard/profile" className="justify-between">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/messages" className="justify-between">
                      Messages
                    </Link>
                  </li>
                  <li>
                    <a>Settings</a>
                  </li>
                  <div
                    onClick={userSignout}
                    className="cursor-pointer bg-red-500 p-2 rounded-xl"
                  >
                    <a className="text-white ">Logout</a>
                  </div>
                </ul>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          <Link to="/account">
            {" "}
            <FontAwesomeIcon icon={faUser} />{" "}
          </Link>
        )}
      </div>
    </header>
  );
};
