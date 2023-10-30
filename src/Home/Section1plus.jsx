import { faLightbulb, faMap, faMapLocation, faPen, faPeopleGroup, faUserFriends } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from 'swiper';

import React from 'react'

const Section1plus = () => {
  const breakpoints = {
    300: {
      slidesPerView: 1,
      spaceBetween: 20,

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
      slidesPerView: 1,
      spaceBetween: 40,
      loop: true,
      centeredSlides: false,

    },

  };
  return (
    <div className='py-24   w-screen bg-white'>
      <h1 className='text-2xl   text-center text-black Aceh py-5 uppercase sm:text-md sm:px-10'>What’s in store for members?</h1>
      <Swiper
        slidesPerView={'auto'}
        centeredSlides={true}
        watchSlidesProgress
        grabCursor={true}
        spaceBetween={30}
        loop={true}
        breakpoints={breakpoints}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Navigation]}
        className="mySwiper w-full  px-4 sm:px-0 lg:px-20"
      >
        <SwiperSlide>
          <div className=' flex  sm:flex-col px-60 sm:px-0 gap-20 sm:gap-5 ' >
            <div className="avatar m-auto ">
              <div className=" w-60 sm:w-full sm:px-10 rounded-full">
                <img src="/Images/whats-in -store/9372532.jpg" />
              </div>
            </div>
            <div className='h-full flex flex-col  gap-4 m-auto px-20'>
              <h1 className='text-green-500 text-4xl sm:text-2xl'>Create a map of your travels</h1>
              <p className='text-black text-xl  text-red-500'>&quot;i am photography enthusiast. Taking pictures of nature and animals is what i love doing &quot; &quot;i am photography enthusiast. Taking pictures of nature and animals is what i love doing &quot; </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='flex  sm:flex-col px-60 sm:px-0 gap-20 sm:gap-5  ' >
            <div className="avatar m-auto">
              <div className=" w-60 sm:w-full sm:px-10 rounded-full">
                <img src="/Images/whats-in -store/32594.jpg" />
              </div>
            </div>
            <div className='h-full flex flex-col  gap-4 m-auto px-20'>
              <h1 className='text-green-500 text-4xl sm:text-2xl'>Get advice from the community</h1>
              <p className='text-black text-xl  text-red-500'>&quot;i am photography enthusiast. Taking pictures of nature and animals is what i love doing &quot; &quot;i am photography enthusiast. Taking pictures of nature and animals is what i love doing &quot; </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='flex  sm:flex-col px-60 sm:px-0 gap-20 sm:gap-5' >
            <div className="avatar m-auto">
              <div className=" w-60 sm:w-60 sm:px-10 rounded-full">
                <img src="/Images/whats-in -store/19197307.jpg" />
              </div>
            </div>
            <div className='h-full flex flex-col  gap-4 m-auto px-20'>
              <h1 className='text-green-500 text-4xl sm:text-2xl'>Blog about your adventures</h1>
              <p className='text-black text-xl  text-red-500'>&quot;i am photography enthusiast. Taking pictures of nature and animals is what i love doing &quot; &quot;i am photography enthusiast. Taking pictures of nature and animals is what i love doing &quot; </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className=' flex  sm:flex-col px-60 sm:px-0 gap-20 sm:gap-5' >
            <div className="avatar m-auto">
              <div className=" w-60 sm:w-60 sm:px-10   rounded-full">
                <img src="/Images/whats-in -store/2492241.jpg" />
              </div>
            </div>
            <div className='h-full flex flex-col  gap-4 m-auto px-20'>
              <h1 className='text-green-500 text-4xl sm:text-2xl'>Foster connections with like-minds that transcends borders</h1>
              <p className='text-black text-xl  text-red-500'>&quot;i am photography enthusiast. Taking pictures of nature and animals is what i love doing &quot; &quot;i am photography enthusiast. Taking pictures of nature and animals is what i love doing &quot; </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className=' flex  sm:flex-col px-60 sm:px-0 gap-20 sm:gap-5' >
            <div className="avatar m-auto">
              <div className=" w-60 sm:w-60 sm:px-10  rounded-full">
                <img src="/Images/whats-in -store/8056324.jpg" />
              </div>
            </div>
            <div className='h-full flex flex-col  gap-4 m-auto px-20'>
              <h1 className='text-green-500 text-4xl sm:text-2xl'>Share your experiences, knowledge and creativity</h1>
              <p className='text-black text-xl  text-red-500'>&quot;i am photography enthusiast. Taking pictures of nature and animals is what i love doing &quot; &quot;i am photography enthusiast. Taking pictures of nature and animals is what i love doing &quot; </p>
            </div>
          </div>
        </SwiperSlide>



      </Swiper>
     
    </div>
  )
}

export default Section1plus