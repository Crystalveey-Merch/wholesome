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
import { Card } from 'flowbite-react';
import { NavLink } from 'react-router-dom';


const MyInterest = () => {
    const [userInterests, setUserInterests] = useState([]);
    const [interestPosts, setInterestPosts] = useState([]);
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

    useEffect(() => {
        // Replace "userId" with the currently logged-in user's ID // You should get the actual user ID

        const fetchData = async () => {
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


                    const queries = userInterests.map((interest) =>
                        query(postsRef, where('category', '==', interest.key))

                    );
                    // Create a Promise for each query
                    const queryPromises = queries.map((query) => getDocs(query));

                    // Wait for all queries to complete
                    const querySnapshots = await Promise.all(queryPromises);

                    const postData = [];

                    // Process each query result
                    querySnapshots.forEach((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            const post = doc.data();
                            postData.push(post);
                        });
                    });

                    // const querySnapshot = await getDocs(collection(db, 'posts'));

                    // const postID = [];

                    // querySnapshot.forEach((doc) => {
                    //   // Extract the data from each document
                    //   const post = doc.data();
                    //   post.id = doc.id;
                    //    setPostId (post.id)
                
                   
                    // })
                    setInterestPosts(postData);
                } else {
                    console.log('User document not found.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
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
        <div className='mt-40 sm:mt-16 mx-40 sm:mx-5 '>
            <div>
                <h1 className='text-red-500 text-3xl my-5  sm:text-xl'>Posts Based on your Interests </h1>
                <hr></hr>
                <div>
                    {userInterests.map((interest) => (
                        <div key={interest.key} className='my-5 p-5 sm:p-0'>
                            <h2 className='text-md  text-gray-100 my-5 bg-black uppercase w-fit p-2'>{interest.key}</h2>
                            {interestPosts
                                .filter((post) => post.category === interest.key)
                                .map((post) => (
                                    <div key={post.id}>
                                    <div className='flex   gap-5 px-20  sm:px-0' > 
                                    <div className='h-full overflow-hidden w-96 h-40 sm:w-full'>
                                    <img src={post.imgUrl}  />
                                    </div>
                                        
                                        <div className='flex flex-col gap-5 sm:gap-2'>
                                        <h5 className="text-2xl sm:text-md font-bold tracking-tight text-gray-900 dark:text-white">
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

                                        </div>

                                    </div>


                                    </div>
                                ))}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default MyInterest