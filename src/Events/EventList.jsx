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
  faBagShopping,
  faBible,
  faBook,
  faCalendar,
  faComputer,
  faFirstAid,
  faGamepad,
  faHand,
  faHockeyPuck,
  faHorse,
  faMicrophone,
  faMicrophoneAlt,
  faMoneyBillTrendUp,
  faMusic,
  faPalette,
  faPlane,
  faPlusCircle,
  faTree,
} from "@fortawesome/free-solid-svg-icons";
import { auth, db } from "../firebase/auth.js";
import Spinner from "../components/Spinner";
import { Helmet } from "react-helmet-async";
import Moment from "moment";
import {
  faClock,
  faLocationPin,
} from "@fortawesome/free-solid-svg-icons";

const EventList = () => {
  const { eventName } = useParams();
  const [searchInput, setSearchInput] = useState("");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      // setLoading(true);

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
        setLoading(false);
        console.error("Error fetching posts:", error);

        setEvents([]);
      }
    };

    fetchPosts();
  }, []);
  console.log(events);

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

  const filterBusinessHandler = () => {
    // Filter products with a data collection called "Tech"
    const businessFilter = events.filter(
      (event) => event.category === "Business and Finance"
    );
    setFilteredEvents(businessFilter); // Update the state with the filtered events
  };

  const filterLifestyle = () => {
    // Filter products with a data collection called "Tech"
    const religionFilter = events.filter(
      (event) => event.category === "Lifestyle and Fashion"
    );
    setFilteredEvents(religionFilter); // Update the state with the filtered events
  };
  const filterHealthandler = () => {
    // Filter products with a data collection called "Tech"
    const healthFilter = events.filter(
      (event) => event.category === "Health and wellness"
    );
    setFilteredEvents(healthFilter); // Update the state with the filtered events
  };
  const filterGameshandler = () => {
    // Filter products with a data collection called "Tech"
    const healthFilter = events.filter(
      (event) => event.category === "Games and Sports"
    );
    setFilteredEvents(healthFilter); // Update the state with the filtered events
  };
  const filterTravelhandler = () => {
    // Filter products with a data collection called "Tech"
    const healthFilter = events.filter(
      (event) => event.category === "Travel and Adventure"
    );
    setFilteredEvents(healthFilter); // Update the state with the filtered events
  };
  const filterVolunteerhandler = () => {
    // Filter products with a data collection called "Tech"
    const healthFilter = events.filter(
      (event) => event.category === "Volunteer and Philanthropy"
    );
    setFilteredEvents(healthFilter); // Update the state with the filtered events
  };
  const filterArthandler = () => {
    // Filter products with a data collection called "Tech"
    const healthFilter = events.filter(
      (event) => event.category === "Art and crafts"
    );
    setFilteredEvents(healthFilter); // Update the state with the filtered events
  };
  const filterEnvironmental = () => {
    // Filter products with a data collection called "Tech"
    const healthFilter = events.filter(
      (event) => event.category === "Environmental and Sustainability"
    );
    setFilteredEvents(healthFilter); // Update the state with the filtered events
  };
  const filterBook = () => {
    // Filter products with a data collection called "Tech"
    const healthFilter = events.filter(
      (event) => event.category === "Book club"
    );
    setFilteredEvents(healthFilter); // Update the state with the filtered events
  };

  const clearFilteredEvents = () => {
    setFilteredEvents(events);
  };
  return (
    <>
      <Helmet>
        <title>Events List</title>
        <meta name="description" content="See upcoming Events Around You" />
        <link
          rel="canonical"
          href="https://wholesome.crystaleey.com/upcomingevents/"
        />
        <meta
          name="keywords"
          content="`Wholesome, Crystalveey,
         , Events,  Attend, Calender, Create Events, Host Events, Search Events, City , Location, Time, Venue, schedule, event listings , event calendar , upcoming events, activities, city events, Art, Travel and Adventure"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Event List" />
        <meta
          property="og:url"
          content="https://wholesome.crystaleey.com/upcomingevents/"
        />
        {/* <meta property="og:image" content={posts} /> */}
        <meta name="og:description" content="See upcoming Events Around You" />
        <meta name="og:site_name" content="Wholesome" />
        <meta name="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content="https://wholesome.crystaleey.com/upcomingevents/"
        />
        <meta name="twitter:title" content="Article List" />
        <meta
          name="twitter:description"
          content="See upcoming Events Around You"
        />
        {/* <meta name="twitter:image" content="../../public/20231116_210104-removebg-preview.png" /> */}

        <script
          type="application/ld+json"
          {...JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: "Events List",
            url: "https://wholesome.crystaleey.com/upcomingevents",

            // "image": {posts.imgUrl},

            publisher: {
              "@type": "Organization",
              name: "Wholesome",
              logo: {
                "@type": "ImageObject",
                url: "",
              },
            },
            // "datePublished": `${posts.timestamp?.toDate()?.toDateString()}`,
          })}
        />
      </Helmet>
      <div className="py-20 w-screen  sm:pt-18">
        <div className="">
          <div className="h-full bg-gradient-to-r from-fuchsia-600 to-pink-600 sm:p-10">
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
                className="bg-transparent border border-1 border-gray-100/50 rounded-full p-3 w-96 sm:w-full m-auto text-white"
                placeholder="Search an event/location"
                value={searchInput}
                onChange={handleSearchInputChange}
              ></input>
            </div>
          </div>
        </div>
        <div className="flex  flex-wrap justify-center  text-4xl sm:text-2xl m-auto py-5 gap-20 sm:gap-3 px-20 sm:px-5  mt-10 overflow-x-auto">
          <span className="">
            <FontAwesomeIcon
              icon={faHand}
              className="border rounded-full p-4 cursor-pointer m-auto flex text-sky-300  shadow	"
              onClick={filterVolunteerhandler}
            />
            <p className="text-sm text-center text-gray-400 ">Volunteer</p>
          </span>
          <span className="">
            <FontAwesomeIcon
              icon={faFirstAid}
              className="border rounded-full p-4 cursor-pointer m-auto flex  text-green-300  shadow"
              onClick={filterHealthandler}
            />
            <p className="text-sm text-center text-gray-400 ">Health</p>
          </span>
          <span className="">
            <FontAwesomeIcon
              icon={faBook}
              className="border rounded-full p-4 cursor-pointer m-auto flex  shadow	 text-yellow-800"
              onClick={filterBook}
            />
            <p className="text-sm text-center text-gray-400 ">Book club</p>
          </span>
          <span className="">
            <FontAwesomeIcon
              icon={faMoneyBillTrendUp}
              className="border rounded-full p-4 cursor-pointer  m-auto flex  shadow  text-red-700	"
              onClick={filterBusinessHandler}
            />
            <p className="text-sm text-center text-gray-400 ">Business</p>
          </span>
          <span className="">
            <FontAwesomeIcon
              onClick={filterTravelhandler}
              icon={faPlane}
              className="border rounded-full p-4 cursor-pointer  m-auto flex  shadow	text-cyan-500"
            />
            <p className="text-sm text-center text-gray-400 ">Travel</p>
          </span>
          <span className="">
            <FontAwesomeIcon
              icon={faPalette}
              onClick={filterArthandler}
              className="border rounded-full p-4 cursor-pointer m-auto flex   shadow  text-purple-700	"
            />
            <p className="text-sm text-center text-gray-400 ">Art</p>
          </span>
          <span className="">
            <FontAwesomeIcon
              icon={faGamepad}
              onClick={filterGameshandler}
              className="border rounded-full p-4 m-auto flex cursor-pointer  shadow text-orange-500	"
            />
            <p className="text-sm text-center text-gray-400 ">Games</p>
          </span>
          <span className="">
            <FontAwesomeIcon
              icon={faTree}
              onClick={filterEnvironmental}
              className="border rounded-full p-4 cursor-pointer m-auto flex   shadow text-green-900	"
            />
            <p className="text-sm text-center text-gray-400 ">Environmental</p>
          </span>
          <span className="">
            <FontAwesomeIcon
              icon={faBagShopping}
              onClick={filterLifestyle}
              className="border rounded-full p-4 cursor-pointer	m-auto flex  shadow text-pink-500"
            />
            <p className="text-sm text-center text-gray-400 ">Lifestyle</p>
          </span>
        </div>
        <span
          className="text-red-500 px-40 cursor-pointer		sm:px-5	"
          onClick={clearFilteredEvents}
        >
          X Clear Filters
        </span>

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
                      alt={event.eventName}
                    />

                    <div className="p-5">
                      <div className="badge">{event.category}</div>
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 Aceh">
                        {event.eventName}
                      </h5>

                      <badge className="badge p-2 bg-yellow-400 mb-2 text-xl tracking-tight text-gray-900 ">
                          <FontAwesomeIcon
                            icon={faCalendar}
                            className="text-sm mr-2"
                          />{" "}
                          {Moment(event.StartDateTime).format("DD-MM-YYYY")}{" "}
                          {", "}
                          {Moment(event.StartDateTime).format("HH:MM a")}
                        </badge>
                      <p className="mb-3 font-normal text-md  text-gray-500 ">
                        {event.address}
                      </p>
                      <p className=" font-normal Aceh text-md text-black">
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
      </div>
    </>
  );
};

export default EventList;
