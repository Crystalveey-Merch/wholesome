import React from 'react'
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from 'swiper';


const Section3 = () => {
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
        <div>
                    <h1 className='text-black text-2xl  my-5 text-center text-red-500 Aceh text-md'>COMMUNITY SPOTLIGHT</h1>

           <Swiper
            slidesPerView={'auto'}
            centeredSlides={true}
       watchSlidesProgress
       grabCursor={true}
      spaceBetween={30}
        loop= {true}
        breakpoints={breakpoints}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        modules={[ Autoplay, Navigation]}
        className="mySwiper w-full  px-4 sm:px-10 lg:px-10"
        >
<SwiperSlide>
<div className=' flex w-auto sm:flex-col gap-4  p-10 m-auto justify-center' >
                <div className="avatar sm:m-auto">
                    <div className="w-40 sm:w-36 rounded-full">
                        <img src="/Images/section2/lifestyle.jpeg" />
                    </div>
                </div>
                <div className='h-full flex flex-col  gap-4'>
                    <h1 className='text-green-500 text-xl'>Serena Williams</h1>
                    <p className='text-gray-600'>Professional Photographer</p>
                    <p className='text-black w-64 text-red-500'>&quot;i am photography enthusiast. Taking pictures of nature and animals is what i love doing &quot;</p>
                </div>
            </div>
</SwiperSlide>
<SwiperSlide>
<div className=' flex w-auto sm:flex-col  gap-4  p-10 m-auto justify-center' >
                <div className="avatar sm:m-auto">
                    <div className="w-40 sm:w-36  rounded-full">
                        <img src="/Images/man.jpeg" />
                    </div>
                </div>
                <div className='h-full flex flex-col  gap-4'>
                    <h1 className='text-green-500 text-xl'>David Bekcham</h1>
                    <p className='text-gray-600'>Lecturer</p>
                    <p className='text-black w-64 text-red-500'>&quot;i am photography enthusiast. Taking pictures of nature and animals is what i love doing &quot;</p>
                </div>
            </div>
</SwiperSlide>
<SwiperSlide>
<div className=' flex w-auto sm:flex-col  gap-4  p-10 m-auto justify-center' >
                <div className="avatar sm:m-auto">
                    <div className="w-40 sm:w-36 rounded-full">
                        <img src="/Images/man2.jpeg" />
                    </div>
                </div>
                <div className='h-full flex flex-col  gap-4'>
                    <h1 className='text-green-500 text-xl'>Daniel Whales</h1>
                    <p className='text-gray-600'>Fashion Designer</p>
                    <p className='text-black w-64 text-red-500'>&quot;i am photography enthusiast. Taking pictures of nature and animals is what i love doing &quot;</p>
                </div>
            </div>
</SwiperSlide>
<SwiperSlide>
<div className=' flex w-auto sm:flex-col  gap-4  p-10 m-auto justify-center' >
                <div className="avatar sm:m-auto">
                    <div className="w-40 sm:w-36 rounded-full">
                        <img src="/Images/woman.jpeg" />
                    </div>
                </div>
                <div className='h-full flex flex-col  gap-4'>
                    <h1 className='text-green-500 text-xl'>Daisy Hail</h1>
                    <p className='text-gray-600'>House  wife</p>
                    <p className='text-black w-64 text-red-500'>&quot;i am photography enthusiast. Taking pictures of nature and animals is what i love doing &quot;</p>
                </div>
            </div>
</SwiperSlide>



        </Swiper>
      
        </div>
    )
}

export default Section3