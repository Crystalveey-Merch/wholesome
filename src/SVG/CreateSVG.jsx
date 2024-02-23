import { useLocation } from "react-router-dom";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { faPlusSquare as solid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CreateSVG = () => {
  const location = useLocation();
  return (
    <div
      className={`h-6 w-6
    ${
      location.pathname === "/createpost" ? "text-[#FF5841]" : "text-[#919EAB]"
    }`}
    >
      <FontAwesomeIcon
        icon={location.pathname === "/createpost" ? solid : faPlusSquare}
        className={`h-6 w-6
          ${location.pathname === "/createpost" ? "#FF5841" : "#919EAB"}`}
      />
    </div>
  );
};
