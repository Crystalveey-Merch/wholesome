/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";
import { handleFollow, handleSearchUser } from "../Hooks";

export const People = ({ searchResults }) => {
  const loggedInUser = useSelector(selectUser);

  const navigate = useNavigate();

  const peopleResults = searchResults.filter(
    (result) => result.type === "users"
  );

  return (
    <div>
      {peopleResults.length > 0 ? (
        <>
          {peopleResults[0].value.map((user) => (
            <div key={user.id} className="flex flex-col gap-0.5 py-1">
              <div className="w-full flex justify-between hover:bg-gray-100 p-2 rounded-xl transition duration-300 ease-in-out">
                <button
                  onClick={() => {
                    handleSearchUser(user.id, loggedInUser);
                    navigate(`/profile/${user.id}`);
                  }}
                  className="flex w-full gap-2 items-center"
                >
                  <img
                    src={user?.photoURL}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col justify-start">
                    <h4 className="text-sm font-inter font-semibold text-black">
                      {user?.name}
                    </h4>
                    <p className="text-xs text-start font-inter text-gray-400">
                      @{user?.username}{" "}
                    </p>
                  </div>
                </button>
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
            </div>
          ))}
        </>
      ) : (
        <div className="text-center">No Result Found</div>
      )}
    </div>
  );
};
