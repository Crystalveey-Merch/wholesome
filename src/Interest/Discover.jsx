/* eslint-disable react/prop-types */
import { convertToLowercase } from "../Hooks";
import { Link } from "react-router-dom";

export const Discover = ({ interests }) => {
  return (
    <div className="py-10 mb-10 px-10 flex justify-center w-full lg:px-6">
      <div className="flex flex-col gap-10 justify-start w-max md:w-full">
        {" "}
        <h2 className="text-2xl font-bold text-black sm:text-xl">
          Discover Interest Groups
        </h2>
        <div className="grid grid-cols-4 gap-6 pb-10 lg:grid-cols-3 md:grid-cols-2 md:w-full">
          {interests.map((interest) => (
            <div
              key={interest.id}
              className="w-60 border border-gray-200 rounded-md flex flex-col gap2 justify-start items-start lg:w-56 md:w-full"
            >
              <img
                src={interest.wallPaper}
                alt={interest.name}
                className="w-full h-24 object-cover rounded-t-md"
              />
              <div className="flex flex-col gap-2 p-3 w-full">
                <h3 className="text-base font-semibold text-black sm:text-[0.95rem] one-line-text">
                  {interest.name}
                </h3>
                {/* <p className="text-gray-500">{interest.description}</p> */}
                <Link
                  to={`/i/${convertToLowercase(interest.name)}`}
                  className="w-full px-4 py-2 border border-[#ff5841] rounded-md text-[#ff5841] font-semibold text-center"
                >
                  Join
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
