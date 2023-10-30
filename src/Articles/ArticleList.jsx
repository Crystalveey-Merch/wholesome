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
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState([]);

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

        const tags = [];
        if (querySnapshot && Array.isArray(querySnapshot.docs)) {
          querySnapshot.docs.forEach((doc) => {
            const postData = doc.data();
            if (postData && Array.isArray(postData.tags)) {
              tags.push(...postData.tags);
            }
          });
        }
        const uniqueTags = [...new Set(tags)];
        console.log(uniqueTags);
        setTags(uniqueTags);

        const categories = [];
        if (querySnapshot && Array.isArray(querySnapshot.docs)) {
          querySnapshot.docs.forEach((doc) => {
            const postData = doc.data();
            const category = postData.category; // Get the category value from postData
            if (category) {
              categories.push(category); // Push the category to the array
            }
          });
        }

        setCategory(categories);
        console.log(categories);

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
    <div className="  py-20 sm:px-2 px-10  w-screen  flex sm:flex-col  m-auto  justify-center bg-stone-200  relative">
      <div>
        <div className="flex m-auto my-10 justify-center sm:hidden">
          {Array.isArray(randomPost) &&
            randomPost.map((post) => (
              <NavLink
                to={`/readmore/${post.id}`}
                onClick={handleReadMoreClick}
                key={post.id}
                className=""
              >
                <div className="card card-side  bg-base-100 ">
                  <figure className="w-60">
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
              <div key={post.id} className="w-80 bg-white">
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
      <div
        className="tags p-5  m-5 bg-white w-2/3  sm:w-full sm:m-0 sm:my-10 "
       
      >
        <div>
          <h2 className="text-xl">Tags</h2>
          <hr></hr>
          {tags?.map((tag) => (
            <div
              className="badge bg-green-600  m-1 p-4 hvr-bounce-in"
              key={tag.id}
            >
              <NavLink
                to={`/articletag/${tag}`}
                style={{ textDecoration: "none", color: "white" }}
              >
                {tag}
              </NavLink>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl">Categories</h2>
          <hr></hr>
          {category?.map((category) => (
            <div
              className="badge bg-sky-600  m-1 p-4 hvr-bounce-in"
              key={category.id}
            >
              <NavLink
                to={`/category/${category}`}
                style={{ textDecoration: "none", color: "white" }}
              >
                {category}
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleList;