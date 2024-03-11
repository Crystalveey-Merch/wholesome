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
        <div className="flex flex-wrap gap-10 gap-y-6">
          {interests.map((interest) => (
            <Link
              to={`/i/${convertToLowercase(interest.name)}`}
              key={interest.id}
              className="w-max min-w-[150px] p-2 border border-gray-200 rounded-full flex gap-2 justify-start items-center transition ease-in-out duration-300 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={interest.wallPaper}
                alt={interest.name}
                className="w-10 max-w-10 h-10 max-w-[40px] rounded-full object-cover"
              />
              <div className="flex flex-col gap-2 w-full">
                <h3 className="text-base font-semibold text-black sm:text-[0.95rem] one-line-text">
                  {interest.name}
                </h3>
                {/* <p className="text-gray-500">{interest.description}</p> */}
                {/* <Link
                  to={`/i/${convertToLowercase(interest.name)}`}
                  className="w-full px-4 py-2 border border-[#ff5841] rounded-md text-[#ff5841] font-semibold text-center"
                >
                  Join
                </Link> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
