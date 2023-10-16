import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { events } from "../data/events";
import { faCalendar, faClock, faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EventDes = () => {
  const { eventName } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // Find the selected event by comparing the name as a string
    const selectedEvent = events.find((e) => e.name === eventName);

    if (selectedEvent) {
      // Set the selected event in the state
      setEvent(selectedEvent);
    }
  }, [eventName]);

  if (!event) {
    return <div>Event not found.</div>;
  }

  return (
    <div className="mt-20 sm:mt-18 flex flex-col m-auto justify-center">
      <div className="m-auto">
        <img src={event.src} alt={event.name} />
      </div>
      <div className="mx-40 my-20 sm:mx-5 sm:my-10">
      <h1 className="text-red-500 text-xl">{event.date}</h1>
      <h1 className="text-black text-4xl"> {event.name}</h1>
      <p className="text-green-500 text-xl ">{event.theme}</p>
      <p className="text-gray-600 py-5">{event.description}</p>

      <h1 className="text-gray-800 text-2xl py-4">Date and Time</h1>
      <p className="text-gray-500"><FontAwesomeIcon icon={faCalendar}/> {event.date}</p>
      <p className="text-gray-500"><FontAwesomeIcon icon={faClock}/> {event.time}</p>

      <h1 className="text-gray-800 text-2xl py-4">Location</h1>
      <p className="text-gray-500"><FontAwesomeIcon icon={faLocationPin}/> {event.address}</p>
      <h1 className="text-gray-800 text-2xl py-4">Tags</h1>
      <div className="flex flex-wrap gap-5">
        {event.tags.map((tag) =>{
            return(

            <h1 key={tag.id} className="badge p-5 bg-red-500 text-white border-none">#{tag}</h1>
            )
            
        } 
        )}
        </div>
      </div>
    </div>
  );
}

export default EventDes;
