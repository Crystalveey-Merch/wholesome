/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/auth";
import { FirstTierReply } from "./FirstTierReply";
// import { selectUsers } from "../../Features/usersSlice";
// import { useSelector } from "react-redux";
import {
  getProfileDetails,
  formatTimeAgo,
  useAutosizeTextArea,
  handleLikeComment,
  handleUnlikeComment,
} from "../../Hooks";
import notClapImg from "../../Feed/assets/clapping-not-clapped.png";
import clappedImg from "../../Feed/assets/clapping-clapped.png";

export const Comment = ({
  loggedInUser,
  users,
  post,
  setPost,
  comment,
  comments,
  index,
}) => {
  const [loading, setLoading] = useState(false);
//   const users = useSelector(selectUsers);
  //   console.log(users);
  const postRef = doc(db, "posts", post.id);
  const [firstTierReply, setFirstTierReply] = useState("");

  const [selectedCommentIndex, setSelectedCommentIndex] = useState(-1);

  const handleCancelReply = () => {
    setSelectedCommentIndex(-1);
    setFirstTierReply("");
  };

  const FirstTierReplyRef = useRef(null);
  useAutosizeTextArea(FirstTierReplyRef.current, firstTierReply);

  const handleFirstTierReply = async (commentId) => {
    if (firstTierReply.trim() === "") {
      return;
    }

    setLoading(true);

    const newFirstTierReply = {
      replyId: loggedInUser?.id + "-" + Date.now(),
      replyAuthorId: loggedInUser?.id,
      replyingToId: commentId,
      body: firstTierReply,
      image: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      isDeleted: false,
      likes: [],
      secondTierReplies: [],
    };

    await updateDoc(postRef, {
      comments: comments.map((comment) =>
        comment.commentId === commentId
          ? {
              ...comment,
              firstTierReplies: comment.firstTierReplies
                ? [...comment.firstTierReplies, newFirstTierReply]
                : [newFirstTierReply],
            }
          : comment
      ),
    });

    // Update the post state with the updated comments
    // setPost((prevPost) => ({
    //   ...prevPost,
    //   comments: prevPost.comments.map((comment) =>
    //     comment.commentId === commentId
    //       ? {
    //           ...comment,
    //           firstTierReplies: comment.firstTierReplies
    //             ? [...comment.firstTierReplies, newFirstTierReply]
    //             : [newFirstTierReply],
    //         }
    //       : comment
    //   ),
    // }));

    // Clear the input field after adding the reply
    // setFirstTierReplies((prevReplies) => ({
    //   ...prevReplies,
    //   [commentId]: "",
    // }));

    setFirstTierReply("");
    toast.success("Reply added");
    setLoading(false);
  };

  const handleClick = (comment) => {
    // Wait for one second before scrolling
    setTimeout(() => {
      // Get the target element
      const targetElement = document.getElementById(`reply-${index}`);

      // Calculate the offset based on the desired spacing
      const offset = -220; // Desired spacing

      // Calculate the final scroll position
      const scrollPosition = targetElement.offsetTop + offset;

      // Scroll to the desired position
      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });

      // Add comment.authorId to the beginning of firstTierReply if it's not already there
      if (
        // !firstTierReply.includes(
        //   getProfileDetails(comment.userId, users)?.username
        firstTierReply.trim() === ""
      ) {
        setFirstTierReply(
          `@${
            getProfileDetails(
              comment.userId ? comment.userId : comment.commentAuthorId,
              users
            )?.username
          } ${firstTierReply}`
        );
      }

      // Set focus to the reply textarea
      FirstTierReplyRef.current.focus();
    }, 500); // Wait for one second (1000 milliseconds)
  };

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <img
          src={
            getProfileDetails(
              comment.userId ? comment.userId : comment.commentAuthorId,
              users
            )?.photoURL
          }
          alt="profile"
          className="h-10 w-10 block min-h-[40px] object-cover mt1 rounded-full md:h-9 md:w-9"
        />
        {/* if index is not last on the list and selectedCommentIndex is not (-1) then show the line */}
        {/* <p
      className={` ${
        index !== comments.length - 1 &&
        "h-full w-0.5 bg-slate-400"
      }`}
    ></p> */}
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="w-full flex flex-col gap-1 md:gap-0.5">
          <div className="flex justify-between">
            <div className="flex gap-1 items-center">
              <h2 className="text-black font-semibold text-base md:text-base">
                {
                  getProfileDetails(
                    comment.userId ? comment.userId : comment.commentAuthorId,
                    users
                  )?.name
                }
              </h2>
              <p className="text-slate-500 text-center text-sm md:text-xs">·</p>
              <p className="text-slate-500 text-sm md:text-xs">
                {comment.createdAt
                  ? formatTimeAgo(new Date(comment.createdAt.seconds * 1000))
                  : "loading"}
              </p>
            </div>
            {/* <button> follow </button> */}
          </div>
          <p className="text-[rgb(71,85,105)] text-base">{comment.body}</p>
        </div>
        <div className="flex gap-2 items-center">
          {comment?.likes?.length < 1 ? (
            <div
              onClick={() =>
                handleLikeComment(
                  loggedInUser?.id,
                  post,
                  setPost,
                  comment.commentId,
                  comments,
                  postRef
                )
              }
              className="cursor-pointer focus:scale-120 transition duration-150 ease-in-out"
            >
              <img src={notClapImg} alt="clap" className="h-6 w-6" />
            </div>
          ) : (
            <>
              {comment?.likes?.includes(loggedInUser?.id) ? (
                <div
                  onClick={() =>
                    handleUnlikeComment(
                      loggedInUser?.id,
                      post,
                      setPost,
                      comment.commentId,
                      comments,
                      postRef
                    )
                  }
                  className="cursor-pointer flex gap-1 items-center"
                >
                  <div className="cursor-pointer hover:scale50 transition duration-150 ease-in-out">
                    <img src={clappedImg} alt="clap" className="h-6 w-6" />
                  </div>

                  <p className="text-[rgb(71,85,105)] text-sm font-medium">
                    {comment?.likes?.length}
                  </p>
                </div>
              ) : (
                <div
                  onClick={() =>
                    handleLikeComment(
                      loggedInUser?.id,
                      post,
                      setPost,
                      comment.commentId,
                      comments,
                      postRef
                    )
                  }
                  className="cursor-pointer flex gap-1 items-center"
                >
                  <div className="cursor-pointer hover:scale50 transition duration-150 ease-in-out">
                    <img src={notClapImg} alt="clap" className="h-6 w-6" />
                  </div>
                  <p className="text-[rgb(71,85,105)] text-sm font-medium">
                    {comment?.likes?.length}
                  </p>
                </div>
              )}
            </>
          )}
          <p className="text-slate-500 font-semibold text-center text-sm md:text-xs">
            ·
          </p>
          <div
            onClick={() => (
              setSelectedCommentIndex(index), handleClick(comment)
            )} // Set the selected comment index to the current index
            className="text-[rgb(71,85,105)] text-sm font-medium cursor-pointer transition duration-150 ease-in-out hover:underline"
          >
            Reply
          </div>
        </div>
        {comment.firstTierReplies?.map((reply, fIndex) => (
          <FirstTierReply
            key={fIndex}
            loggedInUser={loggedInUser}
            users={users}
            post={post}
            setPost={setPost}
            comment={comment}
            comments={comments}
            reply={reply}
            index={fIndex}
          />
        ))}
        {selectedCommentIndex === index && (
          <div id={`reply-${index}`} className="flex gap-2">
            <img
              src={loggedInUser?.photoURL}
              alt="profile"
              className="h-10 w-10 rounded-full md:h-8 md:w-8"
            />
            <div className="w-full border border-r-gray-200 rounded-md p-3 flex flex-col gap-6 md:gap-3">
              <textarea
                placeholder={`Replying to ${
                  getProfileDetails(comment.userId ? comment.userId : comment.commentAuthorId, users)?.name
                }`}
                value={firstTierReply}
                ref={FirstTierReplyRef}
                onChange={(e) => setFirstTierReply(e.target.value)}
                className="w-full rounded-md px-2 py-2 resize-none border-none overflow-hidden text-black focus:outline-none focus:ring-0 transition duration-300 ease-in-out md:px-2 md:py-2"
                disabled={!loggedInUser}
              />
              <div className="flex gap-2 items-center justify-end">
                <button
                  onClick={handleCancelReply}
                  className="text-red-500 bg-transparent font-semibold text-sm cursor-pointer transition duration-300 ease-in-out hover:bg-red-50 hover:text-red-600 px-3 py-2 rounded-md md:px-2 md:py-2 md:text-xs"
                >
                  Cancel
                </button>
                <button
                  className={`w-max bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out md:px-3 md:py-2 md:text-sm ${
                    loading || (firstTierReply.trim() === "" && "opacity-50")
                  }`}
                  disabled={loading || firstTierReply.trim() === ""}
                  onClick={() => handleFirstTierReply(comment.commentId)}
                >
                  {loading ? "Replying..." : "Reply"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <p className="text-gray-500 text-sm px-3 md:px-2">Replies</p> */}
    </div>
  );
};
