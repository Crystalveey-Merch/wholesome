/* eslint-disable no-unused-vars */
import React from "react";
import { useParams } from "react-router";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner.tsx";

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
  increment,
  orderBy,
  query,
  setDoc,
  deleteField,
  startAfter,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/auth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MDEditor from "@uiw/react-md-editor";
import {
  faComment,
  faCopy,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Like from "./Like.tsx";
import UserComment from "./UserComment.jsx";
import CommentBox from "./CommentBox.tsx";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  faFacebook,
  faLinkedin,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { NavLink } from "react-router-dom";
import { faBookmark, faEye } from "@fortawesome/free-solid-svg-icons";

const ReadMore = () => {
  const url = window.location.href;

  const { id } = useParams();
  const [authUser, setAuthUser] = useState(null);
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState([]);
  const [commentLikes, setCommentLikes] = useState("");

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [relatedPost, setRelatedPosts] = useState([]);

  const [userComment, setUserComment] = useState("");
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileDocRef = doc(db, "users", post?.userId); // Assuming you have a "users" collection in Firebase
        const profileDocSnapshot = await getDoc(profileDocRef);
        setProfileData(profileDocSnapshot.data());
      } catch (error) {
        console.error("Error fetching profile data: ", error);
      }
    };
    // console.log(!profileData.photoURL);
    if (post?.userId) {
      fetchProfileData();
    }
  }, [post?.userId, profileData]);

  const isAuthUserComment = (comment, authUserId) => {
    // Check if the comment's userId matches the authenticated user's ID
    return comment.userId === authUserId;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileDocRef = doc(db, "users", userId); // Assuming you have a "users" collection in Firebase
        const profileDocSnapshot = await getDoc(profileDocRef);
        setUserData(profileDocSnapshot.data());
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };
    // console.log(!profileData.photoURL);
    if (userId) {
      fetchUserData();
    }
  }, [userId, userData]);

  useEffect(() => {
    const fetchSelectedPost = async () => {
      try {
        const docRef = doc(db, "posts", id); // Replace "posts" with your collection name
        const docSnapshot = await getDoc(docRef);

        setComments(
          docSnapshot.data().comments ? docSnapshot.data().comments : []
        );
        setLikes(docSnapshot.data().likes ? docSnapshot.data().likes : []);
        setCommentLikes(
          docSnapshot.data().comments
            ? docSnapshot.data().comments.commentLikes
            : []
        );

        if (docSnapshot.exists()) {
          setPost(docSnapshot.data());
        } else {
          console.error(`Post with id '${id}' not found.`);
          // Handle the case where the post is not found, e.g., display a 404 page.
        }
      } catch (error) {
        console.error("Error fetching the selected post:", error);
        // Handle the error, e.g., display an error message to the user.
      }
    };

    fetchSelectedPost();
  }, [id]);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        if (userId && id) {
          const bookmarkDocRef = doc(db, "bookmarks", userId);
          const blogRef = doc(db, "posts", id);

          const bookmarkDocSnapshot = await getDoc(bookmarkDocRef);
          if (bookmarkDocSnapshot.exists()) {
            const bookmarks = bookmarkDocSnapshot.data();
            const isBookmarked = id in bookmarks;
            setIsBookmarked(isBookmarked);
          }
          else {
            setIsBookmarked(false); // Document doesn't exist, so it's not bookmarked
          }
          const blogSnapshot = await getDoc(blogRef);
          if (blogSnapshot.exists()) {
            const blogData = blogSnapshot.data();
            console.log(blogData)
            setBookmarkCount(blogData.count)


          }
        }
      } catch (error) {
        console.error("Error checking bookmark status: ", error);
      }
    };
    checkBookmarkStatus();
  }, [id, userId]);


  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        // Fetch the selected post's category
        const selectedPostRef = doc(db, "posts", id);
        const selectedPostSnapshot = await getDoc(selectedPostRef);

        if (selectedPostSnapshot.exists()) {
          const selectedPostData = selectedPostSnapshot.data();
          const selectedCategory = selectedPostData.category;

          // Query posts with the same category as the selected post
          const postsRef = collection(db, "posts");
          const relatedPostsQuery = query(
            postsRef,
            where("category", "==", selectedCategory)
          );
          const relatedPostsSnapshot = await getDocs(relatedPostsQuery);

          const relatedPosts = [];

          relatedPostsSnapshot.forEach((doc) => {
            if (doc.id !== id) {
              relatedPosts.push({ id: doc.id, data: doc.data() });
            }
          });

          setRelatedPosts(relatedPosts);
        } else {
          console.error(`Post with id '${id}' not found.`);
          // Handle the case where the selected post is not found, e.g., display a 404 page.
        }
      } catch (error) {
        console.error("Error fetching related posts:", error);
        // Handle the error, e.g., display an error message to the user.
      }
    };

    fetchRelatedPosts();
  }, [id]);

  if (!post) {
    return <Spinner />;
  }

  const formatTime = (date) => {
    if (date instanceof Date) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return "Invalid Date";
    }
  };

  const handleLike = async () => {
    if (userId) {
      try {
        const postRef = doc(db, "posts", id);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
          const postData = postDoc.data();
          let updatedLikes = postData.likes ? [...postData.likes] : [];

          // Check if the user has already liked the post
          const index = updatedLikes.indexOf(userId);

          if (index === -1) {
            // User has not liked the post, add their ID to likes
            updatedLikes.push(userId);
          } else {
            // User has already liked the post, remove their ID from likes
            updatedLikes.splice(index, 1);
          }

          // Update the likes array in Firestore
          await updateDoc(postRef, { likes: updatedLikes });

          // Update your component state with the updatedLikes array
          setLikes(updatedLikes);
        }
      } catch (error) {
        console.error("Error updating likes:", error);
      }
    }
  };
  const handleCommentLikesUpdate = async (e) => { };

  const commentId = `${userId}-${Date.now()}`;

  const handleComment = async (e) => {
    e.preventDefault();

    const timestamp = Timestamp.now();

    const newComment = {
      createdAt: timestamp,
      userId,
      commentId,
      name: userData?.displayName,
      body: userComment,
      imgUrl: userData?.photoURL,
      replies: [],
    };

    // Create a copy of the existing comments array and add the new comment
    const updatedComments = [...post.comments, newComment];

    try {
      await updateDoc(doc(db, "posts", id), {
        comments: updatedComments, // Update with the merged comments array
      });

      // Update the local state if needed
      setComments(updatedComments);
      setUserComment(""); // Clear the input field
      toast.success("Comment posted successfully");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again later.");
    }
  };

  function copyText() {
    /* Copy text into clipboard */
    navigator.clipboard.writeText(
      // eslint-disable-next-line no-unexpected-multiline
      url
    );
    toast.success("Link copied successfully");
  }
  const profileId = post.userId;

  const excerpt = (str, count) => {
    if (str && str.length > count) {
      str = str.substring(0, count) + " ... ";
    }
    return str;
  };
  const handleReadMoreClick = async (relatedPost) => {
    try {
      // Fetch the specific post based on postId
      const postDocRef = doc(db, "posts", relatedPost.id);

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

  const handleAddBookmark = async () => {
    const bookmarkRef = doc(db, "bookmarks", userId);
    const blogRef = doc(db, "posts", id);
    try {
      if (isBookmarked) {
        await updateDoc(bookmarkRef, {
          [id]: deleteField(),
        });
        setIsBookmarked(false);
        toast.success("Removed from Bookmarks");
        setBookmarkCount((prevCount) => prevCount - 1);
      } else {
        const blogSnapshot = await getDoc(blogRef);
        if (blogSnapshot.exists()) {
          const blogData = blogSnapshot.data();
          await setDoc(
            bookmarkRef,
            {
              [id]: {
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
          setBookmarkCount((prevCount) => prevCount + 1);
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark status: ", error);
      toast.error("Failed to toggle bookmark");
    }
  };

  const buttonStyle = {
    color: isBookmarked ? "gold" : "gray",
    opacity: isBookmarked ? "100%" : "75%",
    // Add any other button styles as needed
  };


  return (
    <div className="flex mt-40 w-screen px-30 sm:flex-col sm:px-5 ">
      <div
        className="  px-40 lg:px-20 sm:px-0  sm:mt-30 flex flex-col m-auto justify-center"
        key={post.id}
      >
        <div className="badge bg-red-500 text-white text-xl Aceh p-4">
          {post.category}
        </div>

        <h1 className="text-black text-4xl sm:text-3xl py-5">
          {" "}
          {post.postTitle}
        </h1>

        <div className="m-auto">
          <img src={post.imgUrl} alt={post.postTitle} width={1000} />
        </div>
        <div className=" my-20 sm:mx-5 sm:my-10">
          <h1 className="text-red-500 text-xl">{post.date}</h1>
          <p className="mt-1 text-xl sm:text-sm leading-5 text-red-400 Aceh pb-2">
            Posted on {post.timestamp?.toDate()?.toDateString()} at{" "}
            {formatTime(post.timestamp?.toDate())}
          </p>
          <p className="py-5 Aceh">By {profileData?.displayName}</p>
          <p className="py-5 underline cursor-pointer  gap-2"
            onClick={handleAddBookmark}
          >
            Add to Bookmarks
            <FontAwesomeIcon
              icon={faBookmark}
              style={buttonStyle}
              className="  cursor-pointer "
            />{" "}

            ({bookmarkCount})</p>
          <span className="text-xl flex text-gray-100 p-2 rounded-full sticky top-24  bg-black m-auto justify-center">
            <div className="flex gap-2   m-auto">
              <Like handleLike={handleLike} likes={likes} userId={userId} />
              <FontAwesomeIcon
                icon={faComment}
                className="text-gray-100  "
              />{" "}
              {post.comments.length}

            </div>
            <div className="flex gap-3 m-auto ">
              <span className="text-white Aceh">Share:</span>
              <LinkedinShareButton url={url} title={post?.postTitle}>
                <FontAwesomeIcon
                  icon={faLinkedin}
                  className="fab fa-linkedin text-sky-500 text-xl"
                />
              </LinkedinShareButton>
              <FacebookShareButton url={url} title={post?.postTitle}>
                <FontAwesomeIcon
                  icon={faFacebook}
                  className="fab fa-facebook text-sky-500 text-xl"
                />
              </FacebookShareButton>
              <TwitterShareButton url={url} title={post?.postTitle}>
                <FontAwesomeIcon
                  icon={faTwitter}
                  className="fab fa-twitter text-sky-500 text-xl"
                />
              </TwitterShareButton>
              <WhatsappShareButton url={url} title={post?.postTitle}>
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  className="fab fa-whatsapp text-green-500 text-xl"
                />
              </WhatsappShareButton>
              <span onClick={copyText}>
                <FontAwesomeIcon
                  icon={faCopy}
                  className="fas fa-link text-xl text-white"
                />
              </span>


            </div>

          </span>
          <hr></hr>
          <br></br>
          <MDEditor.Markdown
            source={post.content}
            style={{ whiteSpace: "pre-wrap" }}
          />

          <ul>
            {Array.isArray(post.tags) ? (
              post.tags.map((tag, index) => (
                <li
                  key={index}
                  className="badge bg-green-800 p-3 text-white Aceh my-10 mx-2"
                >
                  {tag}
                </li>
              ))
            ) : (
              <li>No tags available</li>
            )}
          </ul>
        </div>
        <div>
          <div className="flex flex-col m-auto my-5 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400   rounded-xl p-5">
            <img
              src={profileData?.photoURL}
              className="rounded-full h-20 w-20 m-auto"
            />
            <h1 className="text-xl m-auto text-black py-5">
              {" "}
              Author: {profileData?.displayName}
            </h1>
            <h1 className="text-sm text-gray-600 py-1 m-auto">
              Bio: {profileData?.shortBio}
            </h1>
            <h1 className="text-sm text-gray-600 py-1 m-auto">
              Email: {profileData?.email}
            </h1>
            <NavLink to={`/profile/${profileId}`}>
              <button className="btn w-40 flex hover:bg-black m-auto my-2  bg-gradient-to-r from-orange-400 to-rose-400 text-white ">
                View Profile
              </button>
            </NavLink>
          </div>
          <div className=" bg-gray-200 border rounded-xl text-base-200 p-5 sm:p-2 ">
            <div className="scroll">
              <h4 className="small-title Aceh text-red-500 ">
                {post.comments?.length} Comment
              </h4>
              <div className="h-96 sm:h-60 overflow-scroll">
                {isEmpty(post.comments) ? (
                  <UserComment
                    msg={
                      "No Comment yet posted on this blog. Be the first to comment"
                    }
                    name="any"
                    body="any"
                    createdAt="any"
                    className="text-red-500"
                    imgUrl="any"
                    commentLikes="any"
                  />
                ) : (
                  <>
                    {comments?.map((comment) => (
                      <UserComment
                        {...comment}
                        isAuthUserComment={isAuthUserComment(comment, userId)}
                        postReplies={post.replies}
                        postId={id}
                        key={id}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>

            <CommentBox
              userId={userId}
              userComment={userComment}
              setUserComment={setUserComment}
              handleComment={handleComment}
              imgUrl={userData?.photoURL}
            />
          </div>
        </div>
      </div>

      <div className=" bg-gradient-to-l from-orange-400 to-rose-400  ">
        <p className="text-white text-2xl text-red-500 sm:my-2 my-5 text-center Aceh text-md">Related Publications</p>
        <div  className="flex  flex-wrap px-5 sm:p-5 my-20 sm:my-5 m-auto justify-center gap-5 sm:gap-2">
        {relatedPost?.map((post, index) => {
          return (
            <NavLink
              to={`/readmore/${post.id}`}
              onClick={() => handleReadMoreClick(post)}
              key={index}
              className=" p-5 sm:p-0 sm:px-5 m-auto flex  flex-col  transition duration-300 ease-in-out"
            >
              <div className="w-72  bg-white hover:bg-gray-100/50   rounded-xl p-2 shadow ">
                <div className="relative overflow-clip  h-40 sm:w-40">
                  <img
                    src={post.data.imgUrl}
                    height={200}
                    className="p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out m-auto "
                  />
                </div>
                <div className="px-5 sm:p-0">
                  <p className="badge bg-gray-100 p-4  top-5 text-gray-600  sm:hidden border-none ">
                    {post.data.category}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-red-300 border-b Aceh">
                    {post.data.timestamp?.toDate().toDateString()} at{" "}
                    {formatTime(post.data.timestamp?.toDate())}
                  </p>
                  <h2 className="Aceh text-xl py-2 text-black ">
                    {post.data.postTitle}
                  </h2>

                  <p className="h-14 text-gray-800 sm:hidden">
                    {excerpt(post.data.postDescription, 50)}
                  </p>
                  <span className="text-xl flex gap-5 ">
                    <FontAwesomeIcon
                      icon={faComment}
                      className="text-gray-500 my-auto "
                    />{" "}
                    {post.data.comments?.length}
                    <FontAwesomeIcon
                      icon={faThumbsUp}
                      className="text-gray-500 my-auto "
                    />{" "}
                    {post.data.likes?.length}
                    <FontAwesomeIcon
                      icon={faEye}
                      className="text-gray-500 my-auto "
                    />{" "}
                    {post.data.views ? post.data.views.length : 0}
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
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default ReadMore;
