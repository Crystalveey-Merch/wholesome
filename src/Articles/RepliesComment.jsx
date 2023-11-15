import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const RepliesComment = ({
  reply,
  postId,
  userId,
  commentId,
  authUser,
  deleteReply,
}) => {
  const {
    name,
    body,
    createdAt,
    msg,
    isAuthUserComment,
    imgUrl,
    commentLikes,
    replyId,
  } = reply;
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const [replyUserId] = reply.replyId.split('-');

  return (
    <div>
      <div className="row w-auto ">
        <div className="col-lg-12">
          <div className="comments-list">
            <div className="media dark:text-red-300">
              {msg ? (
                <h4 className="mt-5 text-red-300 text-xl  text-center">
                  {msg}
                </h4>
              ) : (
                <>
                  <div
                    className={
                      isAuthUserComment ? "right  m-2 " : "left  m-2 w-fit  "
                    }
                  >
                    <div className=" flex  gap-5 ml-14 ">
                      <div className="chat-header text-sky-500 flex gap-2 Aceh  my-auto">
                        {name}{" "}
                        <time className="text-sm opacity-50 text-red-500 flex gap-4">
                          {createdAt.toDate().toDateString()}
                        </time>
                      </div>
                    </div>

                    <div className=" flex gap-5 ">
                      <div className="rounded-full overflow-hidden w-10 h-10">
                        <img
                          src={imgUrl}
                          alt="user"
                          className=" m-auto"
                          // width={30}
                          // height={30}
                        />
                      </div>
                      <div
                        className={
                          isAuthUserComment
                            ? "chat chat-start  "
                            : "chat chat-start  w-full "
                        }
                      >
                        <div className="flex">
                          <div
                            className={
                              isAuthUserComment
                                ? "chat-bubble flex text-white    Aceh bg-red-500  "
                                : "chat-bubble text-white chat-start Aceh bg-sky-500 flex gap-5  sm:gap-4 my-auto w-full "
                            }
                          >
                            <span className="text-green-400 text-sm  ">
                              {formatTime(createdAt.toDate())}
                            </span>
                            {body}
                          </div>
                          <div className="m-auto mx-2">
                            <FontAwesomeIcon
                              icon={faHeart}
                              className="text-gray-300 flex my-auto"
                            />
                            {commentLikes}
                          </div>
                          <div>
                            {replyUserId === authUser.uid && (
                              <span onClick={() => deleteReply(reply)} className="text-red-500 cursor-pointer">
                                Delete
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepliesComment;
