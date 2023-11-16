import { NavLink } from "react-router-dom";
import { useParams } from "react-router";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import {
  addDoc,
  collection,
  DocumentSnapshot,
  endAt,
  endBefore,
  getDocs,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  deleteField,
  where,
  increment,
} from "firebase/firestore";
import {
  faAngleDown,
  faAnglesDown,
  faBible,
  faCalendar,
  faComputer,
  faFirstAid,
  faGamepad,
  faHockeyPuck,
  faHorse,
  faMicrophone,
  faMicrophoneAlt,

  faMoneyBillTrendUp,
  faMusic,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { auth, db } from "../firebase/auth.js";
import Spinner from "../components/Spinner";
import { Helmet } from "react-helmet-async";

const EventList = () => {
  const { eventName } = useParams();
  const [searchInput, setSearchInput] = useState("");
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const postData = [];
        querySnapshot.forEach((doc) => {
          // Extract the data from each document
          const event = doc.data();
          event.id = doc.id;
          setEventId(event.id);

          postData.push(event);
        });

        setEvents(postData);
        setFilteredEvents(postData);

       
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setEvents([]);
      }
    };

    fetchPosts();
  }, []);
  console.log(events)

  if (loading) {
    return <Spinner />;
  }

  const collectionProduct = () => {
    return events.filter((event) => event.name === eventName);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    const searchText = e.target.value.toLowerCase();
    const filtered = events.filter((event) => {
      return (
        event.eventName.toLowerCase().includes(searchText) ||
        event.address.toLowerCase().includes(searchText) ||
        event.tags.some((tag) => tag.toLowerCase().includes(searchText))
      );
    });
    setFilteredEvents(filtered);
  };

  const filterTechHandler = () => {
    // Filter products with a data collection called "Tech"
    const techFilter = events.filter((event) => event.category === "Tech");
    setFilteredEvents(techFilter); // Update the state with the filtered events
  };

  const filterBusinessHandler = () => {
    // Filter products with a data collection called "Tech"
    const businessFilter = events.filter(
      (event) => event.category === "Business"
    );
    setFilteredEvents(businessFilter); // Update the state with the filtered events
  };

  const filterReligionHandler = () => {
    // Filter products with a data collection called "Tech"
    const religionFilter = events.filter(
      (event) => event.category === "Religion"
    );
    setFilteredEvents(religionFilter); // Update the state with the filtered events
  };
  const filterHealthandler = () => {
    // Filter products with a data collection called "Tech"
    const healthFilter = events.filter(
      (event) => event.category === "Health"
    );
    setFilteredEvents(healthFilter); // Update the state with the filtered events
  };
  const clearFilteredEvents = () =>{
    setFilteredEvents(events);
  }
  return (
    <><Helmet>
      <title>Homepage</title>
      <meta name='description' content='Wholesome helps foster connections with like-minds that transcends borders and also share your experiences, knowledge and creativity' />
      <link rel=" canonical" href='/' />
    </Helmet><div className="my-20 w-screen  sm:mt-18">
        <div
          className="h-96"

        >
          <div className="h-full bg-gradient-to-r from-fuchsia-600 to-pink-600">
            <h1 className="text-white text-center sm:text-4xl pt-24 sm:pt-14">
              See upcoming Events Around You
            </h1>
            <hr className="w-64 m-auto my-5"></hr>
            <p className="text-base-100 bg-black/50 py-2  text-center text-xl font-bolder Aceh">
              Discover, Explore, Attend: Your Event Search Starts Here
            </p>
            <div className="m-auto flex flex-col gap-2  justify-center py-5">
              <p className="m-auto text-gray-300 Aceh">
                Search event by name, tags and location
              </p>
              <p className=" m-auto text-gray-300   ">
                <FontAwesomeIcon icon={faAnglesDown} />
              </p>
              <input
                type="text"
                className="bg-transparent border border-1 border-gray-100/50 rounded-full p-3 w-96 m-auto text-white"
                placeholder="Search an event/location"
                value={searchInput}
                onChange={handleSearchInputChange}
              ></input>
            </div>
          </div>
        </div>
        <div className="flex justify-center text-red-400 text-4xl m-auto sm:px-2 py-5 gap-20 sm:gap-2 px-20 mt-10 overflow-x-auto">
          <span className="">
            <FontAwesomeIcon
              icon={faComputer}
              className="border rounded-full p-4 cursor-pointer	"
              onClick={filterTechHandler} />
            <p className="text-sm text-center text-gray-400 ">Tech</p>
          </span>
          <span className="">
            <FontAwesomeIcon
              icon={faFirstAid}
              className="border rounded-full p-4 cursor-pointer	"
              onClick={filterHealthandler} />
            <p className="text-sm text-center text-gray-400 ">Health</p>
          </span>
          <span className="">
            <FontAwesomeIcon
              icon={faBible}
              className="border rounded-full p-4 cursor-pointer	"
              onClick={filterReligionHandler} />
            <p className="text-sm text-center text-gray-400 ">Religion</p>
          </span>
          <span className="">
            <FontAwesomeIcon
              icon={faMoneyBillTrendUp}
              className="border rounded-full p-4 cursor-pointer	"
              onClick={filterBusinessHandler} />
            <p className="text-sm text-center text-gray-400 ">Business</p>
          </span>
          <span className="">
            <FontAwesomeIcon
              icon={faMicrophoneAlt}
              className="border rounded-full p-4 cursor-pointer	" />
            <p className="text-sm text-center text-gray-400 ">Music</p>
          </span>
          <span className="">
            <FontAwesomeIcon
              icon={faCalendar}
              className="border rounded-full p-4 cursor-pointer	" />
            <p className="text-sm text-center text-gray-400 ">Holiday</p>
          </span>
          <span className="">
            <FontAwesomeIcon
              icon={faGamepad}
              className="border rounded-full p-4 cursor-pointer	" />
            <p className="text-sm text-center text-gray-400 ">Hobbies</p>
          </span>
        </div>
        <span className="text-red-500 px-40 cursor-pointer		sm:px-5	" onClick={clearFilteredEvents}>X Clear Filters</span>

        <div className="flex m-auto justify-center gap-10 m-10 flex-wrap px-20 sm:p-2 ">

          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              return (
                <div
                  key={event.id}
                  className="w-80 bg-white    shadow  dark:border-gray-700"
                >
                  <NavLink to={`/upcomingevents/${event.id}`}>
                    <img
                      className="rounded-t-lg"
                      src={event.imgUrl}
                      alt={event.eventName} />

                    <div className="p-5">
                      <div className="badge">{event.category}</div>
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 Aceh">
                        {event.eventName}
                      </h5>

                      <p className="mb-1 font-normal text-md Aceh text-red-500 dark:text-red-500">
                        {event.dateTime}
                      </p>
                      <p className="mb-3 font-normal text-md  text-gray-500 ">
                        {event.address}
                      </p>
                      <p
                        className=" font-normal Aceh text-md text-black"
                      >
                        {event.organizerName}
                      </p>
                    </div>
                  </NavLink>

                </div>
              );
            })
          ) : (
            <div className="text-center text-2xl font-bold text-gray-500 mt-4 h-48">
              No events found matching your search.
            </div>
          )}
        </div>
        <div></div>
      </div></>
  );
};

export default EventList;
