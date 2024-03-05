/* eslint-disable react/prop-types */
import { NavLink, useNavigate } from "react-router-dom";
import { handleFollow } from "../Hooks";
// import devAvatar from "../assets/avatar-default.png";

export const Suggested2 = ({ users, loggedInUser }) => {
  const navigate = useNavigate();
  const suggestedUsers = users.filter((user) => {
    // Check if the user is not the loggedInUser and is not in the loggedInUser's following list
    return (
      user.id !== loggedInUser?.id && !loggedInUser?.following.includes(user.id)
    );
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-black md:text-lg">
        🌟 Squaremates Spotlight
      </h3>
      <div className="flex flex-col gap-5 w-full max-w-[550px] justify-center">
        {suggestedUsers.slice(0, 5).map((user, index) => (
          <div
            key={user.id}
            className={`flex flex-col gap-2 py-3  ${
              index === 0
                ? "bordert borderb border-gray-200"
                : "border-t border-gray-200"
            }`}
          >
            <div className="w-full flex justify-between">
              <NavLink
                to={`/${user.username}`}
                className="flex w-full gap-2 items-center"
              >
                <img
                  src={user.photoURL}
                  className="w-10 h-10 rounded-full mt-1"
                />
                <div className="flex flex-col">
                  <h4 className="one-line-text text-sm font-inter font-semibold text-black">
                    {user.name}
                  </h4>
                  <p className="text-xs font-inter text-gray-400">
                    @{user.username}{" "}
                    {/* <span className="text-black">
                      {" "}
                      · {user.followers?.length} followers
                    </span> */}
                  </p>
                  {/* <h4 className="pt-1 text-sm font-inter font-semibold text-black">
                    {user.followers?.length} followers
                  </h4> */}
                </div>
              </NavLink>
              {loggedInUser ? (
                <>
                  {loggedInUser.id === user.id ? (
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/dashboard/profile");
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
                      className="w-max h-max min-w-[120px] block px-4 py-2 rounded-xl border border-gray-300 text-[#FF5841] font-inter text-sm"
                    >
                      Follow
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/${user.username}`);
                  }}
                  className="w-max min-w-[120px] h-max block px-4 py-2 rounded-xl border border-gray-300 text-[#FF5841] font-inter text-sm"
                >
                  View Profile
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
