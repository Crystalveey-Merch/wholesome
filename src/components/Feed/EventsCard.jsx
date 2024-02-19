/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

export const EventsCard = ({ events }) => {
  const formattedDateTime = (date) => {
    return moment(date).format("MMM DD, YYYY h:mm A");
  };

  return (
    <div className="w-full h-max p-5 border border-gray-200 rounded-xl flex flex-col gap-7">
      <h3 className="text-xl font-semibold text-black md:text-lg">
        🎉 Featured Event
      </h3>
      {events.length === 0 ? (
        <div className="text-gray-500 text-center">
          No events yet. Check back later!
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* show three events */}
          {/* {events.map((event, index) => ( */}
          <div className="flex flex-col">
            <Link
              to={`/events/${events[0]?.id}`}
              className="text-lg font-semibold text-black"
            >
              <img
                src={events[0]?.imgUrl}
                className="h-40 w-full rounded-t-xl object-cover"
              />
            </Link>
            <div className="h- p-3 rounded-b-xl border border-gray-200 flex flex-col gap-4">
              <h4 className="text-base font-semibold text-black font-inter">
                {events[0]?.eventName}
              </h4>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 itemscenter">
                  <FontAwesomeIcon
                    icon={faCalendarDay}
                    className="text-[#FF5841]"
                  />
                  <p className="font-inter text-sm">
                    {formattedDateTime(events[0].StartDateTime)} -{" "}
                    {formattedDateTime(events[0].EndDateTime)}
                  </p>
                </div>
                <div className="flex gap-2 itemscenter">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-[#FF5841]"
                  />
                  <p className="font-inter text-sm">{events[0].address}</p>
                </div>
              </div>
            </div>
          </div>
          {/* ))} */}
        </div>
      )}
    </div>
  );
};
