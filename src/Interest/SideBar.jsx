/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faNewspaper,
  faCompass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  faNewspaper as NewRegular,
  faCompass as ComRegular,
  faImage,
} from "@fortawesome/free-regular-svg-icons";
import { selectUser } from "../Features/userSlice";
import { toggleSideBar } from "../Features/openSideBarSlice";
import { wholesquareEmployees } from "../Employees";
import { convertToLowercase } from "../Hooks";

export const SideBar = ({ interests }) => {
  const loggedInUser = useSelector(selectUser);
  const dispatch = useDispatch();
  const location = useLocation();
  const [userInterest, setUserInterest] = useState([]);

  // check for user interest by checking if the user is in the interest group
  useEffect(() => {
    if (loggedInUser) {
      setUserInterest(
        interests.filter((interest) =>
          interest.members.some((member) => member.userId === loggedInUser.id)
        )
      );
    }
  }, [interests, loggedInUser]);

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

  return (
    <div className="bar-links block xl:hdden" onClick={handleMenu}>
      <div
        className="w-80 h-screen border-r border-gray-300 xl:abslute xl:bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full overflow-y-scroll scroll-bar-beauty flex flex-col gap-6 py-10 px-4">
          <div className="px-1 flex flex-col gap-4 pb-4 border-b border-gray-200">
            <div className="relative min-h-12 w-full border bg-white border-gray-200 mx-auto rounded-3xl flex gap-3.5 items-center px-4 py-1.5">
              <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search interests groups"
                className="w-full text-gray-900 py-1 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-transparent transition duration-300 ease-in-out"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Link
                to="/i/interest"
                className={`flex gap-4 items-center px-4 py-2.5 rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-gray-100 ${
                  location.pathname === "/i/interest" ? "bg-gray-100" : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    location.pathname === "/i/interest"
                      ? faNewspaper
                      : NewRegular
                  }
                  className="text-gray-900 h-5 w-5"
                />
                <p className="text-gray-900 font-inter text-sm font-medium">
                  Interest Feed
                </p>
              </Link>
              <Link
                to="/i/discover"
                className={`flex gap-4 items-center px-4 py-2.5 rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-gray-100 ${
                  location.pathname === "/i/discover" ? "bg-gray-100" : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    location.pathname === "/i/discover" ? faCompass : ComRegular
                  }
                  className="text-gray-900 h-5 w-5"
                />
                <p className="text-gray-900 font-inter text-sm font-medium">
                  Discover More
                </p>
              </Link>
            </div>
          </div>
          <div className="px-1 flex flex-col gap-4 pb-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h5 className="text-black text-base font-medium font-inter">
                Your Interests
              </h5>
              <button className="text-[#FF5841] text-sm font-inter font-medium transition ease-in-out duration-300 hover:underline">
                View All
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              <Link
                to={`${
                  !loggedInUser
                    ? "/login"
                    : wholesquareEmployees.includes(loggedInUser.email)
                    ? "/i/create"
                    : "/i/interest"
                }`}
                className={`flex gap-4 items-center px-4 py-2.5 rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-gray-100 ${
                  !loggedInUser
                    ? "pointer-events-none opacity-50 hidden"
                    : wholesquareEmployees.includes(loggedInUser.email)
                    ? ""
                    : "pointer-events-none opacity-50"
                } ${location.pathname === "/i/create" ? "bg-gray-100" : ""}
                `}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-gray-900 h-4 w-4"
                />
                <p className="text-gray-900 font-inter text-sm font-normal">
                  Create New Interest
                </p>
              </Link>
              <>
                {userInterest?.slice(0, 6).map((interest, index) => (
                  <Link
                    to={`/i/${convertToLowercase(interest.name)}`}
                    key={index}
                    className={`flex gap-4 items-center px-4 py-2.5 rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-gray-100 ${
                      location.pathname ===
                      `/i/${convertToLowercase(interest.name)}`
                        ? "bg-gray-100"
                        : ""
                    }`}
                  >
                    {interest.wallPaper ? (
                      <img
                        src={interest.wallPaper}
                        alt="interest"
                        className="h-10 w-10 rounded-md"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faImage}
                        className="text-gray-500 h-8 w-8"
                      />
                    )}

                    <p className="text-gray-900 font-inter text-sm font-medium">
                      {interest.name}
                    </p>
                  </Link>
                ))}
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
