/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faCommentDots as solidComment,
  faBell as solidBell,
} from "@fortawesome/free-solid-svg-icons";
import { faCommentDots, faBell } from "@fortawesome/free-regular-svg-icons";
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink, useLocation } from "react-router-dom";
// import { useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/auth.js";
import { signOut } from "firebase/auth";
// import { doc, getDoc, collection, getDocs } from "firebase/firestore";
// import { useNavigate } from "react-router";
// import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logout } from "./Features/userSlice.js";
import { Menu } from "@headlessui/react";
// import { events } from "./data/events";
// import { useParams } from "react-router";
// import { useEffect } from "react";
import { toast } from "react-toastify";
import { getProfileDetails } from "./Hooks/index.js";

const Header = ({ users }) => {
  const dispatch = useDispatch();
  // const { interestName } = useParams();
  const user = useSelector(selectUser);

  const location = useLocation();

  // const navigate = useNavigate();
  // const [isModalOpen, setIsModalOpen] = useState(false);

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

  // useEffect(() => {
  //   const selectedEvent = events.find((e) => e.interest === interestName);
  // });

  const closeDrawer = () => {
    const drawerToggle = document.getElementById("my-drawer-3");
    if (drawerToggle.checked) {
      drawerToggle.click();
    }
  };
  const handleScrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // const handleOnSelect = (user) => {
  //   // Construct the target URL
  //   const targetUrl = `/profile/${user.id}`;

  //   // Use history.push() to navigate to the target URL
  //   navigate(targetUrl);
  //   setIsModalOpen(false);
  // };

  // const handleOnSearch = (string, results) => {
  //   // onSearch will have as the first callback parameter
  //   // the string searched and for the second the results.
  //   console.log(string, results);
  // };

  // const handleOnHover = (result) => {
  //   // the item hovered
  //   console.log(result);
  // };
  // const handleOnFocus = () => {
  //   console.log("Focused");
  // };
  // const formatResult = (item) => {
  //   return (
  //     <>
  //       <div className="flex  w-60  gap-1" id={item.id}>
  //         <img src={item.photoURL} className="w-10" />

  //         <h1 className="text-sm">{item.name}</h1>
  //       </div>
  //     </>
  //   );
  // };
  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  // // Function to close the modal
  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  const unseenNotifications = getProfileDetails(
    user?.id,
    users
  )?.notifications.filter((notification) => !notification.hasSeen);

  return (
    <div className="fixed  z-50 top-0 w-screen flex flex-col gap-0 sm:m-0 items-center justify-between border-b border-gray-100  sm:px-0 ">
      <div className="navbar text-black bg-white flex gap-5 justify-between px-10 xl:px-5 w-full sm:px-2">
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex-none hidden w-max h-max  lg:block">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square w-6 btn-ghost"
            >
              <svg
                xmlns="https://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <NavLink to="/">
            {" "}
            <div>
              <a className=" Aceh  normal-case text-2xl sm:text-xl xl:text-xl  ">
                Wholesquare
              </a>
            </div>
          </NavLink>
        </div>
        <div className="drawer lg:block  sm:block hidden w-5  left-0">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

          {/* Navbar */}
          {/* <div className="hidden lg:flex items-center gap-3">
            <div className="flex-none hidden  lg:block">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="https://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <NavLink to="/">
              {" "}
              <div>
                <a className=" Aceh  normal-case text-2xl sm:text-xl xl:text-xl  ">
                  Wholesquare
                </a>
              </div>
            </NavLink>
          </div> */}
          <div className="drawer-side hidden lg:grid">
            <label
              htmlFor="my-drawer-3"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu p-4 w-80 min-h-full bg-black text-xl">
              {/* Sidebar content here */}
              <NavLink
                to="/"
                className="text-center py-5 Aceh  normal-case text-2xl "
              >
                {" "}
                <div>Wholesquare</div>
                <hr></hr>
              </NavLink>
              <Menu>
                <Menu.Button className="text-left p-2 text-white light:text-black   border-b border">
                  About us
                </Menu.Button>
                <Menu.Items className="flex flex-col gap-4 text-2xl px-5">
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/aboutus"
                      >
                        Our mission & values
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item onClick={closeDrawer}>
                    {({ active }) => (
                      <NavLink
                        onClick={(e) => {
                          e.preventDefault();
                          handleScrollToSection("#whatwedo");
                          closeDrawer();
                        }}
                        className={`${active && "bg-blue-500"}`}
                        to="/aboutus/#whatwedo"
                      >
                        What we do
                      </NavLink>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
              <Menu>
                <Menu.Button className="text-left p-2 text-white light:text-black ">
                  Interest
                </Menu.Button>
                <Menu.Items className="flex flex-col gap-4 text-base px-5">
                  {user ? (
                    <Menu.Item>
                      {({ active }) => (
                        <NavLink
                          onClick={closeDrawer}
                          className={`${active && "bg-blue-500"}`}
                          to="/myinterest/articles"
                        >
                          My Interest
                        </NavLink>
                      )}
                    </Menu.Item>
                  ) : (
                    <div></div>
                  )}
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Health and wellness"
                      >
                        Health & wellness
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Travel"
                      >
                        Travel
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Lifestyle"
                      >
                        Lifestyle
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Fashion"
                      >
                        Fashion
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Music"
                      >
                        Fitness
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Music"
                      >
                        Photography
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Volunteer and philanthropy"
                      >
                        Volunteer & philanthropy
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Business and Finance"
                      >
                        Business and Finance
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Games and Sports"
                      >
                        Games & Sports
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Art and crafts"
                      >
                        Art & crafts
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Environmental and Sustainability"
                      >
                        Environmental & Sustainability
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Book club"
                      >
                        Book club
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Music"
                      >
                        Music
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Games & Sports"
                      >
                        Games & Sports
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Tech"
                      >
                        Tech
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Night life"
                      >
                        Night life
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Comedy & entertainment"
                      >
                        Comedy & entertainment
                      </NavLink>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>

              <Menu>
                <Menu.Button className="text-left p-2 text-white border-b border light:text-black  ">
                  {" "}
                  Events
                </Menu.Button>
                <Menu.Items className="flex flex-col gap-4 text-base px-5">
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/upcomingevents"
                      >
                        Upcoming Events
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/hostevent"
                      >
                        Host a Meet-up
                      </NavLink>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
              <li>
                <NavLink
                  to="/activities"
                  onClick={closeDrawer}
                  className="flex  text-gray-200 rounded-lg dark:text-white hover:bg-gray-100  group"
                >
                  <span className=" whitespace-nowrap">Activities</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/podcast"
                  onClick={closeDrawer}
                  className="flex  text-gray-200 rounded-lg dark:text-white hover:bg-gray-100  group"
                >
                  <span className=" whitespace-nowrap">Podcast</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/createpost"
                  onClick={closeDrawer}
                  className="flex  text-gray-200 rounded-lg dark:text-white hover:bg-gray-100  group"
                >
                  <span className=" whitespace-nowrap">Create Post</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/feed"
                  onClick={closeDrawer}
                  className="flex  text-gray-200 rounded-lg dark:text-white hover:bg-gray-100  group"
                >
                  <span className=" whitespace-nowrap">Feed</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <NavLink to="/">
          {" "}
          <div>
            <a className=" Aceh  normal-case text-2xl block lg:hidden sm:text-xl xl:text-xl  ">
              Wholesquare
            </a>
          </div>
        </NavLink>
        <NavLink to="/createpost" className="hidden lg:block sm:hidden">
          <label
            tabIndex={0}
            className=" text-black bg-white border-none capitalize btn m-1 hover:bg-gray-100"
          >
            Create Post
          </label>
        </NavLink>
        <div className=" w-full flex justify-center m-auto text-2xl lg:hidden  ">
          <ul className="menu menu-horizontal xl:flex-nowrap gap-2 text-2xl px-1 xl:gap-0 m-auto text-black">
            <div className="dropdown dropdown-bottom ">
              <NavLink to="/aboutus">
                {" "}
                <label
                  tabIndex={0}
                  className=" bg-white text-black border-none capitalize btn m-1 hover:bg-gray-100"
                >
                  About us
                </label>
              </NavLink>
            </div>
            <div className="dropdown dropdown-bottom text-xl">
              <label
                tabIndex={0}
                className="text-black bg-white  border-none capitalize btn m-1 hover:bg-gray-100"
              >
                Interest
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-black/75  Aceh text-white w-52"
              >
                <ul className="p-2 text-md">
                  {user ? (
                    <li>
                      <NavLink to="/myinterest/articles">My Interest</NavLink>
                    </li>
                  ) : (
                    ""
                  )}
                  <li>
                    <NavLink to={`/interest/Fitness`}>Fitness</NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/Photography`}>Photography</NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/Exploration`}>Exploration</NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/Exploration`}>Tech</NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/Exploration`}>Food</NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/Health and Wellness`}>
                      Health & Wellness
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/Business and Finance`}>
                      Business and Finance
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/Travel`}>Travel</NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/Lifestyle`}>Lifestyle</NavLink>
                  </li>

                  <li>
                    <NavLink to={`/interest/Volunteer and Philanthropy`}>
                      Volunteer & Philanthropy
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/Games and Sports`}>
                      Games & Sports
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/Art and crafts`}>
                      Art & crafts
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/Environmental and Sustainability`}>
                      Environmental & Sustainability
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/Books`}>Books</NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/Music`}>Music</NavLink>
                  </li>
                </ul>
              </ul>
            </div>
            <div className="dropdown dropdown-bottom">
              <label
                tabIndex={0}
                className=" text-black bg-white border-none capitalize btn m-1 hover:bg-gray-100"
              >
                Events
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-black/75 text-white   Aceh w-52"
              >
                <ul className="p-2 text-white">
                  <li className=" text-white">
                    <NavLink to="/upcomingevents">Upcoming Events</NavLink>
                  </li>
                  <li>
                    <NavLink to="/hostevent">Host a Meet-up</NavLink>
                  </li>
                </ul>
              </ul>
            </div>
            <NavLink to="/podcast">
              <label
                tabIndex={0}
                className=" text-black bg-white border-none capitalize btn m-1 hover:bg-gray-100"
              >
                Podcast
              </label>
            </NavLink>
            <NavLink to="/activities">
              <label
                tabIndex={0}
                className=" text-black bg-white border-none capitalize btn m-1 hover:bg-gray-100"
              >
                Activities
              </label>
            </NavLink>
            <NavLink to="/createpost">
              <label
                tabIndex={0}
                className=" text-black bg-white border-none capitalize btn m-1 hover:bg-gray-100"
              >
                Create Post
              </label>
            </NavLink>

            <NavLink to="/feed">
              <label
                tabIndex={0}
                className=" text-black bg-white border-none capitalize btn m-1 hover:bg-gray-100"
              >
                Feed
              </label>
            </NavLink>
          </ul>
        </div>

        {/* <dialog id="my_modal_4"   className={`modal ${isModalOpen ? 'open' : ''}`}> */}

        {/* <form method="dialog"onClick={closeModal} className="modal-backdrop">
                <button>close</button>
              </form> */}
        {/* </dialog> */}

        <div className="justify-end sm:justify-middle  sm:w-full flex gap-2 rounded-full ">
          <div className="flex text-center  bg-white  border-0 btn m-1 hover:bg-gray-100 sm:m-0 sm:hover:bg-none ">
            {/* <Link to="/searchuser"> */}
            <FontAwesomeIcon
              icon={faSearch}
              className={`h-[18px] w-[18px] ${
                location.pathname === "/searchuser"
                  ? "text-[#FF5841]"
                  : "text-[#919EAB]"
              }`}
            />
            {/* </Link> */}
          </div>
          {user && (
            <Link
              to="/messages"
              // to="/"
              className="flex text-center  bg-white  border-0 btn hover:bg-gray-100 sm:hover:bg-none "
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
            </Link>
          )}
          {user && (
            <Link
              to="/notifications"
              // to="/"
              className="relative flex text-center  bg-white  border-0 btn hover:bg-gray-100 sm:hover:bg-none sm:hidden"
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
          )}
          {user ? (
            <div className="flex">
              {user ? (
                <div className="dropdown dropdown-end ">
                  <label tabIndex={0} className="btn-primary   flex-row ">
                    <div className="w-10 h-10  m-1 bg-white border rounded-full overflow-hidden">
                      <img
                        src={user?.photoURL}
                        alt="Photo"
                        className="rounded-full m-auto"
                      />
                    </div>
                  </label>

                  <ul
                    tabIndex={0}
                    className="menu menu-compact dropdown-content mt-3 p-4 shadow bg-white rounded-box w-60"
                  >
                    {/* <li>
                      <p className="lowercase  left text-m ">
                        {profileData?.email}
                      </p>
                    </li> */}

                    <li className="">
                      <NavLink
                        to="/dashboard/profile"
                        className="justify-between"
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/messages" className="justify-between">
                        Messages
                      </NavLink>
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
            <NavLink to="/account">
              {" "}
              <FontAwesomeIcon icon={faUser} />{" "}
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
