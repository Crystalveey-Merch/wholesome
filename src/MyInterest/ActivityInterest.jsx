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
    return (
        <div className=' flex gap-5 flex-wrap justify-center m-auto  w-full my-40 sm:my-20'>

            {interestActivities.length > 0 ? (
                interestActivities.map((activity) => (
                    <div key={activity.key}>
                        <NavLink to={`/activity/${activity.id}`} style={{ height: "32rem" }}>
                            <div className="relative w-94 text-white shadow-xl image-full">
                            <div className="relative overflow-clip  h-40 sm:w-40" >

                                <figure className="">
                                    <img src={activity.imgUrl} alt={activity.activityName} className='p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out' />
                                </figure>
                                </div>
                                <div className="p-5 bg-gray-900">
                                    <div className="badge bg-red-500 text-white p-4 text-md">{activity.category}</div>
                                    <h1 className="text-2xl py-2">{activity.activityName}</h1>
                                    <p>{activity.writeup}</p>
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