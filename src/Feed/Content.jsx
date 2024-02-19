/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  useAutosizeTextArea,
  formatByInitialTime,
  readTime,
  getProfileDetails,
  handleLikePost,
  handleUnlikePost,
  handleBookmark,
} from "../Hooks";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";
import { selectUsers } from "../Features/usersSlice";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/auth.js";
import readSVG from "../Feed/assets/read.svg";
// import devAvatar from '../../Images/Profile/avatar-default.png';
// import loveBeforeSVG from '../../assets/Svg/Feed/love-before.svg';
// import loveAfterSVG from '../../assets/Svg/Feed/love-after.svg';
// import bookmarkBeforeSVG from '../../assets/Svg/Feed/bookmark-before.svg';
// import bookmarkAfterSVG from '../../assets/Svg/Feed/bookmark-after.svg';
// import commentSVG from '../../assets/Svg/Feed/comment.svg';
import { toast } from "react-toastify";
// import { Comment } from "../../Utils/types";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
// import MDEditor from "@uiw/react-md-editor";
import remarkGfm from "remark-gfm";
import notClapImg from "./assets/clapping-not-clapped.png";
import clappedImg from "./assets/clapping-clapped.png";
import { faBookmark } from "@fortawesome/free-regular-svg-icons"; //for yet to be bookmarked
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons"; //for already bookmarked
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Comment } from "../components/Feed/Comment.jsx";

export const Content = ({ posts, setPosts }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  //   const postId = "9mBXAxwEFABpxW0jTfn3";
  const postId = id;
  const reduxUser = useSelector(selectUser);
  //const storageUser = JSON.parse(localStorage.getItem("user") || "{}");
  const loggedInUser = reduxUser;
  // || storageUser;
  const users = useSelector(selectUsers);
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);

  const commentRef = useRef(null);
  useAutosizeTextArea(commentRef.current, comment);

  //   useEffect(() => {
  //     const postRef = doc(db, "posts", postId);

  //     const unsubscribe = onSnapshot(postRef, (postSnapshot) => {
  //       if (postSnapshot.exists()) {
  //         const postId = postSnapshot.id;
  //         const postData = postSnapshot.data();
  //         setPost({ ...postData, id: postId });

  //         // const hasVisited = postData.analytics.visitors.includes(
  //         //   loggedInUser?.id
  //         // );
  //         // const updatedAnalytics = {
  //         //   views: postData.analytics.views + 1,
  //         //   visits: postData.analytics.visits + 1,
  //         //   visitors: loggedInUser?.id
  //         //     ? hasVisited
  //         //       ? [...postData.analytics.visitors]
  //         //       : [...postData.analytics.visitors, loggedInUser?.id]
  //         //     : [...postData.analytics.visitors],
  //         //   viewers: postData.analytics.viewers, // Include 'viewers' in the update
  //         // };

  //         // updateDoc(postRef, {
  //         //   analytics: updatedAnalytics,
  //         // }).catch((error) => {
  //         //   console.log("Error updating analytics:", error);
  //         // });
  //       } else {
  //         console.log("Post does not exist");
  //       }
  //     });

  //     return () => unsubscribe(); // Unsubscribe from the snapshot listener when component unmounts or when dependencies change
  //   }, [postId, loggedInUser?.id]);

  useEffect(() => {
    if (posts.length > 0) {
      const post = posts.find((post) => post.id === postId);
      setPost(post);
    }
  }, [posts, postId]);

  useEffect(() => {
    const updateAnalytics = async () => {
      try {
        const hasVisited = post?.analytics.visitors.includes(loggedInUser?.id);
        const updatedAnalytics = {
          views: post?.analytics.views + 1,
          visits: post?.analytics.visits + 1,
          visitors: loggedInUser?.id
            ? hasVisited
              ? [...post?.analytics.visitors]
              : [...post?.analytics.visitors, loggedInUser?.id]
            : [...post?.analytics.visitors],
          viewers: post?.analytics.viewers, // Include 'viewers' in the update
        };

        await updateDoc(postRef, {
          analytics: updatedAnalytics,
        });
      } catch (error) {
        console.log("Error updating analytics:", error);
      }
    };
    if (post) {
      updateAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!post) {
    return (
      <div className="py-20 h-screen flex items-center justify-center">
        <div className="w-96 h-96">Loading...</div>
      </div>
    );
  }

  const { userId, imgUrl, postTitle, content, likes, comments } = post;
  const postRef = doc(db, "posts", id);
  const authorProfile = getProfileDetails(userId, users);

  const handleComment = async () => {
    if (comment.trim() === "") {
      return;
    }

    setLoading(true);

    const postRef = doc(db, "posts", id);
    const newComment = {
      commentId: loggedInUser?.id + "-" + Date.now(),
      commentAuthorId: loggedInUser?.id,
      body: comment,
      image: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      isDeleted: false,
      likes: [],
      firstTierReplies: [],
    };

    // Add the new comment to the post's comments array but don't use arrayUnion
    await updateDoc(postRef, {
      comments: arrayUnion(newComment),
    });

    // const updatedPost = {
    //   ...post,
    //   comments: [...comments, newComment],
    // };
    // setPost(updatedPost);
    setComment("");
    toast.success("Comment added");

    setLoading(false);
  };

  return (
    <div className="pt-[126px] py-20 px-12 flex items-center font-inter justify-center xl:px-6 md:px-2 md:py-5">
      <Helmet>
        <title>{postTitle}</title>
        <meta name="description" content={content.slice(0, 150) + "..."} />
      </Helmet>
      {/* formerly 800px */}
      <div className="max-w-[850px] w-full px-12 flex flex-col gap-5 border border-gray-200 p-5 rounded-md 2xl:px-10 xl:px-6 xl:w[600px] lg:w[650px] lg:p-4 lg:px-6 md:w-full md:border-none md:shadow-none md:gap-3 sm:px-3">
        <div className="flex gap-3">
          <Link to={`/${authorProfile?.username}`}>
            <img
              src={authorProfile?.photoURL}
              alt=""
              className="w-12 h-12 rounded-full md:w-12 md:h-12"
            />
          </Link>
          <div className="flex flex-col gap-1 md:gap-0.5">
            <Link to={`/profile/${authorProfile?.id}`}>
              <p className="text-black text-xl font-semibold font-inter md:text-base">
                {authorProfile?.name}
              </p>
            </Link>
            <p className="text-gray-500 md:text-sm">
              {formatByInitialTime(post.timestamp.seconds * 1000)}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-6 md:gap-4">
          <div className="flex flex-col gap-1.5 md:gap-0.5">
            <h3 className="text-black text-2xl font-bold md:text-[22px]">
              {postTitle}
            </h3>
            <div className="flex gap-2 items-center md:gap-1.5">
              <img src={readSVG} alt="edit" className="h-6 w-6 md:h-5 md:w-5" />
              <p className="text-[rgb(71,85,105)] font-inter text-sm font-medium">
                {readTime(content)}
              </p>
            </div>
          </div>
          <img
            src={imgUrl}
            alt="post"
            className="w-full max-h-[500px]  object-cover rounded-md md:h-80"
          />
          <div className="flex flex-col gap-3 ">
            <div className="prose prose-lg text-black prose-a:text-blue-700 prose-a:font-bold prose-a:no-underline prose-blockquote:bg-gray-50 prose-blockquote:py-0.5 prose-th:bg-slate-100 prose-th:p-2 prose-td:p-2 prose-td:border prose-th:border border-r-gray-200 prose-em:prose-strong:text-gray-700 prose-img:w-10/12 prose-img:mx-auto xl:prose-lg md:prose-base">
              <ReactMarkdown children={content} remarkPlugins={[remarkGfm]} />
            </div>
            {/* <MDEditor.Markdown
              source={post.content}
              className="bg-white text-black prose prose-lg prose-a:text-blue-700 prose-a:font-bold prose-a:no-underline prose-blockquote:bg-gray-50 prose-blockquote:py-0.5 prose-th:bg-slate-100 prose-th:p-2 prose-td:p-2 prose-td:border prose-th:border border-r-gray-200 prose-em:prose-strong:text-gray-700 prose-img:w-10/12 prose-img:mx-auto xl:prose-lg md:prose-base"
              //   style={{ whiteSpace: "pre-wrap" }}
            /> */}
          </div>
        </div>
        <div className="flex justify-between pt-4 px-3 border-t border-gray-200">
          <div className="flex gap-2 items-center">
            {likes?.length < 1 ? (
              <div
                onClick={() => handleLikePost(post, loggedInUser)}
                className="cursor-pointer focus:scale-120 transition duration-150 ease-in-out"
              >
                <img src={notClapImg} alt="clap" className="h-6 w-6" />
              </div>
            ) : (
              <>
                {likes?.includes(loggedInUser?.id) ? (
                  <div
                    onClick={() => handleUnlikePost(post, loggedInUser)}
                    className="cursor-pointer flex gap-1 items-center"
                  >
                    <div className="cursor-pointer hover:scale50 transition duration-150 ease-in-out">
                      <img src={clappedImg} alt="clap" className="h-6 w-6" />
                    </div>

                    <p className="text-[rgb(71,85,105)] font-inter text-sm font-medium">
                      {likes?.length}
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
                      {likes?.length}
                    </p>
                  </div>
                )}
              </>
            )}
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
                className="text-[#818f9c] text-lg hover:text-[#637381] transition duration-300 ease-in-out h-5"
              />
            ) : (
              <FontAwesomeIcon
                icon={faBookmark}
                className="text-[#818f9c] text-lg hover:text-[#637381] transition duration-300 h-5"
              />
            )}
          </div>
        </div>
        <div className="py-10 flex flex-col gap-6 px-6 md:gap-4 md:px-2">
          <div className="flex justify-between">
            <h2 className="text-gray-700 font-bold text-2xl md:text-[22px]">
              Comments
              <span className="text-gray-500 text-sm ml-2">
                {comments.length > 0 && (
                  <span className="text-gray-500 text-sm">
                    ({comments.length})
                  </span>
                )}
              </span>
            </h2>
            {/* <button> follow </button> */}
          </div>
          <div className="flex gap-2">
            <img
              src={loggedInUser?.photoURL}
              alt="profile"
              className="h-10 w-10 rounded-full md:h-8 md:w-8"
            />
            <div className="w-full border border-r-gray-200 rounded-md p-3 flex flex-col gap-6 md:gap-3">
              <textarea
                placeholder="Write a comment..."
                value={comment}
                ref={commentRef}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-md px-2 py-4 resize-none border-none overflow-hidden text-black focus:outline-none focus:ring-0 transition duration-300 ease-in-out md:px-2 md:py-2"
                disabled={!loggedInUser}
              />
              <button
                className={`w-max place-self-end bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out md:px-3 md:py-2 md:text-sm ${
                  loading || (comment.trim() === "" && "opacity-50")
                }`}
                disabled={loading || comment.trim() === ""}
                onClick={() => handleComment()}
              >
                {loading ? "Commenting..." : "Comment"}
              </button>
            </div>
          </div>
          {comments.length > 0 && (
            <div className="flex flex-col gap-4 pt-10 md:pt-6 md:gap-2">
              {comments.map((comment, index) => (
                <Comment
                  key={index}
                  loggedInUser={loggedInUser}
                  post={post}
                  setPost={setPost}
                  comment={comment}
                  comments={comments}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
