/* eslint-disable react/prop-types */
import { RealEventsCard } from "../components/Feed";

export const SuggestedEvents = ({ events, routeUser }) => {
  // check if user id matches any event attendees object userId and return only events that the user is not attending
  const suggestedEvents = events?.filter(
    (event) =>
      !event.attendees?.some((attendee) => attendee.userId === routeUser.id) &&
      event.userId !== routeUser.id
  );

  return (
    <div className="w-full flex flex-col gap-4">
      <h4 className="text-lg font-semibold text-gray-800">Suggested Events</h4>
      <div className="flex flex-col gap-4 overflow-y-scroll hide-scrollbar">
        {suggestedEvents?.slice(0, 3).map((event) => (
          <RealEventsCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};
