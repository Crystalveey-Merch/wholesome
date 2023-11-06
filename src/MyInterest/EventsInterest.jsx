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
    // Fetch user interests when the component mounts
    const fetchUserInterests = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInterests(userData.selectedOptions);
        } else {
          console.log("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching user interests:", error);
      }
    };

    fetchUserInterests();
  }, [userId]);

  useEffect(() => {
    // Fetch interestPosts when userInterests change
    const fetchInterestPosts = async () => {
      if (userInterests.length === 0) {
        // No interests to fetch, exit early
        setLoading(true);
        return;
      }

      try {
        const postsRef = collection(db, "events");
        const queries = userInterests.map((interest) =>
          query(postsRef, where("category", "==", interest.key))
        );

        const queryPromises = queries.map((query) => getDocs(query));
        const querySnapshots = await Promise.all(queryPromises);

        const eventData = [];

        querySnapshots.forEach((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const post = doc.data();
            post.id = doc.id;
            eventData.push(post);
          });
        });

        setInterestEvents(eventData);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching interest Event:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchInterestPosts();
  }, [userInterests]);
  console.log(interestEvents)
  console.log("interestEvents:", interestEvents);

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
    <div className=' flex gap-5 flex-wrap justify-center m-auto  w-full my-40 sm:my-20'>

          {interestEvents.map((event) => (
            
              <div
                key={event.id}
                className="w-80 bg-sky-100    shadow  dark:border-gray-700"
              >
                <NavLink to={`/upcomingevents/${event.id}`}>
                  <img
                    className="rounded-t-lg"
                    src={event.imgUrl}
                    alt={event.eventName}
                  />

                  <div className="p-5">
                    <div className="badge bg-sky-800 p-4 text-white">{event.category}</div>
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
        
          ))}
        
    </div>
  )
}

export default EventsInterest