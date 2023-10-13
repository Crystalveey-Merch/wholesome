import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup, faHandHoldingHand, faSeedling, faPeoplePulling, faHandsHoldingChild , faQuestion, faUserGroup} from "@fortawesome/free-solid-svg-icons";

const Aboutus = () => {
  return (
    <>
      <div className="mt-16   sm:mt-18 relative overflow-hidden ">
      <div className=" mt-5 sm:mt-0 w-screen h-fit ">
        <div className="hero-main absolute sm:w-screen sm:ml-0 sm:h-40">
        <div className="py-10 flex justify-center text-white bg-red-500/50 h-full ">
            <h1 className="pt-20 sm:pt-5 sm:text-4xl pl-5 text-md ">
              Our Mission and Values
            </h1>
            <hr></hr>
          </div>
        </div>
        </div>
        <div className="relative mt-96 sm:mt-40 pt-10 px-20 sm:px-5">
          
          {/* <div
            style={{ height: "300px" }}
            className="sm:h-full z-0 sm:hidden absolute w-screen rounded-b-full border  top-0  overflow-hidden"
          >
            <img src="/Images/friends1.jpg" className="  " width={1900}></img>
          </div> */}
          <div className="mt-20 sm:mt-5 relative px-40 sm:px-0   flex m-auto  justify-center sm:w-full sm:flex sm:flex-col sm:justify-center">
          <div className="px-20 sm:px-0">
            <h2 className="text-red-500 text-xl Aceh sm:text-center ">
              OUR MISSION
            </h2>
            <hr className="mb-5"></hr>

            <p className="text-black text-sm sm:text-center ">
              Community Corporation of Santa Monica fosters a more inclusive,
              caring, and environmentally sustainable city where each person has
              a home in which to live and thrive with dignity. We improve lives
              and neighborhoods by restoring, building, and managing affordable
              housing for people of modest means. We work to advance the values
              that Santa Monica residents share and to enrich the community for
              all.
            </p>
            </div>
            <img src="/Images/friends1.jpg" width={400} className="p-5"/>
          </div>
          <div className="mt-20 mb-10" id="values">
            <h2 className="text-red-500 text-xl Aceh text-center  ">OUR VALUES</h2>
            <hr></hr>
          </div>
          <ul className="text-black text-md gap-4 flex flex-wrap m-auto justify-center mb-10 ">
          <li className="mb-2 border  rounded-lg text-center text-white p-4 w-72 shadow shadow-xl bg-red-500">
              <div className="Aceh text-lg">Inclusiveness:</div>
              <div><FontAwesomeIcon icon={faPeoplePulling} className="text-6xl p-5"/></div>
              Inclusiveness: We work to make Santa Monica a more inclusive and
              vibrant place to live, contributing to the City’s distinct
              character.
            </li>
            
            <li className="mb-2 border  rounded-lg text-center text-white p-4 w-72 shadow shadow-xl bg-green-600">
              <div className="Aceh text-lg">Sustainability:</div>
              <div><FontAwesomeIcon icon={faSeedling} className="text-6xl p-5"/></div>

               Since our founding, Community Corp. has been
              focused on helping to create environmentally sustainable
              communities. We build green, affordable housing properties that
              bring together the latest sustainable building practices and
              living features. These properties allow families to live in
              neighborhoods near their schools and workplaces—limiting commutes
              and reducing carbon emissions.
            </li>
            
            <li className="mb-2 brder text-white  rounded-lg text-center p-4 w-72 shadow-xl bg-amber-600 ">
            <div className="Aceh text-lg"> Opportunity:</div>
              <div><FontAwesomeIcon icon={faHandHoldingHand} className="text-6xl p-5"/></div>
              We create opportunities for families of modest means
              to build brighter futures by providing access to homes where they
              can flourish.
            </li>
            <li className="mb-2 brder text-white  rounded-lg text-center p-4 w-72 shadow-xl bg-gray-500 ">
            <div className="Aceh text-lg"> Community:</div>
              <div><FontAwesomeIcon icon={faPeopleGroup} className="text-6xl p-5"/></div>
              We preserve historically significant structures and
              replace underutilized properties with innovative affordable
              buildings that capture the essence of their neighborhoods. By
              preserving the past and innovating the future, we strive to
              contribute to Santa Monica’s unique architectural character and
              community.
            </li>
          </ul>

          <div className="mt-20 mb-10" id="whatwedo">
            <h2 className="text-red-500 text-xl Aceh text-center  ">WHAT WE DO</h2>
            <hr></hr>
          </div>

          <div className="flex sm:block px-40 mb-20 sm:px-5">
            <div className="w-1/2 sm:w-full p-auto h-auto">
              <h1 className="text-red-500 my-20 ">WHOLESOME</h1>
            </div>
            <div className="flex flex-col gap-6 w-1/2 sm:w-full">
              <div className="flex gap-4">
                <FontAwesomeIcon icon={faHandsHoldingChild} className="text-3xl border rounded-full p-4 text-gray-500"/>
                <span>
                <h1 className="text-xl text-gray-800 ">MENTORSHIP</h1>
                <p className="text-gray-600">Because this is a MAJOR pain point for our community. I know how to find a mentor and I'm giving you the cheat codes so you can get one.</p>
                </span>
              </div>
              <div className="flex gap-4">
                <FontAwesomeIcon icon={faQuestion} className="text-3xl border rounded-full p-4 text-gray-500"/>
                <span>
                <h1 className="text-xl text-gray-800">RESOURCE HUB</h1>
                <p className="text-gray-600">with challenges, courses and downloadables to help you level up professionally and personally</p>
                </span>
              </div>
              <div className="flex gap-4">
                <FontAwesomeIcon icon={faUserGroup} className="text-3xl border rounded-full p-4 text-gray-500"/>
                <span>
                <h1 className="text-xl text-gray-800">A DOPE COMMUNITY</h1>
                <p className="text-gray-600">to build a squad with (Are you a Truth Teller or Bridge Builder or Heart Helper or Mind Molder? - Find your people.)</p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Aboutus;
