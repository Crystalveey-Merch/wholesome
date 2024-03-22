/* eslint-disable react/prop-types */

export const SearchNavBar = ({ currenTab, handleTabChange }) => {
  return (
    <div className="sticky top-0 py-4 pb-2 bg-white w-full flex gap-8 sm:overflow-y-scroll">
      {/* <button className="w-40 px-4 hidden sm:block"></button> */}
      <button
        onClick={() => handleTabChange("all")}
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          currenTab === "all"
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
      >
        All
      </button>
      {/* <button
              onClick={() => handleTabChange("latest")}
              className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
                currenTab === "latest"
                  ? "text-black border-[#FF5841]"
                  : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
              } `}
            >
              Latest
            </button> */}
      <button
        onClick={() => handleTabChange("tags")}
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          currenTab === "tags"
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
      >
        Tags
      </button>
      <button
        onClick={() => handleTabChange("people")}
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          currenTab === "people"
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
      >
        People
      </button>
      <button
        onClick={() => handleTabChange("articles")}
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          currenTab === "articles"
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
      >
        Articles
      </button>
      <button
        onClick={() => handleTabChange("events")}
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          currenTab === "events"
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
      >
        Events
      </button>
      <button
        onClick={() => handleTabChange("activities")}
        className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
          currenTab === "activities"
            ? "text-black border-[#FF5841]"
            : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
        } `}
      >
        Activities
      </button>
    </div>
  );
};
