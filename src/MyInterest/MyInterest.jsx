import React from "react";
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

const MyInterest = () => {
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
  const [postId, setPostId] = useState([]);
  const [loading, setLoading] = useState(false);

  const [eventId, setEventId] = useState([]);

  useEffect(() => {
    // Replace "userId" with the currently logged-in user's ID // You should get the actual user ID

    const fetchData = async () => {
      try {
        // setLoading(true);
        // 1. Retrieve the user's selected interests from Firestore

        const userRef = doc(db, "users", userId); // Use doc to get the user document
        const userDoc = await getDoc(userRef);
        //   console.log(userDoc)
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInterests(userData.selectedOptions);
          // 2. Query the posts collection based on user interests
          const postsRef = collection(db, "posts");
          const eventsRef = collection(db, "events");

          const queries = userInterests.map((interest) =>
            query(postsRef, where("category", "==", interest.key))
          );
          const queries2 = userInterests.map((interest) =>
            query(eventsRef, where("category", "==", interest.key))
          );
          const queryPromises2 = queries2.map((query) => getDocs(query));
          const querySnapshots2 = await Promise.all(queryPromises2);

          //
          // Create a Promise for each query
          const queryPromises = queries.map((query) => getDocs(query));

          // Wait for all queries to complete
          const querySnapshots = await Promise.all(queryPromises);

          const postData = [];
          const eventData = [];

          // Process each query result
          querySnapshots.forEach((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const post = doc.data();
              post.id = doc.id;
              setPostId(post.id);
              postData.push(post);
            });
          });
          querySnapshots2.forEach((querySnapshot2) => {
            querySnapshot2.forEach((doc) => {
              const events = doc.data();
              events.id = doc.id;
              setEventId(events.id);
              eventData.push(events);
            });
          });

          setInterestPosts(postData);
          setInterestEvents(eventData);
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

 

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  //   const handleReadMoreClick = async () => {
  //     if (userId) {
  //       try {
  //         // Fetch the specific post based on postId
  //         const postDocRef = doc(db, "posts",postId);
  //         const postDoc = await getDoc(postDocRef);

  //         if (postDoc.exists()) {
  //           // Update the Firestore document with the user's ID
  //           const updatedViewers = [...postDoc.data().views, userId];
  //           await updateDoc(postDocRef, { views: updatedViewers });
  //         }
  //       } catch (error) {
  //         console.error("Error updating post document:", error);
  //       }
  //     }
  //   };
  return (
    <div className="mt-40 sm:mt-16 w-screen px-10 sm:px-0">
      <div>
        <h1 className="text-red-500 text-3xl my-5 text-center AcehLight sm:text-xl">
          Filtered Based on your Interests{" "}
        </h1>
        <hr></hr>

        <ul className="flex flex-wrap text-xl m-auto justify-center Aceh font-medium text-center text-white  bg-red-600 border-b border-gray-200 ">
          <li className="mr-2">
            <NavLink
              to="articles"
              className="inline-block p-4  text-white hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
            <FontAwesomeIcon icon={faBook} className="mx-2"/>
              Articles
            </NavLink>
          </li>
          <li className="mr-2">
            <NavLink
              to="events"
              className="inline-block p-4 text-white  hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
                        <FontAwesomeIcon icon={faCalendar} className="mx-2"/>

              Events
            </NavLink>
          </li>
        
          <li className="mr-2">
            <a
              href="#"
              className="inline-block p-4 text-white hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
                        <FontAwesomeIcon icon={faMicrophone} className="mx-2"/>

              Podcasts
            </a>
          </li>
          <li className="mr-2">
            <a
              href="#"
              className="inline-block p-4 text-white hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
                        <FontAwesomeIcon icon={faFeed} className="mx-2"/>

              Followers Feed
            </a>
          </li>
        
        </ul>
        
       <Outlet/>
        
        
      </div>
    </div>
  );
};

export default MyInterest;
