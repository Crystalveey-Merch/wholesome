/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { selectUser } from "../../Features/userSlice";
import { useNavigate } from "react-router-dom";
import {
  faLocationDot,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

export const EventBox = ({ event, events, setEvents, users }) => {
//   const loggedInUser = useSelector(selectUser);
//   const navigate = useNavigate();

  const {
    // EndDateTime,
    StartDateTime,
    // aboutOrganizer,
    address,
    category,
    // eventDescription,
    eventName,
    imgUrl,
    organizerName,
    // userId,
  } = event;

  //   const formattedDateTime = (date) => {
  //     return moment(date).format("MMM DD, YYYY h:mm A");
  //   };

  const formatToJustDate = (date) => {
    return moment(date).format("MMM DD, YYYY");
  };

  const formatToJustTime = (date) => {
    return moment(date).format("h:mm A");
  };

  return (
    <div className="p-3 border border-gray-100 rounded-xl bg-white flex gap-3.5 items-center transition duration-300 ease-in-out sm:p-2 hover:bg-[#fefefe] hover:cursor-pointer hover:shadow-md md:flex-col md:relative">
      <img
        src={imgUrl}
        alt={eventName}
        className="w-72 min-w-[288px] h-44 rounded-lg object-cover border border-gray-50 md:w-full md:min-w-full md:h-60"
      />
      <div className="flex flex-col gap-2.5 justify-start w-full md:p-2 sm:p-1">
        <div className="flex flex-col gap-1.5">
          <p className="bg-yellow-500 text-[#FFFFFF] font-medium text-xs px-2 py-1 rounded-md inline-block w-max transition duration-300 ease-in-out hover:bg-yellow-600 md:absolute md:top-6 md:right-5">
            {category}
          </p>
          <h2
            className="text-[1.16rem] font-bold text-black sm:text-base"
            style={{
              lineHeight: "1.4",
            }}
          >
            {eventName}
          </h2>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2 items-start">
            <FontAwesomeIcon icon={faLocationDot} className="text-[#FF0000]" />
            <p className="font-inter text-[0.85rem] text-gray-500 font-medium one-line-text">
              {address}
            </p>
          </div>
          <div className="flex gap-2">
            <FontAwesomeIcon icon={faCalendarDays} className="text-[#FFFF00]" />
            <p className="font-inter text-[0.85rem] text-gray-500 font-medium uppercase">
              {formatToJustDate(StartDateTime)} •{" "}
              {formatToJustTime(StartDateTime)}
            </p>
          </div>
        </div>
        <h5 className="text-[0.85rem] text-gray-600 font-medium one-line-text">
          Event By: <span className="text-black">{organizerName}</span>
        </h5>
      </div>
    </div>
  );
};
