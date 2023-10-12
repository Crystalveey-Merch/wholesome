import React from 'react'
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from 'swiper';


const Sectiom2 = () => {
  const breakpoints = {
    300: {
      slidesPerView: 2,
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
      loop: true,
      centeredSlides: false,

    },

  };
  return (


    <div className='  py-20  sm:py-5'>
      <h1 className='text-black text-2xl  my-5 text-center text-md'>MUST READS</h1>
      <div className='  m-auto justify-center flex'
      >
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
          delay: 1000,
          disableOnInteraction: false,
        }}
        modules={[ Autoplay, Navigation]}
        className="mySwiper w-full  px-4 sm:px-0 lg:px-10"
        >
          <SwiperSlide>
            <div className="relative w-72 h-72  bg-base-100 shadow-xl image-full">
              <figure><img src="/Images/section2/travel.jpeg" alt="image" /></figure>
              <div className=" absolute bottom-0 bg-gray-500/75 p-5 top-40">
                <button className="badge btn-primary">Travel</button>

                <h2 className="Aceh">XXXXXXXX</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div className="card-actions justify-end">
                </div>
              </div>

            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-72 h-72 bg-base-100 shadow-xl image-full">
              <figure><img src="/Images/section2/food.jpeg" alt="image" /></figure>
              <div className=" absolute bottom-0 bg-gray-500/75 p-5 top-40">
                <button className="badge btn-primary">Food</button>

                <h2 className=" Aceh">Food</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div className="card-actions justify-end">
                </div>
              </div>

            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-72 h-72 bg-base-100 shadow-xl image-full">
              <figure><img src="/Images/section2/health.jpeg" alt="image" /></figure>
              <div className=" absolute bottom-0 bg-gray-500/75 p-5 top-40">
                <div className="card-actions justify-start">
                  <button className="badge btn-primary">Health & Wellness!</button>
                </div>
                <h2 className="Aceh">How to Eat well</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>

              </div>

            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-72 h-72  bg-base-100 shadow-xl image-full">
              <figure><img src="/Images/section2/lifestyle.jpeg" alt="image" /></figure>
              <div className=" absolute bottom-0 bg-gray-500/75 p-5 top-40">
                <div className="card-actions justify-start">
                  <button className="badge btn-primary">Lifestyle</button>
                </div>
                <h2 className="Aceh">How to Eat well</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>

              </div>

            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-72 h-72 bg-base-100 shadow-xl image-full">
              <figure><img src="/homepage/slider2.jpeg" alt="image" /></figure>
              <div className=" absolute bottom-0 bg-gray-500/75 p-5 top-40">
                <div className="card-actions justify-start">
                  <button className="badge btn-primary">Lifestyle</button>
                </div>
                <h2 className="Aceh">How to Eat well</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>

              </div>

            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-72 h-72 bg-base-100 shadow-xl image-full">
              <figure><img src="/homepage/slider2.jpeg" alt="image" /></figure>
              <div className=" absolute bottom-0 bg-gray-500/75 p-5 top-40">
                <div className="card-actions justify-start">
                  <button className="badge btn-primary">Lifestyle</button>
                </div>
                <h2 className="Aceh">How to Eat well</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>

              </div>

            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-72 h-72 bg-base-100 shadow-xl image-full">
              <figure><img src="/homepage/slider2.jpeg" alt="image" /></figure>
              <div className=" absolute bottom-0 bg-gray-500/75 p-5 top-40">
                <div className="card-actions justify-start">
                  <button className="badge btn-primary">Lifestyle</button>
                </div>
                <h2 className="Aceh">How to Eat well</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>

              </div>

            </div>
          </SwiperSlide>
        </Swiper>

      </div>
    </div>

  )

}

export default Sectiom2