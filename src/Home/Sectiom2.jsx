import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from 'swiper';


const Sectiom2 = () => {
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
      spaceBetween: 40,
      centeredSlides: true,

    },

  };
  return (


    <div className='  py-20  sm:py-5'>
      <h1 className='text-black text-2xl text-red-500  my-5 text-center Aceh text-md'>MUST READS</h1>
      <div className='  m-auto justify-center flex auto'
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
          delay: 4000,
          disableOnInteraction: false,
        }}
        modules={[ Autoplay, Navigation, Pagination]}
        className="mySwiper w-full  px-20 sm:px-10 lg:px-10"
        >
          <SwiperSlide>
            <div className="relative w-72 h-96  bg-base-100 shadow-xl  image-full">
              <figure><img src="/Images/section2/travel.jpeg" alt="image" /></figure>
              <div className=" absolute flex flex-col gap-2 bottom-0 bg-gray-100 border p-5 top-40">
                <button className="badge btn-primary">Travel</button>

                <h2 className="Aceh text-black py-2">Pile earthly scene loved light blast.</h2>
                <p className='text-red-500'>BY FERARI MITSHEL</p>

                <p className='text-gray-700'>Pleurs frémir couronne» m'enivre majesté a n'est . Quel genoux.Mein nennt sich freundliche lebt geneigt faßt so nach bilder. </p>
                <div className="card-actions justify-end">
                </div>
              </div>

            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-72 h-96 bg-base-100 shadow-xl image-full">
              <figure><img src="/Images/section2/food.jpeg" alt="image" /></figure>
              <div className=" absolute bottom-0 bg-gray-100 border p-5 top-40">
                <button className="badge btn-primary">Food</button>

                <h2 className=" Aceh text-black py-2">Food Hagyottan élők hallja s és áll kiket gondom ott vakogjatok,.</h2>
                <p className='text-red-500'>BY FERARI MITSHEL</p>

                <p className='text-gray-700'>If a dog chews shoes whose shoes does he choose?I my lenore of one followed linking raven home, the sat with the the. Least there and core purple pallas. </p>
                <div className="card-actions justify-end">
                </div>
              </div>

            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-72 h-96 bg-base-100 shadow-xl image-full">
              <figure><img src="/Images/section2/health.jpeg" alt="image" /></figure>
              <div className=" absolute bottom-0 bg-gray-100 p-5 top-40">
                <div className="card-actions justify-start">
                  <button className="badge btn-primary">Health & Wellness!</button>
                </div>
                <h2 className="Aceh text-black py-2">Farad de o kyul fyom viragnac ezes kyul </h2>
                <p className='text-red-500'>BY FERARI MITSHEL</p>

                <p className='text-gray-700'>Diana la escaleras que quedo es abrir. Borrando con pasan la sólo el sensitivo el de, transparente por los come.If a dog chews shoes whose shoes does he choose?</p>

              </div>

            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-72 h-96  bg-base-100 shadow-xl image-full">
              <figure><img src="/Images/section2/lifestyle.jpeg" alt="image" /></figure>
              <div className=" absolute bottom-0 bg-gray-100 p-5 top-40">
                <div className="card-actions justify-start">
                  <button className="badge btn-primary">Lifestyle</button>
                </div>
                <h2 className="Aceh text-black py-2">Fáj és kelljen fehérül találhat elvonta akit akadt ő, pattanjon.</h2>
                <p className='text-red-500'>BY FERARI MITSHEL</p>

                <p className='text-gray-700'>Diana la escaleras que quedo es abrir. Borrando con pasan la sólo el sensitivo el de, transparente por los come.If a dog chews shoes whose shoes does he choose?</p>

              </div>

            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-72 h-96 bg-base-100 shadow-xl image-full">
              <figure><img src="/Images/section2/afr.jpeg" alt="image" /></figure>
              <div className=" absolute bottom-0 bg-gray-100 p-5 top-40">
                <div className="card-actions justify-start">
                  <button className="badge btn-primary">Lifestyle</button>
                </div>
                <h2 className="Aceh text-black py-2">Farad de o kyul fyom viragnac ezes kyul merth buol bezzeg.</h2>
                <p className='text-red-500'>BY FERARI MITSHEL</p>

                <p className='text-gray-700'>Diana la escaleras que quedo es abrir. Borrando con pasan la sólo el sensitivo el de, transparente por los come.If a dog chews shoes whose shoes does he choose?</p>

              </div>

            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-72 h-96 bg-base-100 shadow-xl image-full">
              <figure><img src="/Images/section2/lady.jpeg" alt="image" /></figure>
              <div className=" absolute bottom-0 bg-gray-100 p-5 top-40">
                <div className="card-actions justify-start">
                  <button className="badge btn-primary">Lifestyle</button>
                </div>
                <h2 className="Aceh text-black py-2">Farad de o kyul fyom viragnac ezes kyul merth buol bezzeg.</h2>
                <p className='text-red-500'>BY FERARI MITSHEL</p>
                <p className='text-gray-700'>Diana la escaleras que quedo es abrir. Borrando con pasan la sólo el sensitivo el de, transparente por los come.If a dog chews shoes whose shoes does he choose?</p>

              </div>

            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-72 h-96 bg-base-100 shadow-xl image-full">
              <figure><img src="/Images/section2/kids-playing-outdoors_23-2149218025.jpg" alt="image" /></figure>
              <div className=" absolute bottom-0 bg-gray-100 p-5 top-40">
                <div className="card-actions justify-start">
                  <button className="badge btn-primary">Lifestyle</button>
                </div>
                <h2 className="Aceh text-black py-2">Farad de o kyul fyom viragnac ezes kyul merth buol bezzeg.</h2>
                <p className='text-red-500'>BY FERARI MITSHEL</p>

                <p className='text-gray-700'>Diana la escaleras que quedo es abrir. Borrando con pasan la sólo el sensitivo el de, transparente por los come.If a dog chews shoes whose shoes does he choose?</p>

              </div>

            </div>
          </SwiperSlide>
        </Swiper>

      </div>
    </div>

  )

}

export default Sectiom2