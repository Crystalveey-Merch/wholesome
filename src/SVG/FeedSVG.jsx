import { useLocation } from "react-router-dom";

export const FeedSVG = () => {
  const location = useLocation();
  return (
    <div className="w-6 h-6">
      <svg
        viewBox="0 0 24 24"
        fill={location.pathname === "/feed" ? "#FF5841" : "none"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 2H9C8.4 2 8 2.4 8 3V6C8 6.6 8.4 7 9 7H21C21.6 7 22 6.6 22 6V3C22 2.4 21.6 2 21 2ZM12 17H7V22H12V17ZM7 9.5H2V14.5H7V9.5ZM18 9.6H9.5V14.3H18V9.6Z"
          stroke={location.pathname === "/feed" ? "#FF5841" : "#919EAB"}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
