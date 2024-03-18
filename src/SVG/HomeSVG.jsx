import { useLocation } from "react-router-dom";
import { faHouse as solid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const HomeSVG = () => {
  const location = useLocation();
  return (
    <div
      className={`h-6 w-6
    ${
      location.pathname === "/"
        ? "text-[#FF5841]"
        : location.pathname === "/interest/articles"
        ? "text-[#FF5841]"
        : location.pathname === "/interest/activities"
        ? "text-[#FF5841]"
        : location.pathname === "/interest/events"
        ? "text-[#FF5841]"
        : location.pathname === "/interest/podcasts"
        ? "text-[#FF5841]"
        : "text-[#000000]"
    }`}
    >
      <FontAwesomeIcon
        icon={location.pathname === "/" ? solid : solid}
        className={`h-6 w-6
            ${location.pathname === "/" ? "#FF5841" : "#000000"}`}
      />
    </div>
  );
};
