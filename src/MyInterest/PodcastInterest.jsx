/* eslint-disable no-unused-vars */
import { useState, useEffect, memo } from "react";
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
import { faSpotify, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { Helmet } from "react-helmet-async";


const PodcastInterest = () => {
    const [userInterests, setUserInterests] = useState([]);
    const [interestPosts, setInterestPosts] = useState([]);
    const [loading, setLoading] = useState(false);
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
            // setLoading(true);
            return;
          }
    
          try {
            const postsRef = collection(db, "podcast");
            const queries = userInterests.map((interest) =>
              query(postsRef, where("category", "==", interest.key))
            );
    
            const queryPromises = queries.map((query) => getDocs(query));
            const querySnapshots = await Promise.all(queryPromises);
    
            const postData = [];
    
            querySnapshots.forEach((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const post = doc.data();
                post.id = doc.id;
                postData.push(post);
              });
            });
    
            setInterestPosts(postData);
            // setLoading(false); // Set loading to false when data is fetched
          } catch (error) {
            console.error("Error fetching interest posts:", error);
            // setLoading(false); // Set loading to false in case of error
          }
        };
    
        fetchInterestPosts();
      }, [userInterests]);
    
  return (
    <div>
      <Helmet>  
        <title>Podcast Interest</title>
        <meta
          name="description"
          property="og:description"
          content={interestPosts.map(interest => interest.podcastName).join(", ")}
        />
<meta name="keywords" content={interestPosts.map(interest => interest.podcastName).join(", ")} />        <meta
          name="url"
          content="http://wholesome.crystaleey.com/myinterest/podcast"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="article" />
        <link
          rel=" canonical"
          href="http://wholesome.crystaleey.com/myinterest/podcast"
        />
        <meta property="og:title" content="Article Interest" />
        <meta
          property="og:url"
          content="http://wholesome.crystaleey.com/myinterest/podcast"
        />
        <meta property="og:image" content='' />
        <meta name="og:description" content={interestPosts.map(interest => interest.podcastName).join(", ")}/>
        <meta name="og:site_name" content="Wholesome" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content="http://wholesome.crystaleey.com/myinterest/podcast"
        />
        <meta name="twitter:title" content="Article Interest" />
        <meta name="twitter:description" content={interestPosts.map(interest => interest.podcastName).join(", ")} />
        {/* <meta name="twitter:image" content="../../public/20231116_210104-removebg-preview.png" /> */}

        <script
          type="application/ld+jason"
          {...JSON.stringify({
            "@context": "https://schema.org",
            "@type": "website",
            headline: "Article Interest",
            url: "http://wholesome.crystaleey.com/myinterest/podcast",

            image: "",
            author: {
              "@type": "Person",
              name: "Wholesome",
            },
            publisher: {
              "@type": "Organization",
              name: "Wholesome",
              logo: {
                "@type": "ImageObject",
                url: "",
              },
            },
            // datePublished: `${post.timestamp?.toDate()?.toDateString()}`,
          })}
        />
      </Helmet>
     <div className="py-32  flex flex-wrap px-20 sm:w-full sm:px-5  gap-4  justify-center">
            {interestPosts?.map((item) => (
              <div
                key={item.key}
                className="flex flex-col gap-4 bg-gray-800 h-56 "
              >
                <div
                  key={item.id}
                  className=" relative flex rounded-xl shadow w-96 sm:w-full"
                >
                  <div className=" relative w-40 overflow-clip p-2  rounded-xl ">
                    <img
                      src={item.imageUrl}
                      className="absolute  hover:scale-125  m-auto  transition duration-300 ease-in-out"
                    ></img>
                  </div>
                  <div className=" p-4">
                    <p className="text-white Aceh text-2xl sm:text-xl">
                      {item.podcastName}{" "}
                    </p>
                    <p className="text-gray-300   ">{item.category} </p>

                    <div className="flex  gap-2">
                      <a  href={item.spotify}>                          
                           <FontAwesomeIcon
                        icon={faSpotify}
                        className=" text-2xl text-gray-500 hover:text-gray-200 cursor-pointer hover:scale-125 transition duration-300 ease-in-out"/>
                        </a>
                      <a href={item.youtube}> 
                      <FontAwesomeIcon
                        icon={faYoutube}
                        className="text-2xl text-gray-500 hover:text-gray-200 cursor-pointer hover:scale-125 transition duration-300 ease-in-out"
                      /> </a>
                    </div>
                  </div>
                </div>
                <div className="px-5">
                  <audio
                    className="w-full h-10 "
                    src={item.audioUrl}
                    controls
                  />
                </div>
              </div>
            ))}
            </div>
    </div>
  )
}

export default PodcastInterest