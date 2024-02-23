/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import {
  updateDoc,
  doc,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/auth";
import { getProfileDetails } from "../Hooks";
import { selectUser } from "../Features/userSlice";
import { useSelector } from "react-redux";

export const Notifications = ({ users }) => {
  const user = useSelector(selectUser);

  const notifications = getProfileDetails(user.id, users)?.notifications;

  const handleClick = (e, id) => {
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

  return (
    <div className="flex flex-col gap-6">
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
        <div className="min-w[100%] flex flex-col gap-8">
          {notifications
            ?.sort((a, b) => b.timestamp - a.timestamp)
            ?.map((notification, index) => (
              <div key={index}>
                {notification.type === "comment" ? (
                  <Link
                    to={`/readMore/${notification.postId}`}
                    className={`flex gap-3 py-3 px-2 border-b ${
                      index === notifications.length - 1 ? "" : ""
                    } ${notification.hasRead ? "" : "bg-slate-50"}`}
                  >
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
                      </div>
                      <p className="text-gray-500 font-inter text-sm">
                        {notification.content}
                      </p>
                    </div>
                  </Link>
                ) : notification.type === "like" ? (
                  <div className="flex gap-4"></div>
                ) : (
                  ""
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
