/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { ActionButtons, SocialProfile } from ".";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

export const Profile20 = ({ users, posts }) => {
  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);

  const { username } = useParams();

  //const reduxUser = useSelector(selectUser);
  //const storageUser = JSON.parse(localStorage.getItem("user") || "{}");
  ///const loggedInUser = reduxUser || storageUser;

  const routeUser = users.find((user) => user.username === username);

  useEffect(() => {
    if (routeUser) {
      setLoading(false);
      setUserNotFound(false);
    } else {
      setLoading(false);
      setUserNotFound(true);
    }
  }, [routeUser, username, users]);

  return (
    <div className="relative -mt-20 min-h-screen">
      <div className="bg-gradient-to-tr from-red-100 via-orange-200 to-red-400 w-full absolute top-0 z-10 h-60 sm:h-52"></div>
      {loading ? (
        <div className="pt-64 sm:pt-56">
          <p className="text-center">Loading...</p>
        </div>
      ) : userNotFound ? (
        <div className="pt-64 sm:pt-56">
          <p className="text-center">User not found or invalid username</p>
        </div>
      ) : (
        <div className="w-full relative pt-[195px] border border-gray-200 h-full rounded-md sm:pt-[160px]">
          <div className="flex justify-between px-6 w-full sm:px-5">
            <div
              className="flex flex-col gap-10 h-max z-20 w-full sm:gap-6"
              //style="position: sticky; top: 0"
            >
              <div className="flex flex-row justify-between w-full">
                <div className="flex gap-5 md:flex-col">
                  <img
                    src={routeUser?.photoURL}
                    alt="avatar"
                    className="h-36 w-36 rounded-full border-4 border-white shadow-lg bg-white md:w-32 md:h-32 sm:w-24sm:h-24"
                  />

                  <div className="flex flex-col gap-3 mt-16 md:mt-4">
                    <div className="flex flex-col gap-0">
                      <h1 className="text-2xl font-semibold text-gray-900 w-max">
                        {routeUser?.name}
                      </h1>
                      <p className="text-gray-600 text-base font-normal">
                        @{username}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <NavLink
                        // to={`/${username}/followers`}
                        className="text-gray-600 text-base font-semibold"
                      >
                        {routeUser?.followers.length} followers
                      </NavLink>
                      <NavLink
                        // to={`/${username}/following`}
                        className="text-gray-600 text-base font-semibold"
                      >
                        {routeUser?.following.length} following
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="mt-16 block sm:hidden">
                  <ActionButtons users={users} />
                </div>
                <button className="h-max mt-16 hidden sm:block">
                  <FontAwesomeIcon icon={faEllipsis} className="h-5 w-5" />
                </button>
              </div>
              <SocialProfile routeUser={routeUser} users={users} />
              <div className="hidden sm:block">
                <ActionButtons users={users} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
