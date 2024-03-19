/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";
import { handleFollow, handleSearchUser } from "../Hooks";
import { PostCard } from "../components/Feed";

export const All = ({
  searchResults,
  handleTabChange,
  posts,
  setPosts,
  users,
}) => {
  const loggedInUser = useSelector(selectUser);

  const navigate = useNavigate();

  const convertedTitle = (title) => {
    return title.toLowerCase().split(" ").join("-");
  };

  return (
    <div>
      {searchResults.length > 0 ? (
        <div className="flex flex-col gap-3">
          {searchResults.map((result, index) => {
            return (
              <div key={index}>
                {result.type === "users" ? (
                  <div className="flex flex-col gap-3 w-full border-b border-gray-200">
                    <h3 className="text-base mb-2 font-inter font-semibold text-black uppercase">
                      People
                    </h3>
                    {result.value.slice(0, 3).map((user) => (
                      <div key={user.id} className="flex flex-col gap-0.5 py-1">
                        <div className="w-full flex justify-between hover:bg-gray-100 p-2 rounded-xl transition duration-300 ease-in-out">
                          <button
                            onClick={() => {
                              handleSearchUser(user.id, loggedInUser);
                              navigate(`/${user.username}`);
                              window.scrollTo(0, 0);
                            }}
                            className="flex w-full gap-2 items-center"
                          >
                            <img
                              src={user?.photoURL}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex flex-col justify-start">
                              <h4 className="text-sm text-left font-inter font-semibold text-black">
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
                                    navigate("/settings/account");
                                    window.scrollTo(0, 0);
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
                                window.scrollTo(0, 0);
                              }}
                              className="w-max min-w-[120px] h-max block px-4 py-2 rounded-xl border border-gray-300 text-[#FF5841] font-inter text-sm"
                            >
                              View Profile
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => handleTabChange("people")}
                      className="mt-1 py-1.5 text-start text-gray-700 hover:underline"
                    >
                      View all
                    </button>
                  </div>
                ) : result.type === "posts" ? (
                  <div className="mt-8 flex flex-col gap-6 w-full border-b border-gray-200">
                    {result.value.slice(0, 3).map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        posts={posts}
                        setPosts={setPosts}
                        users={users}
                      />
                    ))}
                    {/* <button
                      onClick={() => handleTabChange("posts")}
                      className="mt-1 py-1.5 text-start text-gray-700 hover:underline"
                    >
                      View all
                    </button> */}
                  </div>
                ) : result.type === "tags" ? (
                  <div className="mt-8 flex flex-col gap-3 w-full border-b border-gray-200">
                    <h3 className="text-base mb-2 font-inter font-semibold text-black uppercase">
                      Tags
                    </h3>
                    {result.value.slice(0, 4).map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          navigate(`/topic/${convertedTitle(tag)}`),
                            window.scrollTo(0, 0);
                        }}
                        className="text-sm text-black bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors duration-300 ease-in-out w-max lowercase"
                      >
                        #{tag}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        handleTabChange("tags"), window.scrollTo(0, 0);
                      }}
                      className="mt-1 py-1.5 text-start text-gray-700 hover:underline"
                    >
                      View all
                    </button>
                  </div>
                ) : (
                  <></>
                )}
                {(!result.type === "tags" || result.type === "posts") && (
                  <div className="mt-8 flex flex-col gap-6 w-full border-b border-gray-200">
                    {result.value.slice(4).map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        posts={posts}
                        setPosts={setPosts}
                        users={users}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center">No Result Found</div>
      )}
    </div>
  );
};
