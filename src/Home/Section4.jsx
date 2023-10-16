import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from 'swiper';
import { events } from "../data/events"
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";



const Section4 = () => {
    const { eventName } = useParams();
    // const [event, setEvent] = useState("");


    const categoryProduct = () => {
        return events.filter((event) => event.name === eventName);
    };




    if (!event) {
        return <div>Event not found.</div>;
    }

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
            slidesPerView: 3.8,
            spaceBetween: 5,
            centeredSlides: true,

        },

    };
    return (


        <div className='  py-10  sm:py-5 bg-red-100/50'>
            <h1 className='text-black text-2xl text-red-500  my-5 text-center Aceh text-md'>FEATURED EVENTS</h1>
            <div className='  m-auto justify-center flex auto'
            >
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
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay, Navigation, Pagination]}
                    className="mySwiper w-full  px-20 sm:px-10 lg:px-10 bg-red-100"
                >
                    {events.length > 0 ? (
                        events.map((event) => {
                            return(
                        <SwiperSlide key={event.id} style={{height:"32rem"}}>
                            <div  className="w-80  bg-white     shadow  dark:border-gray-700">
                                <NavLink to={`/upcomingevents/${event.name}`}>
                                    <img className="rounded-t-lg" src={event.src} alt={event.name} />

                                    <div className="p-5">

                                        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 Aceh">{event.name}</h5>

                                        <p className="mb-1 font-normal text-md Aceh text-red-500 dark:text-red-500">{event.date}</p>
                                        <p className="mb-3 font-normal text-md  text-gray-500 ">{event.address}</p>
                                        {event.organizer.map((organizer, index) => (
                                            <p key={index} className="mb-3 font-normal Aceh text-md text-black">
                                                {organizer.name}
                                            </p>))}

                                        <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                        </svg>

                                    </div>
                                </NavLink>
                            </div>

                        </SwiperSlide>

                        );
        })
        ):(
            <div className="text-center text-2xl font-bold text-gray-500 mt-4 h-48">
            No events found matching your search.
          </div>
          )}

                </Swiper>

            </div>
        </div>

    )

}

export default Section4