import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleGroup,
  faHandHoldingHand,
  faSeedling,
  faPeoplePulling,
  faHandsHoldingChild,
  faQuestion,
  faUserGroup,
  faMaskFace,
  faMask,
  faMasksTheater,
  faThumbtack,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
import { faConnectdevelop } from "@fortawesome/free-brands-svg-icons";

const Aboutus = () => {
  document.addEventListener("DOMContentLoaded", function () {
    var element = document.getElementById("whatwedo");
    if (element) {
      console.log(element.offsetTop);
    }
  });
  return (
    <>
      <Helmet>
        <title>About Wholesquare</title>
        <meta
          name="description"
          content="Wholesquare helps foster connections with like-minds that transcends borders and also share your experiences, knowledge and creativity"
        />
        <link rel="canonical" href="/aboutus" />
      </Helmet>
      <div className="mt-16   sm:mt-18 relative overflow-hidden w-screen ">
        <div className=" mt-5 sm:mt-0 h-fit w-screen ">
          <div className="hero-main absolute sm:w-screen sm:ml-0 sm:h-40 ">
            <div className="py-10 flex justify-center text-white bg-red-500/50 h-full  ">
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

              <p className="text-black text-xl sm:text-center ">
                Empowering Connections, Inspiring Conversations: We're dedicated
                to building a vibrant online community that fosters personal and
                professional growth. Our platform celebrates diversity and
                positive engagement, offering a range of interest groups
                including Health and Wellness, Travel & Events, Lifestyle &
                Fashion, and more. Join us in this social network designed for
                relaxation, enjoyment, and insight, as we connect, collaborate,
                and explore together!
              </p>
            </div>
            <img src="/Images/friends1.jpg" width={400} className="p-5" />
          </div>
          <div className="mt-20 mb-10" id="values">
            <h2 className="text-red-500 text-xl Aceh text-center  ">
              OUR VALUES
            </h2>
            <hr></hr>
          </div>
          <ul className="text-black text-md gap-4 flex flex-wrap m-auto justify-center mb-10 ">
            <li className="mb-2 border  rounded-lg text-center text-white p-4 w-72 shadow shadow-xl bg-red-500">
              <div className="Aceh text-lg">Integrity:</div>
              <div>
                <FontAwesomeIcon icon={faThumbsUp} className="text-6xl p-5" />
              </div>
              Maintaining sincerity and openness in all dealings and
              correspondence.
            </li>

            <li className="mb-2 border  rounded-lg text-center text-white p-4 w-72 shadow shadow-xl bg-green-600">
              <div className="Aceh text-lg">Inclusivity:</div>
              <div>
                <FontAwesomeIcon icon={faSeedling} className="text-6xl p-5" />
              </div>
              Promoting an environment that is inclusive, diverse, and values
              and respects each individual.
            </li>

            <li className="mb-2 brder text-white  rounded-lg text-center p-4 w-72 shadow-xl bg-amber-600 ">
              <div className="Aceh text-lg"> Innovation:</div>
              <div>
                <FontAwesomeIcon
                  icon={faHandHoldingHand}
                  className="text-6xl p-5"
                />
              </div>
              Fostering imagination, progressive thinking, and ongoing
              development.
            </li>
            <li className="mb-2 brder text-white  rounded-lg text-center p-4 w-72 shadow-xl bg-gray-500 ">
              <div className="Aceh text-lg"> Community:</div>
              <div>
                <FontAwesomeIcon
                  icon={faPeopleGroup}
                  className="text-6xl p-5"
                />
              </div>
              Putting our users' relationships and general well-being first.
            </li>
            <li className="mb-2 brder text-white  rounded-lg text-center p-4 w-72 shadow-xl bg-teal-700 ">
              <div className="Aceh text-lg"> Opportunity:</div>
              <div>
                <FontAwesomeIcon
                  icon={faConnectdevelop}
                  className="text-6xl p-5"
                />
              </div>
              Fostering an atmosphere that acknowledges and supports chances for
              both professional and personal development, giving people the
              ability to reach their full potential and discover new paths.
            </li>
            <li className="mb-2 brder text-white  rounded-lg text-center p-4 w-72 shadow-xl bg-sky-500 ">
              <div className="Aceh text-lg"> Fun:</div>
              <div>
                <FontAwesomeIcon
                  icon={faMasksTheater}
                  className="text-6xl p-5"
                />
              </div>
              Including a joyful and upbeat component into user experience
            </li>
          </ul>

          <div className="mt-20 mb-10" id="whatwedo">
            <h2 className="text-red-500 text-xl Aceh text-center  ">
              WHAT WE DO
            </h2>
            <hr></hr>

            <div className="flex  sm:block px-10 mb-20 sm:px-5 py-14">
              <div className="flex sm:flex-col gap-6  sm:w-full">
                <div className="flex gap-4 text-xl">
                  <FontAwesomeIcon
                    icon={faHandsHoldingChild}
                    className="text-3xl border rounded-full p-4 w-10 h-10 text-gray-500"
                  />
                  <span>
                    <h1 className="text-xl text-gray-800 ">
                      Facilitate Connections:
                    </h1>
                    <p className="text-gray-600">
                      Our engaging web-based forum unites individuals across
                      diverse interest groups, fostering profound connections
                      and meaningful exchanges in areas like Health and
                      Wellness, Travel & Events, Lifestyle & Fashion, and more.
                    </p>
                  </span>
                </div>
                <div className="flex gap-4  text-xl">
                  <FontAwesomeIcon
                    icon={faQuestion}
                    className="text-3xl border rounded-full p-4 w-10 h-10 text-gray-500"
                  />
                  <span>
                    <h1 className="text-xl text-gray-800">
                      Encourage Diversity:
                    </h1>
                    <p className="text-gray-600">
                      We create a welcoming space on our platform for a spectrum
                      of conversations and viewpoints within these interest
                      groups, promoting inclusivity.
                    </p>
                  </span>
                </div>
                <div className="flex gap-4  text-xlsec">
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    className="text-3xl border rounded-full p-4 w-10 h-10 text-gray-500"
                  />
                  <span>
                    <h1 className="text-xl text-gray-800">
                      Empowerment and Growth:
                    </h1>
                    <p className="text-gray-600">
                      Through cutting-edge functionality and user-centric
                      design, we empower our community to thrive individually
                      and collectively, exploring a broad range of interest
                      groups for personal and professional development.
                    </p>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Aboutus;
