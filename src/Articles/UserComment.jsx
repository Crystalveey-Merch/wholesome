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
  deleteComment,
  comment
}) => {
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userReply, setUserReply] = useState("");
  const [replies, setReplies] = useState([]);
const [showCommentBox, setShowCommentBox] =useState(false)
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  const commentClassName = isAuthUserComment ? " w-auto " : "w-auto ml-auto";

console.log(comment)
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileDocRef = doc(db, "users", authUser?.uid); // Assuming you have a "users" collection in Firebase
        const profileDocSnapshot = await getDoc(profileDocRef);
        setUserData(profileDocSnapshot.data());
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };
    // console.log(!profileData.photoURL);
    if (authUser?.uid) {
      fetchUserData();
    }
  }, [authUser?.uid, userData]);

  const replyId = `${authUser?.uid}-${Date.now()}`;

  const handleReply = async (e) => {
    e.preventDefault();
    // if (userReply.trim() === "") {
    //   return;
    // }

    const timestamp = Timestamp.now();
     const authUserId =  authUser?.uid

    const newReply = {
      createdAt: timestamp,
      authUserId,
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

  
  // eslint-disable-next-line react/prop-types
  // const [commentUserId] = comment.commentId.split('-');

  const deleteReply = async (reply) => {
    const [replyUserId] = reply.replyId.split('-');

    if (replyUserId === authUser?.uid) {
      const updatedReplies = replies.filter((r) => r.replyId !== reply.replyId);
      setReplies(updatedReplies);
      try {
        await updateDoc(doc(db, "posts", postId), {
          replies: updatedReplies,
        });
        toast.success("Reply deleted successfully");
      } catch (error) {
        console.error("Error deleting reply: ", error);
        toast.error("Error deleting reply", error);
      }
    }
  };

 
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
                      <div className="m-auto mx-2  flex ">
                        <FontAwesomeIcon
                          icon={faHeart}
                          className="text-gray-300 flex my-auto"
                        />
                        {commentLikes}
                        <span className="flex gap-2 pl-5 sm:p-2 cursor-pointer" onClick={() => setShowCommentBox(!showCommentBox)}>
                      
                      <p className="text-sky-500">Reply</p>
                    </span>
                    {authUser?.uid == comment.userId  && (
                              <span onClick={() => deleteComment(comment)} className="text-red-500 cursor-pointer">
                                Delete
                              </span>
                            )}
                      </div>
                    </div>
                    
                    <div className="ml-10">
                    <div className={`comment-box transition-height duration-300 ease-in-out ${showCommentBox ? 'h-20' : 'h-0'}`}>
                      <CommentBox
                        userId={authUser?.uid}
                        userComment={userReply}
                        setUserComment={setUserReply}
                        handleComment={handleReply}
                        imgUrl={userData?.photoURL}
                      />
                      </div>
                      {replies?.length > 0 &&
                        replies.map((reply) => (
                          <RepliesComment
                            reply={reply}
                            postId={postId}
                            userId={userId}
                            commentId={commentId}
                            key={reply.replyId}
                            authUser={authUser}
                            deleteReply={deleteReply}
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
