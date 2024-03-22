import { Link } from "react-router-dom";

export const AllInterestNavBar = () => {
  return (
    <div className="sticky top-0 pt-6 bg-white w-full min-h-10 flex gap-8 sm:overflow-y-scroll sm:px-2">
      {/* chatBox */}
      <Link
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out whitespace-nowrap ${
          location.pathname === `/`
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
        to={`/`}
      >
        Chat Box
      </Link>
      {/* articles */}
      <Link
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          location.pathname === `/interest/articles`
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
        to={`/interest/articles`}
      >
        Articles
      </Link>
      {/* activities */}
      <Link
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          location.pathname === `/interest/activities`
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
        to={`/interest/activities`}
      >
        Activities
      </Link>
      {/* events */}
      <Link
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          location.pathname === `/interest/events`
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
        to={`/interest/events`}
      >
        Events
      </Link>
      {/* podcasts */}
      <Link
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          location.pathname === `/interest/podcasts`
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
        to={`/interest/podcasts`}
      >
        Podcasts
      </Link>
    </div>
  );
};
