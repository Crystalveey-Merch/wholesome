import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from 'swiper';
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { activities } from "../data/activity";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock, faLocationPin } from "@fortawesome/free-solid-svg-icons";



const Activity = () => {
  const { activityName } = useParams();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    // Find the   by comparing the name as a string
    const selectedActivity = activities.find((a) => a.title === activityName);

    if (selectedActivity) {
      // Set the selected event in the state
      setActivity(selectedActivity);
    }
  }, [activityName]);

  if (!activity) {
    return <div>Event not found.</div>;
  }

  return (


    <div className="mt-20 sm:mt-18 flex flex-col m-auto justify-center">
    <div>
        <h1 className="bg-red-500 text-center p-2 text-3xl sm:text-2xl">Community Activity</h1>
    </div>
      <div className="m-auto">
        <img src={activity.src} alt={activity.name} width={700} />
      </div>
      <div className="mx-40 my-20 sm:mx-5 sm:my-10">
      <p className="text-gray-500"><FontAwesomeIcon icon={faLocationPin}/> {activity.address}</p>
      <p className="text-gray-500"><FontAwesomeIcon icon={faCalendar}/> {activity.date}</p>
      <h1 className="text-black text-4xl"> {activity.title}</h1>
      <p className="text-green-500 text-xl ">{activity.theme}</p>
      <p className="text-gray-600 py-5">{activity.content}</p>      
 
        </div>
      </div>
   

  )

}

export default Activity