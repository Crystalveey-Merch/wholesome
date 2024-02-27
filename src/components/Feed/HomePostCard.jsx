/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  formatTimeAgo,
  readTime,
  handleLikePost,
  handleUnlikePost,
  getProfileDetails,
} from "../../Hooks";
import { selectUser } from "../../Features/userSlice";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import notClapImg from "../../Feed/assets/clapping-not-clapped.png";
import clappedImg from "../../Feed/assets/clapping-clapped.png";
import readSVG from "../../Feed/assets/read.svg";
import devAvatar from "../../assets/avatar-default.png";

export const HomePostCard = ({ post, users }) => {
  const loggedInUser = useSelector(selectUser);

  // filter out other characters except letters and single space
  const filterOutOtherCharacters = (string) => {
    return string.replace(/[^a-zA-Z ]/g, "");
  };

  const convertedTitle = (title) => {
    if (!title) {
      return "";
    }
    return title.toLowerCase().split(" ").join("-");
  };
  return (
    <div className="p-4 bg-white font-inter w-full max-w-[400px] h-[440px] rounded-md flex flex-col justify-between gap-5 overflow-hidden sm:w-full sm:max-w-[300px]">
      <div className="flex gap-4 flex-col">
        <div className="flex gap-4 items-center">
          <img
            src={
              getProfileDetails(post.userId, users).photoURL
                ? getProfileDetails(post.userId, users).photoURL
                : devAvatar
            }
            alt="user"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex gap-1 items-center">
            <Link
              onClick={() => window.scrollTo(0, 0)}
              to={`/${getProfileDetails(post.userId, users)?.username}`}
              className="text-[0.95rem] font-inter font-semibold text-black sm:text-sm"
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
          className="flex items-center gap-3 flex-col"
          onClick={() => window.scrollTo(0, 0)}
          to={`/readmore/${post.id}`}
        >
          <div className="w-full flex flex-col gap-2 h[200px] max-w-full">
            <h2
              className="text-title text-[1.08rem] font-semibold text-black overflow-hidden md:text-base"
              id={`title-${post.id}`}
              style={{
                WebkitLineClamp: 1,
              }}
            >
              {post.postTitle}
            </h2>
            <div className="flex gap-2 items-center">
              <img src={readSVG} alt="read" className="h-5 w-5" />
              <p className="text-[rgb(71,85,105)] font-inter text-sm font-medium">
                {readTime(post.content)}
              </p>
            </div>
            <p
              className="text-[#637381] wfit font-inter text-[0.95rem] font-normal title-content-container overflow-hidden"
              style={{
                WebkitLineClamp: 2,
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
            className="w-full max-h-[200px] h-[200px] object-top  rounded-md object-cover block"
          />
        </Link>
      </div>

      <div className="flex justify-between items-center justify-self-end">
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
