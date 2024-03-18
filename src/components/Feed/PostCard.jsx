/* eslint-disable react/prop-types */
// import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  formatTimeAgo,
  readTime,
  handleLikePost,
  handleUnlikePost,
  handleBookmark,
  getProfileDetails,
} from "../../Hooks";
import { selectUser } from "../../Features/userSlice";
// import { selectUsers } from "../../Features/usersSlice";
// import { db } from "../../firebase/auth";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons"; //for yet to be bookmarked
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons"; //for already bookmarked
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import notClapImg from "../../Feed/assets/clapping-not-clapped.png";
import clappedImg from "../../Feed/assets/clapping-clapped.png";
import readSVG from "../../Feed/assets/read.svg";

export const PostCard = ({ post, posts, setPosts, users }) => {
  const navigate = useNavigate();
  const loggedInUser = useSelector(selectUser);

  // const users = useSelector(selectUsers);
  const postRef = useRef(null);
  // const [hasViewedP, setHasViewedP] = useState(false);

  const postId = post.id;

  // useEffect(() => {
  //   const observerOptions = {
  //     root: null,
  //     rootMargin: "0px",
  //     threshold: 0.5,
  //   };

  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         setHasViewedP(true);
  //         observer.unobserve(entry.target);
  //         updatePostViews(post.id);
  //       }
  //     });
  //   }, observerOptions);

  //   if (postRef.current) {
  //     observer.observe(postRef.current);
  //   }

  //   return () => {
  //     if (postRef.current) {
  //       // eslint-disable-next-line react-hooks/exhaustive-deps
  //       observer.unobserve(postRef.current);
  //     }
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [post.id]);

  // const updatePostViews = async (postId) => {
  //   try {
  //     const postRef = doc(db, "posts", postId);
  //     const hasViewed = post.analytics.viewers.includes(loggedInUser?.id);
  //     const updatedAnalytics = {
  //       views: hasViewedP ? post.analytics.views : post.analytics.views + 1,
  //       viewers: loggedInUser?.id
  //         ? hasViewed
  //           ? [...post.analytics.viewers]
  //           : [...post.analytics.viewers, loggedInUser?.id]
  //         : [...post.analytics.viewers], // If no user is logged in, keep the viewers array unchanged
  //       visits: post.analytics.visits,
  //       visitors: post.analytics.visitors,
  //     };
  //     await updateDoc(postRef, {
  //       analytics: updatedAnalytics,
  //     });

  // setPosts(
  //     posts.map((post) => {
  //         if (post.id === postId) {
  //             return {
  //                 ...post,
  //                 analytics: updatedAnalytics,
  //             };
  //         }
  //         return post;
  //     })
  // );
  // console.log('Post views updated' + post.analytics.views);
  //   } catch (error) {
  //     //console.log(loggedInUser?.id);
  //     console.log("Error updating post views:", error);
  //   }
  // };

  // filter out other characters except letters and single space
  const filterOutOtherCharacters = (string) => {
    return string.replace(/[^a-zA-Z ]/g, "");
  };

  const [titleLines, setTitleLines] = useState(1);

  useEffect(() => {
    // Calculate the number of lines for the title
    const titleElement = document.getElementById(`title-${post.id}`);
    if (titleElement) {
      const lineHeight = parseInt(
        window.getComputedStyle(titleElement).lineHeight
      );
      const maxHeight = lineHeight * 2; // Two lines max
      if (titleElement.offsetHeight > maxHeight) {
        setTitleLines(2);
      }
    }
  }, [post.id]);

  const convertedTitle = (title) => {
    if (!title) {
      return "";
    }
    return title.toLowerCase().split(" ").join("-");
  };

  return (
    <div
      ref={postRef}
      className="p-5 border border-gray-200 rounded-md flex flex-col gap-5 overflow-hidden lg:p-4"
    >
      <div className="flex gap-4 items-center">
        <img
          src={getProfileDetails(post.userId, users)?.photoURL}
          alt="user"
          className="w-8 h-8 rounded-full"
        />
        <div className="flex gap-1 items-center">
          <Link
            onClick={() => window.scrollTo(0, 0)}
            to={`/${getProfileDetails(post.userId, users)?.username}`}
            className="text-[0.95rem] font-inter font-semibold text-black"
          >
            {getProfileDetails(post.userId, users)?.name}
          </Link>
          <p className="text-slate-500 text-center text-sm md:text-xs">·</p>
          <p className="text-slate-500 text-[0.85rem]">
            {formatTimeAgo(new Date(post?.timestamp?.seconds * 1000))}
          </p>
        </div>
      </div>
      <Link
        className="flex gap-8 items-center lg:gap-4 md:gap-4 sm:flex-col"
        onClick={() => window.scrollTo(0, 0)}
        to={`/readmore/${post.id}`}
      >
        <div className="w-full max-w-[450px] flex flex-grow flex-col gap-2 h[200px] xl:max-w-[332px] lg:max-w-[470px] md:max-w-[440px] sm:max-w-full">
          <h2
            className="text-lg font-semibold text-black overflow-hidden md:text-base"
            id={`title-${post.id}`}
            style={{ WebkitLineClamp: titleLines }}
          >
            {post.postTitle}
          </h2>
          <div className="sm:flex gap-2 items-center hidden">
            <img src={readSVG} alt="read" className="h-5 w-5" />
            <p className="text-[rgb(71,85,105)] font-inter text-sm font-medium">
              {readTime(post.content)}
            </p>
          </div>
          <p
            className="text-[#637381] wfit font-inter text-base font-normal title-content-container overflow-hidden md:text-sm"
            style={{
              WebkitLineClamp: titleLines === 1 ? 3 : 2,
              textOverflow: "ellipsis",
              overflowWrap: "break-word",
              wordWrap: "break-word",
            }}
          >
            {filterOutOtherCharacters(post.content)}
          </p>
        </div>
        <img
          src={post.imgUrl}
          alt="post"
          className="min-w-[200px] w-[200px] max-h-[100px] rounded-md object-cover block md:min-w-[150px] md:w-[150px] md:max-h-[100px] sm:w-full sm:max-h-[200px]"
        />
      </Link>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex gap-2 items-center">
            {post?.likes?.length < 1 ? (
              <div
                onClick={() => handleLikePost(post, loggedInUser)}
                className="cursor-pointer focus:scale-120 transition duration-150 ease-in-out"
              >
                <img src={notClapImg} alt="clap" className="h-6 w-6" />
              </div>
            ) : (
              <>
                {post?.likes?.includes(loggedInUser?.id) ? (
                  <div
                    onClick={() => handleUnlikePost(post, loggedInUser)}
                    className="cursor-pointer flex gap-1 items-center"
                  >
                    <div className="cursor-pointer hover:scale50 transition duration-150 ease-in-out">
                      <img src={clappedImg} alt="clap" className="h-6 w-6" />
                    </div>

                    <p className="text-[rgb(71,85,105)] font-inter text-sm font-medium">
                      {post?.likes?.length}
                    </p>
                  </div>
                ) : (
                  <div
                    onClick={() => handleLikePost(post, loggedInUser)}
                    className="cursor-pointer flex gap-1 items-center"
                  >
                    <div className="cursor-pointer hover:scale50 transition duration-150 ease-in-out">
                      <img src={notClapImg} alt="clap" className="h-6 w-6" />
                    </div>
                    <p className="text-[rgb(71,85,105)] font-inter text-sm font-medium">
                      {post?.likes?.length}
                    </p>
                  </div>
                )}
              </>
            )}
            {/* <div
              onClick={() => (
                setSelectedCommentIndex(index), handleClick(comment)
              )} // Set the selected comment index to the current index
              className="text-[rgb(71,85,105)] text-sm font-medium cursor-pointer transition duration-150 ease-in-out hover:underline"
            >
              Reply
            </div> */}
          </div>
          <p className="text-slate-500 font-semibold text-center text-sm md:text-xs sm:hidden">
            ·
          </p>
          <div className="flex gap-2 items-center sm:hidden">
            <img src={readSVG} alt="read" className="h-5 w-5" />
            <p className="text-[rgb(71,85,105)] font-inter text-sm font-medium">
              {readTime(post.content)}
            </p>
          </div>
        </div>
        <div className="flex items-end gap-4">
          <div>
            <Link
              onClick={() => window.scrollTo(0, 0)}
              to={`/topic/${convertedTitle(post?.tags[0])}`}
            >
              <p className="text-red-500 capitalize py-1 px-2.5 bg-red-50 rounded-3xl font-inter text-xs font-semibold">
                {/* get first post tag */}
                {post.tags[0]}
              </p>
            </Link>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              if (loggedInUser) {
                handleBookmark(postId, loggedInUser, setPosts, posts);
              } else {
                // Redirect the user to the login page
                navigate("/login");
              }
            }}
          >
            {Array.isArray(post.bookmarks) &&
            post.bookmarks.includes(loggedInUser?.id) ? (
              <FontAwesomeIcon
                icon={faBookmarkSolid}
                className="text-[#818f9c] text-lg hover:text-[#637381] transition duration-300 ease-in-out h-4"
              />
            ) : (
              <FontAwesomeIcon
                icon={faBookmark}
                className="text-[#818f9c] text-lg hover:text-[#637381] transition duration-300 h-4"
              />
            )}
          </div>
          <div className="flex gap-1 itemsend">
            <FontAwesomeIcon icon={faChartSimple} className="text-[#818f9c]" />
            <p className="text-[#637381] font-inter text-[0.85rem] font-medium">
              {post.analytics.views > 0 ? post.analytics.views : 1}
              {/* {post.analytics.views !== 1} */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
