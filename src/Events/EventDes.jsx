import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { events } from "../data/events";
import { faCalendar, faClock, faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gapi from "gapi-client";

const EventDes = () => {
  const { eventName } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // Find the   by comparing the name as a string
    const selectedEvent = events.find((e) => e.name === eventName);

    if (selectedEvent) {
      // Set the selected event in the state
      setEvent(selectedEvent);
    }
  }, [eventName]);

  if (!event) {
    return <div>Event not found.</div>;
  }


  function GoogleCalendarButton() {

    useEffect(() => {
      gapi.load("client:auth2", initClient);
    }, []);
   
    const initClient = () => {
      gapi.client.init({
        apiKey: "AIzaSyCeiZbLVAYKPRGGcyaD6__DFZu-viC1p_g",
    clientId: "864639171372-re4ni3d90o7ggqertgrrbn7282a6u8qs.apps.googleusercontent.com",
   
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: "https://www.googleapis.com/auth/calendar.events",
      }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(handleSignedInStatus);
      });
      gapi.client.load("calendar", "v3");
    };
  
    const handleSignedInStatus = (isSignedIn) => {
      if (isSignedIn) {
        // User is signed in, you can proceed with event creation
      }
    };
  
    const handleAddToCalendar = () => {
      gapi.auth2.getAuthInstance().signIn().then(() => {
        const event = {
          summary: event.description, // Event title
          location: event.address, // Event location
          description: event.name, // Event description
          start: {
            dateTime: event.date, // Event start date and time in ISO 8601 format
            timeZone: "Lagos", // Event timezone, e.g., "America/New_York"
          },
          end: {
            dateTime: event.date, // Event end date and time in ISO 8601 format
            timeZone: "Lagos",
          },
          // You can add more properties such as recurrence, reminders, attendees, etc.
        };
  
        gapi.client.calendar.events
          .insert({
            calendarId: "primary", // "primary" refers to the user's primary calendar
            resource: event,
          })
          .then((response) => {
            console.log("Event created: " + response.result.htmlLink);
          });
      });
    };

    return (
      <button className="btn my-5 bg-sky-500 border-none text-white" onClick={handleAddToCalendar}>Add to Google Calendar</button>
    );
  }

  return (
    <div className="mt-20 sm:mt-18 flex flex-col m-auto justify-center">
      <div className="m-auto">
        <img src={event.src} alt={event.name} />
      </div>
    
      <div className="mx-40 my-20 sm:mx-5 sm:my-10">
      <GoogleCalendarButton />
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
