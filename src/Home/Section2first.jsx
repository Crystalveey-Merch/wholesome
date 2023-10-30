import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import { activities } from "../data/activity";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";



const Section2first = () => {

  const { activityName } = useParams();

  const ArticleName = () => {
    return activities.filter((activity) => activity.title === activityName);
  };

  const breakpoints = {
    300: {
      slidesPerView: 1,
      spaceBetween: 5,
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
      spaceBetween:5,
      centeredSlides: true,
    },
  };
  return (
    <div className="py-20  sm:py-5 bg-stone-700">
      <h1 className="text-white text-2xl   text-center Aceh text-md">
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
          className="mySwiper w-full  mx-10 sm:mx-0 py-10 sm:px-10 lg:px-10"
        >
        {activities.length > 0 ? (
            activities.map((activity) => {
              return (
          <SwiperSlide key={activity.id}>
          <NavLink to={`/activity/${activity.title}`}>
            <div className="relative w-72  text-white shadow-xl  image-full">
              <figure>
                <img src={activity.src} />
              </figure>
              <div className=" p-5 bg-gray-800">
              <div className="badge text-green-500 ">{activity.date}</div>
                <h1 className="text-2xl py-2"> {activity.title}</h1>
                <p>{activity.content} </p>
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
