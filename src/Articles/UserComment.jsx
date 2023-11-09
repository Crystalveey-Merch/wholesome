
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

const UserComment = ({ name, body, createdAt, msg, isAuthUserComment, imgUrl, commentLikes, id }) => {
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userReply, setUserReply] = useState("");

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  const commentClassName = isAuthUserComment ? " w-auto " : "w-auto ml-auto";
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
  


  const handleReply = async (e) => {
    e.preventDefault();

    const timestamp = Timestamp.now();

    const newReply = {
      createdAt: timestamp,
      userId,
      name: userData?.displayName,
      body: userReply,
      imgUrl: userData?.photoURL,
      replies:[]
    };}
console.log(id)
    // Create a copy of the existing comments array and add the new comment
   

  return (
    <div>
      <div className="row w-auto ">
        <div className="col-lg-12">
          <div className="comments-list">
            <div className="media dark:text-red-300">
              {msg ? (
                <h4 className="mt-5 text-red-300 text-xl  text-center">{msg}</h4>
              ) : (
                <>
                    <div className=" flex  ml-14 w-full ">

                      <div className="chat-header text-sky-500 flex gap-2 Aceh  my-auto">
                        {name}{" "}
                        <time className="text-sm opacity-50 text-red-500 flex gap-4">{createdAt.toDate().toDateString()}

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
                      <div className= "chat chat-start  w-full ">
                        <div className=" w-full ">
                          <div className= "chat-bubble text-white  Aceh bg-sky-800 flex gap-6  sm:gap-4 my-auto w-fit ">
                            <span className="text-green-400  text-sm   ">
                              {formatTime(createdAt.toDate())}
                            </span>
                            {body}

                           
                          </div>

                          
                        
                        </div>
                        
                      </div>
                      <div className="m-auto mx-2">
                            <FontAwesomeIcon icon={faHeart} className="text-gray-300 flex my-auto" />
                            {commentLikes}
                          </div>
                      </div>
                      <span className="flex gap-2 pl-5 sm:p-2">
                          <FontAwesomeIcon icon={faReply} className="text-sky-500"></FontAwesomeIcon>
                          <p className="text-sky-500">Reply</p>
                          </span>
                          <div className="ml-20">
                          <CommentBox
                            userId ={userId}
                            userComment
                            setUserComment={setUserReply}
                            handleComment={handleReply}
                            imgUrl ={userData?.photoURL}
                          />
                          <RepliesComment
                            name
                            body
                            createdAt
                            msg
                            isAuthUserComment
                            imgUrl
                            commentLikes

                          />
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
