import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { Fragment, useState } from "react";
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

const Header = () => {
  const { interestName } = useParams();

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
    <div className="fixed  w-full z-30 top-0   flex   flex-col gap-0 sm:m-0  w-full items-center justify-between xl:px-8 sm:px-0 ">
      <div className="navbar  w-screen text-black bg-white flex gap-20  justify-evenly px-10 sm:px-2 w-full ">
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
                className="text-center py-5 Aceh  normal-case text-xl "
              >
                {" "}
                <div>Wholesome</div>
                <hr></hr>
              </NavLink>
              <Menu>
                <Menu.Button className="text-left p-2 text-white light:text-black   border-b border">
                  About us
                </Menu.Button>
                <Menu.Items className="flex flex-col gap-4 text-base px-5">
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
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/health"
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
                        to="/interest/food"
                      >
                        Food & nutrition
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/travel"
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
                        to="/interest/lifestyle"
                      >
                        Lifestyle & fashion
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        onClick={closeDrawer}
                        className={`${active && "bg-blue-500"}`}
                        to="/interest/volunteer"
                      >
                        Volunteer & philanthropy
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
                  className="flex  text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <span className=" whitespace-nowrap">Podcast</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <NavLink to="/">
          {" "}
          <div>
            <a className=" Aceh  normal-case text-xl  ">Wholesome</a>
          </div>
        </NavLink>
        <div className=" w-full flex justify-center m-auto  sm:hidden ">
          <ul className="menu menu-horizontal px-1 m-auto text-black">
            <div className="dropdown dropdown-bottom ">
              <label
                tabIndex={0}
                className=" bg-white text-black border-none capitalize btn m-1 hover:bg-gray-100"
              >
                About us
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content  z-[1] menu p-2 shadow bg-white w-52"
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
            <div className="dropdown dropdown-bottom">
              <label
                tabIndex={0}
                className="text-black bg-white border-none capitalize btn m-1 hover:bg-gray-100"
              >
                Interest
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-white w-52"
              >
                <ul className="p-2">
                  <li>
                    <NavLink to={`/interest/health`}>Health & wellness</NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/food`}>Food & nutrition</NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/travel`}>Travel & events</NavLink>
                  </li>
                  <li>
                    <NavLink to={`/interest/lifestyle`}>
                      Lifestyle & fashion
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to={`/interest/volunteer`}>
                      Volunteer & philanthropy
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
                className="dropdown-content z-[1] menu p-2 shadow bg-white w-52"
              >
                <ul className="p-2">
                  <li>
                    <NavLink to="/upcomingevents">Upcoming Events</NavLink>
                  </li>
                  <li>
                    <NavLink to="/hostevent">Host a Meet-up</NavLink>
                  </li>
                </ul>
              </ul>
            </div>

            <label
              tabIndex={0}
              className=" text-black bg-white border-none capitalize btn m-1 hover:bg-gray-100"
            >
              <NavLink to="/podcast">Podcast</NavLink>
            </label>
          </ul>
        </div>
        <div className="justify-end flex gap-10">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <NavLink to="/account">
            {" "}
            <FontAwesomeIcon icon={faUser} />{" "}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Header;
