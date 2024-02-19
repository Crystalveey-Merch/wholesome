/* eslint-disable react/prop-types */
import React from "react";
import { useParams } from "react-router";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner.tsx";
import { Link as ScrollLink } from "react-scroll";

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
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice.js";
import { selectUsers } from "../Features/usersSlice.js";

const ReadMore = ({ posts }) => {
  const url = window.location.href;

  const { id } = useParams();
  // const [authUser, setAuthUser] = useState(null);
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
  const [claps, setClaps] = useState([]);

  const authUser = useSelector(selectUser);
  const users = useSelector(selectUsers);

  const userId = authUser?.id;

  const isAuthUserComment = (comment, authUserId) => {
    // Check if the comment's userId matches the authenticated user's ID
    return comment.userId === authUserId;
  };

  // console.log(claps);
  // console.log(likes)

  useEffect(() => {
    if (posts.length > 0) {
      const post = posts.find((post) => post.id === id);
      const comments = post.comments ? post.comments : [];
      const claps = comments.map((comment) =>
        comment.claps ? comment.claps : []
      );
      setComments(comments);
      setLikes(post.likes ? post.likes : []);
      setPost(post);
      setClaps(claps);
    }
  }, [id, posts]);

  useEffect(() => {
    if (users.length > 0) {
      const postAuthor = users.find((user) => user.id === post?.userId);
      setProfileData(postAuthor);
      setUserData(authUser);
    }
  }, [authUser, post?.userId, users]);

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
          } else {
            setIsBookmarked(false); // Document doesn't exist, so it's not bookmarked
          }
          const blogSnapshot = await getDoc(blogRef);
          if (blogSnapshot.exists()) {
            const blogData = blogSnapshot.data();
            // console.log(blogData);
            setBookmarkCount(blogData.count);
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
  const handleCommentLikesUpdate = async (e) => {};

  const commentId = `${userId}-${Date.now()}`;

  const handleComment = async (e) => {
    e.preventDefault();
    const timestamp = Timestamp.now();
    const newComment = {
      createdAt: timestamp,
      userId,
      commentId,
      name: userData?.name,
      body: userComment,
      imgUrl: userData?.photoURL,
      claps: [],
    };
    try {
      const updatedComments = [...post.comments, newComment];
      await updateDoc(doc(db, "posts", id), {
        comments: updatedComments,
      });
      setComments((prevComments) => [...prevComments, newComment]);
      setUserComment("");
      toast.success("Comment posted successfully");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again later.");
    }
  };
  const deleteComment = async (comment) => {
    const [commentId] = comment.commentId.split("-");
    if (commentId === authUser?.uid) {
      const updatedComments = comments.filter(
        (c) => c.commentId !== comment.commentId
      );
      setComments(updatedComments);
      try {
        await updateDoc(doc(db, "posts", id), {
          comments: updatedComments,
        });
        toast.success("comment deleted successfully");
      } catch (error) {
        console.error("Error deleting comment: ", error);
        toast.error("Error deleting comment", error);
      }
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

  const handleClaps = async () => {
    try {
      const postDocRef = doc(db, "posts", id);
      const postDoc = await getDoc(postDocRef);
      if (postDoc.exists()) {
        setClaps(claps + 1);

        const comments = postDoc.data().comments;
        const updatedComments = comments.map((comment) => {
          if (comment.commentId === commentId) {
            return {
              ...comment,
              claps: comment.claps + 1,
            };
          }
          return comment;
        });
        await updateDoc(postDocRef, { comments: updatedComments });
        toast.success("Clap added to comment");
      }
    } catch (error) {
      console.error("Error updating claps count:", error);
      toast.error("Failed to add clap to comment. Please try again later.");
    }
  };

  const handleClaps2 = async (commentId) => {
    if (userId) {
      try {
        const postRef = doc(db, "posts", id);
        const postDoc = await getDoc(postRef);
        if (postDoc.exists()) {
          const postData = postDoc.data();
          const comments = postData.comments ? [...postData.comments] : [];
          const commentIndex = comments.findIndex(
            (comment) => comment.commentId === commentId
          );
          if (commentIndex !== -1) {
            const updatedClaps = comments[commentIndex].claps
              ? [...comments[commentIndex].claps]
              : [];
            const userIndex = updatedClaps.indexOf(userId);
            if (userIndex === -1) {
              // User has not clapped, add their ID to claps
              updatedClaps.push(userId);
            } else {
              // User has already clapped, remove their ID from claps
              updatedClaps.splice(userIndex, 1);
            }
            // Update the claps array in Firestore
            comments[commentIndex].claps = updatedClaps;
            await updateDoc(postRef, { comments });
            // Update your component state with the updatedClaps array
            setClaps(updatedClaps);
            toast.success("Clap updated");
          }
        }
      } catch (error) {
        console.error("Error updating Claps:", error);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{post.postTitle}</title>
        <meta
          name="description"
          property="og:description"
          content={post.postDescription}
        />
        <meta name="keywords" content={post.tags.join(", ")} />
        <meta
          name="url"
          content={`https://wholesome.crystaleey.com/readmore/${id}`}
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="article" />
        <link
          rel="canonical"
          href={`http://wholesome.crystaleey.com/readmore/${id}`}
        />
        <meta property="og:title" content={post.postTitle} />
        <meta
          property="og:url"
          content={`https://wholesome.crystaleey.com/readmore/${id}`}
        />
        <meta property="og:image" content={post.imgUrl} />
        <meta name="og:description" content={post.postDescription} />
        <meta name="og:site_name" content="Wholesome" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content={`https://wholesome.crystaleey.com/readmore/${id}`}
        />
        <meta name="twitter:title" content={post.postTitle} />
        <meta name="twitter:description" content={post.postDescription} />
        <meta name="twitter:image" content={post.imgUrl} />
        <meta name="twitter:creator" content={profileData?.displayName} />
        <meta name="twitter:site" content="@wholesome" />
        <meta name="twitter:image:alt" content={post.postTitle} />
        <meta
          property="article:published_time"
          content={post.timestamp?.toDate()?.toDateString()}
        />
        <meta
          property="article:modified_time"
          content={post.timestamp?.toDate()?.toDateString()}
        />
        <meta property="article:section" content={post.category} />
        <meta property="article:tag" content={post.tags.join(", ")} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.postTitle} />
        <meta property="og:description" content={post.postDescription} />
        <meta
          property="og:url"
          content={`https://wholesome.crystaleey.com/readmore/${id}`}
        />
        <link
          rel="canonical"
          href={`https://wholesome.crystaleey.com/readmore/${id}`}
        />
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "${post.postTitle}",
            "image": "${post.imgUrl}",
            "genre": "${post.category}",
            "author": {
              "@type": "Person",
              "name": "${profileData?.displayName}"
              "url": "https://wholesome.crystaleey.com/profile/${profileId}"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Wholesome",
              "logo": {
                "@type": "ImageObject",
                "url": "https://wholesome.crystaleey.com/wholesome-logo.png"
              }
            },
            "datePublished": "${post.timestamp?.toDate()?.toDateString()}",
            "dateModified": "${post.timestamp?.toDate()?.toDateString()}",
            "description": "${post.postDescription}",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://wholesome.crystaleey.com/readmore/${id}"
            }
          }
          `}
          {/*  "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: `${post.postTitle}`,
            url: `https://wholesome.crystaleey.com/readmore/${id}`,

            image: `${post.imgUrl}`,
            author: {
              "@type": "Person",
              name: `${profileData?.displayName}`,
            },
            publisher: {
              "@type": "Organization",
              name: "Wholesome",
              logo: {
                "@type": "ImageObject",
                url: "",
              },
            },
            datePublished: `${post.timestamp?.toDate()?.toDateString()}`, */}
        </script>
      </Helmet>
      <span className="text-xl hidden sm:block  text-gray-100 p-1  rounded-full fixed top-60 right-0  bg-black/50 m-auto justify-center">
        <div className="flex flex-col gap-2   m-auto">
          <Like handleLike={handleLike} likes={likes} userId={userId} />
          <div>
            <ScrollLink
              to="comment" // the ID of the target section you want to scroll to
              smooth={true}
              duration={500} // the duration of the scroll animation in milliseconds
            >
              <FontAwesomeIcon icon={faComment} className="text-gray-100  " />{" "}
              {post.comments.length}{" "}
            </ScrollLink>
          </div>
        </div>
        <div className="flex-col flex gap-3 m-auto  text-2xl">
          <LinkedinShareButton url={url} title={post?.postTitle}>
            <FontAwesomeIcon
              icon={faLinkedin}
              className="fab fa-linkedin text-sky-500 "
            />
          </LinkedinShareButton>
          <FacebookShareButton url={url} title={post?.postTitle}>
            <FontAwesomeIcon
              icon={faFacebook}
              className="fab fa-facebook text-sky-500 "
            />
          </FacebookShareButton>
          <TwitterShareButton url={url} title={post?.postTitle}>
            <FontAwesomeIcon
              icon={faTwitter}
              className="fab fa-twitter text-sky-500 "
            />
          </TwitterShareButton>
          <WhatsappShareButton url={url} title={post?.postTitle}>
            <FontAwesomeIcon
              icon={faWhatsapp}
              className="fab fa-whatsapp text-green-500 "
            />
          </WhatsappShareButton>
          <span onClick={copyText} className="flex">
            <FontAwesomeIcon
              icon={faCopy}
              className="fas fa-link text-xl text-white m-auto"
            />
          </span>
        </div>
      </span>
      <div className="flex mt-32 w-screen sm:mr-2  py-10 px-30 sm:flex-col sm:px-5 dark:bg-gray-800 ">
        <div
          className="  px-40 lg:px-20 sm:px-0  sm:mt-30 flex flex-col m-auto justify-center"
          key={post.id}
        >
          <div className="badge bg-red-500 text-white sm:text-sm text-l Aceh p-4">
            {post.category}
          </div>

          <h1 className="text-black dark:text-white text-4xl sm:text-3xl py-5">
            {" "}
            {post.postTitle}
          </h1>

          <div className="m-auto">
            <img src={post.imgUrl} alt={post.postTitle} width={1000} />
          </div>
          <div className=" my-20 sm:mx-5 sm:my-10">
            <h1 className="text-red-500 text-xl">{post.date}</h1>
            <p className="mt-1 text-l sm:text-sm leading-5 text-red-400 Aceh pb-1">
              Posted on {post.timestamp?.toDate()?.toDateString()} at{" "}
              {formatTime(post.timestamp?.toDate())}
            </p>
            <p className="py-1 Aceh flex m-auto">
              <p className="my-auto">By</p>
              <img
                src={profileData?.photoURL}
                className="rounded-full h-8 w-8 my-auto mx-2 text-black"
              />{" "}
              {profileData?.name}
            </p>
            <p
              className="py-5 underline cursor-pointer  gap-2"
              onClick={handleAddBookmark}
            >
              Add to Bookmarks
              <FontAwesomeIcon
                icon={faBookmark}
                style={buttonStyle}
                className="  cursor-pointer "
              />{" "}
              ({bookmarkCount})
            </p>

            <span className="text-l  sm:hidden  flex text-gray-100 p-2 rounded-full sticky top-24  bg-black m-auto justify-center">
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
              className="dark:bg-gray-800 sm:mr-2"
              style={{ whiteSpace: "pre-wrap" }}
            />

            <ul>
              {Array.isArray(post.tags) ? (
                post.tags.map((tag, index) => (
                  <li
                    key={index}
                    className="badge bg-green-800 p-3 text-white Aceh my-2 mx-2 sm:mx-1"
                  >
                    {tag}
                  </li>
                ))
              ) : (
                <li>No tags available</li>
              )}
            </ul>
          </div>
          <div id="comment">
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
                    <div>
                      {comments?.map((comment) => (
                        <div key={comment.commentId}>
                          <UserComment
                            {...comment}
                            isAuthUserComment={isAuthUserComment(
                              comment,
                              userId
                            )}
                            postReplies={post.replies}
                            postId={id}
                            userId={userId}
                            deleteComment={deleteComment}
                            comment={comment}
                            handleClaps2={handleClaps2}
                            claps={claps}
                          />
                        </div>
                      ))}
                    </div>
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
            <div className="flex flex-col m-auto my-5 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400   rounded-xl p-5 ">
              <p>About Author</p>
              <div className="flex">
                <img
                  src={profileData?.photoURL}
                  className="rounded-full h-20 w-20 my-auto "
                />
                <div className="mx-5">
                  <h1 className="text-xl m-auto text-black ">
                    {" "}
                    {profileData?.name}
                  </h1>
                  <h1 className="text-sm text-gray-600 py-1 m-auto">
                    Bio: {profileData?.shortBio}
                  </h1>
                  <h1 className="text-sm text-gray-600 py-1 m-auto">
                    Email: {profileData?.email}
                  </h1>
                </div>
              </div>

              <NavLink to={`/profile/${profileId}`}>
                <button className="btn w-32 flex hover:bg-black m-auto my-2  bg-gradient-to-r from-orange-400 to-rose-400 text-white ">
                  View Profile
                </button>
              </NavLink>
            </div>
          </div>
        </div>

        <div className=" bg-white  dark:bg-gray-700    ">
          <p className="text-black text-xl sm:my-2 my-5  text-center Aceh text-md">
            Related Publications
          </p>
          <div className="flex  flex-wrap px-5 sm:p-5 my-10 sm:my-5 m-auto justify-center gap-5 sm:gap-2">
            {relatedPost?.map((post, index) => {
              return (
                <NavLink
                  to={`/readmore/${post.id}`}
                  onClick={() => handleReadMoreClick(post)}
                  key={index}
                  className=" p-5 sm:p-0 sm:px-5 m-auto flex  flex-col  transition duration-300 ease-in-out"
                >
                  <div className="w-72  bg-white hover:border rounded-lg hover:bg-gradient-to-l from-orange-400 to-rose-400  ">
                    <div className="relative overflow-clip  h-20 ">
                      <img
                        src={post.data.imgUrl}
                        height={200}
                        className="p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out "
                      />
                    </div>
                    <div className="px-5 sm:p-0">
                      {/* <p className="badge bg-gray-100 p-4  top-5 text-gray-600  sm:hidden border-none ">
                        {post.data.category}
                      </p> */}
                      <p className="mt-1 text-sm leading-5 text-red-300 border-b Aceh">
                        {post.data.timestamp?.toDate().toDateString()} at{" "}
                        {formatTime(post.data.timestamp?.toDate())}
                      </p>
                      <h2 className="Aceh text-l py-2 text-black ">
                        {excerpt(post.data.postTitle, 50)}
                      </h2>

                      <p className=" text-gray-500 ">
                        {excerpt(post.data.postDescription, 100)}
                      </p>
                      <span className="text-l flex gap-5 ">
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
    </>
  );
};

export default ReadMore;
