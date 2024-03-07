/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export const NonUsersNavBar = ({ name }) => {
  return (
    // <div></div>
    <div className="w-full h-10 flex gap-8 sm:overflow-y-scroll">
      {/* chatBox */}
      <Link
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out whitespace-nowrap ${
          location.pathname === `/interest/${name}`
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
        to={`/interest/${name}`}
      >
        Chat Box
      </Link>
      {/* articles */}
      <Link
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          location.pathname === `/interest/${name}/articles`
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
        to={`/interest/${name}/articles`}
      >
        Articles
      </Link>
      {/* activities */}
      <Link
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          location.pathname === `/interest/${name}/activities`
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
        to={`/interest/${name}/activities`}
      >
        Activities
      </Link>
      {/* events */}
      <Link
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          location.pathname === `/interest/${name}/events`
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
        to={`/interest/${name}/events`}
      >
        Events
      </Link>
    </div>
  );
};
