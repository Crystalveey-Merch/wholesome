import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";

const Section2first = () => {
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
      spaceBetween: 10,
      centeredSlides: true,
    },
  };
  return (
    <div className="pt-20  sm:py-5">
      <h1 className="text-black text-2xl text-red-500  my-5 text-center Aceh text-md">
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
          className="mySwiper w-full h-80 mx-20 sm:mx-0 sm:px-10 lg:px-10"
        >
          <SwiperSlide>
            <div className="relative w-72  bg-base-100 shadow-xl  image-full">
              <figure>
                <img src="/Images/Events/host/meeting4.jpeg" alt="image" />
              </figure>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-72  bg-base-100 shadow-xl  image-full">
              <figure>
                <img src="/Images/Events/host/meeting5.jpeg" alt="image" />
              </figure>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-72  bg-base-100 shadow-xl  image-full">
              <figure>
                <img src="/Images/Events/host/meeting6.jpeg" alt="image" />
              </figure>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-72  bg-base-100 shadow-xl  image-full">
              <figure>
                <img src="/Images/Events/host/meeting7.jpeg" alt="image" />
              </figure>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-72  bg-base-100 shadow-xl  image-full">
              <figure>
                <img src="/Images/Events/host/meeting8.jpeg" alt="image" />
              </figure>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Section2first;
