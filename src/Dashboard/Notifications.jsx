/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/auth";
import {
  getProfileDetails,
  getPostDetails,
  formatTimeAgo2,
  getInterestDetails,
  getChatBoxDetails,
  convertToLowercase,
} from "../Hooks";
import { selectUser, updateUser } from "../Features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const Notifications = ({ users, posts, interests, setInterests }) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [acceptingInvite, setAcceptingInvite] = useState(false);

  useEffect(() => {
    if (!user) return;
    const sortedNotifications = [...user.notifications] // Create a new array
      .sort((a, b) => b?.createdAt - a?.createdAt); // Compare timestamps directly
    setNotifications(sortedNotifications);
  }, [user]);

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
    console.log("Notification has been read");
  };
  // console.log(user);

  useEffect(() => {
    if (!user || notifications.length === 0) return;

    const updateNotifications = async () => {
      const docRef = doc(db, "users", user.id);
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        hasSeen: true,
      }));

      try {
        await updateDoc(docRef, { notifications: updatedNotifications });
      } catch (error) {
        console.error("Error updating notifications:", error);
      }
    };

    updateNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.notifications, notifications.length, dispatch, user.id]);

  const handleAcceptInvite = async (interestId) => {
    setAcceptingInvite(true);
    //use the interestId to accept the invite
    try {
      const docRef = doc(db, "interests", interestId);
      const interest = getInterestDetails(interestId, interests);
      const newMember = {
        userId: user.id,
        joinedAt: new Date(),
      };
      await updateDoc(docRef, {
        // set the interest inviteAccepted to accepted
        invites: interest.invites.map((invite) => {
          if (invite.invitedUserId === user.id) {
            return { ...invite, inviteAccepted: true };
          }
          return invite;
        }),
        members: [...interest.members, newMember],
      });
      // update interest in local state
      const updatedInterests = interests.map((i) => {
        if (i.id === interestId) {
          return {
            ...i,
            invites: i.invites.map((invite) => {
              if (invite.invitedUserId === user.id) {
                return { ...invite, inviteAccepted: true };
              }
              return invite;
            }),
            members: [...i.members, newMember],
          };
        }
        return i;
      });
      setInterests(updatedInterests);
      setAcceptingInvite(false);
      toast.success("Invite accepted successfully");
    } catch (error) {
      console.error("Error accepting invite:", error);
      setAcceptingInvite(false);
      toast.error(error.message);
    }
  };

  if (!user) return <div>Loading...</div>;
  console.log(notifications);

  return (
    <div className="flex flex-col gap-6 sm:px-2">
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
              <div key={notification.createdAt}>
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
                  <>
                    {notification.replyType === "comment" ||
                    notification.replyType === "reply" ? (
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
                    ) : notification.replyType === "chat" ||
                      notification.replyType === "chatReply" ? (
                      <div
                        className={`flex gap-4 justifybetween py-3 px-4 border-b hover:bg-grey-50 transition duration-500 ease-in-out ${
                          index === notifications.length - 1 ? "" : ""
                        } ${notification.hasRead ? "" : "bg-slate-50"}`}
                        onClick={() => handleClick(notification.id)}
                      >
                        <Link
                          to={notification.link}
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
                              {notification.replyType === "chat"
                                ? "replied to your post."
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
                    ) : (
                      <></>
                    )}
                  </>
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
                              getProfileDetails(notification?.fromUserId, users)
                                ?.photoURL
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
                    ) : notification.likeType === "chatBox" ||
                      notification.likeType === "chatBoxReply" ? (
                      <div
                        className={`flex gap-4 justifybetween py-3 px-4 border-b hover:bg-grey-50 transition duration-500 ease-in-out ${
                          index === notifications.length - 1 ? "" : ""
                        } ${notification.hasRead ? "" : "bg-slate-50"}`}
                        onClick={() => handleClick(notification.id)}
                      >
                        <Link
                          to={notification.link}
                          className="flex gap-3 w-full"
                        >
                          {" "}
                          <img
                            src={
                              getProfileDetails(notification?.fromUserId, users)
                                ?.photoURL
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
                              {notification.likeType === "chatBox"
                                ? "liked your chatBox."
                                : "liked your reply in a chatBox."}{" "}
                              &quot;
                              <span className="text-black font-inter text-sm">
                                {
                                  getChatBoxDetails(
                                    notification.chatBoxId,
                                    notification.interestId,
                                    interests
                                  )?.text
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
                {notification.type === "invite" && (
                  <div
                    className={`flex gap-4 justifybetween py-3 px-4 border-b hover:bg-grey-50 transition duration-500 ease-in-out ${
                      index === notifications.length - 1 ? "" : ""
                    } ${notification.hasRead ? "" : "bg-slate-50"}`}
                    onClick={() => handleClick(notification.id)}
                  >
                    <div
                      // to={notification.link}
                      className="flex gap-3 w-full justify-between items-center cursor-pointer"
                      onClick={() => {
                        navigate(`${notification.link}`);
                      }}
                    >
                      <div className="flex gap-3 w-full">
                        {" "}
                        <img
                          src={
                            getProfileDetails(notification.fromUserId, users)
                              ?.photoURL
                          }
                          alt=""
                          className="w-10 h-10 rounded-full min-w-[40px] min-h-[40px]"
                        />
                        <div className="flex flex-col gap-2">
                          <div className="text-gray-700 font-inter text-base">
                            You are invited to join &quot;
                            <span className="text-black font-inter text-sm font-medium">
                              {
                                getInterestDetails(
                                  notification.interestId,
                                  interests
                                )?.name
                              }
                            </span>{" "}
                            interest group &quot; by &nbsp;
                            <span className="font-semibold text-black">
                              {
                                getProfileDetails(
                                  notification.fromUserId,
                                  users
                                )?.name
                              }
                            </span>{" "}
                          </div>
                          <p className="text-gray-500 font-inter text-sm">
                            {formatTimeAgo2(
                              new Date(notification.createdAt.seconds * 1000)
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptInvite(notification.interestId);
                        }}
                        className="bg-[#FF5841] text-white  px-4 py-2 rounded-lg text-base font-medium  md:py-2 transition duration-300 ease-in-out hover:bg-[#ec432d] sm:text-sm"
                      >
                        {acceptingInvite && notification.interestId === user.id
                          ? "Accepting..."
                          : getInterestDetails(
                              notification.interestId,
                              interests
                            )?.members.find(
                              (member) => member.userId === user.id
                            )
                          ? "Joined"
                          : "Accept"}
                      </button>
                    </div>
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
