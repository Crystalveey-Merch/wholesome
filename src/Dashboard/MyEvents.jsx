import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/auth.js";
import Spinner from "../components/Spinner.tsx";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendar,
  faClock,
  faComment,
  faEye,
  faLocationPin,
  faPen,
  faThumbsUp,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
const MyEvents = () => {
    const [userPosts, setUserPosts] = useState([]);
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

    useEffect(() => {
        const getUserPosts = async () => {
          setLoading(true);
          try {
            const blogRef = collection(db, "events");
            const userBlogQuery = query(blogRef, where("userId", "==", user));
            const docSnapshot = await getDocs(userBlogQuery);
            const userPosts = [];
            docSnapshot.forEach((doc) => {
              userPosts.push({ id: doc.id, ...doc.data() });
            });
            console.log(docSnapshot);
            setUserPosts(userPosts);
            if (userPosts.length > 0) {
              setPostId(userPosts[0].id); // Set the ID of the first post
            }
          } catch (error) {
            console.error("Error fetching user events:", error);
          }
          setLoading(false);
        };
        if (user) {
          getUserPosts();
        }
      }, [user]);

      if (loading) {
        return <Spinner />;
      }

      const handleDelete = async () => {
        if (window.confirm("Are you sure wanted to delete that Post ?")) {
          try {
            // setLoading(true);
            await deleteDoc(doc(db, "events", postId));
            toast.success("Post deleted successfully");
            // setLoading(false);
          } catch (err) {
            console.log(err);
          }
        }
      };
    console.log(userPosts)

      const startDateTimeString = userPosts.StartDateTime;
      const endDateTimeString = userPosts.EndDateTime;
      
      const separateDateTime = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        
        // Extract the date components
        const year = dateTime.getFullYear(); // Extract the year
        const month = (dateTime.getMonth() + 1).toString().padStart(2, "0"); // Extract the month (add 1 because months are zero-based)
        const day = dateTime.getDate().toString().padStart(2, "0"); // Extract the day
      
        // Extract the time components
        const hours = dateTime.getHours().toString().padStart(2, "0"); // Extract the hours
        const minutes = dateTime.getMinutes().toString().padStart(2, "0"); // Extract the minutes
      
        return {
          date: `${year}-${month}-${day}`,
          time: `${hours}:${minutes}`,
        };
      };
      const startDateTime = separateDateTime(startDateTimeString);
      const endDateTime = separateDateTime(endDateTimeString);
    
  return (
    <div>
    <Helmet>
            <title>My Events</title>
            <meta
                name="description"
                content="list of your uploaded events" />
            <link rel=" canonical" href="/dashboard/events" />
        </Helmet>
        <div className=" w-full  ">
      {authUser ? (
        <div>
          <div
            className="  align-center  shadow-xl font-bold m-auto  border "
            style={{
              height: "auto",
            }}
          >
            <div className=" text-left  p-5 mb-4 text-2xl text-base-800 font-bold ">
              My Events
            </div>
            <ul className=" flex flex-col gap-4 m-5  ">
              {userPosts?.map((item) => (
                <li
                  className=" my-2   rounded-lg  p-4 hover:bg-gray-100 "
                  key={item.id}
                >
                  <NavLink
                    to={`/upcomingevents/${item.id}`}
                    className="   m-auto "
                  >
                    <div className=" " key={item.id}>
                      {/* </div> */}
                      <div className=" flex w-full dis_block space-x-5 align-center text-left ">
                        <div>
                          {" "}
                          <h1 className="font-bold text-left text-black text-xl">
                            {item.eventName}
                          </h1>
                         
                          {/* <p className="text-gray-300">{excerpt(postDescription, 120)}</p> */}
                          <div className="flex gap-4">
                            <span className="text-gray-500 flex gap-2">
                            <FontAwesomeIcon icon={faLocationPin} /> {item.address}

                            </span>
                            <span className="text-gray-500  flex gap-2">
                            {/* <FontAwesomeIcon icon={faCalendar} />  {separateDateTime(item.StartDateTime)} */}

                            </span>
                            <span className="text-gray-500 flex gap-2">
                            {/* <FontAwesomeIcon icon={faClock} /> {startDateTime.time} - {endDateTime.time} */}

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
                                    <p>Delete</p>
                                  </span>
                                  {/* <span className="">
                                    <NavLink
                                      to={`/editpost/${item.id}`}
                                      className="text-cyan-400"
                                    >
                                      <p>Edit</p>
                                    </NavLink>
                                  </span> */}
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
        "You have not Made any Post"
      )}
    </div>
    </div>
  )
}

export default MyEvents