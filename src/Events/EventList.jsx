import { NavLink } from "react-router-dom";
import { events } from "../data/events"
import { useParams } from "react-router";


const EventList = () => {

  const { eventName } = useParams();

  const collectionProduct = () => {
    return events.filter((event) => event.name === eventName);
  };
  return (
    <div className="mt-20   sm:mt-18">
      <div className="h-96" style={{ backgroundImage: "url(/Images/Events/headimg.jpeg)", backgroundRepeat: "none" }}>
        <div className="h-full bg-green-700/75">
          <h1 className="text-white text-center sm:text-4xl pt-40 sm:pt-20">See upcoming Events Around You</h1>
          <hr className="w-64 m-auto my-5"></hr>
          <p className="text-base-500 text-center text-xl font-bolder">Discover, Explore, Attend: Your Event Search Starts Here</p>
          <div className="m-auto flex justify-center p-5">
            <input type="text" className="bg-transparent border rounded-full p-3 w-64" placeholder="Search an event/location"></input>
          </div>
        </div>
      </div>



      <div className="flex m-auto justify-center gap-10 m-10 flex-wrap  ">
        {events.map((event) => {
          return (
            <div key={event.id} className="w-80 bg-white    shadow  dark:border-gray-700">
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

          )
        })}
      </div>
      <div>

      </div>
    </div>
  )
}

export default EventList