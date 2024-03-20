/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../Features/userSlice";
import { Link } from "react-router-dom";
import { EventBox } from "../../components/Interest";
import { convertToLowercase } from "../../Hooks";

export const AllEvents = ({ interests, events, setEvents, users }) => {
  const loggedInUser = useSelector(selectUser);
  const [allEvents, setAllEvents] = useState([]);
  const [userInterests, setUserInterests] = useState([]);

  useEffect(() => {
    if (loggedInUser) {
      const userInterests = interests.filter((interest) =>
        interest.members.some((member) => member.userId === loggedInUser.id)
      );
      setUserInterests(userInterests);
    }
  }, [interests, loggedInUser]);

  useEffect(() => {
    if (userInterests.length > 0 && events.length > 0) {
      const allEvents = events.filter((event) =>
        userInterests.some(
          (interest) =>
            convertToLowercase(interest.name) ===
            convertToLowercase(event.category)
        )
      );
      setAllEvents(allEvents);
    }
  }, [userInterests, events]);

  return (
    <div className="pt-10 pb-20">
      <div className="flex justify-center items-center w-full">
        {allEvents?.length === 0 ? (
          <div className="flex justify-center flex-col items-center h-[400px] gap-5">
            <h4 className="text-3xl font-semibold text-gray-900">
              No events found
              <span className="ml-2 text-2xl font-semibold text-gray-900">
                😢
              </span>
            </h4>
            <p className="text-gray-500 text-center">
              Join more interest group to see events from your interests.
              <br />
              <span>
                You can join an interest group{" "}
                <Link
                  to="/i/discover"
                  className="text-blue-500 hover:underline"
                >
                  here
                </Link>
                .
              </span>
            </p>
          </div>
        ) : (
          <div className="w-full max-w-3xl flex flex-col gap-5 pb-10 xl:mx-auto">
            {allEvents
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((event) => (
                <EventBox
                  key={event.id}
                  event={event}
                  setEvents={setEvents}
                  users={users}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
