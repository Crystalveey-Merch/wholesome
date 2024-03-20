/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { selectUser } from "../../Features/userSlice";
import {
  faHeart as faHeartSolid,
  faLocationDot,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getProfileDetails,
  formatByInitialTime,
  handleLikeActivity,
  handleUnlikeActivity,
} from "../../Hooks";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export const ActivityBox = ({ activity, activities, setActivities, users }) => {
  const loggedInUser = useSelector(selectUser);
  const navigate = useNavigate();

  const {
    activityName,
    // category,
    DateTime,
    // claps,
    likes,
    imgUrl,
    location,
    // tags,
    timestamp,
    userId,
    writeup,
  } = activity;

  const poster = getProfileDetails(userId, users);

//   const formatTime = (date) => {
//     if (date instanceof Date) {
//       return date.toLocaleTimeString("en-US", {
//         hour: "numeric",
//         minute: "2-digit",
//         hour12: true,
//       });
//     }
//     return ""; // Return an empty string if date is not a valid Date object
//   };
//   const formatDate = (date) => {
//     if (date instanceof Date) {
//       return date.toLocaleDateString("en-US");
//     }
//     return ""; // Return an empty string if date is not a valid Date object
//   };

  const formattedDateTime = (date) => {
    return moment(date).format("MMM DD, YYYY h:mm A");
  };

  return (
    <div
      className="w[360px] relative border border-gray-100 rounded-xl bg-white flex flex-col transition duration-300 ease-in-out hover:shadow-md hover:cursor-pointer md:w-[400px] sm:w-full sm:max-w[400px]"
      //   onClick={() => navigate(`/activity/${activity.id}`)}
    >
      <img
        src={imgUrl}
        alt={activityName + " image"}
        className="w-full h-[200px] object-cover rounded-t-xl object-top"
      />
      <div className="flex flex-col gap-3 px-3 py-3.5">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-semibold text-black uppercase font-inter">
            {activityName}
          </h3>
          <p className="text-gray-500 text-sm two-line-text font-inter">
            {writeup}
          </p>
        </div>
        <hr className="border-dashed border-t border-gray-100" />
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-red-500 h-4 w-4"
            />
            <p className="text-gray-700 text-sm font-inter font-semibold">
              {location}
            </p>
          </div>
          <div className="flex gap-2">
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="text-amber-400 h-4 w-4"
            />
            <p className="text-gray-500 text-[0.85rem] font-medium font-inter">
              <span className="text-black font-semibold text-[0.85rem]">
                {formattedDateTime(DateTime)}
              </span>
            </p>
          </div>
        </div>
        <hr className="border-dashed border-t border-gray-100" />
        <div className="flex gap-2">
          <p className="text-black text-sm font-inter font-semibold">Posted:</p>
          <p className="text-gray-600 text-[0.80rem] font-inter font-medium one-line-text">
            {formatByInitialTime(timestamp?.seconds * 1000)} by{" "}
            <span
              className="text-black hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/${poster?.username}`);
              }}
            >
              {poster?.name || "Anonymous"}
            </span>
          </p>
        </div>
      </div>
      <div className="w-max absolute top-3 right-3 z-10">
        {likes?.includes(loggedInUser?.id) ? (
          <button
            title="Unlike"
            className="w-max group p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-red-50 transparentbackdrop-blur-lg"
            onClick={() =>
              handleUnlikeActivity(
                activity,
                loggedInUser,
                activities,
                setActivities
              )
            }
          >
            <FontAwesomeIcon
              icon={faHeartSolid}
              className="text-red-500 h-[1.13rem] w-[1.13rem] group-hover:text-red-600 transition duration-300 ease-in-out"
            />
          </button>
        ) : (
          <button
            title="Like"
            onClick={() =>
              handleLikeActivity(
                activity,
                loggedInUser,
                activities,
                setActivities
              )
            }
            className="w-max group p-2 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-red-50 bg-opacity-50backdrop-blur-lg"
          >
            <FontAwesomeIcon
              icon={faHeart}
              className="text-[rgb(255,255,255)] h-[1.13rem] w-[1.13rem] group-hover:text-red-600 transition duration-300 ease-in-out"
            />
          </button>
        )}
      </div>
      <div className="bg-black bg-opacity-10 w-full h-[200px] rounded-t-xl absolute top-0 left-0"></div>
    </div>
  );
};
