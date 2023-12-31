import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "../firebase/auth.js";
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
      try {
        setLoading(true);
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
        setLoading(false);
        // setPosts([]);
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
  const limitedPosts = posts.slice(0, 3);

  return (
    <div className="p-5 sm:p-5 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 w-screen"  >
      <h1 className='text-black text-2xl  sm:my-2 my-5 text-center Aceh text-md'>MUST READS</h1>
      <hr></hr>
<div className="flex  flex-wrap px-1 sm:p-5 my-20 sm:my-5 m-auto justify-center gap-2 sm:gap-2">
        {limitedPosts.map((post) => (
          <NavLink
            to={`/readmore/${post.id}`}
            onClick={handleReadMoreClick}
            key={post.id}
            className="hover:border p-5    hover:bg-red-100/50 hover:rounded-xl transition duration-300 ease-in-out"
          >
            <div key={post.id} className="w-96 sm:w-78 bg-white   rounded-xl p-5 shadow ">
              <div className="relative overflow-clip  h-40 sm:w-full" >
                <img src={post.imgUrl}  height={200} className="p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out m-auto " />
              
              </div>
              <div className="px-5 sm:p-0 my-6"  >
              <p className="badge bg-red-500 py-4  top-5 text-white sm:hidden border-none ">
                  {post.category}
                </p>
                <p className="mt-1 text-sm leading-5 text-gray-500 border-b Aceh">
                  {post.timestamp.toDate().toDateString()} at{" "}
                  {formatTime(post.timestamp.toDate())}
                </p>
                <h2 className="Aceh text-xl py-2 text-red-500 ">
                  {post.postTitle}   
                </h2>
                <p className="h-14 text-gray-800 ">
                {/* {post.postDescription} */}
                  {excerpt(post.postDescription, 80)}
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