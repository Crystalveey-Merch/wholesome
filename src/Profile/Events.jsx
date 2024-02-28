/* eslint-disable react/prop-types */
import { RealEventsCard } from "../components/Feed";
import { SuggestedEvents } from "./SuggestedEvents";

export const Events = ({ events, routeUser, loggedInUser }) => {
  // check if user id matches any event attendees object userId
  const userEvents = events?.filter((event) =>
    event.attendees?.some((attendee) => attendee.userId === routeUser.id)
  );

  //   console.log(userEvents);

  return (
    <div>
      {userEvents?.length === 0 ? (
        <div className="flex flex-col gap-6">
          <p className="text-base text-gray-700 font-inter sm:text-[0.95rem]">
            {routeUser.id === loggedInUser.id ? (
              <span>You have not attended any events yet. </span>
            ) : (
              <span>{routeUser.name} has not attended any events yet. </span>
            )}
          </p>
            <SuggestedEvents events={events} routeUser={routeUser} />
        </div>
      ) : (
        <div>
          <ul className="flex flex-col gap-6 w-full">
            {userEvents?.map((event) => (
              <RealEventsCard key={event.id} event={event} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
