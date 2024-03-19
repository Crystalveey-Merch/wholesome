import { useParams, NavLink, useNavigate } from "react-router-dom";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ConnectionHeader = () => {
  const navigate = useNavigate();
  const { username } = useParams();

  return (
    <div className="w-full pb-8 flex flex-col gap-10 sm:-mt-4">
      <div className="h-24 bg-gradient-to-br from-red-300 via-orange-200 to-red-300 px-10 py-5">
        <div>
          <button
            onClick={() => navigate(`/${username}`)}
            className="py-2.5 px-3 bg-white rounded-md md:py-2"
          >
            <FontAwesomeIcon
              icon={faArrowLeftLong}
              className="h-8 w-8 md:h-6 md:w-6 sm:h-5 sm:w-5"
            />
          </button>
        </div>
      </div>
      <div className="bg-white w-96 p-4 shadow-lg rounded-lg mx-auto font-semibold text-base flex gap-10 sm:w-[370px] sm:p-3">
        <NavLink
          to={`/${username}/followers`}
          className={({ isActive }) =>
            isActive
              ? "p-3 text-center w-2/5 rounded-md bg-red-100 text-red-800 transition duration-500 ease-in-out"
              : "p-3 text-center w-2/5 rounded-md text-red-600 transition duration-500 ease-in-out hover:text-red-800 hover:bg-red-100"
          }
        >
          Followers
        </NavLink>
        <NavLink
          to={`/${username}/following`}
          className={({ isActive }) =>
            isActive
              ? "p-3 text-center w-2/5 rounded-md bg-red-100 text-red-800 transition duration-500 ease-in-out"
              : "p-3 text-center w-2/5 rounded-md text-red-600 transition duration-500 ease-in-out hover:text-red-800 hover:bg-red-100"
          }
        >
          Following
        </NavLink>
      </div>
    </div>
  );
};
