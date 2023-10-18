import React from 'react'
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { events } from "../data/events";
import { articles } from '../data/artucles';
import { activities } from '../data/activity';
import { NavLink } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";


const Interest = () => {

    const { interestName } = useParams();
    const [event, setEvent] = useState(null);
    const [article, setArticle] = useState(null);
    const [activity, setActivity] = useState(null);

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

    useEffect(() => {
        // Find the   by comparing the name as a string
        const selectedEvent = events.filter((e) => e.interest === interestName);
        const selectedArticle = articles.filter((article)=> article.category === interestName);
        const selectedActivity = activities.filter((activity)=> activity.category === interestName);

        if (selectedEvent) {
            // Set the selected event in the state
            setActivity(selectedActivity);
          }
        if (selectedEvent) {
          // Set the selected event in the state
          setEvent(selectedEvent);
        }
        if (selectedArticle) {
            // Set the selected event in the state
            setArticle(selectedArticle);
          }
      }, [interestName]);
    
      if (!event) {
        return <div>Event not found.</div>;
      }



  return (
    <div className="mt-20 w-screen  sm:mt-18 px-20 sm:px-5">
    <div>
        <h1 className='text-red-500 text-center uppercase Aceh text-4xl sm:text-3xl py-10'>Interest: {interestName}</h1>
    </div>
    <div className='py-5'>
        <h1 className=' text-green-500 text-2xl  capitalize text-center'> Events</h1>
        <hr></hr>
    </div>
  
        <div className='flex flex-wrap gap-5'>
        {event.length > 0 ? (
          event.map((event) => {
            return (
              <div
                key={event.id}
                className="w-80 bg-white    shadow  dark:border-gray-700"
              >
                <NavLink to={`/upcomingevents/${event.name}`}>
                  <img
                    className="rounded-t-lg"
                    src={event.src}
                    alt={event.name}
                  />

                  <div className="p-5">
                    <div className="badge">{event.category}</div>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 Aceh">
                      {event.name}
                    </h5>

                    <p className="mb-1 font-normal text-md Aceh text-red-500 dark:text-red-500">
                      {event.date}
                    </p>
                    <p className="mb-3 font-normal text-md  text-gray-500 ">
                      {event.address}
                    </p>
                    {event.organizer.map((organizer, index) => (
                      <p
                        key={index}
                        className="mb-3 font-normal Aceh text-md text-black"
                      >
                        {organizer.name}
                      </p>
                    ))}
                  </div>
                </NavLink>
                <div className="text-red-500 flex btn bg-red-500 text-white border-none w-40 Aceh">
                  <h2>Attend</h2>
                  <svg
                    className="w-3.5 h-3.5 ml-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-2xl font-bold text-gray-500 mt-4 h-48">
            No events found matching your search.
          </div>
        )}
        </div>
        <div className='py-5'>
        <h1 className=' text-green-500 text-2xl  capitalize text-center py-5'>Articles/Publications</h1>
        <hr></hr>

    </div>
    <div className='flex flex-wrap gap-5 justify-center'>
    {article.length > 0 ? (
            article.map((article) => {
              return (
                  <NavLink to={`/article/${article.topic}`} key={article.id}>
                    <div className="relative w-72  bg-base-100 shadow-xl  image-full">
                      <figure><img src={article.src} alt="image" /></figure>
                      <div className="  flex flex-col  gap-2 bottom-0 bg-gray-100 border p-5 top-40">
                        <button className="badge btn-primary">{article.category}</button>

                        <h2 className="Aceh text-black py-2">{article.topic}</h2>
                        <p className='text-red-500'>{article.author}</p>

                        <p className='text-gray-700'>{article.content}</p>
                        <div className="card-actions justify-end">
                        </div>
                      </div>

                    </div>
                  </NavLink>

              );
            })
          ) : (
            <div className="text-center text-2xl font-bold text-gray-500 mt-4 h-48">
              No events found matching your search.
            </div>
          )}
          </div>
          <div className='py-5'>
        <h1 className=' text-green-500 text-2xl  capitalize text-center my-5'>Community Activity</h1>
        <hr></hr>

    </div>
          <div className="  m-auto justify-center flex m-auto ">
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
          className="mySwiper w-full  mx-10 sm:mx-0 py-10 sm:px-10 lg:px-10"
        >
        {activity.length > 0 ? (
            activity.map((activity) => {
              return (
          <SwiperSlide key={activity.id}>
          <NavLink to={`/activity/${activity.title}`}>
            <div className="relative w-72  bg-base-100 text-white shadow-xl  image-full">
              <figure>
                <img src={activity.src} />
              </figure>
              <div className='p-5'>

              <div className="badge text-green-500">{activity.date}</div>
                <h1 className="text-2xl py-2"> {activity.title}</h1>
                <p>{activity.content} </p>
              </div>
            </div>

           </NavLink>
          </SwiperSlide>
          );
            })
          ) : (
            <div className="text-center text-2xl font-bold text-gray-500  h-48">
              No Activity found 
            </div>
          )}

         
        </Swiper>
      </div>
    </div>
  )
}

export default Interest