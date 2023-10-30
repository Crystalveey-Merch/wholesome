import React from 'react';
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
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faComment, faEye, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../components/Spinner.tsx';


const MyInterest = () => {
    const [userInterests, setUserInterests] = useState([]);
    const [interestPosts, setInterestPosts] = useState([]);

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
            setLoading(true);

            try {
                // 1. Retrieve the user's selected interests from Firestore

                const userRef = doc(db, 'users', userId); // Use doc to get the user document
                const userDoc = await getDoc(userRef);
                //   console.log(userDoc)
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserInterests(userData.selectedOptions);
                    // 2. Query the posts collection based on user interests
                    const postsRef = collection(db, 'posts')
                    const eventsRef = collection(db, 'events')

                    const queries = userInterests.map((interest) =>
                        query(postsRef, where('category', '==', interest.key))

                    );
                    const queries2 = userInterests.map((interest) =>
                        query(eventsRef, where('category', '==', interest.key))

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
                            setLoading(false);

                            
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
                    console.log('User document not found.');
                }
               

            } catch (error) {
                console.error('Error fetching data:', error);
            }
            finally {
                setLoading(false); // Move setLoading(false) to the finally block
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

    const handleReadMoreClick = async () => {
        if (userId) {
            try {
                // Fetch the specific post based on postId
                const postDocRef = doc(db, "posts", postId);
                const postDoc = await getDoc(postDocRef);

                if (postDoc.exists()) {
                    // Update the Firestore document with the user's ID
                    const updatedViewers = [...postDoc.data().views, userId];
                    await updateDoc(postDocRef, { views: updatedViewers });
                }
            } catch (error) {
                console.error("Error updating post document:", error);
            }
        }
    };
    
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
        <div className='mt-40 sm:mt-16 w-screen px-10 sm:px-0'>
            <div>
                <h1 className='text-red-500 text-3xl my-5 AcehLight sm:text-xl'>Filtered Based on your Interests </h1>
                <hr></hr>
                <div className='flex sm:flex-col  mx-20 sm:mx-5'>
                    <div>

                        {userInterests.map((interest) => (

                            <div key={interest.key} className='my-5 p-5 sm:p-0'>
                                <h2 className='text-md  text-gray-100 my-5 bg-black uppercase w-fit p-2'>{interest.key}</h2>
                                <div className='flex flex-col gap-5'>
                                    {interestPosts
                                        .filter((post) => post.category === interest.key)
                                        .map((post) => (
                                            <NavLink to={`/readmore/${post.id}`} onClick={handleReadMoreClick} key={post.id} className="hover:border">

                                                <div key={post.id}>
                                                    <div className='flex   gap-5 px-20  sm:px-0' >
                                                        <div className=' overflow-hidden w-96 h-40 sm:w-full'>
                                                            <img src={post.imgUrl} />
                                                        </div>

                                                        <div className='flex flex-col gap-5 sm:gap-2'>
                                                            <h5 className="text-2xl sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                                <p>
                                                                    {post.postTitle}
                                                                </p>
                                                            </h5>
                                                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                                                <p>
                                                                    {excerpt(post.postDescription, 100)}
                                                                </p>
                                                            </p>
                                                            {/* <NavLink to= {`/readmore/${post.id}`} onClick={handleReadMoreClick} > <button className='btn bg-red-500 text-white Aceh px-10 my-5'>Read</button></NavLink> */}
                                                            <span className="text-xl flex gap-5 py-2">
                                                                <FontAwesomeIcon
                                                                    icon={faComment}
                                                                    className="text-gray-300 my-auto "
                                                                />{" "}
                                                                {post.comments.length}
                                                                <FontAwesomeIcon
                                                                    icon={faThumbsUp}
                                                                    className="text-gray-300 my-auto "
                                                                />{" "}
                                                                {post.likes.length}
                                                                <FontAwesomeIcon
                                                                    icon={faEye}
                                                                    className="text-gray-300 my-auto "
                                                                />{" "}
                                                                {post.views ? post.views.length : 0}
                                                            </span>
                                                        </div>

                                                    </div>


                                                </div>
                                            </NavLink>

                                        ))}
                                </div>
                            </div>
                        ))}


                    </div>
                    <div className='w-96 sm:w-full bg-red-100/50'>
                    <h1 className='text-xl my-5 p-2 text-sky-500'><FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon> Interest Events</h1>
                    {userInterests.map((interest) => (
                    <div key={interest.key} className='my-5 p-5 '>
                        <h1 className='text-sm'>{interest.key}</h1>
                        <hr></hr>
                        
                            {interestEvents.filter((event) => event.category === interest.key)
                                    .map((event) => (
                                        <div key={event.id} className='p-5 flex flex-col gap-2 my-2  rounded-xl bg-black/75'>
                                            <h2 className='text-white  Aceh'>{event.eventName}</h2>

                                            <h2 className='text-green-500'>Date and Time: {event.dateTime}</h2>
                                            {/* {formatTime(event.dateTime.toDate())} */}
                                            <h2 className='text-gray-100'>Location: {event.address}</h2>
                                           <NavLink to={`/upcomingevents/${event.id}`}> <button type='button' className='btn bg-sky-600 text-white Aceh'> Details</button></NavLink>
                                        </div>

                                    ))
                            }
                      
                    </div>
                    ))}
                </div>
</div>

            </div>
        </div>
    )
}

export default MyInterest