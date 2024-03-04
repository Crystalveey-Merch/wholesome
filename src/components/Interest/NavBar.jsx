/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export const NavBar = ({ name }) => {
  return (
    <div className="w-full h-10 flex gap-8">
      {/* chatBox */}
      <Link
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          location.pathname === `/i/${name}`
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
        to={`/i/${name}`}
      >
        Chat Box
      </Link>
      {/* activities */}
      <Link
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          location.pathname === `/i/${name}/activities`
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
        to={`/i/${name}/activities`}
      >
        Activities
      </Link>
      {/* events */}
      <Link
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          location.pathname === `/i/${name}/events`
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
        to={`/i/${name}/events`}
      >
        Events
      </Link>
    </div>
  );
};
