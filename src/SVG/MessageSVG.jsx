import { useLocation } from "react-router-dom";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faEnvelope as solid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const MessageSVG = () => {
  const location = useLocation();
  return (
    <div
      className={`h-6 w-6
    ${location.pathname === "/messages" ? "text-[#FF5841]" : "text-[#000000]"}`}
    >
      <FontAwesomeIcon
        icon={location.pathname === "/messages" ? solid : faEnvelope}
        className={`h-6 w-6
          ${location.pathname === "/messages" ? "#FF5841" : "#000000"}`}
      />
    </div>
  );
};
