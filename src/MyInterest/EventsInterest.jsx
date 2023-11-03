import React from 'react'
import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  DocumentSnapshot,
  updateDoc,
  serverTimestamp,
  Timestamp,
  doc,
  getDoc,
  endAt,
  endBefore,
  arrayRemove,
  arrayUnion,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/auth.js";
import { NavLink, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBook,
  faCalendar,
  faComment,
  faEye,
  faFeed,
  faMicrophone,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "../components/Spinner.tsx";


const EventsInterest = () => {
    const [userInterests, setUserInterests] = useState([]);

  const [interestEvents, setInterestEvents] = useState([]);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);
  const userId = authUser?.uid;
  const [loading, setLoading] = useState(false);

  const [eventId, setEventId] = useState([]);

  useEffect(() => {
    // Replace "userId" with the currently logged-in user's ID // You should get the actual user ID

    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Retrieve the user's selected interests from Firestore

        const userRef = doc(db, "users", userId); // Use doc to get the user document
        const userDoc = await getDoc(userRef);
        //   console.log(userDoc)
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInterests(userData.selectedOptions);
          // 2. Query the posts collection based on user interests
          const eventsRef = collection(db, "events");

        
          const queries2 = userInterests.map((interest) =>
            query(eventsRef, where("category", "==", interest.key))
          );
          const queryPromises2 = queries2.map((query) => getDocs(query));
          const querySnapshots2 = await Promise.all(queryPromises2);


          const eventData = [];

          // Process each query result
         
          querySnapshots2.forEach((querySnapshot2) => {
            querySnapshot2.forEach((doc) => {
              const events = doc.data();
              events.id = doc.id;
              setEventId(events.id);
              eventData.push(events);
            });
          });

          setInterestEvents(eventData);
          console.log(eventData)
          setLoading(false);

        } else {
          console.log("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // setLoading(false); // Move setLoading(false) to the finally block
      }
    };

    fetchData();
  }, [userId, userInterests]);
  const excerpt = (str, count) => {
    if (str && str.length > count) {
      str = str.substring(0, count) + " ... ";
    }
    return str;
  };
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className=' flex gap-5  w-full my-5'>

          {interestEvents.map((event) => {
            
              <div
                key={event.id}
                className="w-80 bg-white    shadow  dark:border-gray-700"
              >
                <NavLink to={`/upcomingevents/${event.id}`}>
                  <img
                    className="rounded-t-lg"
                    src={event.imgUrl}
                    alt={event.eventName}
                  />

                  <div className="p-5">
                    <div className="badge">{event.category}</div>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 Aceh">
                      {event.eventName}
                    </h5>

                    <p className="mb-1 font-normal text-md Aceh text-red-500 dark:text-red-500">
                      {event.dateTime}
                    </p>
                    <p className="mb-3 font-normal text-md  text-gray-500 ">
                      {event.address}
                    </p>
                      <p
                        className=" font-normal Aceh text-md text-black"
                      >
                        {event.organizerName}
                      </p>
                  </div>
                </NavLink>
                
              </div>
        
          })}
        
    </div>
  )
}

export default EventsInterest