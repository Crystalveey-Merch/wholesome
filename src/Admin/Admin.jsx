import { Outlet } from "react-router";
import { greetings } from "../components/greeting";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase/auth";
import {
  Dialog,
  Disclosure,
  Popover,
  Transition,
  Menu,
} from "@headlessui/react";
import { useNavigate } from "react-router";

import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faMicrophone,
  faMicroscope,
  faRunning,
  faSave,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Admin = () => {
  const greeting = greetings();
  const [authUser, setAuthUser] = useState(null);
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

  console.log(authUser);

  const userSignout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
        toast.error("Signout Successful");
      })
      .catch((error) => toast.error(error));
  };

  return (
    <>
      <div className="mt-20 py-20 sm:mt-18 sm:py-0 sm:px-0 px-20 w-screen relative ">
        <div className=" sticky sm:top-20 z-10 hidden sm:block w-full  mt-5 ">
          <ul className="menu  text-white menu-horizontal bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 dark:text-slate-200 m-auto justify-center  rounded-box  w-full">
            <li>
              <NavLink to="articles" className="tooltip" data-tip="Home">
                <svg
                  xmlns="https://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </NavLink>
            </li>
            <li>
              <NavLink to="users" className="tooltip" data-tip="Stats">
                <FontAwesomeIcon icon={faUser} className="text-white" />{" "}
              </NavLink>
            </li>
            <li>
              <NavLink to="podcasts" className="tooltip" data-tip="Stats">
                <FontAwesomeIcon icon={faMicrophone} className="text-white" />{" "}
              </NavLink>
            </li>
            <li>
              <NavLink to="activities" className="tooltip" data-tip="Stats">
                <FontAwesomeIcon icon={faRunning} className="text-white" />{" "}
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="drawer drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex   justify-center ">
            <Outlet />
            {/* Hide the button on small screens (mobile) */}
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            {/* Apply responsive classes to the menu */}
            <ul className="menu p-4 w-80 min-h-full bg-gray-200 text-base-content sm:hidden">
              <p className="text-black text-xl Aceh font-bold text-center">
                {" "}
                {greeting}
                <br />
              </p>
              {/* Sidebar content here */}
              <li>
                <NavLink to="articles" className="text-black">
                  All Articles
                </NavLink>
              </li>
              <li>
                <NavLink to="users" className="text-black">
                  Users
                </NavLink>
              </li>
              <li>
                <NavLink to="podcasts" className="text-black">
                  Podcasts
                </NavLink>
              </li>
              <li>
                <NavLink to="activities" className="text-black">
                  Activities
                </NavLink>
              </li>

              {/* <li><NavLink to='statistics' className="text-black">Statistics</NavLink></li>
                      <li><NavLink to='bookmarks' className="text-black">Bookmarks</NavLink></li> */}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
