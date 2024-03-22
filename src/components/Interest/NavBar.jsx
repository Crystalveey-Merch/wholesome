/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export const NavBar = ({ name }) => {
  return (
    <div className="sticky top-0 pt-4 bg-white w-full min-h-10 flex gap-8 sm:overflow-y-scroll">
      {/* chatBox */}
      <Link
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out whitespace-nowrap ${
          location.pathname === `/i/${name}`
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
        to={`/i/${name}`}
      >
        Chat Box
      </Link>
      {/* articles */}
      <Link
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          location.pathname === `/i/${name}/articles`
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
        to={`/i/${name}/articles`}
      >
        Articles
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
      {/* podcasts */}
      <Link
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          location.pathname === `/i/${name}/podcasts`
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
        to={`/i/${name}/podcasts`}
      >
        Podcasts
      </Link>
      {/* about */}
      <Link
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out hidden lg:block ${
          location.pathname === `/i/${name}/about`
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
        to={`/i/${name}/about`}
      >
        About
      </Link>
    </div>
  );
};
