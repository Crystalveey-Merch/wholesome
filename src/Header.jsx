import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { Fragment, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from './firebase/auth.js';
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import {
  Dialog,
  Disclosure,
  Popover,
  Transition,
  Menu,
} from "@headlessui/react";
import { events } from "./data/events";
import { useParams } from "react-router";
import { useEffect } from "react";
import { toast } from "react-toastify";



const Header = () => {
  const { interestName } = useParams();

  const [authUser, setAuthUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);
  const userId = authUser?.uid;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileDocRef = doc(db, "users", userId); // Assuming you have a "users" collection in Firestore
        const profileDocSnapshot = await getDoc(profileDocRef);

        if (profileDocSnapshot.exists()) {
          const profileData = profileDocSnapshot.data();
          setProfileData(profileData);
          console.log(profileData.uid);
        } else {
          // Handle case where the profile document doesn't exist
        }
      } catch (error) {
        // Handle any errors that occur during fetching
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [userId]);

  const userSignout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
        toast.error("Signout Successful");
      })
      .catch((error) => toast.error(error));
  };

  useEffect(() => {
    const selectedEvent = events.find((e) => e.interest === interestName);
  });
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

  return (
    <div className="fixed  w-screen z-30 top-0   flex   flex-col gap-0 sm:m-0  w-full items-center justify-between xl:px-8 sm:px-0 ">
      <div className="navbar   text-black bg-white flex gap-20  justify-evenly px-10 sm:px-5 w-full ">
        <div className="drawer  sm:block hidden w-5 flex left-0">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

          {/* Navbar */}
          <div className="">
            <div className="flex-none hidden  sm:block">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
          </div>
          <div className="drawer-side">
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
                <div>Wholesome</div>
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
                  {authUser ? (
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
                  ) : (<div></div>)}
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
                        to="/interest/Travel and events"
                      >
                        Travel & events
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/Lifestyle and Fashion"
                      >
                        Lifestyle & Fashion
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
                        to="/interest/Business and Finance
"
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
                  to="/articlelist"
                  onClick={closeDrawer}
                  className="flex  text-gray-200 rounded-lg dark:text-white hover:bg-gray-100  group"
                >
                  <span className=" whitespace-nowrap">Article List</span>
                </NavLink>

              </li>
            </ul>
          </div>
        </div>
        <NavLink to="/">
          {" "}
          <div>
            <a className=" Aceh  normal-case text-2xl  ">Wholesome</a>
          </div>
        </NavLink>
        <div className=" w-full flex justify-center m-auto text-2xl sm:hidden ">
          <ul className="menu menu-horizontal text-2xl px-1 m-auto text-black">
            <div className="dropdown dropdown-bottom ">
              <label
                tabIndex={0}
                className=" bg-white text-black border-none capitalize btn m-1 hover:bg-gray-100"
              >
                About us
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content  bg-black/75  Aceh z-[1] menu p-2 shadow bg-white w-52"
              >
                <ul className="p-2">
                  <li>
                    <NavLink to="/aboutus">Our mission & values</NavLink>
                  </li>
                  <li>
                    <NavLink to="/aboutus/#whatwedo">What we do</NavLink>
                  </li>
                  <li>
                    <a>Who we are</a>
                  </li>
                </ul>
              </ul>
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
                  {authUser ? (
                    <li>
                      <NavLink
                        to="/myinterest/articles"
                      >
                        My Interest
                      </NavLink>
                    </li>
                  ) : ("")}
                  <li>
                    <NavLink to={`/interest/Health and Wellness`}>Health & Wellness</NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/Business and Finance`}>Business and Finance</NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/Travel and Adventure`}>Travel & Adventure</NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/Lifestyle and Fashion`}>
                      Lifestyle & Fashion
                    </NavLink>
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
                    <NavLink to={`/interest/Book club`}>
                    Book club
                    </NavLink>
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
              </label></NavLink>
            <NavLink to="/createpost">
              <label
                tabIndex={0}
                className=" text-black bg-white border-none capitalize btn m-1 hover:bg-gray-100"
              >
                Create Post
              </label></NavLink>

            <NavLink to="/articlelist">
              <label
                tabIndex={0}
                className=" text-black bg-white border-none capitalize btn m-1 hover:bg-gray-100"
              >
                Article List
              </label></NavLink>
          </ul>
        </div>
        <div className="justify-end flex gap-10">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          {authUser ? (
            <div className="flex">

              {profileData ? (
                <div className="dropdown dropdown-end ">
                  <label tabIndex={0} className="btn-primary   flex-row ">
                    <div className="w-10 h-10  m-1 bg-white border rounded-full overflow-hidden">
                      <img
                        src={profileData.photoURL}
                        alt="Photo"
                        className="rounded-full m-auto"
                      />
                    </div>
                  </label>

                  <ul
                    tabIndex={0}
                    className="menu menu-compact dropdown-content mt-3 p-4 shadow bg-white rounded-box w-60"
                  >
                    <li>
                      <p className="lowercase  left text-m ">
                        {profileData.email}
                      </p>
                    </li>

                    <li className="">
                      <NavLink
                        to="dashboard/profile"
                        className="justify-between"
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <a>Settings</a>
                    </li>
                    <div onClick={userSignout} className="cursor-pointer bg-red-500 p-2 rounded-xl">
                      <a className="text-white ">Logout</a>
                    </div>
                  </ul>
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <NavLink to="/account">
              {" "}
              <FontAwesomeIcon icon={faUser} />{" "}
            </NavLink>)}
        </div>
      </div>
    </div>
  );
};

export default Header;
