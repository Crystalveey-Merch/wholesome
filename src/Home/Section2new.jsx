import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  DocumentSnapshot,
  endAt,
  endBefore,
  getDocs,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  deleteField,
  where,
  increment,
} from "firebase/firestore";
import { auth, db } from "../firebase/auth.js";
// import { useParams } from 'react-router';
import { NavLink } from "react-router-dom";
import Spinner from "../components/Spinner.tsx";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faComment,
  faEye,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

const Section2new = () => {
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

    const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  const [postId, setPostId] = useState([]);
  const [randomPost, setRandomPost] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const postData = [];
        querySnapshot.forEach((doc) => {
          // Extract the data from each document
          const post = doc.data();
          post.id = doc.id;
          setPostId(post.id);

          postData.push(post);
        });

        setPosts(postData);

        const randomIndex = Math.floor(Math.random() * postData.length);

        if (postData[randomIndex]) {
          setRandomPost([postData[randomIndex]]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const excerpt = (str, count) => {
    if (str && str.length > count) {
      str = str.substring(0, count) + " ... ";
    }
    return str;
  };
  const handleReadMoreClick = async () => {
    try {
      // Fetch the specific post based on postId
      const postDocRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postDocRef);
  
      if (postDoc.exists()) {
        let updatedViewers;
  
        if (userId) {
          // If userId exists, add it to the viewers array
          updatedViewers = [...postDoc.data().views, userId];
        } else {
          // If userId doesn't exist, pass an empty array
          updatedViewers = [];
        }
  
        await updateDoc(postDocRef, { views: updatedViewers });
      }
    } catch (error) {
      console.error("Error updating post document:", error);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  const buttonStyle = {
    color: isBookmarked ? "gold" : "gray",
    opacity: isBookmarked ? "100%" : "50%",
    // Add any other button styles as needed
  };
  const limitedPosts = posts.slice(0, 6);

  return (
    <div className="p-10 sm:p-2 bg-gradient-to-l from-orange-400 to-rose-400  w-full" >
      <h1 className='text-white text-4xl text-red-500 sm:my-2 my-5 text-center Aceh text-md'>MUST READS</h1>
      <hr></hr>
<div className="flex  flex-wrap px-10 sm:px-0 my-20 sm:my-5 m-auto justify-center gap-10 sm:gap-2">
        {limitedPosts.map((post) => (
          <NavLink
            to={`/readmore/${post.id}`}
            onClick={handleReadMoreClick}
            key={post.id}
            className="hover:border p-5 sm:px-10 hover:bg-red-100/50 hover:rounded-xl transition duration-300 ease-in-out"
          >
            <div key={post.id} className="w-96 bg-white   rounded-xl p-2 shadow ">
              <div className="relative overflow-clip  h-40 sm:w-40" >
                <img src={post.imgUrl}  height={200} className="p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out m-auto " />
              
              </div>
              <div className="px-5 sm:p-0">
              <p className="badge bg-gray-100 p-4  top-5 text-gray-600  sm:hidden border-none ">
                  {post.category}
                </p>
                <p className="mt-1 text-sm leading-5 text-red-300 border-b Aceh">
                  {post.timestamp.toDate().toDateString()} at{" "}
                  {formatTime(post.timestamp.toDate())}
                </p>
                <h2 className="Aceh text-xl py-2 text-black ">
                  {post.postTitle}   
                </h2>
               

                <p className="h-14 text-gray-800 sm:hidden">
                  {excerpt(post.postDescription, 50)}
                </p>
                <span className="text-xl flex gap-5 ">
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
     <NavLink to='articlelist'><button  className="btn bg-black flex m-auto Aceh text-white"> See More</button></NavLink> 
    </div>
  )
}

export default Section2new