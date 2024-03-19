/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";
import { handleFollow } from "../Hooks";
import defaultAvatar from "../assets/avatar-default.png";

export const FollowingUsers = ({ users }) => {
  const { username } = useParams();
  const navigate = useNavigate();

  const routeUser = users.find((user) => user.username === username);

  //const reduxUser = useSelector(selectUser);
  const loggedInUser = useSelector(selectUser);

  const [routeUserFollowing, setRouteUserFollowing] = useState(null);

  useEffect(() => {
    if (routeUser) {
      const following = users.filter((user) =>
        routeUser.following.includes(user.id)
      );
      setRouteUserFollowing(following);
    } else {
      setRouteUserFollowing([]);
    }
  }, [routeUser, users]);

  const [isGreaterThanOne, setisGreaterThanOne] = useState(false);

  useEffect(() => {
    if (routeUserFollowing) {
      if (routeUserFollowing.length > 0) {
        setisGreaterThanOne(true);
      } else {
        setisGreaterThanOne(false);
      }
    }
  }, [routeUserFollowing]);

  return (
    <>
      <div className="bg-white w-full p-4 shadow-md rounded-lg mx-auto sm:p-3">
        {routeUser === undefined ? (
          <div>
            <h1>Loading...</h1>
          </div>
        ) : (
          <div className="pb-10">
            {isGreaterThanOne ? (
              <ul className="flex flex-col gap-3">
                {routeUserFollowing.map((user) => (
                  <li key={user.id} className="flex justify-between">
                    <NavLink
                      to={`/${user.username}`}
                      className="flex items-center gap-4 transition duration-300 ease-in-out hover:bg-gray-100 p-2 rounded-md px-4 sm:px-2 sm:gap-2"
                    >
                      <img
                        src={user.photoURL ? user.photoURL : defaultAvatar}
                        alt="avatar"
                        className="w-12 h-12 rounded-full sm:w-10 sm:h-10"
                      />
                      <div className="flex flex-col">
                        <h1 className="text-gray-900 font-semibold text-base font-inter one-line-text sm:text-[0.95rem]">
                          {user.name}
                        </h1>
                        <p className="text-gray-600 text-sm font-inter one-line-text">
                          @{user.username}
                        </p>
                      </div>
                    </NavLink>
                    <div className="flex items-center">
                      {loggedInUser ? (
                        <>
                          {loggedInUser.id === user.id ? (
                            <button
                              type="button"
                              onClick={() => {
                                navigate("/settings/account");
                              }}
                              className="w-max h-max min-w-[120px] block px-4 py-2 rounded-xl bg-[#FF5841] border border-[#FF5841] text-[#FFFFFF] font-inter text-sm"
                            >
                              Edit Profile
                            </button>
                          ) : loggedInUser.following.includes(user.id) ? (
                            <button
                              type="button"
                              onClick={() => {
                                handleFollow(loggedInUser, user);
                              }}
                              className="w-max h-max min-w-[120px] block px-4 py-2 rounded-xl bg-[#FF5841] border border-[#FF5841] text-[#FFFFFF] font-inter text-sm"
                            >
                              Following
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                handleFollow(loggedInUser, user);
                              }}
                              className="w-max h-max min-w-[120px] block px-4 py-2 rounded-xl bg-white border border-gray-300 text-[#FF5841] font-inter text-sm"
                            >
                              Follow
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            navigate(`/profile/${user.id}`);
                          }}
                          className="w-max min-w-[120px] h-max block px-4 py-2 rounded-xl border border-gray-300 text-[#FF5841] font-inter text-sm"
                        >
                          View Profile
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm">
                {routeUser.id === loggedInUser?.id ? (
                  <p>You are not following anyone yet. </p>
                ) : (
                  <p>This user is not following anyone yet.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
