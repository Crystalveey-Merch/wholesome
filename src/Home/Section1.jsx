import "swiper/css/effect-fade";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/auth.js";
import { NavLink } from "react-router-dom";

const Section1 = () => {
  const [authUser, setAuthUser] = useState(null);

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

  const breakpoints = {
    639: {
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        hideOnClick: true,
      },
    },
  };
  return (
    <div className="relative w-full sm:flex-col flex py-30 px-40 sm:px-2  bg-gradient-to-r from-orange-400 to-rose-400	">
      <div className=" h-1/2 sm:h-auto  m-auto w-full py-20 sm:px-5 flex  flex-col gap-5">
        <h1 className=" my-2 text-left Aceh drop-shadow-lg sm:text-5xl xl:text-3xl bg-clip-text text-white  bg-gradient-to-r from-red-500 to-black font-black text-6xl  ">
          JOIN THE GLOBAL NETWORK
        </h1>
        <p className=" py-4 xl:text-xl  text-3xl sm:text-2xl text-black ">
          Be part of our Community
        </p>
        <hr></hr>
        {userId ? (
          <NavLink to="/myinterest">
            <button className="text-2xl btn xl:text-sm  p-auto sm:text-sm hover:text-white  hover:bg-red-500  flex w-60 sm:w-40  bg-white  text-red-500 text-center ">
              <p className="text-xl xl:text-sm "> My Interest</p>
            </button>
          </NavLink>
        ) : (
          <NavLink to="/account">
            <button className=" btn Aceh   p-auto sm:text-sm hover:text-white  hover:bg-red-500  flex w-60 sm:w-40  bg-white  text-red-500 text-center ">
              <p className=""> JOIN </p>
            </button>
          </NavLink>
        )}
      </div>
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
          delay: 2000,
          disableOnInteraction: false,
        }}
        // style={{height:"35rem"}}
        // navigation={true}
        className="mySwiper z-0 swiper-h   w-full  h-1/2 sm:hidden      justify-center "
      >
        <SwiperSlide className=" relative">
          <div className=" relative  ">
            <img
              src="/homepage/slider1.jpeg"
              alt="imgSeven"
              // style={{position:"center"}}

              className="       m-auto  "
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative   ">
            <img
              src="/homepage/slider2.jpeg"
              alt="imgSeven"
              className="    m-auto   "
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Section1;
