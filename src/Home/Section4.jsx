import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { auth, db } from "../firebase/auth.js";
import Spinner from "../components/Spinner.tsx";
import Moment from "moment";
import {
  faCalendar,
  faClock,
  faLocationPin,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Section4 = () => {
  const { eventName } = useParams();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState([]);

  // const [event, setEvent] = useState("");
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);

      try {
        const q = query(collection(db, "events"), limit(10)); // Limit to 10 events
        const querySnapshot = await getDocs(q);
        const postData = [];

        querySnapshot.forEach((doc) => {
          const event = doc.data();
          event.id = doc.id;
          postData.push(event);
          setEventId(event.id);
        });

        setEvents(postData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <Spinner />;
  }

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

  const breakpoints = {
    300: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    639: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 40,
      centeredSlides: true,
    },
  };
  return (
    <div className="  py-10  sm:py-5 bg-red-100/50">
      <h1 className="text-black text-2xl text-red-500  my-5 text-center Aceh text-md">
        FEATURED EVENTS
      </h1>
      <div className="  m-auto justify-center flex auto">
        <Swiper
          slidesPerView={"auto"}
          centeredSlides={true}
          watchSlidesProgress
          navigation={true}
          grabCursor={true}
          spaceBetween={30}
          loop={true}
          breakpoints={breakpoints}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper w-full  mx-20 sm:mx-0  lg:px-10"
        >
          {events.length > 0 ? (
            events.map((event) => {
              return (
                <SwiperSlide key={event.id} className=" transition duration-500 hover:scale-90  ease-in-out">
                  <div
                    className="  bg-white     shadow  dark:border-gray-700"
                    style={{ height: "28rem" }}
                  >
                    <NavLink
                      to={`/upcomingevents/${event.id}`}
                      className="w-94"
                    >
                      <div className="relative overflow-clip  h-40 sm:w-full">
                        <img
                          className="p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out m-auto"
                          src={event.imgUrl}
                          alt={event.eventName}
                        />
                      </div>

                      <div className="p-5">
                        <p className="mb-3 font-bold  Aceh text-xl text-black Aceh">
                          {event.eventName}
                        </p>
                        <badge className="badge p-2 bg-yellow-400 mb-2 text-xl tracking-tight text-gray-900 ">
                          <FontAwesomeIcon
                            icon={faCalendar}
                            className="text-sm mr-2"
                          />{" "}
                          {Moment(event.StartDateTime).format("DD-MM-YYYY")}{" "}
                          {", "}
                          {Moment(event.StartDateTime).format("HH:MM a")}
                        </badge>

                        <p className="mb-1 font-normal text-md Aceh text-red-500 dark:text-red-500">
                          {event.date}
                        </p>
                        <p className="mb-3 font-normal text-md  text-gray-500 ">
                          {event.address}
                        </p>

                        <p className="mb-3 font-normal Aceh text-md text-gray-500">
                          Organised by: {event.organizerName}
                        </p>
                      </div>
                    </NavLink>
                  </div>
                </SwiperSlide>
              );
            })
          ) : (
            <div className="text-center text-2xl font-bold text-gray-500 mt-4 h-48">
              No events found matching your search.
            </div>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default Section4;
