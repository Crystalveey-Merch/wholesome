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
  faRunning,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "../components/Spinner.tsx";
import { Helmet } from "react-helmet-async";

const MyInterest = () => {

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
 


  return (

    <>
    <Helmet>
      <title>My Interest</title>
      <meta
        name="description"
        content='Filtered Based on your Interests
' />
      <link rel=" canonical" href="http://wholesome.crystaleey.com/myinterest/" />
    <meta
          name="keywords"
          content="my interest,technology , events, activities, podcasts, wholesome"
        />
      <meta name="robots" content="index, follow" />
        <meta property="og:title" content="My Interest" />
        <meta property="og:url" content="http://wholesome.crystaleey.com/myinterest/"/>
        {/* <meta property="og:image" content={posts} /> */}
        <meta name="og:description" content="Filtered Based on your Interests" />
        <meta name="og:site_name" content="Wholesome" />
        <meta name="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="http://wholesome.crystaleey.com/myinterest/"/>
        <meta name="twitter:title" content="My Interest" />
        <meta name="twitter:description" content="Filtered Based on your Interests"/>
        {/* <meta name="twitter:image" content={event.imgUrl} /> */}

  <script
  type="application/ld+jason"
    {...JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "My Interest",
      url:"http://wholesome.crystaleey.com/myinterest/",

      // "image": `${event.imgUrl}`,
     
      "publisher": {
        "@type": "Organization",
        "name": "Wholesome",
        "logo": {
          "@type": "ImageObject",
          "url": "",
        },
      },
      // "datePublished": `${posts.timestamp?.toDate()?.toDateString()}`,
    })}
    />
    </Helmet>
    <div className="pt-40 sm:pt-16 w-screen px-10 sm:px-0 relative  bg-gray-100">
        <div>
          <h1 className="text-red-500 text-3xl my-5 text-center AcehLight sm:text-xl">
            Filtered Based on your Interests{" "}
          </h1>
          <hr></hr>

          <ul className="flex flex-wrap text-sm m-auto justify-center Aceh sticky top-24 z-10 sm:top-16 font-medium text-center text-white  bg-gradient-to-r from-red-500 to-orange-500 border-b border-gray-200 ">
            <li className="">
              <NavLink
                to="articles"
                className="inline-block p-4  text-white hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <FontAwesomeIcon icon={faBook} className="mx-2" />
                Articles
              </NavLink>
            </li>
            <li className="">
              <NavLink
                to="events"
                className="inline-block p-4 text-white  hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <FontAwesomeIcon icon={faCalendar} className="mx-2" />

                Events
              </NavLink>
            </li>
            <li className="">
              <NavLink
                to="activities"
                className="inline-block p-4 text-white  hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <FontAwesomeIcon icon={faRunning} className="mx-2" />

                Activities
              </NavLink>
            </li>

            <li className="">
              <NavLink
                to="podcast"
                className="inline-block p-4 text-white hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <FontAwesomeIcon icon={faMicrophone} className="mx-2" />

                Podcasts
              </NavLink>
            </li>
            <li className="">
              <NavLink
                to="feeds"
                className="inline-block p-4 text-white hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <FontAwesomeIcon icon={faFeed} className="mx-2" />

                Feeds
              </NavLink>
            </li>

          </ul>

          <Outlet />


        </div>
      </div></>
  );
};

export default MyInterest;
