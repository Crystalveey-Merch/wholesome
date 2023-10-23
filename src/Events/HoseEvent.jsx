import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HostEvent = () => {
  return (
    <div className="w-screen">
      <div className=" ">
        <div className="h-full bg-red-800 sm:py-5 relative w-full">
          <img
            src="/Images/Events/host/meeeting2.jpeg"
            className="w-full relative"
          ></img>
          <div className="absolute sm:relative sm:top-0 sm:right-0 px-5 top-80 right-10">
            <h1 className="text-white text-left sm:text-4xl pt-10 sm:pt-10 text-8xl">
              Host a Meetup
            </h1>
            <hr className="w-64 my-5"></hr>
            <p className="text-white text-left text-2xl  Aceh font-bolder">
              Empower Your Community: Create a Meetup Today
            </p>
          </div>
        </div>
<div className="bg-gray-800 py-20 ">
<h1 className="text-red-500  text-center text-2xl">Reach the right people
</h1>
        <div className="m-auto flex sm:flex-col  gap-5 sm:gap-10 px-5   sm:px-0 sm:py-5  py-10 justify-center ">
       
          <div className="flex gap-5  flex-col w-72 sm:w-full p-5">
            <img src="/Images/Events/host/meeting.jpeg"  className="m-auto" />
            <div className="text-center">
              <h1 className="text-xl text-green-500">Attendee Discovery</h1>
              <p className="text-gray-200 ">
                Personalised recommendations are tailored to attendees 
                interests and location, matching them with events they’d be most
                interested in attending
              </p>
            </div>
          </div>
          <div className="flex gap-5 flex-col  w-72 sm:w-full  p-5">
            <img src="/Images/Events/host/meeting3.jpeg"  className="m-auto" />
            <div className="text-center">
              <h1 className="text-xl text-green-500">Promotion</h1>
              <p className="text-gray-200 ">
              Promote your event across wholesome and get 14x more visibility on our homepage, related events, search results, and more
              </p>
            </div>
          </div>
          <div className="flex  gap-5 flex-col w-72 sm:w-full  p-5">
            <img src="/Images/Events/host/meeting4.jpeg" className="m-auto" />
            <div className="text-center">
              <h1 className="text-xl text-green-500 text-center">Attendee Discovery</h1>
              <p className="text-gray-200 ">
                Personalised recommendations are tailored to attendees'
                interests and location, matching them with events they’d be most
                interested in attending
              </p>
            </div>
          </div>
        </div>
    </div>
        <div className="mx-40 px-40 sm:mx-5 sm:px-5">
<h1 className="text-center text-black py-10 text-2xl ">Fill Event/Meetup Details</h1>
<div className="flex flex-col gap-2 py-5">
<label className="text-gray-500 Aceh text-sm"> Event Name</label>
<input className="p-3 bg-transparent border rounded-xl text-black"></input>
</div>
<div className="flex flex-col gap-2">
<label className="text-gray-500 Aceh text-sm"> Theme</label>
<input className="p-3 bg-transparent border rounded-xl text-black"></input>
</div>
<div className="flex flex-col gap-2 py-2">
<label className="text-gray-500 Aceh text-sm"> Date/Time</label>
<input type="datetime-local" className="p-3 bg-transparent border rounded-xl text-black"></input>
</div>
<div className="flex flex-col gap-2 py-2">
<label className="text-gray-500 Aceh text-sm"> Category</label>
<input type="text" className="p-3 bg-transparent border rounded-xl text-black"></input>
</div>
<div className="flex flex-col gap-2 py-2">
<label className="text-gray-500 Aceh text-sm"> Address</label>
<input type="text" className="p-3  bg-transparent border rounded-xl  text-black"></input>
</div>
<div className="flex flex-col gap-2 py-2">
<label className="text-gray-500 Aceh text-sm"> Description of Event</label>
<input type="text" className="p-3 bg-transparent border rounded-xl text-black"></input>
</div>
<div className="flex flex-col gap-2 py-2">
<label className="text-gray-500 Aceh text-sm">Tags</label>
<input type="text" className="p-3 bg-transparent border rounded-xl  text-black"></input>
</div>
<p className="text-center text-xl text-red-300 py-2 my-5 border-b">Organizers Details</p>
<div className="flex flex-col gap-2 py-2">
<label className="text-gray-500 Aceh text-sm"> Organizers Name</label>
<input type="text" className="p-3 bg-transparent border rounded-xl text-black"></input>
</div>
<div className="flex flex-col gap-2 py-2">
<label className="text-gray-500 Aceh text-sm"> Twitter</label>
<input type="text" className="p-3 bg-transparent border rounded-xl  text-black"></input>
</div>
<div className="flex flex-col gap-2 py-2">
<label className="text-gray-500 Aceh text-sm"> Website</label>
<input type="text" className="p-3 bg-transparent border rounded-xl text-black"></input>
</div>
<div className="flex flex-col gap-2 py-2">
<label className="text-gray-500 Aceh text-sm"> Phone Number</label>
<input type="text" className="p-3 bg-transparent border rounded-xl text-black"></input>
</div>
<div className="flex flex-col gap-2 py-2">
<label className="text-gray-500 Aceh text-sm"> About Organiser</label>
<input type="text" className="p-3 bg-transparent border rounded-xl text-black"></input>
</div>

<button className=" btn m-auto flex my-5 p-3 w-40 bg-green-500 text-white border-none ">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default HostEvent;
