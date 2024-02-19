/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/auth";
import {
  getProfileDetails,
  formatTimeAgo,
  useAutosizeTextArea,
  handleLikeFirstTierReply,
  handleUnlikeFirstTierReply,
  handleLikeSecondTierReply,
  handleUnlikeSecondTierReply,
} from "../../Hooks";
import notClapImg from "../../Feed/assets/clapping-not-clapped.png";
import clappedImg from "../../Feed/assets/clapping-clapped.png";

export const FirstTierReply = ({
  loggedInUser,
  users,
  post,
  setPost,
  comment,
  comments,
  reply,
  index,
}) => {
  const [loading, setLoading] = useState(false);
  const postRef = doc(db, "posts", post.id);
  const [secondTierReply, setSecondTierReply] = useState("");

  const [selectedReplyIndex, setSelectedReplyIndex] = useState(-1);
  const secondTierReplyRef = useRef(null);

  const handleCancelReply = () => {
    setSelectedReplyIndex(-1);
    setSecondTierReply("");
  };

  const srollToReplyFunction = (index) => {
    // Get the target element
    const targetElement = document.getElementById(`secondReply-${index}`);

    // Calculate the offset based on the desired spacing
    const offset = -220; // Desired spacing

    // Calculate the final scroll position
    const scrollPosition = targetElement.offsetTop + offset;

    // Scroll to the desired position
    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  };
  const handleClick = (reply) => {
    const authorUsername = getProfileDetails(
      reply.replyAuthorId,
      users
    )?.username;
    // Check if there is content after the first space after username
    const hasContentAfterUsername = secondTierReply.split(" ")[1]?.trim();

    const hasAtUsername = /@\S+\s/.test(secondTierReply);

    const isReplyAuthorInSecondTierReply = secondTierReply.includes(
      "@" + authorUsername
    );

    const isSecondTierReplyEmpty = secondTierReply.trim() === "";

    // Wait for one second before scrolling
    setTimeout(() => {
      if (!hasContentAfterUsername && !isReplyAuthorInSecondTierReply) {
        if (hasAtUsername) {
          srollToReplyFunction(index);
          // Replace the first username with the new username
          setSecondTierReply(
            `@${authorUsername} ${secondTierReply.split(" ")[1]}`
          );
          // Set focus to the reply textarea
          secondTierReplyRef.current.focus();
        } else {
          if (isSecondTierReplyEmpty && selectedReplyIndex === -1) {
            srollToReplyFunction(index);
            // Add reply.authorId to the beginning of secondTierReply if it's not already there
            //   if (
            //     // !secondTierReply.includes(
            //     //   getProfileDetails(reply.replyAuthorId, users)?.username
            //     secondTierReply.trim() === ""
            //   ) {
            setSecondTierReply(
              `@${
                getProfileDetails(reply.replyAuthorId, users)?.username
              } ${secondTierReply}`
            );
            //   }

            // Set focus to the reply textarea
            secondTierReplyRef.current.focus();
          }
        }
      }
    }, 500); // Wait for one second (1000 milliseconds)
  };

  const handleShowReply = (index) => {
    // don't chnage the selectedReplyIndex if secondTierReply is not empty
    if (secondTierReply.trim() !== "") {
      return;
    }

    setSelectedReplyIndex(index);
  };

  useAutosizeTextArea(secondTierReplyRef.current, secondTierReply);

  const handleSecondTierReply = async (replyId, commentId) => {
    if (secondTierReply.trim() === "") {
      return;
    }

    setLoading(true);

    const newSecondTierReply = {
      replyId: loggedInUser?.id + "-" + Date.now(),
      replyAuthorId: loggedInUser?.id,
      replyingToId: replyId,
      body: secondTierReply,
      image: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      isDeleted: false,
      likes: [],
    };

    await updateDoc(postRef, {
      comments: comments.map((comment) =>
        comment.commentId === commentId
          ? {
              ...comment,
              firstTierReplies: comment.firstTierReplies.map((reply) =>
                reply.replyId === replyId
                  ? {
                      ...reply,
                      secondTierReplies: reply.secondTierReplies
                        ? [...reply.secondTierReplies, newSecondTierReply]
                        : [newSecondTierReply],
                    }
                  : reply
              ),
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
    //           firstTierReplies: comment.firstTierReplies.map((reply) =>
    //             reply.replyId === replyId
    //               ? {
    //                   ...reply,
    //                   secondTierReplies: reply.secondTierReplies
    //                     ? [...reply.secondTierReplies, newSecondTierReply]
    //                     : [newSecondTierReply],
    //                 }
    //               : reply
    //           ),
    //         }
    //       : comment
    //   ),
    // }));

    // Clear the input field after adding the reply
    setSecondTierReply("");

    toast.success("Reply added");
    setLoading(false);
  };

  const [showReplies, setShowReplies] = useState(false);

  return (
    <div key={index} className="flex gap-3">
      <div className="flex flex-col items-center">
        <img
          src={getProfileDetails(reply.replyAuthorId, users)?.photoURL}
          alt="profile"
          className="h-[40px] w-[40px] block min-h-[40px] object-cover mt1 rounded-full md:h-[36px] md:w-[36px] md:min-h-[36px]"
        />
        {/* <p
            className={` ${
              index !== comment.firstTierReplies.length - 1 &&
              "h-full w-0.5 bg-slate-400"
            }`}
          ></p> */}
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="w-full flex flex-col gap-1 md:gap-0.5">
          <div className="flex justify-between">
            <div className="flex gap-1 items-center">
              <h2 className="text-black font-semibold text-base md:text-base">
                {getProfileDetails(reply.replyAuthorId, users)?.name}
              </h2>
              <p className="text-slate-500 text-center text-sm md:text-xs font-inter">
                ·
              </p>
              <p className="text-gray-500 text-sm md:text-xs font-inter">
                {reply.createdAt
                  ? formatTimeAgo(new Date(reply.createdAt.seconds * 1000))
                  : "loading"}
              </p>
            </div>
            {/* <button> follow </button> */}
          </div>
          <p className="text-[rgb(71,85,105)] text-base font-inter sm:text-[0.95rem]">
            {reply.body}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          {reply?.likes?.length < 1 ? (
            <div
              onClick={() =>
                handleLikeFirstTierReply(
                  loggedInUser?.id,
                  post,
                  setPost,
                  comment?.commentId,
                  reply?.replyId,
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
              {reply?.likes?.includes(loggedInUser?.id) ? (
                <div
                  onClick={() =>
                    handleUnlikeFirstTierReply(
                      loggedInUser?.id,
                      post,
                      setPost,
                      comment?.commentId,
                      reply?.replyId,
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
                    {reply?.likes?.length}
                  </p>
                </div>
              ) : (
                <div
                  onClick={() =>
                    handleLikeFirstTierReply(
                      loggedInUser?.id,
                      post,
                      setPost,
                      comment.commentId,
                      reply?.replyId,
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
                    {reply?.likes?.length}
                  </p>
                </div>
              )}
            </>
          )}
          <p className="text-slate-500 font-semibold text-center text-sm md:text-xs">
            ·
          </p>
          <div
            onClick={() => (handleShowReply(index), handleClick(reply))}
            className="text-[rgb(71,85,105)] text-sm font-medium cursor-pointer transition duration-150 ease-in-out hover:underline"
          >
            Reply
          </div>
        </div>
        {reply.secondTierReplies?.length > 0 && (
          <div
            onClick={() => setShowReplies(!showReplies)}
            className="w-full text-[rgb(71,85,105)] text-sm font-medium cursor-pointer transition duration-150 ease-in-out hover:underline"
          >
            {showReplies ? "Hide" : "View"} {reply.secondTierReplies?.length}{" "}
            {reply.secondTierReplies?.length > 1 ? "replies" : "reply"}
          </div>
        )}
        {/* put put all */}
        {showReplies && (
          <>
            {reply.secondTierReplies?.map((secondReply, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <img
                    src={
                      getProfileDetails(secondReply.replyAuthorId, users)
                        ?.photoURL
                    }
                    alt="profile"
                    className="h-[40px] w-[40px] block min-h-[40px] object-cover mt1 rounded-full md:h-[36px] md:w-[36px] md:min-h-[36px]"
                  />
                  {/* <p
                  className={` ${
                    i !== comment.firstTierReplies.length - 1 &&
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
                            getProfileDetails(secondReply.replyAuthorId, users)
                              ?.name
                          }
                        </h2>
                        <p className="text-slate-500 text-center text-sm md:text-xs">
                          ·
                        </p>
                        <p className="text-gray-500 text-sm md:text-xs font-inter">
                          {secondReply.createdAt
                            ? formatTimeAgo(
                                new Date(secondReply.createdAt.seconds * 1000)
                              )
                            : "loading"}
                        </p>
                      </div>
                      {/* <button> follow </button> */}
                    </div>
                    <p className="text-[rgb(71,85,105)] text-base font-inter sm:text-[0.95rem]">
                      {secondReply.body}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center">
                    {secondReply?.likes?.length < 1 ? (
                      <div
                        onClick={() =>
                          handleLikeSecondTierReply(
                            loggedInUser?.id,
                            post,
                            setPost,
                            comment.commentId,
                            reply?.replyId,
                            secondReply?.replyId,
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
                        {secondReply?.likes?.includes(loggedInUser?.id) ? (
                          <div
                            onClick={() =>
                              handleUnlikeSecondTierReply(
                                loggedInUser?.id,
                                post,
                                setPost,
                                comment.commentId,
                                reply?.replyId,
                                secondReply?.replyId,
                                comments,
                                postRef
                              )
                            }
                            className="cursor-pointer flex gap-1 items-center"
                          >
                            <div className="cursor-pointer hover:scale50 transition duration-150 ease-in-out">
                              <img
                                src={clappedImg}
                                alt="clap"
                                className="h-6 w-6"
                              />
                            </div>

                            <p className="text-[rgb(71,85,105)] text-sm font-medium">
                              {secondReply?.likes?.length}
                            </p>
                          </div>
                        ) : (
                          <div
                            onClick={() =>
                              handleLikeSecondTierReply(
                                loggedInUser?.id,
                                post,
                                setPost,
                                comment.commentId,
                                reply?.replyId,
                                secondReply?.replyId,
                                comments,
                                postRef
                              )
                            }
                            className="cursor-pointer flex gap-1 items-center"
                          >
                            <div className="cursor-pointer hover:scale50 transition duration-150 ease-in-out">
                              <img
                                src={notClapImg}
                                alt="clap"
                                className="h-6 w-6"
                              />
                            </div>
                            <p className="text-[rgb(71,85,105)] text-sm font-medium">
                              {secondReply?.likes?.length}
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
                        handleShowReply(index), handleClick(secondReply)
                      )}
                      className="text-[rgb(71,85,105)] text-sm font-medium cursor-pointer transition duration-150 ease-in-out hover:underline"
                    >
                      Reply
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {selectedReplyIndex === index && (
          <div id={`secondReply-${index}`} className="flex gap-2">
            <img
              src={loggedInUser?.photoURL}
              alt="profile"
              className="h-10 w-10 rounded-full md:h-8 md:w-8"
            />
            <div className="w-full border border-r-gray-200 rounded-md p-3 flex flex-col gap-6 md:gap-3">
              <textarea
                placeholder={`Replying to ${
                  getProfileDetails(reply.replyAuthorId, users)?.name
                }`}
                value={secondTierReply}
                ref={secondTierReplyRef}
                onChange={(e) => setSecondTierReply(e.target.value)}
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
                    loading || (secondTierReply.trim() === "" && "opacity-50")
                  }`}
                  disabled={loading || secondTierReply?.trim() === ""}
                  onClick={() =>
                    handleSecondTierReply(reply.replyId, comment.commentId)
                  }
                >
                  {loading ? "Replying..." : "Reply"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
