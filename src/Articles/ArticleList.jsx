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

const ArticleList = () => {
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
  const buttonStyle = {
    color: isBookmarked ? "gold" : "gray",
    opacity: isBookmarked ? "100%" : "50%",
    // Add any other button styles as needed
  };

  const handleAddBookmark = async () => {
    const bookmarkRef = doc(db, "bookmarks", userId); // Assuming you have the authenticated user's ID available
    const blogRef = doc(db, "posts", postId);

    try {
      if (isBookmarked) {
        // If the post is already bookmarked, remove the bookmark
        await updateDoc(bookmarkRef, {
          [postId]: deleteField(),
        });
        setIsBookmarked(false);
        toast.success("Removed from Bookmarks");
      } else {
        // If the post is not bookmarked, add the bookmark

        // Get the blog data from the "posts" collection
        const blogSnapshot = await getDoc(blogRef);
        if (blogSnapshot.exists()) {
          const blogData = blogSnapshot.data();

          // Add the entire blog data to the "bookmarks" collection
          await setDoc(
            bookmarkRef,
            {
              [postId]: {
                ...blogData,
                count: bookmarkCount + 1,
              },
            },
            { merge: true }
          );

          // Update the "posts" collection's count
          await updateDoc(blogRef, {
            count: increment(1),
          });

          setIsBookmarked(true);
          toast.success("Added to Bookmarks");
          setBookmarkCount(bookmarkCount + 1);
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark status: ", error);
      toast.error("Failed to toggle bookmark");
    }
  };

  return (
    <div className=" mt-30 py-40 sm:px-2 mx-20 sm:mx-0 w-full  flex  flex-col m-auto  justify-center border relative">
      <div className="flex m-auto my-20 justify-center sm:hidden">
        {Array.isArray(randomPost) &&
          randomPost.map((post) => (
            <NavLink
              to={`/readmore/${post.id}`}
              onClick={handleReadMoreClick}
              key={post.id}
              className="hover:border"
            >
              <div className="card card-side  bg-base-100 shadow-xl">
                <figure className="w-96">
                  <img src={post.imgUrl} alt="Album" />
                </figure>
                <div className="card-body">
                  <div className="px-5  ">
                    <h2 className="Aceh text-3xl py-5 text-black  card-title">
                      {post.postTitle}
                    </h2>
                    <p className="mt-1 text-sm leading-5 text-red-500 border-b Aceh">
                      Posted on {post.timestamp.toDate().toDateString()} at{" "}
                      {formatTime(post.timestamp.toDate())}
                    </p>

                    <p className="text-gray-600 py-5">
                      {excerpt(post.postDescription, 300)}
                    </p>
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
      <div className="flex  flex-wrap m-auto justify-center gap-10">
        {posts.map((post) => (
          <NavLink
            to={`/readmore/${post.id}`}
            onClick={handleReadMoreClick}
            key={post.id}
            className="hover:border"
          >
            <div key={post.id} className="w-96 bg-white">
              <div className="relative" style={{ height: "250px" }}>
                <img src={post.imgUrl} className="h-full m-auto" />
                <p className="badge bg-red-500 p-4 absolute top-5 text-white uppercase border-none ml-2">
                  {post.category}
                </p>
              </div>
              <div className="px-5">
                <h2 className="Aceh text-xl py-2 text-black ">
                  {post.postTitle}
                </h2>
                <p className="mt-1 text-sm leading-5 text-red-500 border-b Aceh">
                  Posted on {post.timestamp.toDate().toDateString()} at{" "}
                  {formatTime(post.timestamp.toDate())}
                </p>

                <p className="h-20 text-gray-600">
                  {excerpt(post.postDescription, 150)}
                </p>
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
                  <FontAwesomeIcon
                    onClick={handleAddBookmark}
                    icon={faBookmark}
                    style={buttonStyle}
                    className="my-auto "
                  />{" "}
                  {bookmarkCount}
                </span>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
