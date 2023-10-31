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
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/auth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MDEditor from "@uiw/react-md-editor";
import { faComment, faCopy, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Like from "./Like.tsx";
import UserComment from "./UserComment.tsx";
import CommentBox from "./CommentBox.tsx";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { faFacebook, faLinkedin, faTwitter, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

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


  const [userComment, setUserComment] = useState("");

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
  }, [userId, userData,]);


  useEffect(() => {
    const fetchSelectedPost = async () => {
      try {
        const docRef = doc(db, "posts", id); // Replace "posts" with your collection name
        const docSnapshot = await getDoc(docRef);

        setComments(docSnapshot.data().comments ? docSnapshot.data().comments : []);
        setLikes(docSnapshot.data().likes ? docSnapshot.data().likes : []);
        setCommentLikes(docSnapshot.data().comments ? docSnapshot.data().comments.commentLikes : [])

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

  if (!post) {
    return <Spinner />;
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
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
 const handleCommentLikesUpdate  = async (e) => {

  }
  const handleComment = async (e) => {
    e.preventDefault();

    const timestamp = Timestamp.now();

    const newComment = {
      createdAt: timestamp,
      userId,
      name: userData?.displayName,
      body: userComment,
      imgUrl: userData?.photoURL,
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
  return (
    <div>
      <div className="mt-40 mx-40 sm:mx-5 sm:mt-30 flex flex-col m-auto justify-center">
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
          <p className="mt-1 text-xl leading-5 text-red-500 Aceh pb-5">
            Posted on {post.timestamp?.toDate()?.toDateString()} at{" "}
            {formatTime(post.timestamp?.toDate())}
          </p>
          <span className="text-xl flex gap-5 pb-5">
            <Like handleLike={handleLike} likes={likes} userId={userId} />
            <FontAwesomeIcon
              icon={faComment}
              className="text-gray-300  "
            />{" "}
            {post.comments.length}

            <div className="flex gap-3 m-auto">
                  <span>Share:</span>
                  <LinkedinShareButton url={url} title={post?.postTitle}>
                    <FontAwesomeIcon icon={faLinkedin} className="fab fa-linkedin text-sky-500 text-xl" />
                  </LinkedinShareButton>
                  <FacebookShareButton url={url} title={post?.postTitle}>
                    <FontAwesomeIcon icon={faFacebook} className="fab fa-facebook text-sky-500 text-xl" />
                  </FacebookShareButton>
                  <TwitterShareButton url={url} title={post?.postTitle}>
                    <FontAwesomeIcon icon={faTwitter} className="fab fa-twitter text-sky-500 text-xl" />
                  </TwitterShareButton>
                  <WhatsappShareButton url={url} title={post?.postTitle}>
                    <FontAwesomeIcon icon={faWhatsapp} className="fab fa-whatsapp text-green-500 text-xl" />
                  </WhatsappShareButton>
                  <span onClick={copyText}>
                    <FontAwesomeIcon icon={faCopy} className="fas fa-link text-xl" />
                  </span>
                </div>
          </span>
          <hr></hr>
          <p className="text-green-500 text-xl ">{post.theme}</p>
          <p className="text-red-500 py-5">{post.author}</p>

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
        <div className="flex flex-col m-auto">
        <img src={ profileData?.photoURL} className="rounded-full h-20 w-20 m-auto"/>
        <h1 className="text-xl m-auto" > Author:  {profileData?.displayName}</h1>
        <h1 className="text-xl m-auto" > Author:  {profileData?.bio}</h1>

        
        </div>
          <div className=" bg-white border rounded-xl text-base-200 p-5 mob_width">
            <div className="scroll">
              <h4 className="small-title Aceh text-red-500">
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
                        isAuthUserComment={isAuthUserComment(
                          comment,
                          // authUser.Id
                        )}
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
    </div>
  );
};

export default ReadMore;
