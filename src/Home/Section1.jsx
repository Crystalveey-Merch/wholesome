import React from 'react'
import 'swiper/css/effect-fade';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation,   } from 'swiper';

const Section1 = () => {
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
    <div className='relative w-full flex sm:flex-col p-40 	'>
       <div className=' h-full sm:h-auto  m-auto w-full px-20 sm:p-5 '>
      <h1 className=' my-2 drop-shadow-lg sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-black font-black text-7xl AcehLight '>JOIN THE GLOBAL NETWORK</h1>
      <p className=' py-4   text-2xl sm:text-2xl text-black' >Be part of our Community</p>

        <h1 className='text-xl  sm:text-sm text-black  btn flex w-60 sm:w-40 bg-red-500 hover:bg-black border-none  text-white text-center '>JOIN WHOLESOME</h1>
      </div>
      <Swiper
        modules={[Autoplay, Navigation, ]}
        breakpoints={breakpoints}
        loop={true}
        Navigation
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
        className="mySwiper z-0 swiper-v   w-full sliderhgt  m-10 border-2  border border-red-500    m-auto flex justify-center "
      >

        <SwiperSlide className=' relative'>
          <img
            src="/homepage/slider1.jpeg"
            alt="imgSeven"

            style={{position:"center"}}
            
            width={600}

            className="  w-full  shadow-lg  " />

        </SwiperSlide>
        <SwiperSlide>
          <img
            src="/homepage/slider2.jpeg"
            alt="imgSeven"
            width={600}
            className="    w-full   shadow-lg " />

        </SwiperSlide>
      </Swiper>

   

    </div>
  )
}

export default Section1