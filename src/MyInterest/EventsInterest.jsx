import React from 'react'
import Moment from "moment";

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
  faAddressCard,
    faBook,
  faCalendar,
  faClock,
  faComment,
  faEye,
  faFeed,
  faMicrophone,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "../components/Spinner.tsx";
import Pagination from '../components/pagination.jsx';


const EventsInterest = () => {
    const [userInterests, setUserInterests] = useState([]);

  const [interestEvents, setInterestEvents] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [postPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

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

  const indexOfLastPage = currentPage * postPerPage;
  const indexOfFirstPage = indexOfLastPage - postPerPage;
  const currentPosts = interestEvents.slice(indexOfFirstPage, indexOfLastPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  
  return (
    <><div className=' flex  gap-5 flex-wrap justify-center m-auto  w-full my-20 sm:my-20'>

      {currentPosts.map((event) => (

        <div
          key={event.id}
          className="w-72 bg-sky-100    shadow  dark:border-gray-700"
        >
          <NavLink to={`/upcomingevents/${event.id}`}>
            <div className="relative overflow-clip  h-40 sm:w-full ">

              <img
                className="rounded-t-lg w-full"
                src={event.imgUrl}
                alt={event.eventName} />
            </div>

            <div className="p-5">
            <div className="badge">{event.category}</div>
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 Aceh">
                {event.eventName}
              </h5>
              <p className="text-red-500 Aceh text-l flex gap-4 m-2">
                <FontAwesomeIcon icon={faCalendar} />
                {Moment(event.StartDateTime).format("DD-MM-YYYY")} - {Moment(event.EndDateTime).format("DD-MM-YYYY")}
              </p>
              <p className="text-gray-800 text-l flex gap-4 m-2">
                <FontAwesomeIcon icon={faClock} />{Moment(event.StartDateTime).format("HH:MM a")}- {Moment(event.EndDateTime).format("HH:MM a")}
              </p>
              <div className="flex p-2 ">
                        <FontAwesomeIcon
                          icon={faAddressCard}
                          className="text-md"
                        />{" "}
                        <p className="mb-3 font-normal text-md px-2 text-gray-500 ">
                          {event.address}
                        </p>
                      </div>
              <p
                className=" font-normal Aceh text-md text-black"
              >
                {event.organizerName}
              </p>
            </div>
          </NavLink>

        </div>

      ))}

    </div><Pagination
        postPerPage={postPerPage}
        totalPosts={interestEvents.length}
        paginate={paginate}
        currentPage={currentPage} /></>
  )
}

export default EventsInterest