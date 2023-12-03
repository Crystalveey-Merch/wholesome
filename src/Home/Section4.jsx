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
                <SwiperSlide key={event.id} className="">
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
                          className="rounded-t-lg"
                          src={event.imgUrl}
                          alt={event.eventName}
                        />
                      </div>

                      <div className="p-5">
                        <p className="mb-3 font-bold  Aceh text-xl text-black Aceh">
                          {event.eventName}
                        </p>
                        <h5 className="mb-2 text-xl tracking-tight text-gray-900 ">
                          {event.StartDateTime}
                        </h5>

                        <p className="mb-1 font-normal text-md Aceh text-red-500 dark:text-red-500">
                          {event.date}
                        </p>
                        <p className="mb-3 font-normal text-md  text-gray-500 ">
                          {event.address}
                        </p>

                        <svg
                          className="w-3.5 h-3.5 ml-2"
                          aria-hidden="true"
                          xmlns="https://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                        <p className="mb-3 font-normal Aceh text-md text-black">
                          BY {event.organizerName}
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
