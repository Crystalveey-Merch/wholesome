import {
  faLightbulb,
  faMap,
  faMapLocation,
  faPen,
  faPeopleGroup,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";


const Section1plus = () => {
  const breakpoints = {
    300: {
      slidesPerView: 1,
      spaceBetween: 40,
      loop: true,
      centeredSlides: false,    },
    639: {
      slidesPerView: 1,
      spaceBetween: 40,
      loop: true,
      centeredSlides: false,    },
    768: {
      slidesPerView: 1,
      spaceBetween: 40,
      loop: true,
      centeredSlides: false,    },
    1024: {
      slidesPerView: 1,
      spaceBetween: 40,
      loop: true,
      centeredSlides: false,
    },
  };
  return (
    <div className="py-24 px-20 sm:px-5 w-screen bg-white">
      <h1 className="text-lg   text-center text-black Aceh py-5 uppercase sm:text-md sm:px-5">
        What’s in store for members?
      </h1>
      <Swiper
      modules={[Autoplay, Navigation]}
        breakpoints={breakpoints}
        loop={true}
        navigation={true}
        effect="fade"
        // direction={"vertical"}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        // style={{height:"35rem"}}
        // navigation={true}
        className="mySwiper z-0 swiper-h   w-full  h-1/2 justify-center "
      >
        <SwiperSlide>
          <div className=" flex  sm:flex-col px-60 xl:px-5 xl:gap-10 sm:px-0 gap-20 sm:gap-5 ">
            <div className="avatar  ">
              <div className=" w-60 sm:w-40   xl:w-40   rounded-full">
                <img src="/Images/whats-in -store/9372532.jpg" width={50} />
              </div>
            </div>
            <div className="h-full flex flex-col  gap-4 m-auto px-20 sm:px-5 xl:px-10">
              <h1 className="text-purple-500 text-2xl sm:text-2xl sm:text-center ">
                Social Connections
              </h1>
              <hr></hr>
              <p className="text-gray-700 text-xl sm:text-center  ">
                &quot;Users can establish relationships by connecting with
                friends, family, and coworkers. &quot;{" "}
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className=" flex  sm:flex-col px-60 xl:px-5 xl:gap-10 sm:px-0 gap-20 sm:gap-5 ">
            <div className="avatar m-auto">
              <div className=" w-60 sm:w-40   xl:w-40 rounded-full">
                <img src="/Images/whats-in -store/32594.jpg" width={50} />
              </div>
            </div>
            <div className="h-full flex flex-col  gap-4 m-auto px-20 sm:px-5 xl:px-5">
              <h1 className="text-yellow-500 text-2xl xl:text-xl  sm:text-center  sm:text-2xl">
                Networking Opportunities/ Opportunity for Business Ideas
              </h1>
              <hr></hr>
              <p className="text-gray-700 text-xl sm:text-center  ">
                &quot;We offer a setting for networking and job advancement.
                &quot;{" "}
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className=" flex  sm:flex-col px-60 xl:px-5 xl:gap-10 sm:px-0 gap-20 sm:gap-5 ">
            <div className="avatar m-auto">
              <div className=" w-60 sm:w-40   xl:w-40rounded-full">
                <img src="/Images/whats-in -store/19197307.jpg" width={50} />
              </div>
            </div>
            <div className="h-full flex flex-col  gap-4 m-auto px-20 sm:px-5">
              <h1 className="text-cyan-500 text-2xl sm:text-2xl sm:text-center ">
                Information Sharing
              </h1>
              <hr></hr>
              <p className="text-gray-700 text-xl sm:text-center  ">
                &quot;Through shared content, users can remain current on
                events, trends, and news. &quot;{" "}
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className=" flex  sm:flex-col px-60 xl:px-5 xl:gap-10 sm:px-0 gap-20 sm:gap-5 ">
            <div className="avatar m-auto">
              <div className=" w-60  sm:w-40   xl:w-40 rounded-full">
                <img src="/Images/whats-in -store/home_party.jpg" width={50} />
              </div>
            </div>
            <div className="h-full flex flex-col  gap-4 m-auto px-20 sm:px-5 xl:gap-10">
              <h1 className="text-red-500 text-2xl sm:text-2xl sm:text-center ">
                Entertainment
              </h1>
              <hr></hr>
              <p className="text-gray-700 text-xl sm:text-center  ">
                &quot;Games, memes, and movies are just a few examples of the
                multimedia material available on social networks. &quot;{" "}
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className=" flex  sm:flex-col px-60 xl:px-5 xl:gap-10 sm:px-0 gap-20 sm:gap-5 ">
            <div className="avatar m-auto">
              <div className=" w-60 sm:w-40   xl:w-40 rounded-full">
                <img src="/Images/whats-in -store/56829.jpg" width={50} />
              </div>
            </div>
            <div className="h-full flex flex-col  gap-4 m-auto px-20 sm:px-5">
              <h1 className="text-sky-500 text-2xl sm:text-2xl sm:text-center ">
                Self-Expression
              </h1>
              <hr></hr>
              <p className="text-gray-700 text-xl  sm:text-center ">
                &quot;Posts, images, and private updates are ways for users to
                express who they are. &quot;{" "}
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className=" flex  sm:flex-col px-60 xl:px-5 xl:gap-10 sm:px-0 gap-20 sm:gap-5 ">
            <div className="avatar m-auto">
              <div className=" w-60 sm:w-40   xl:w-40 rounded-full">
                <img src="/Images/whats-in -store/2530832.jpg" width={50} />
              </div>
            </div>
            <div className="h-full flex flex-col  gap-4 m-auto px-20 sm:px-5">
              <h1 className="text-sky-500 text-2xl sm:text-2xl sm:text-center ">
                Support & Assistance
              </h1>
              <hr></hr>
              <p className="text-gray-700 text-xl  sm:text-center ">
                &quot;Becoming a member of a group or community gives you a
                place to ask for and give assistance. &quot;{" "}
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className=" flex  sm:flex-col px-60 xl:px-5 xl:gap-10 sm:px-0 gap-20 sm:gap-5 ">
            <div className="avatar m-auto">
              <div className=" w-60 sm:w-40   xl:w-40 rounded-full">
                <img src="/Images/whats-in -store/5437683.jpg" width={50} />
              </div>
            </div>
            <div className="h-full flex flex-col  gap-4 m-auto px-20 sm:px-5">
              <h1 className="text-sky-500 text-2xl sm:text-2xl sm:text-center ">
                Knowledge Exchange:
              </h1>
              <hr></hr>
              <p className="text-gray-700 text-xl  sm:text-center ">
                &quot;Users can exchange their knowledge on a variety of topics
                and learn from one another. &quot;{" "}
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className=" flex  sm:flex-col px-60 xl:px-5 xl:gap-10 sm:px-0 gap-20 sm:gap-5 ">
            <div className="avatar m-auto">
              <div className=" w-60 sm:w-40   xl:w-40 rounded-full">
                <img src="/Images/whats-in -store/cal.jpg" width={50} />
              </div>
            </div>
            <div className="h-full flex flex-col  gap-4 m-auto px-20 sm:px-5">
              <h1 className="text-sky-500 text-2xl sm:text-2xl sm:text-center ">
                Event Invitations:
              </h1>
              <hr></hr>
              <p className="text-gray-700 text-xl  sm:text-center ">
                &quot;We have amazing features for event hosting with
                invitations and event preparation. &quot;{" "}
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className=" flex  sm:flex-col px-60 xl:px-5 xl:gap-10 sm:px-0 gap-20 sm:gap-5 ">
            <div className="avatar m-auto">
              <div className=" w-60 sm:w-40   xl:w-40    rounded-full">
                <img src="/Images/whats-in -store/afr.jpeg" width={50} />
              </div>
            </div>
            <div className="h-full flex flex-col  gap-4 m-auto px-20 sm:px-5">
              <h1 className="text-sky-500 text-2xl sm:text-2xl sm:text-center ">
                Cultural Exposure:
              </h1>
              <hr></hr>
              <p className="text-gray-700 text-xl  sm:text-center ">
                &quot;Through international connections, users can encounter and
                learn about many cultures. &quot;{" "}
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className=" flex  sm:flex-col px-60 xl:px-5 xl:gap-10 sm:px-0 gap-20 sm:gap-5 ">
            <div className="avatar m-auto">
              <div className=" w-60  sm:w-40   xl:w-40  rounded-full">
                <img src="/Images/whats-in -store/3249754.jpg" width={50} />
              </div>
            </div>
            <div className="h-full flex flex-col  gap-4 m-auto px-20 sm:px-5 xl:gap-10">
              <h1 className="text-sky-500 text-2xl sm:text-2xl sm:text-center ">
                Feedback and Validation
              </h1>
              <hr></hr>
              <p className="text-gray-700 text-xl  sm:text-center ">
                &quot; Users' motivation and confidence might increase when they
                receive positive feedback and validation. &quot;{" "}
              </p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Section1plus;
