import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/auth.js";
import Spinner from "../components/Spinner.tsx";
import {
  addDoc,
  collection,
  DocumentSnapshot,
  endAt,
  endBefore,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  Timestamp,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faEye,
  faPen,
  faThumbsUp,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
export const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [postId, setPostId] = useState([]);

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
  const user = authUser?.uid;
  console.log(user);

  useEffect(() => {
    const getBookmarks = async () => {
      setLoading(true);
      try {
        const bookmarkDocRef = doc(db, "bookmarks", user);
        const bookmarkDocSnapshot = await getDoc(bookmarkDocRef);
        const bookmarksData = bookmarkDocSnapshot.data();
        if (bookmarksData) {
          const bookmarkList = Object.keys(bookmarksData).map((bookmarkId) => {
            setPostId(bookmarkId);

            return {
              id: bookmarkId,
              ...bookmarksData[bookmarkId],
            };
          });
          setBookmarks(bookmarkList);
        } else {
          setBookmarks([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookmarks: ", error);
      }

      // setLoading(false);
    };
    if (user) {
      getBookmarks();
    }
  }, [user]);
  console.log(bookmarks.id);
  console.log(postId);

  if (loading) {
    return <Spinner />;
  }
  const handleReadMoreClick = async () => {
    if (user) {
      try {
        // Fetch the specific post based on postId
        const postDocRef = doc(db, "posts", postId);
        const postDoc = await getDoc(postDocRef);

        if (postDoc.exists()) {
          // Update the Firestore document with the user's ID
          const updatedViewers = [...postDoc.data().views, user];
          await updateDoc(postDocRef, { views: updatedViewers });
        }
      } catch (error) {
        console.error("Error updating post document:", error);
      }
    }
  };
  const handleDelete = async () => {
    try {
      // setLoading(true);
      await deleteDoc(doc(db, "bookmarks", postId));
      toast.success("Post deleted successfully");
      // setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className=" w-full  ">
      <Helmet>
        <title>My Bookmarks</title>
        <meta name="description" content="Your Bookmarks " />
        <link rel="canonical" href="/dashboard/settings" />
      </Helmet>
      {authUser ? (
        <div>
          <div
            className="    shadow-xl font-bold   border "
            style={{
              height: "h-full",
            }}
          >
            <div className=" text-left  p-5 mb-4 text-2xl text-base-800 font-bold ">
              My Bookmarks
            </div>
            <ul className=" flex flex-col gap-4 m-5  ">
              {bookmarks?.map((item) => (
                <li
                  className=" my-2   rounded-lg  p-4 hover:bg-gray-100 "
                  key={item.id}
                >
                  <NavLink
                    to={`/readmore/${item.id}`}
                    className="   m-auto "
                    onClick={handleReadMoreClick}
                  >
                    <div className=" " key={item.id}>
                      {/* </div> */}
                      <div className=" flex w-full dis_block space-x-5 align-center text-left ">
                        <div>
                          {" "}
                          <h1 className="font-bold text-left text-black text-xl">
                            {item.postTitle}
                          </h1>
                          <p className="mt-1 text-sm leading-5 text-red-500 Aceh pb-5">
                            Posted on {item.timestamp?.toDate()?.toDateString()}{" "}
                            at {formatTime(item.timestamp?.toDate())}
                          </p>
                          {/* <p className="text-gray-300">{excerpt(postDescription, 120)}</p> */}
                          <div className="flex gap-4">
                            <span className="text-gray-500 flex gap-2">
                              <FontAwesomeIcon icon={faComment} />
                              {item.comments?.length}
                            </span>
                            <span className="text-gray-500  flex gap-2">
                              <FontAwesomeIcon icon={faThumbsUp} />
                              {item.likes?.length}
                            </span>
                            <span className="text-gray-500 flex gap-2">
                              <FontAwesomeIcon icon={faEye} />
                              {item.views.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                  <div className="card-actions py-5 relative">
                    {authUser && authUser.uid === user && (
                      <>
                        <span
                          style={{}}
                          className="  gap-5 flex absolute z-10  rounded-full "
                        >
                          <span
                            onClick={() => handleDelete()}
                            className="  cursor-pointer text-red-500"
                          >
                            <p>Remove</p>
                          </span>
                          <span className=""></span>
                        </span>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-black text-2xl text-center">
            No Bookmarks yet, click{" "}
            <NavLink to="/feed" className="cursor-pointer  text-sky-500">
              {" "}
              <span>here</span>
            </NavLink>{" "}
            to read and bookmark your favourite articles
          </p>
        </div>
      )}
    </div>
  );
};
