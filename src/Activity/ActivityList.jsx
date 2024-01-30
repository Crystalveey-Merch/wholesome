import { NavLink } from "react-router-dom";
import { useParams } from "react-router";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import {
  faAnglesDown,
  faBagShopping,
  faBook,
  faCalendar,
  faFirstAid,
  faGamepad,
  faHand,
  faHands,
  faMoneyBillTrendUp,
  faPalette,
  faPlane,
  faTree,
  faLocationPin,

} from "@fortawesome/free-solid-svg-icons";
import { db } from "../firebase/auth.js";
import Spinner from "../components/Spinner";
import { Helmet } from "react-helmet-async";
import Moment from "moment";

const ActivityList = () => {
//   const { eventName } = useParams();
  const [searchInput, setSearchInput] = useState("");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const formatDate = (date) => {
    if (date instanceof Date) {
      return date.toLocaleDateString("en-US");
    }
    return ""; // Return an empty string if date is not a valid Date object
  };
  const formatTime = (date) => {
    if (date instanceof Date) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  };
  const excerpt = (str, count) => {
    if (str && str.length > count) {
      str = str.substring(0, count) + " ... ";
    }
    return str;
  };
  useEffect(() => {
    const fetchPosts = async () => {
      // setLoading(true);

      try {
        const querySnapshot = await getDocs(collection(db, "activities"));
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

  if (loading) {
    return <Spinner />;
  }

//   const collectionProduct = () => {
//     return events.filter((event) => event.name === eventName);
//   };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    const searchText = e.target.value.toLowerCase();
    const filtered = events.filter((event) => {
      return (
        event.eventName?.toLowerCase().includes(searchText) ||
        event.address?.toLowerCase().includes(searchText) ||
        event.tags.some((tag) => tag?.toLowerCase().includes(searchText))
      );
    });
    setFilteredEvents(filtered);
  };

  const filterHandler = (category)=>{
    const categoryFilter = events.filter(
    (event) => event.category === category
    )
    setFilteredEvents(categoryFilter)
  }
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
          href="https://wholesquare.org/upcomingevents/"
        />
        <meta
          name="keywords"
          content="`Wholesquare, Crystalveey,
         , Events,  Attend, Calender, Create Events, Host Events, Search Events, City , Location, Time, Venue, schedule, event listings , event calendar , upcoming events, activities, city events, Art, Travel and Adventure"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Event List" />
        <meta
          property="og:url"
          content="https://wholesquare.org/upcomingevents/"
        />
        {/* <meta property="og:image" content={posts} /> */}
        <meta name="og:description" content="See upcoming Events Around You" />
        <meta name="og:site_name" content="Wholesquare" />
        <meta name="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content="https://wholesquare.org/upcomingevents/"
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
            url: "https://wholesquare.org/upcomingevents",

            // "image": {posts.imgUrl},

            publisher: {
              "@type": "Organization",
              name: "Wholesquare",
              logo: {
                "@type": "ImageObject",
                url: "",
              },
            },
            // "datePublished": `${posts.timestamp?.toDate()?.toDateString()}`,
          })}
        />
      </Helmet>
      <div className="py-20 w-screen  sm:pt-18 bg-gray-100">
        <div className="">
          <div className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 sm:p-10">
            <h1 className="text-white  text-center sm:text-4xl pt-24 sm:pt-14">
            Explore Wholesquare Activities
            </h1>
            <hr className="w-64 m-auto my-5"></hr>
            <p className="text-white py-2  text-center text-xl font-bolder Aceh">
            Where Moments Become Memories: A Showcase of Wholesquare Activities."
            </p>
            <div className="m-auto flex flex-col gap-2  justify-center py-5">
              <p className="m-auto text-xl text-white AcehLight">
                Search activity by name, tags and location
              </p>
              <p className=" m-auto text-gray-100   ">
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
        <div className="flex  flex-wrap justify-center  text-2xl sm:text-2xl m-auto py-5 gap-20 sm:gap-3 px-20 sm:px-5  mt-10 overflow-x-auto">
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
              onClick={() => filterHandler("Health & wellness")}            />
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
            <p className="text-sm text-center text-gray-400 ">Nature</p>
          </span>
          <span className="">
            <FontAwesomeIcon
              icon={faBagShopping}
              onClick={() => filterHandler("Lifestyle and Fashion")}            
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

        <div className="flex m-auto justify-center gap-10 m-10 flex-wrap px-20 sm:p-2  my-20">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((activity) => {
              return (
                <div
                  key={activity.id}
                  className="w-72 bg-white    shadow  dark:border-gray-700"
                >
                          <NavLink
                    to={`/activity/${activity.id}`}
                    style={{ height: "32rem" }}

                    className="w-94"
                  >
                      <div className="relative overflow-clip  h-40 sm:w-fulll">
                        <img
                          src={activity.imgUrl}
                          height={200}
                          className="p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out m-auto "
                        />
                      </div>

                      <div className="p-5 text-x text-gray-700">
                        <FontAwesomeIcon icon={faCalendar} className="text-red-500"/>{" "}
                        {formatDate(
                          activity.DateTime instanceof Date
                            ? activity.DateTime
                            : new Date(activity.DateTime)
                        )}{" "}
                        {formatTime(
                          activity.DateTime instanceof Date
                            ? activity.DateTime
                            : new Date(activity.DateTime)
                        )}
                      </div>
                      <hr></hr>
                      <div className="p-5">
                      <span className="text-sky-600">{activity.category}</span>
                     <div className="p-2"> <h1 className="text-xl py-2 text-black">
                        {activity.activityName}
                      </h1>
                      <p className=" text-gray-500">{excerpt(activity.writeup, 80)}</p>
                      </div>
                      <div className="flex ">
                        <p className="text-gray-800 flex  gap-2 ">
                          <FontAwesomeIcon icon={faLocationPin} className="my-auto" />
                          <p className="m-auto"> {activity.location} </p>
                        </p>
                        <p className="text-gray-800 flex   text-left ">
                          <FontAwesomeIcon
                            icon={faHands}
                            className="p-2  text-violet-400"
                          />{" "}
                          <p className="m-auto"> {activity.claps} </p>
                        </p>
                      </div></div>
                  </NavLink>
                </div>
              );
            })
          ) : (
            <div className="text-center text-2xl font-bold text-gray-500 mt-4 h-48">
              No Activity found matching your search.
            </div>
          )}
        </div>
        <div></div>
      </div>
    </>
  );
};

export default ActivityList;
