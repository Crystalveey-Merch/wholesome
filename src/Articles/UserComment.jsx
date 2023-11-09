import { faHeart, faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import RepliesComment from "./RepliesComment";
import CommentBox from "./CommentBox";
import {
  updateDoc,
  serverTimestamp,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/auth.js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserComment = ({
  name,
  body,
  createdAt,
  msg,
  isAuthUserComment,
  imgUrl,
  commentLikes,
  commentId,
  id,
  postReplies,
  postId,
  userId,
}) => {
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userReply, setUserReply] = useState("");
  const [replies, setReplies] = useState([]);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  const commentClassName = isAuthUserComment ? " w-auto " : "w-auto ml-auto";

  console.log(commentId);
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
  console.log(id, "id");

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

  const replyId = `${userId}-${Date.now()}`;

  const handleReply = async (e) => {
    e.preventDefault();
    // if (userReply.trim() === "") {
    //   return;
    // }

    const timestamp = Timestamp.now();

    const newReply = {
      createdAt: timestamp,
      userId,
      name: userData?.displayName,
      body: userReply,
      imgUrl: userData?.photoURL,
      replyingTo: commentId,
      replyId,
    };

    const updatedReplies = [...replies, newReply];
    setReplies(updatedReplies);

    try {
      await updateDoc(doc(db, "posts", postId), {
        replies: updatedReplies,
      });
      setUserReply("");
      toast.success("Reply added successfully");
    } catch (error) {
      console.error("Error adding reply: ", error);
      toast.error("Error adding reply", error);
    }
  };

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const postDocRef = doc(db, "posts", postId);
        const postDocSnapshot = await getDoc(postDocRef);
        //get the replies that their replyingTo match the commentId
        const replies = postDocSnapshot.data().replies.filter((reply) => {
          return reply.replyingTo === commentId;
        });
        setReplies(replies);
      } catch (error) {
        console.error("Error fetching replies: ", error);
      }
    };
    fetchReplies();
  }, [postId, commentId]);

  // const handleReply = async (e) => {
  //   e.preventDefault();

  //  ;}
  // console.log(id)
  // Create a copy of the existing comments array and add the new comment

  return (
    <div>
      <div className="row w-auto ">
        <div className="col-lg-12">
          <div className="comments-list">
            <div className="media dark:text-red-300">
              {msg ? (
                <h4 className="mt-5 text-red-300 text-xl  text-center">
                  {msg}
                </h4>
              ) : (
                <>
                  <div className=" flex  ml-14 w-full ">
                    <div className="chat-header text-sky-500 flex gap-2 Aceh  my-auto">
                      {name}{" "}
                      <time className="text-sm opacity-50 text-red-500 flex gap-4">
                        {createdAt.toDate().toDateString()}
                      </time>
                    </div>
                  </div>

                  <div className=" flex flex-col gap-2 w-full ">
                    <div className="flex gap-5 ">
                      <div className="rounded-full overflow-hidden w-10 h-10">
                        <img
                          src={imgUrl}
                          alt="user"
                          className=" m-auto"
                          // width={30}
                          // height={30}
                        />
                      </div>
                      <div className="chat chat-start  w-full ">
                        <div className=" w-full ">
                          <div className="chat-bubble text-white  Aceh bg-sky-800 flex gap-6  sm:gap-4 my-auto w-fit ">
                            <span className="text-green-400  text-sm   ">
                              {formatTime(createdAt.toDate())}
                            </span>
                            {body}
                          </div>
                        </div>
                      </div>
                      <div className="m-auto mx-2">
                        <FontAwesomeIcon
                          icon={faHeart}
                          className="text-gray-300 flex my-auto"
                        />
                        {commentLikes}
                      </div>
                    </div>
                    <span className="flex gap-2 pl-5 sm:p-2">
                      <FontAwesomeIcon
                        icon={faReply}
                        className="text-sky-500"
                      ></FontAwesomeIcon>
                      <p className="text-sky-500">Reply</p>
                    </span>
                    <div className="ml-20">
                      <CommentBox
                        userId={userId}
                        userComment={userReply}
                        setUserComment={setUserReply}
                        handleComment={handleReply}
                        imgUrl={userData?.photoURL}
                      />
                      {replies?.length > 0 &&
                        replies.map((reply) => (
                          <RepliesComment
                            reply={reply}
                            postId={postId}
                            userId={userId}
                            commentId={commentId}
                            key={reply.replyId}
                          />
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserComment;
