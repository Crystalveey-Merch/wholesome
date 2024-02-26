/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { handleFollow } from "../Hooks";
import { selectUser } from "../Features/userSlice";
// import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ActionButtons = ({ users }) => {
  const reduxUser = useSelector(selectUser);
  // const [storageUser, setStorageUser] = useState<any>(null);

  // useEffect(() => {
  //     if (localStorage.getItem("user") !== undefined) {
  //         setStorageUser(JSON.parse(localStorage.getItem("user") || '{}'))
  //     }
  // }, [])

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [routeUser, setRouteUser] = useState(null);
  //const loggedInUser = reduxUser || storageUser;

  useEffect(() => {
    if (reduxUser) {
      setLoggedInUser(reduxUser);
      // } else if (storageUser) {
      //     setLoggedInUser(storageUser)
    }
  }, [reduxUser]);

  const { username } = useParams();

  //const routeUser = users.find((user) => user.username === username);
  useEffect(() => {
    if (users) {
      setRouteUser(users.find((user) => user.username === username));
    }
  }, [users, username]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (routeUser && loggedInUser) {
      setLoading(false);
      //console.log(routeUser.id, loggedInUser.id)
    }
  }, [routeUser, loggedInUser]);

  //if routeUser is null, then loading is true
  useEffect(() => {
    if (routeUser) {
      setLoading(false);
    }
  }, [routeUser]);

  const routeId = loggedInUser?.id + "-" + routeUser?.id;

  const [buttonHover, setButtonHover] = useState(false);
  return (
    <div>
      {loading ? (
        <div className="">
          <button className="self-end bg-blue-700 text-white w-36 py-3 rounded-lg text-base font-medium xl:py-3 md:w-28 md:py-2">
            Loading...
          </button>
        </div>
      ) : routeUser && loggedInUser ? (
        <div>
          {routeUser?.id === loggedInUser?.id ? (
            <div>
              <Link to="/dashboard/profile">
                <button className="z-0 self-end bg-[#FF5841] text-white px-4 h-11 rounded-lg text-base font-medium shadow hover:bg-[#ad3020] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-100 focus:ring-offset-violet-100   disabled:cursor-not-allowed transition duration-500 ease-in-out">
                  Edit Profile
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-3 items-center sm:justify-start">
              <Link to={`/messages/${routeId}`}>
                <button className="text-gray-900 flex justify-center items-center rounded-lg border border-gray-300 shadow bg-white font-semibold text-base px-3 py-2 h-11 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100 focus:ring-offset-gray-100  disabled:cursor-not-allowed transition duration-500 ease-in-out">
                  {/* <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5" /> */}
                  Message
                </button>
              </Link>
              {routeUser?.followers.includes(loggedInUser?.id) ? (
                <button
                  onClick={() => handleFollow(loggedInUser, routeUser)}
                  onMouseEnter={() => setButtonHover(true)}
                  onMouseLeave={() => setButtonHover(false)}
                  className={`flex items-center gap-2 justify-center  text-white w-28 h-11 rounded-lg text-base font-medium shadow  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-100 focus:ring-offset-violet-100   disabled:cursor-not-allowed transition duration-500 ease-in-out ${
                    buttonHover
                      ? "bg-[#FF5841] hover:bg-[#ad3020]"
                      : "bg-[#FF5841] hover:bg-[#ad3020]"
                  }`}
                >
                  {buttonHover ? "Unfollow" : "Following"}
                </button>
              ) : (
                <button
                  onClick={() => handleFollow(loggedInUser, routeUser)}
                  className="flex items-center gap-3 justify-center bg-white text-[#FF5841] px-4 h-11 rounded-lg text-base font-medium border border-gray-300 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-100 focus:ring-offset-violet-100   disabled:cursor-not-allowed transition duration-500 ease-in-out"
                >
                  Follow
                </button>
              )}
              <button className="block sm:hidden">
                <FontAwesomeIcon icon={faEllipsis} className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            className="self-end bg-blue-700 text-white w-36 py-3 rounded-lg text-base font-medium xl:py-3 md:w-28 md:py-2"
            onClick={() => (window.location.href = "/login")}
          >
            Login to follow
          </button>
        </div>
      )}
    </div>
  );
};
