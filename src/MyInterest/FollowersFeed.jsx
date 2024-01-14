import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/auth.js";
import Spinner from "../components/Spinner.tsx";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBookmark,
    faComment,
    faEye,
    faThumbsUp,
  } from "@fortawesome/free-solid-svg-icons";

export const FollowersFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);


  const userId = auth.currentUser.uid;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // Get the currently logged-in user's ID

        // Retrieve the list of user IDs that the logged-in user is following
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const followedUsers = userData.following || []; // Replace 'following' with the actual field name in your Firestore data
          // Query the 'posts' collection for posts made by followed users
          const postsRef = collection(db, "posts");
          const queryPosts = query(
            postsRef,
            where("userId", "in", followedUsers)
          );

          const querySnapshot = await getDocs(queryPosts);
          const postData = [];

          querySnapshot.forEach((doc) => {
            const post = doc.data();

            post.id = doc.id;
            postData.push(post);
          });

          setPosts(postData);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const excerpt = (str, count) => {
    if (str && str.length > count) {
      str = str.substring(0, count) + " ... ";
    }
    return str;
  };

  const handleReadMoreClick = async () => {
    try {
      // Fetch the specific post based on postId
      const postDocRef = doc(db, "posts", posts.id);
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
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        if (userId && posts.id) {
          const bookmarkDocRef = doc(db, "bookmarks", userId);
          const bookmarkDocSnapshot = await getDoc(bookmarkDocRef);
          const blogRef = doc(db, "posts",  posts.id);

          if (bookmarkDocSnapshot.exists()) {
            const bookmarks = bookmarkDocSnapshot.data();
            const isBookmarked =  posts.id in bookmarks;
            setIsBookmarked(isBookmarked);

            console.log(bookmarks.length);
          } else {
            setIsBookmarked(false); // Document doesn't exist, so it's not bookmarked
          }
          const blogSnapshot = await getDoc(blogRef);
          if (blogSnapshot.exists()) {
            const blogData = blogSnapshot.data();
            console.log(blogData);
            setBookmarkCount(blogData.count);
          }
        }
      } catch (error) {
        console.error("Error checking bookmark status: ", error);
      }
    };

    checkBookmarkStatus();
  }, [userId, posts.id]);

  const buttonStyle = {
    color: isBookmarked ? "gold" : "gray",
    opacity: isBookmarked ? "100%" : "75%",
    // Add any other button styles as needed
  };
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
console.log(posts.id)

  return (
    <div>
            <p className="text-center text-2xl my-10">Based on Users you Follow</p>

   
    <div className="flex  flex-wrap px-5 sm:px-0 my-10 sm:my-5 m-auto justify-center gap-4 sm:gap-2">
    {posts.length > 0 ? (
        posts.map((post) => {

            return (

              <NavLink
                  to={`/readmore/${post.id}`}
                  onClick={() => handleReadMoreClick(post)}
                  key={post.id}
                  className="hover:border sm:hover:border-none p-4 sm:p-0  hover:rounded-xl transition duration-300  sm:m-0 ease-in-out "
                >
                  <div
                    key={post.id}
                    className="w-72   sm:w-full bg-white  sm:p-10 hover:scale-105   transition duration-300 ease-in-out sm:rounded-none  rounded-xl p-2 shadow "
                  >
                    <div className="relative overflow-clip  h-40 ">
                      <img
                        src={post.imgUrl}
                        height={200}
                        className="p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out "
                      />
                    </div>
                    <div className="px-5 sm:p-0 ">
                      <p className="badge  bg-gradient-to-r from-orange-400 to-rose-400 p-4 my-5  top-5 text-gray-100   border-none ">
                        {post.category}
                      </p>
                      <p className="mt-1 text-sm leading-5 text-red-300 border-b Aceh">
                        {post?.timestamp.toDate().toDateString()} at{" "}
                        {formatTime(post?.timestamp.toDate())}
                      </p>
                      <h2 className="Aceh text-l py-2 text-black ">
                        {excerpt(post.postTitle, 50)}
                      </h2>
                      <div className="">
                        <p className=" text-gray-500 ">
                          {excerpt(post.postDescription, 100)}
                        </p>
                      </div>
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
                        <FontAwesomeIcon
                          icon={faBookmark}
                          style={buttonStyle}
                          className="my-auto   "
                        />
                        {post.count}
                      </span>
                    </div>
                  </div>
                </NavLink>
        )})) : (
  <div className="text-center text-2xl font-bold text-gray-500 mt-4 h-48">
    You have not followed 
  </div>
)}
        </div>
      </div>
  )
};
