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
import { Helmet } from "react-helmet-async";

// eslint-disable-next-line react/display-name
const ArticleInterest = () => {
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

  // const fetchData = async () => {
  //   try {
  //     setLoading(true); // Set loading to true before fetching data

  //     // 1. Retrieve the user's selected interests from Firestore
  //     const userRef = doc(db, "users", userId);
  //     const userDoc = await getDoc(userRef);

  //     if (userDoc.exists()) {
  //       const userData = userDoc.data();
  //       setUserInterests(userData.selectedOptions);

  //       // 2. Query the posts collection based on user interests
  //       const postsRef = collection(db, "posts");

  //       // Create an array of query objects
  //       const queries = userInterests.map((interest) =>
  //         query(postsRef, where("category", "==", interest.key))
  //       );

  //       // Create a Promise for each query
  //       const queryPromises = queries.map((query) => getDocs(query));

  //       // Wait for all queries to complete
  //       const querySnapshots = await Promise.all(queryPromises);

  //       const postData = [];

  //       // Process each query result
  //       querySnapshots.forEach((querySnapshot) => {
  //         querySnapshot.forEach((doc) => {
  //           const post = doc.data();
  //           post.id = doc.id;
  //           setPostId(post.id);
  //           postData.push(post);
  //         });
  //       });
  //       console.log("Query Snapshots:", querySnapshots);

  //       setInterestPosts(postData);
  //       console.log(postData)
  //     } else {
  //       console.log("User document not found.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false); // Set loading to false in the finally block
  //   }
  // };

  // useEffect(() => {
  //   if (userId) {
  //     fetchData();
  //   }
  // }, [ userId]);

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
        const postsRef = collection(db, "posts");
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

  // ... (the rest of your component)

  if (loading) {
    return <Spinner />; // Show loading indicator while data is being fetched
  }

  const excerpt = (str, count) => {
    if (str && str.length > count) {
      str = str.substring(0, count) + " ... ";
    }
    return str;
  };
  if (loading) {
    return <Spinner />;
  }
  console.log(interestPosts);
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
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
  console.log(userInterests);
  return (
    <div>
      <Helmet>
        <title>Article Interest</title>
        <meta
          name="description"
          property="og:description"
          content="List of Articles based on your Interest"
        />
        <meta
          name="keywords"
          content={userInterests.map((interest) => interest.key).join(", ")}
        />{" "}
        <meta
          name="url"
          content="https://wholesquare.crystaleey.com/myinterest/articles"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="article" />
        <link
          rel="canonical"
          href="https://wholesquare.crystaleey.com/myinterest/articles"
        />
        <meta property="og:title" content="Article Interest" />
        <meta
          property="og:url"
          content="https://wholesquare.crystaleey.com/myinterest/articles"
        />
        <meta property="og:image" content="" />
        <meta
          name="og:description"
          content="List of Articles based on your Interest"
        />
        <meta name="og:site_name" content="wholesquare" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content="https://wholesquare.crystaleey.com/myinterest/articles"
        />
        <meta name="twitter:title" content="Article Interest" />
        <meta
          name="twitter:description"
          content="List of Articles based on your Interest"
        />
        {/* <meta name="twitter:image" content="../../public/20231116_210104-removebg-preview.png" /> */}
        <script
          type="application/ld+json"
          {...JSON.stringify({
            "@context": "https://schema.org",
            "@type": "website",
            headline: "Article Interest",
            url: "https://wholesquare.crystaleey.com/myinterest/articles",

            image: "",
            author: {
              "@type": "Person",
              name: "Wholesquare",
            },
            publisher: {
              "@type": "Organization",
              name: "Wholesquare",
              logo: {
                "@type": "ImageObject",
                url: "",
              },
            },
            // datePublished: `${post.timestamp?.toDate()?.toDateString()}`,
          })}
        />
      </Helmet>
      <div className="flex sm:flex-col  mx-20 sm:mx-5">
        <div>
          {userInterests.map((interest) => (
            <div key={interest.key} className="my-5 p-5 sm:p-0">
              <h2 className="text-md  text-gray-100 my-5 bg-black uppercase w-fit p-2">
                {interest.key}
              </h2>
              <div className="flex flex-wrap gap-2">
                {interestPosts
                  .filter((post) => post.category === interest.key)
                  .map((post) => (
                    <NavLink
                      to={`/readmore/${post.id}`}
                      onClick={() => handleReadMoreClick(post)}
                      key={post.id}
                      className="hover:border p-5  hover:rounded-xl transition duration-300   ease-in-out "
                    >
                      <div
                        key={post.id}
                        className="w-72 sm:w-80 bg-white hover:bg-gradient-to-r hover:scale-105  hover:from-orange-400 hover:to-rose-400 transition duration-300 ease-in-out  rounded-xl p-2 shadow "
                      >
                        <div className="relative overflow-clip  h-40 sm:w-full">
                          <img
                            src={post.imgUrl}
                            height={200}
                            className="p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out m-auto "
                          />
                        </div>
                        <div className="px-5 sm:p-0 ">
                          <p className="badge  bg-gradient-to-r from-orange-400 to-rose-400 p-4 my-5  top-5 text-gray-100   border-none ">
                            {post.category}
                          </p>
                          <p className="mt-1 text-sm leading-5 text-red-300 border-b Aceh">
                            {post.timestamp.toDate().toDateString()} at{" "}
                            {formatTime(post.timestamp.toDate())}
                          </p>
                          <h2 className="Aceh text-xl py-2 text-black ">
                          {excerpt(post.postTitle, 50)}
                          </h2>

                          <p className=" text-gray-800 ">
                            {excerpt(post.postDescription, 100)}
                          </p>
                          <span className="text-l flex gap-5 ">
                            <FontAwesomeIcon
                              icon={faComment}
                              className="text-gray-500 my-auto "
                            />{" "}
                            {post.comments.length}
                            <FontAwesomeIcon
                              icon={faThumbsUp}
                              className="text-gray-500 my-auto "
                            />{" "}
                            {post.likes.length}
                            <FontAwesomeIcon
                              icon={faEye}
                              className="text-gray-500 my-auto "
                            />{" "}
                            {post.views ? post.views.length : 0}
                            {/* <FontAwesomeIcon
                    onClick={handleAddBookmark}
                    icon={faBookmark}
                    style={buttonStyle}
                    className="my-auto "
                  />{" "}
                  {bookmarkCount} */}
                          </span>
                        </div>
                      </div>
                    </NavLink>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleInterest;
