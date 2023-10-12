import React from 'react'
import 'swiper/css/effect-fade';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation,  } from 'swiper';

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
    <div className='relative w-full 	'>
      <Swiper
        modules={[Autoplay, Navigation]}
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
        style={{height:"35rem"}}
        // navigation={true}
        className="mySwiper z-0 swiper-v   w-full sliderhgt    m-auto flex justify-center "
      >

        <SwiperSlide className=' relative'>
          <img
            src="/homepage/slider1.jpeg"
            alt="imgSeven"
            style={{position:"center"}}
            
            // width={400}

            className="absolute  -top-20 sm:top-0 w-full z-0 shadow-lg  " />

        </SwiperSlide>
        <SwiperSlide>
          <img
            src="/homepage/slider2.jpeg"
            alt="imgSeven"
            // width={400}
            className=" absolute  -top-20 w-full center sm:top-0    shadow-lg " />

        </SwiperSlide>
      </Swiper>

      <div className='absolute z-10 top-0 h-full sm:h-auto p-40 sm:p-5 m-auto w-full bg-black/50 '>
      <h1 className='text-center my-5 font-bold sm:text-xl'>JOIN THE GLOBAL NETWORK</h1>
        <h1 className='text-xl sm:text-sm text-black m-auto btn flex w-60 sm:w-40 bg-red-500 hover:bg-black border-none  text-white text-center '>JOIN WHOLESOME</h1>
        <p className='text-center py-5'>Be part of our Community</p>
      </div>

    </div>
  )
}

export default Section1