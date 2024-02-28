/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

export const RealEventsCard = ({ event }) => {
  const formattedDateTime = (date) => {
    return moment(date).format("MMM DD, YYYY h:mm A");
  };

  return (
    <Link
      to={`/upcomingevents/${event.id}`}
      className="p-5 font-inter border border-gray-200 rounded-md flex gap-8 items-center overflow-hidden xl:gap-6 lg:p-4 sm:flex-col sm:bordernone sm:rounded-xl sm:gap-0 sm:p-0"
    >
      <img
        src={event.imgUrl}
        alt={event.eventName}
        className="min-w-[220px] w-[220px] h-[140px] rounded-md object-cover block md:w-[180px] md:min-w-[180px] md:h-[120px] sm:w-full sm:min-w-full sm:rounded-t-xl sm:rounded-none sm:h-[160px]"
      />
      <div className="flex flex-col gap-3 sm:rounded-b-xl sm:border sm:border-gray-200 sm:p-2.5 sm:w-full">
        <h2
          className="one-line-text text-lg font-semibold text-black overflow-hidden hover:underline cursor-pointer md:text-base"
          style={{ WebkitLineClamp: 1 }}
        >
          {event.eventName}
        </h2>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faCalendarDay} className="text-[#FF5841]" />
            <p className="text-sm text-gray-500 font-inter one-line-text  md:text-[0.85rem]">
              {formattedDateTime(event.StartDateTime)} -{" "}
              {formattedDateTime(event.EndDateTime)}
            </p>
          </div>
          <div className="flex gap-2 itemscenter">
            <FontAwesomeIcon icon={faLocationDot} className="text-[#FF5841]" />
            <p className="font-inter text-gray-600 text-sm two-line-text">
              {event.address}
            </p>
          </div>
          <h4 className="text-sm text-gray-700 font-inter font-medium">
            Event By : <span className="text-black">{event.organizerName}</span>
          </h4>
        </div>
      </div>
    </Link>
  );
};
