import { useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  faCalendar,
  faClock,
  faLocationPin,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase/auth.js";
import "add-to-calendar-button";
import { Helmet } from "react-helmet-async";
import Moment from "moment";
import { NavLink } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth,  } from "../firebase/auth.js";
import { toast } from "react-toastify";

const EventDes = () => {
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [isUserRegistered, setIsUserRegistered] = useState(false);

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
    const fetchProfileData = async () => {
      try {
        const profileDocRef = doc(db, "users", userId); // Assuming you have a "users" collection in Firebase
        const profileDocSnapshot = await getDoc(profileDocRef);
        setProfileData(profileDocSnapshot.data());
      } catch (error) {
        console.error("Error fetching profile data: ", error);
      }
    };
    // console.log(!profileData.photoURL);
    if (userId) {
      fetchProfileData();
    }
  }, [userId, profileData]);
  useEffect(() => {
    const fetchTotalAttendees = async () => {
      try {
        const eventDocRef = doc(db, "events", id);
        const eventDocSnapshot = await getDoc(eventDocRef);

        if (eventDocSnapshot.exists()) {
          const attendees = eventDocSnapshot.data()?.attendees || [];
          setTotalAttendees(attendees.length);
        }
      } catch (error) {
        console.error("Error fetching total attendees:", error);
      }
    };})
  
    useEffect(() => {
      const checkUserRegistration = async () => {
        try {
          if (authUser) {
            const eventDocRef = doc(db, "events", id);
            const eventDocSnapshot = await getDoc(eventDocRef);
  
            if (eventDocSnapshot.exists()) {
              const attendees = eventDocSnapshot.data()?.attendees || [];
              const isRegistered = attendees.some(attendee => attendee.userId === authUser.uid);
              setIsUserRegistered(isRegistered);
            }
          }
        } catch (error) {
          console.error("Error checking user registration:", error);
        }
      };
  
      checkUserRegistration();
    }, [id, authUser]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const docRef = doc(db, "events", id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          setEvent(docSnapshot.data());
        }

        // setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    const fetchOtherEventsInSameCategory = async () => {
      if (event && event.category) {
        try {
          const eventsRef = collection(db, "events");
          const querySnapshot = await getDocs(eventsRef);
          const otherEvents = [];

          querySnapshot.forEach((doc) => {
            const eventData = doc.data();
            eventData.id = doc.id;

            // Exclude the current event by checking its ID
            if (eventData.id !== id && eventData.category === event.category) {
              otherEvents.push(eventData);
            }
          });

          setRelatedEvents(otherEvents);
        } catch (error) {
          console.error(
            "Error fetching other events in the same category:",
            error
          );
        }
      }
    };
    fetchPosts();
    fetchOtherEventsInSameCategory();
  }, [id, event, relatedEvents]);

  if (!event) {
    return <div>Event not found.</div>;
  }

  const startDateTimeString = event.StartDateTime;
  const endDateTimeString = event.EndDateTime;

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


  const handleAttend = async () => {
    try {
      // Check if the user is authenticated
      if (authUser) {
        // Update the event document with the attendee's information
        const eventDocRef = doc(db, "events", id);
  
        // Use arrayUnion to add the attendee's ID to the 'attendees' field
        await updateDoc(eventDocRef, {
          attendees: arrayUnion({
            userId: authUser.uid,
            userName: profileData.name,
          }),
        });
        toast.success('Registration Succesful')
        console.log("Attendee added successfully!");
      } else {
        console.log("User not authenticated");
        toast.error('Login to Attend Event ')
      }
    } catch (error) {
      console.error("Error attending event:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>{event.eventName}</title>
        <meta name="description" content={event.eventDescription} />
        <link
          rel="canonical"
          href={`https://wholesome.crystaleey.com/upcomingevents/${id}`}
        />
        <meta name="keywords" content={event.tags.join(", ")} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={event.eventName} />
        <meta
          property="og:url"
          content={`https://wholesome.crystaleey.com/upcomingevents/${id}`}
        />
        {/* <meta property="og:image" content={posts} /> */}
        <meta name="og:description" content={event.eventDescription} />
        <meta name="og:site_name" content="Wholesome" />
        <meta name="og:image" content={event.imgUrl} />

        <meta name="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content={`https://wholesome.crystaleey.com/upcomingevents/${id}`}
        />
        <meta name="twitter:title" content="Host an Event" />
        <meta name="twitter:description" content={event.eventDescription} />
        <meta name="twitter:image" content={event.imgUrl} />

        <script
          type="application/ld+json"
          {...JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: `${event.eventName}`,
            description: ` ${event.eventDescription}`,
            image: `${event.imgUrl}`,
            startDate: ` ${startDateTime.date}`,
            endDate: `${endDateTime.time}`,

            headline: "Host an Event",
            url: `https://wholesome.crystaleey.com/upcomingevents/${id}`,
            location: {
              "@type": "Place",
              name: "Event Venue",
              address: `${event.address}`,
            },
            organizer: {
              "@type": "Organization",
              name: `${event.organizerName}`,
              website: `${event.website}`,
            },
          })}
        />
      </Helmet>
      <div className="pt-40  sm:pt-10 sm:mt-18 flex sm:flex-col gap-10  m-auto justify-center bg-stone-100 w-screen">
        <div className=" w-1/2 sm:w-full">
          <div className="m-auto sm:w-full ">
            <img src={event.imgUrl} alt={event.eventName} />
          </div>

          <div className="mx-10 my-20 sm:mx-5 sm:my-10">
            <span className="py-20 relative flex gap-10">
              <add-to-calendar-button
                name={event.eventName}
                startDate={startDateTime.date}
                options="'Apple','Google','iCal'"
                startTime={startDateTime.time}
                endTime={endDateTime.time}
                timeZone="GMT"
                location={event.address}
                buttonStyle="date"
                size="5"
                lightMode="bodyScheme"
              ></add-to-calendar-button>
              <p> {totalAttendees} Attending</p>
              {isUserRegistered ? <div className="btn bg-green-600 text-white">
              <p>Already Registered</p>
              
              </div>:<div className="btn bg-rose-900 text-white" onClick={handleAttend}>
              <p>Attend</p>
              
              </div>}
              
              <p>{isUserRegistered ? 'Already Registered' : 'Attend'}</p>

            </span>
            <h1 className="text-red-500 text-xl mt-4 ">
              {/* {dateTime.toDateString()} */}
            </h1>
            <h1 className="text-black text-4xl"> {event.eventName}</h1>
            <p className="text-green-500 text-xl ">{event.theme}</p>
            <p className="text-gray-600 py-5 text-xl">
              {event.eventDescription}
            </p>

            <h1 className="text-gray-800 text-2xl py-4">Date and Time</h1>
            <p className="text-gray-500 text-xl flex gap-4">
              <FontAwesomeIcon icon={faCalendar} />
              {Moment(event.StartDateTime).format("DD-MM-YYYY")} -{" "}
              {Moment(event.EndDateTime).format("DD-MM-YYYY")}
            </p>
            <p className="text-gray-500 text-xl flex gap-4">
              <FontAwesomeIcon icon={faClock} />
              {Moment(event.StartDateTime).format("H:MM a")}-{" "}
              {Moment(event.EndDateTime).format("H:MM a")}
            </p>

            <h1 className="text-gray-800 text-2xl py-4">Location</h1>
            <p className="text-gray-500 text-xl">
              <FontAwesomeIcon icon={faLocationPin} /> {event.address}
            </p>
            <h1 className="text-gray-800 text-2xl py-4">Tags</h1>
            <div className="flex flex-wrap gap-5">
              {event.tags.map((tag) => {
                return (
                  <h1
                    key={tag.id}
                    className="badge p-5 bg-red-500 text-white border-none"
                  >
                    #{tag}
                  </h1>
                );
              })}
            </div>
            <div className="rounded-xl border shadow bg-gray-200 p-5 my-5">
              <h1 className="text-gray-800 text-2xl py-4">Organizer</h1>
              <p className="text-xl">{event.organizerName}</p>
              <a href={`http://${event.website}`}>
                <p className="text-xl">{event.website}</p>
              </a>
            </div>
          </div>
        </div>
        <div className="w-1/4 sm:w-full h-screen bg-sky-100">
          {relatedEvents.length > 0 && (
            <div className="">
              <h3 className="text-red-500 text-2xl text-center p-10 Aceh">
                Related Events
              </h3>
              <ul className="p-5 ">
                {relatedEvents.map((related) => (
                  <NavLink
                    to={`/upcomingevents/${related.id}`}
                    className=""
                    key={related.id}
                  >
                    <li
                      key={related.id}
                      className="border bg-sky-600 rounded-2xl w-72 m-auto shadow  cursor-pointer "
                    >
                    <div >
                      <img
                        src={related.imgUrl}
                        alt={related.eventName}
                        className=""
                      /></div>
                      <h3 className="text-xl text-white Aceh p-5">
                        {related.eventName}
                      </h3>
                      <p className="text-gray-200 text-xl p-3">
                        <FontAwesomeIcon icon={faLocationPin} /> {event.address}
                      </p>
                      <p className="text-gray-100 text-xl flex gap-4 m-2">
                        <FontAwesomeIcon icon={faCalendar} />
                        {Moment(related.StartDateTime).format(
                          "DD-MM-YYYY"
                        )} - {Moment(related.EndDateTime).format("DD-MM-YYYY")}
                      </p>
                      <p className="text-gray-100 text-xl flex gap-4 m-2">
                        <FontAwesomeIcon icon={faClock} />
                        {Moment(related.StartDateTime).format("HH:MM a")}-{" "}
                        {Moment(related.EndDateTime).format("HH:MM a")}
                      </p>
                    </li>
                  </NavLink>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventDes;
