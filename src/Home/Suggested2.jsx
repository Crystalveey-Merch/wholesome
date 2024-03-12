/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination, Navigation } from "swiper";
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
    <div className="w-full flex flex-col gap-4 lg:pb-6">
      <h3 className="text-xl font-semibold text-black md:text-lg">
        🌟 Squaremates Spotlight
      </h3>
      {/* <div className="flex flex-col justifycenter p-4 gap-4 h-[300px] border border-gray-100 rounded-xl w-full">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-3">
            <img
              src={suggestedUsers[0]?.photoURL}
              className="w-32 h-32 object-cover rounded-full"
            />
            <div className="flex flex-col">
              <h4 className="text-lg font-inter font-semibold text-black">
                {suggestedUsers[0]?.name}
              </h4>
              <p className="text-sm font-inter text-gray-700">
                @{suggestedUsers[0]?.username}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <p className="text-sm font-inter text-black">
                {suggestedUsers[0]?.followers?.length} followers
              </p>
              <p className="text-sm font-inter text-black">
                {suggestedUsers[0]?.following?.length} following
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              navigate(`/${suggestedUsers[0]?.username}`);
            }}
            className="w-max h-max min-w-[120px] block px-4 py-2 rounded-xl border border-gray-300 text-[#FF5841] font-inter font-semibold text-sm"
          >
            View Profile
          </button>
        </div>
        <h4 className="text-black font-semibold text-base">
          {suggestedUsers[0]?.shortBio}
        </h4>
      </div> */}
      <Swiper
        // breakpoints={breakpoints}
        slidesPerView={"auto"}
        // spaceBetween={10}
        // navigation={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay, Navigation]}
        className="mySwiper pb8 w-[calc(100vw-2.5rem)] sm:w-[calc(100vw-24px)]"
      >
        {suggestedUsers.slice(1, 8).map((user) => (
          <SwiperSlide key={user.id} className="w-max sm:h-max">
            <div className="p-1.5">
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
                {/* {loggedInUser?.following.includes(user.id) ? (
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
                )} */}
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
          </SwiperSlide>
        ))}
      </Swiper>
      {/* <div className="flex flex-col gap-5 w-full max-w-[550px] justify-center">
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
                    <span className="text-black">
                      {" "}
                      · {user.followers?.length} followers
                    </span>
                  </p>
                  <h4 className="pt-1 text-sm font-inter font-semibold text-black">
                    {user.followers?.length} followers
                  </h4>
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
      </div> */}
    </div>
  );
};
