/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { convertToLowercase } from "../Hooks";
import { EventBox } from "../components/Interest";

export const Events = ({ interests, events, setEvents, users }) => {
  const { name } = useParams();

  const [interest, setInterest] = useState(null);
  const [interestEvents, setInterestEvents] = useState([]);

  useEffect(() => {
    if (!name) return;
    const interest = interests.find(
      (interest) => convertToLowercase(interest.name) === name
    );
    setInterest(interest);
  }, [name, interests]);

  useEffect(() => {
    if (!interest) return;
    const interestEvents = events.filter(
      (event) => convertToLowercase(event.category) === name
    );
    setInterestEvents(interestEvents);
  }, [interest, events, name]);

  return (
    <div className="pt-10 pb-10">
      <div className="flex flex-col gap-5 pb-10 md:w-full md:justify-center md:items-center">
        {interestEvents?.length > 0 ? (
          interestEvents
            ?.sort((a, b) => b.timestamp - a.timestamp)
            .map((event) => {
              return (
                <EventBox
                  key={event.id}
                  event={event}
                  events={events}
                  setEvents={setEvents}
                  users={users}
                />
              );
            })
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-base font-inter font-semibold text-black">
              {interest?.name} has no events yet
              <span className="text-[#3a4e4d]"> Be the first contributor</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
