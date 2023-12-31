import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import { activities } from "../data/activity";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase/auth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faHands, faLocationPin } from "@fortawesome/free-solid-svg-icons";



const Section2first = () => {
  const [activityId, setActivityId] = useState([]);
  const [activity, setActivity] = useState([]);

  const { activityName } = useParams();

  const ArticleName = () => {
    return activities.filter((activity) => activity.title === activityName);
  };

  useEffect(() => {
    const fetchEvents = async () => {
        // setLoading(true);

        try {
            const q = query(collection(db, "activities"), limit(10)); // Limit to 10 events
            const querySnapshot = await getDocs(q);
            const activityData = [];

            querySnapshot.forEach((doc) => {
                const activity = doc.data();
                activity.id = doc.id;
                activityData.push(activity);
                setActivityId(activity.id);

            });

            setActivity(activityData);
            // setLoading(false);
        } catch (error) {
            console.error("Error fetching events:", error);
            setActivity([]);
        }
    };

    fetchEvents();
}, []);

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
    const formatTime = (date) => {
    if (date instanceof Date) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }};
    const formatDate = (date) => {
      if (date instanceof Date) {
        return date.toLocaleDateString("en-US");
      }
      return ""; // Return an empty string if date is not a valid Date object
    };
  return (
    <div className="py-20  sm:py-5 bg-gradient-to-r from-rose-100 to-teal-100">
      <h1 className="text-black text-2xl   text-center Aceh text-md">
        COMMUNITY ACTIVITY
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
          {activity.length > 0 ? (
            activity.map((activity) => {
              return (
                <SwiperSlide key={activity.id}>
                  <NavLink to={`/activity/${activity.id}`} style={{ height: "32rem" }}>
                  <div className="relative w-94  bg-gray-800 rounded-xl  shadow-xl  image-full">
                  <div className="relative overflow-clip  h-40 sm:w-40" >

              <figure>
                <img src={activity.imgUrl} />
              </figure>
              </div>

              <div className='p-5 bg-base-500'>
              <p className="text-gray-100 flex  gap-4"><FontAwesomeIcon icon={faLocationPin}/>{activity.location} </p>
                <p className="text-gray-100 flex  gap-4  "><FontAwesomeIcon icon={faHands} className="p-2 rounded-full border"/> {activity.claps} Claps</p>
              <div className="badge text-gray-200 bg-gray-600 p-4 my-3 ">   <FontAwesomeIcon icon={faCalendar} />{" "} {formatDate(activity.DateTime instanceof Date ? activity.DateTime : new Date(activity.DateTime))} {formatTime(activity.DateTime instanceof Date ? activity.DateTime : new Date(activity.DateTime))}</div>
                <h1 className="text-2xl py-2 text-gray-200"> {activity.activityName}</h1>
              </div>
            </div>


                  </NavLink>
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

export default Section2first;
