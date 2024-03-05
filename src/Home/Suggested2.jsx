/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { HighlightedText, handleFollow } from "../Hooks";
import devAvatar from "../assets/avatar-default.png";

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
      <h4 className="font-semibold text-black text-lg">🌟 Community Spotlight</h4>
      <div className="flex gap-4 overflow-y-scroll hide-scrollbar">
        {suggestedUsers.map((user) => (
          <div
            key={user.id}
            className="p-3 border border-gray-300 rounded-md w-56 h-40 min-w-[224px] flex flex-col gap-2 justify-between"
          >
            <Link
              to={`/${user.username}`}
              className="flex gap-2 items-center w-full"
            >
              <img
                src={user.photoURL ? user.photoURL : devAvatar}
                className="h-10 w-10 rounded-full"
                alt="User avatar"
              />
              <div className="flex flex-col justifystart w-full">
                <h4 className="text-sm font-inter font-semibold text-black one-line-text">
                  {user?.name}
                </h4>
                <p className="text-xs text-start font-inter text-gray-400">
                  @{user?.username}{" "}
                </p>
              </div>
            </Link>
            <div className="text-gray-900 text-sm font-inter font-normal w-full two-line-text">
              <HighlightedText content={user.shortBio} users={users} />
            </div>
            {loggedInUser ? (
              <>
                {loggedInUser?.following.includes(user.id) ? (
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
                  navigate(`/${user.username}`);
                }}
                className="w-max min-w-[120px] h-max block px-4 py-2 rounded-xl border border-gray-300 text-[#FF5841] font-inter text-sm"
              >
                View Profile
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
