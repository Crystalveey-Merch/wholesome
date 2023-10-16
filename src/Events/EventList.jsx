import { NavLink } from "react-router-dom";
import { events } from "../data/events"
import { useParams } from "react-router";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAnglesDown } from "@fortawesome/free-solid-svg-icons";



const EventList = () => {

  const { eventName } = useParams();
  const [searchInput, setSearchInput] = useState("");
  const filteredEvents = events.filter((event) => {
    const searchText = searchInput.toLowerCase();
    return (
      event.name.toLowerCase().includes(searchText) ||
      event.address.toLowerCase().includes(searchText) ||
      event.tags.some((tag) => tag.toLowerCase().includes(searchText))
    );
  });

  const collectionProduct = () => {
    return events.filter((event) => event.name === eventName);
  };
  
  return (
    <div className="mt-20   sm:mt-18">
      <div className="h-96" style={{ backgroundImage: "url(/Images/Events/headimg.jpeg)", backgroundRepeat: "none" }}>
        <div className="h-full bg-green-700/75">
          <h1 className="text-white text-center sm:text-4xl pt-24 sm:pt-14">See upcoming Events Around You</h1>
          <hr className="w-64 m-auto my-5"></hr>
          <p className="text-base-500 text-center text-xl font-bolder">Discover, Explore, Attend: Your Event Search Starts Here</p>
          <div className="m-auto flex flex-col gap-2  justify-center py-5">
          <p className="m-auto text-gray-300" >Search event by name, tags and location</p>
          <p className=" m-auto text-gray-300   ">
            <FontAwesomeIcon icon={faAnglesDown}/>
          </p>
            <input type="text" className="bg-transparent border rounded-full p-3 w-64 m-auto" placeholder="Search an event/location" value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}></input>
          </div>
        </div>
      </div>



      <div className="flex m-auto justify-center gap-10 m-10 flex-wrap  ">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
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

          );
        })
        ):(
            <div className="text-center text-2xl font-bold text-gray-500 mt-4 h-48">
            No events found matching your search.
          </div>
          )}
      </div>
      <div>

      </div>
    </div>
  )
}

export default EventList