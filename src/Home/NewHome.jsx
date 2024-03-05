/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  closeRightBar,
  selectOpenRightBar,
} from "../Features/openRightBarSlice";
import { RightBar } from "../Feed";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MiniHeader, Section1, Suggested2 } from ".";
import { PostCard } from "../components/Feed";
import { selectUser } from "../Features/userSlice";
// import { handleFollow } from "../Hooks";

export const NewHome = ({
  users,
  posts,
  setPosts,
  loading,
  events,
  activities,
}) => {
  const dispatch = useDispatch();

  const closeRightBarSlide = () => {
    dispatch(closeRightBar());
  };

  const rightBarSlideOpen = useSelector(selectOpenRightBar);
  const rightBarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const rightBarHeight = rightBarRef.current.offsetHeight;
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Check if the scroll position is greater than or equal to the height of the RightBar
      if (scrollPosition >= rightBarHeight - windowHeight) {
        // Add sticky class
        rightBarRef.current.classList.add("sticky-rightbar");
        rightBarRef.current.style.top = `${windowHeight - rightBarHeight}px`;
      } else {
        // Remove sticky class
        rightBarRef.current.classList.remove("sticky-rightbar");
        rightBarRef.current.style.top = "0";
      }
    };

    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const loggedInUser = useSelector(selectUser);
  //   const navigate = useNavigate();

  return (
    <div className="pt-[90px] flex flex-col gap-16 font-inter lg:pt-[80px] md:pt-[70px]">
      <MiniHeader />
      <section>
        <Section1 />
      </section>

      <div className="flex justify-center gap-10 lg:flex-col">
        <div className="hidden lg:flex flex-col px-6">
          <div className="w-full lg:mx-auto lg:max-w-3xl lg:px-5 md:max-w-[650px] md:px-2 sm:px-0 h-max p-5 flex justify-center flex-col gap-7">
            <Suggested2 loggedInUser={loggedInUser} users={users} />
          </div>
        </div>
        <div className="w-full place-self-center pb-10 max-w-3xl xl:max-w-[650px] lg:mx-auto lg:max-w-3xl lg:px-5 md:max-w-[650px] md:px-2 sm:px-0">
          <div className="sm:px-4">
            {posts.length === 0 ? (
              <div className="flex justify-center flex-col items-center h-[400px] gap-5">
                <h4 className="text-3xl font-semibold text-gray-900">
                  No posts yet
                  <span className="ml-2 text-2xl font-semibold text-gray-900">
                    😢
                  </span>
                </h4>
                <p className="text-gray-500 text-center">
                  Posts from different creators will appear here
                  <br />
                  <span>
                    You can find users and topics to follow{" "}
                    <Link to="/feed" className="text-blue-500 hover:underline">
                      here
                    </Link>
                    .
                  </span>
                </p>
              </div>
            ) : (
              <div className="min-w[100%] flex flex-col gap-8">
                {posts
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((post) => (
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
        </div>
        <div
          className={`rightbar-link z-20 ${
            rightBarSlideOpen
              ? "rightbar-link-active lg:bg-[rgba(0,0,0,0.4)] lg:items-end"
              : ""
          }`}
          style={{
            backgroundColor: rightBarSlideOpen ? "" : "transparent",
          }}
          onClick={closeRightBarSlide}
        >
          <div
            ref={rightBarRef}
            className="px min- h-max pb-9 lg:overflow-y-auto lg:bg-white lg:w-max lg:place-self-end lg:h-full lg:px-4 lg:flex lg:flex-col lg:gap-8 lg:pt-[106px] lg:items-end md:pt-[90px] sm:mb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="hidden lg:block sm:pt-10"
              onClick={closeRightBarSlide}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="text-2xl text-gray-800 cursor-pointer md:text-xl"
              />
            </div>
            <RightBar
              posts={posts}
              loading={loading}
              events={events}
              users={users}
              activities={activities}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
