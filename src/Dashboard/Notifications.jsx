/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/auth";
import { getProfileDetails, getPostDetails, formatTimeAgo2 } from "../Hooks";
import { selectUser } from "../Features/userSlice";
import { useSelector } from "react-redux";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";

export const Notifications = ({ users, posts }) => {
  const user = useSelector(selectUser);

  const notifications = getProfileDetails(user.id, users)?.notifications;

  const handleClick = (id) => {
    const docRef = doc(db, "users", user.id);
    updateDoc(docRef, {
      notifications: notifications.map((notification) => {
        if (notification.id === id) {
          return { ...notification, hasRead: true };
        }
        return notification;
      }),
    });
  };

  useEffect(() => {
    // set the notifications to hasSeen = true
    const docRef = doc(db, "users", user.id);
    {
      if (notifications?.length === 0) return;
    }
    updateDoc(docRef, {
      notifications: notifications?.map((notification) => {
        return { ...notification, hasSeen: true };
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  return (
    <div className="flex flex-col gap-6 sm:px-4">
      <h1 className="text-4xl font-inter font-semibold text-black md:text-3xl sm:text-2xl">
        Notifications
      </h1>
      <div className="w-full h-10 flex gap-8 border-b">
        <div
          className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
            location.pathname === "/notifications"
              ? "text-black border[#FF5841]"
              : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
          } `}
          //   to="/feed"
        >
          All
        </div>
      </div>

      {notifications?.length === 0 ? (
        <div className="flex justify-center flex-col items-center h-[400px] gap-5">
          <h4 className="text-3xl font-semibold text-gray-900 sm:text-2xl">
            You&rsquo;re all caught up.
            <span className="ml-2 text-2xl font-semibold text-gray-900"></span>
          </h4>
        </div>
      ) : (
        <div className="min-w[100%] flex flex-col gap-0">
          {notifications
            ?.sort((a, b) => b.createdAt - a.createdAt)
            ?.map((notification, index) => (
              <div key={notification.index}>
                {notification.type === "comment" && (
                  <div
                    className={`flex gap-4 justifybetween py-3 px-4 border-b hover:bg-grey-50 transition duration-500 ease-in-out ${
                      index === notifications.length - 1 ? "" : ""
                    } ${notification.hasRead ? "" : "bg-slate-50"}`}
                    onClick={() => handleClick(notification.id)}
                  >
                    <Link
                      to={`/readMore/${notification.postId}`}
                      className="flex gap-3 w-full"
                    >
                      {" "}
                      <img
                        src={
                          getProfileDetails(notification.fromUserId, users)
                            .photoURL
                        }
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col gap-2">
                        <div className="text-gray-700 font-inter text-base">
                          <span className="font-semibold">
                            {
                              getProfileDetails(notification.fromUserId, users)
                                .name
                            }
                          </span>{" "}
                          commented on your post.
                          {/* <span className="text-gray-500 font-inter text-sm">
                            {formatTimeAgo2(
                              new Date(notification.createdAt.seconds * 1000)
                            )}
                          </span> */}
                        </div>
                        <p className="text-gray-500 font-inter text-sm">
                          {notification.content}
                        </p>
                        <p className="text-gray-500 font-inter text-sm">
                          {formatTimeAgo2(
                            new Date(notification.createdAt.seconds * 1000)
                          )}
                        </p>
                      </div>
                    </Link>
                    <div>
                      <FontAwesomeIcon
                        icon={faEllipsisV}
                        className="text-gray-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
                {notification.type === "reply" && (
                  <div
                    className={`flex gap-4 justifybetween py-3 px-4 border-b hover:bg-grey-50 transition duration-500 ease-in-out ${
                      index === notifications.length - 1 ? "" : ""
                    } ${notification.hasRead ? "" : "bg-slate-50"}`}
                    onClick={() => handleClick(notification.id)}
                  >
                    <Link
                      to={`/readMore/${notification.postId}`}
                      className="flex gap-3 w-full"
                    >
                      {" "}
                      <img
                        src={
                          getProfileDetails(notification.fromUserId, users)
                            .photoURL
                        }
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col gap-2">
                        <div className="text-gray-700 font-inter text-base">
                          <span className="font-semibold">
                            {
                              getProfileDetails(notification.fromUserId, users)
                                .name
                            }
                          </span>{" "}
                          {notification.replyType === "comment"
                            ? "replied to your comment."
                            : "replied to your reply."}
                        </div>
                        <p className="text-gray-500 font-inter text-sm">
                          {notification.content}
                        </p>
                        <p className="text-gray-500 font-inter text-sm">
                          {formatTimeAgo2(
                            new Date(notification.createdAt.seconds * 1000)
                          )}
                        </p>
                      </div>
                    </Link>
                    <div>
                      <FontAwesomeIcon
                        icon={faEllipsisV}
                        className="text-gray-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
                {notification.type === "like" && (
                  <>
                    {notification.likeType === "post" ||
                    notification.likeType === "comment" ||
                    notification.likeType === "reply" ? (
                      <div
                        className={`flex gap-4 justifybetween py-3 px-4 border-b hover:bg-grey-50 transition duration-500 ease-in-out ${
                          index === notifications.length - 1 ? "" : ""
                        } ${notification.hasRead ? "" : "bg-slate-50"}`}
                        onClick={() => handleClick(notification.id)}
                      >
                        <Link
                          to={`/readMore/${notification.postId}`}
                          className="flex gap-3 w-full"
                        >
                          {" "}
                          <img
                            src={
                              getProfileDetails(notification.fromUserId, users)
                                .photoURL
                            }
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex flex-col gap-2">
                            <div className="text-gray-700 font-inter text-base">
                              <span className="font-semibold">
                                {
                                  getProfileDetails(
                                    notification.fromUserId,
                                    users
                                  ).name
                                }
                              </span>{" "}
                              {notification.likeType === "post"
                                ? "liked your article."
                                : notification.likeType === "comment"
                                ? "liked your comment in article."
                                : "liked your reply in article."}{" "}
                              &quot;
                              <span className="text-black font-inter text-sm">
                                {
                                  getPostDetails(notification.postId, posts)
                                    ?.postTitle
                                }
                              </span>
                              &quot;
                            </div>
                            <p className="text-gray-500 font-inter text-sm">
                              {formatTimeAgo2(
                                new Date(notification.createdAt.seconds * 1000)
                              )}
                            </p>
                          </div>
                        </Link>
                        <div>
                          <FontAwesomeIcon
                            icon={faEllipsisV}
                            className="text-gray-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                )}
                {notification.type === "mention" && (
                  <div
                    className={`flex gap-4 justifybetween py-3 px-4 border-b hover:bg-grey-50 transition duration-500 ease-in-out ${
                      index === notifications.length - 1 ? "" : ""
                    } ${notification.hasRead ? "" : "bg-slate-50"}`}
                    onClick={() => handleClick(notification.id)}
                  >
                    <Link
                      to={`/readMore/${notification.postId}`}
                      className="flex gap-3 w-full"
                    >
                      {" "}
                      <img
                        src={
                          getProfileDetails(notification.fromUserId, users)
                            .photoURL
                        }
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col gap-2">
                        <div className="text-gray-700 font-inter text-base">
                          <span className="font-semibold">
                            {
                              getProfileDetails(notification.fromUserId, users)
                                .name
                            }
                          </span>{" "}
                          {notification.mentionType === "comment" ? (
                            <span>
                              mentioned you in a comment on the post &quot;
                              <span className="text-black font-inter text-sm">
                                {
                                  getPostDetails(notification.postId, posts)
                                    ?.postTitle
                                }
                              </span>
                              &quot;
                            </span>
                          ) : (
                            <span>
                              mentioned you in a post &quot;
                              <span className="text-black font-inter text-sm">
                                {
                                  getPostDetails(notification.postId, posts)
                                    ?.postTitle
                                }
                              </span>
                              &quot;
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 font-inter text-sm">
                          {formatTimeAgo2(
                            new Date(notification.createdAt.seconds * 1000)
                          )}
                        </p>
                      </div>
                    </Link>
                    <div>
                      <FontAwesomeIcon
                        icon={faEllipsisV}
                        className="text-gray-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
