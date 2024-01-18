import Moment from "moment";

import { useState, useEffect } from "react";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/auth.js";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faHands,
    faLocationPin,
} from "@fortawesome/free-solid-svg-icons";

const ActivityInterest = () => {
    const [userInterests, setUserInterests] = useState([]);

    const [interestActivities, setInterestActivities] = useState([]);
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
    const [loading, setLoading] = useState(false)

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
        const fetchInterestActivity = async () => {
            if (userInterests.length === 0) {
                // No interests to fetch, exit early
                setLoading(true);
                return;
            }

            try {
                const postsRef = collection(db, "activities");
                const queries = userInterests.map((interest) =>
                    query(postsRef, where("category", "==", interest.key))
                );

                const queryPromises = queries.map((query) => getDocs(query));
                const querySnapshots = await Promise.all(queryPromises);

                const activityData = [];

                querySnapshots.forEach((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const post = doc.data();
                        post.id = doc.id;
                        activityData.push(post);
                    });
                });

                setInterestActivities(activityData);
                setLoading(false); // Set loading to false when data is fetched
            } catch (error) {
                console.error("Error fetching interest Activity:", error);
                setLoading(false); // Set loading to false in case of error
            }
        };

        fetchInterestActivity();
    }, [userInterests]);
    console.log(interestActivities);

    const formatTime = (date) => {
        if (date instanceof Date) {
          return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
        }
        return ""; // Return an empty string if date is not a valid Date object
      };
      const formatDate = (date) => {
        if (date instanceof Date) {
          return date.toLocaleDateString("en-US");
        }
        return ""; // Return an empty string if date is not a valid Date object
      };
      const excerpt = (str, count) => {
        if (str && str.length > count) {
          str = str.substring(0, count) + " ... ";
        }
        return str;
      };
    return (
        <div className=' flex gap-5 flex-wrap justify-center m-auto  w-full my-40 sm:my-20'>

            {interestActivities.length > 0 ? (
                interestActivities.map((activity) => (
                    <div key={activity.key}>
                    <NavLink to={`/activity/${activity.id}`}>
                  <div className="relative w-94  bg-gray-100 rounded-xl  shadow-xl  image-full p-2">
                      <div className="relative overflow-clip  h-40 sm:w-full">
                        <img
                          src={activity.imgUrl}
                          height={200}
                          className="p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out m-auto "
                        />
                      </div>

                      <div className="p-2 text-x text-gray-800">
                        <FontAwesomeIcon icon={faCalendar} />{" "}
                        {formatDate(
                          activity.DateTime instanceof Date
                            ? activity.DateTime
                            : new Date(activity.DateTime)
                        )}{" "}
                        {formatTime(
                          activity.DateTime instanceof Date
                            ? activity.DateTime
                            : new Date(activity.DateTime)
                        )}
                      </div>
                      <hr></hr>
                      <span className="text-sky-600">{activity.category}</span>
                      <h1 className="text-xl py-2 text-green-800">
                        {activity.activityName}
                      </h1>
                      <p className="p-3 text-gray-500">{excerpt(activity.writeup, 80)}</p>
                      <div className="flex m-auto">
                        <p className="text-gray-800 flex  gap-2 m-auto">
                          <FontAwesomeIcon icon={faLocationPin} />
                          <p className="m-auto"> {activity.location} </p>
                        </p>
                        <p className="text-gray-800 flex  gap-4 n-auto ">
                          <FontAwesomeIcon
                            icon={faHands}
                            className="p-2 rounded-full border text-violet-400"
                          />{" "}
                          <p className="m-auto"> {activity.claps} Claps</p>
                        </p>
                      </div>
                    </div>
                  </NavLink>
                    </div>
                ))
            ) : (
                <p className='text-2xl'>No activity based on your interest found.</p>
            )}
        </div>
    )
}

export default ActivityInterest