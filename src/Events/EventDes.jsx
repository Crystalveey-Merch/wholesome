import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { events } from "../data/events";
import {
  faCalendar,
  faClock,
  faLocationPin,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gapi from "gapi-client";
import {
  addDoc,
  collection,
  DocumentSnapshot,
  endAt,
  endBefore,
  getDocs,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  deleteField,
  where,
  increment,
} from "firebase/firestore";
import { auth, db } from "../firebase/auth.js";
import "add-to-calendar-button";
import { Helmet } from "react-helmet-async";

const EventDes = () => {
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);

  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const docRef = doc(db, "events", id); 
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          setEvent(docSnapshot.data());
        } else {
          console.error(`Post with id '${id}' not found.`);
        }

        // setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    const fetchOtherEventsInSameCategory = async () => {
      if (event && event.category) {
        try {
          const eventsRef = collection(db, 'events');
          const querySnapshot = await getDocs(eventsRef);
          const otherEvents = [];
    
          querySnapshot.forEach((doc) => {
            const eventData = doc.data();
            // Exclude the current event by checking its ID
            if (eventData.id !== id && eventData.category === event.category) {
              otherEvents.push(eventData);
            }
          });
    
          setRelatedEvents(otherEvents);
        } catch (error) {
          console.error('Error fetching other events in the same category:', error);
        }
      }
    };
    fetchPosts();
    fetchOtherEventsInSameCategory();
  }, [id, event]);

  if (!event) {
    return <div>Event not found.</div>;
  }

  console.log(event);

  


  const startDateTimeString = event.StartDateTime;
  const endDateTimeString = event.EndDateTime;
  
  const separateDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    
    // Extract the date components
    const year = dateTime.getFullYear(); // Extract the year
    const month = (dateTime.getMonth() + 1).toString().padStart(2, "0"); // Extract the month (add 1 because months are zero-based)
    const day = dateTime.getDate().toString().padStart(2, "0"); // Extract the day
  
    // Extract the time components
    const hours = dateTime.getHours().toString().padStart(2, "0"); // Extract the hours
    const minutes = dateTime.getMinutes().toString().padStart(2, "0"); // Extract the minutes
  
    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`,
    };
  };
  const startDateTime = separateDateTime(startDateTimeString);
  const endDateTime = separateDateTime(endDateTimeString);



  return (
    <>
    <Helmet>
    <title>{event.eventName}</title>
    <meta
      name="description"
      content={event.eventName}
    />
    <link rel=" canonical" href="/upcomingevents" />
  </Helmet>
    <div className="pt-40 sm:mt-18 flex sm:flex-col gap-10  m-auto justify-center bg-stone-100 w-screen">
      <div  className=" w-1/2 sm:w-full">
      <div className="m-auto sm:w-full" >
        <img src={event.imgUrl} alt={event.eventName} />
      </div>

      <div className="mx-10 my-20 sm:mx-5 sm:my-10">
        <span className="py-20 relative">
       
          <add-to-calendar-button
            name={event.eventName}
            startDate= {startDateTime.date}
            options="'Apple','Google','iCal'"
            startTime={startDateTime.time}
            endTime={endDateTime.time}
            timeZone="GMT"
            location={event.address}
            buttonStyle="date"
            size="5"
            lightMode="bodyScheme"
          ></add-to-calendar-button>
      
        </span>
        <h1 className="text-red-500 text-xl mt-4 ">
          {/* {dateTime.toDateString()} */}
        </h1>
        <h1 className="text-black text-4xl"> {event.eventName}</h1>
        <p className="text-green-500 text-xl ">{event.theme}</p>
        <p className="text-gray-600 py-5 text-xl">{event.eventDescription}</p>

        <h1 className="text-gray-800 text-2xl py-4">Date and Time</h1>
        <p className="text-gray-500 text-xl">
          <FontAwesomeIcon icon={faCalendar} />  {startDateTime.date}
        </p>
        <p className="text-gray-500 text-xl">
          <FontAwesomeIcon icon={faClock} /> {startDateTime.time} - {endDateTime.time}
        </p>

        <h1 className="text-gray-800 text-2xl py-4">Location</h1>
        <p className="text-gray-500 text-xl">
          <FontAwesomeIcon icon={faLocationPin} /> {event.address}
        </p>
        <h1 className="text-gray-800 text-2xl py-4">Tags</h1>
        <div className="flex flex-wrap gap-5">
          {event.tags.map((tag) => {
            return (
              <h1
                key={tag.id}
                className="badge p-5 bg-red-500 text-white border-none"
              >
                #{tag}
              </h1>
            );
          })}
        </div>
      </div>
      </div>
          <div  className="w-1/4 sm:w-full h-screen bg-sky-200">
      {relatedEvents.length > 0 && (
        <div  >
          <h3 className="text-red-500 text-2xl text-center p-10 Aceh">Related Events</h3>
          <ul className="p-5">
            {relatedEvents.map((related) => (
              <li key={related.id} className="border bg-sky-600 rounded-2xl w-72 m-auto  ">
              <img src={related.imgUrl} alt={related.eventName} className="" />
              <h3 className="text-xl text-white Aceh p-5">{related.eventName}</h3>
              <p className="text-gray-100 text-xl">
          <FontAwesomeIcon icon={faClock} /> {related.StartDateTime} - {related.EndDateTime}
        </p>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </div></>
  );
};

export default EventDes;
