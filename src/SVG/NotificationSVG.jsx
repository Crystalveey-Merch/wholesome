import { useLocation } from "react-router-dom";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faBell as solid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const NotificationSVG = () => {
  const location = useLocation();
  return (
    <div
      className={`h-6 w-6
    ${
      location.pathname === "/notifications"
        ? "text-[#FF5841]"
        : "text-[#919EAB]"
    }`}
    >
      <FontAwesomeIcon
        icon={location.pathname === "/notifications" ? solid : faBell}
        className={`h-6 w-6
            ${location.pathname === "/notifications" ? "#FF5841" : "#919EAB"}`}
      />
    </div>
  );
};
