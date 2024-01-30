import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faLocationPin,
  faHands,
  faTag,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/auth.js";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";

const Activity = () => {
  const [activity, setActivity] = useState("");
  const [relatedActivity, setRelatedActivity] = useState("");
  const [authUser, setAuthUser] = useState(null);

  const [claps, setClaps] = useState(0);
  const { id } = useParams();

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
    const fetchActivity = async () => {
      try {
        const docRef = doc(db, "activities", id);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const activityData = docSnapshot.data();
          setActivity({ ...activityData, id: docSnapshot.id });
        } else {
          console.error(`Activity with id '${id}' not found.`);
          // Handle the case where the activity is not found, e.g., display a 404 page.
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };

    const fetchOtherEventsInSameCategory = async () => {
      if (activity && activity.category) {
        try {
          const eventsRef = collection(db, "activities");
          const querySnapshot = await getDocs(eventsRef);
          const otherActivity = [];

          querySnapshot.forEach((doc) => {
            const eventData = doc.data();
            // Exclude the current event by checking its ID
            if (eventData.id !== id && eventData.category === event.category) {
              otherActivity.push(eventData);
            }
          });

          setRelatedActivity(otherActivity);
        } catch (error) {
          console.error(
            "Error fetching other events in the same category:",
            error
          );
        }
      }
    };
    fetchActivity();
    fetchOtherEventsInSameCategory;
  }, [activity, id]);

  useEffect(() => {
    const fetchClapCount = async () => {
      try {
        const postDocRef = doc(db, "activities", id);
        const postDoc = await getDoc(postDocRef);
        if (postDoc.exists()) {
          const clapCount = postDoc.data().claps;
          setClaps(clapCount);

          return clapCount;
        } else {
          console.log("Activity not found");
          return 0;
        }
      } catch (error) {
        console.error("Error fetching clap count:", error);
        return 0;
      }
    };
    fetchClapCount();
  });
  if (!activity) {
    return <div>Event not found.</div>;
  }

  const handleClaps = async (id) => {
    try {
      // Fetch the specific post based on postId
      const postDocRef = doc(db, "activities", id);
      const postDoc = await getDoc(postDocRef);
      if (postDoc.exists()) {
        let updatedClaps;
        setClaps((prevClaps) => prevClaps + 1);

        if (userId) {
          // If userId exists, add 1 to the claps count
          updatedClaps = postDoc.data().claps + 1;
        } else {
          // If userId doesn't exist, set the claps count to 0
          updatedClaps = 0;
        }
        await updateDoc(postDocRef, { claps: updatedClaps });
        toast.success("You gave a clap"); // Update the useState value
      }
    } catch (error) {
      console.error("Error updating activity document:", error);
    }
  };

  const formatTime = (date) => {
    if (date instanceof Date) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
    return ""; // Return an empty string if date is not a valid Date object
  };
  const formatDate = (date) => {
    if (date instanceof Date) {
      return date.toLocaleDateString("en-US");
    }
    return ""; // Return an empty string if date is not a valid Date object
  };

  return (
    <div className="mt-20 sm:mt-18  m-auto justify-center  w-screen">
      <div>
        <h1 className="bg-gradient-to-r from-teal-200 to-lime-200 text-center p-10 text-3xl sm:text-2xl text-black">
          Community Activity
        </h1>
      </div>
      <div className="flex sm:flex-col m-auto justify-center  px-32 sm:px-0">
        <div className=" sm:w-full">
          <div className="  m-auto">
            <div className="badge  m-2 text-lg bg-green-600 text-white">
              {activity.category}
            </div>
            <div className="m-auto sm:w-full py-5 flex">
              <img src={activity.imgUrl} alt={activity.name} width={700} className="m-auto" />
            </div>
          </div>
          <div className="mx-20 my-10 sm:mx-5 sm:my-10">
            <div className="flex text-xl gap-2">
              <FontAwesomeIcon icon={faMoneyBill} className="text-red-600" />{" "}
              <p className="Aceh text-red-600 my-auto">N{activity.fee}</p>
            </div>
            <h1 className="text-black text-3xl sm:flex-col py-5 flex m-auto">
              {" "}
              {activity.activityName}{" "}
              <div className="flex m-auto gap-2 ">
                <FontAwesomeIcon
                  onClick={() => handleClaps(activity.id)}
                  icon={faHands}
                  className="border p-4 text-violet-700 rounded-full text-xl hover:scale-110  hover:text-black active:scale-100 active:text-red-500 cursor-pointer"
                />
                <p className="my-auto text-gray-800 text-lg"> {claps} Claps</p>
              </div>
            </h1>
            <p className="text-gray-500 text-xl ">{activity.theme}</p>

            <p className="text-gray-500 py-4 text-lg">
              <FontAwesomeIcon icon={faLocationPin} /> {activity.location}
            </p>
            <p className="text-gray-500 py-4 flex gap-2 text-lg">
              <FontAwesomeIcon icon={faCalendar} />{" "}
              {formatDate(
                activity.DateTime instanceof Date
                  ? activity.DateTime
                  : new Date(activity.DateTime)
              )}
              <p>
                at{" "}
                {formatTime(
                  activity.DateTime instanceof Date
                    ? activity.DateTime
                    : new Date(activity.DateTime)
                )}
              </p>
            </p>
            {activity.exploreLink && (
              <Link to={activity.exploreLink}>
                <button className="btn text-white border-0 bg-red-600 Aceh">
                  Make Payment
                </button>
              </Link>
            )}
            <p className="text-gray-600 py-5 text-xl">{activity.writeup}</p>
          </div>
        </div>
        <div className="w-96 sm:w-full h-screen bg-sky-200">
          <p className="text-center Aceh  text-xl p-5 text-black">
            Related Events
          </p>
          {relatedActivity.length > 0 && (
            <div>
              <h3 className="text-red-500 text-2xl text-center p-10 Aceh">
                Related Events
              </h3>
              <ul className="p-5">
                {relatedActivity.map((related) => (
                  <li
                    key={related.id}
                    className="border bg-sky-600 rounded-2xl w-72 m-auto  "
                  >
                    <img
                      src={related.imgUrl}
                      alt={related.activityName}
                      className=""
                    />
                    <h3 className="text-xl text-white Aceh p-5">
                      {related.activityName}
                    </h3>
                    <p className="text-gray-100 text-xl">
                      <FontAwesomeIcon icon={faClock} /> {related.DateTime}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activity;
