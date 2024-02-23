/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openRightBar } from "../../Features/openRightBarSlice";
import { CreateSVG, FeedSVG, MoreSVG, NotificationSVG } from "../../SVG";

export const BottomFeedTab = ({ children }) => {
  const dispatch = useDispatch();

  const openRightBarSlide = () => {
    dispatch(openRightBar());
  };

  return (
    <>
      {children}
      <div
        className={` ${
          location.pathname === "/feed"
            ? "hidden fixed z-10 left-0 right-0 w-full bottom-0 cursor-pointer sm:block"
            : "hidden fixed z-10 left-0 right-0 w-full bottom-0 cursor-pointer sm:block"
        }`}
      >
        <div className="bg-white w-full px-7 py-3.5 flex justify-between items-center border-t border-gray-300">
          <Link to="/feed">
            <FeedSVG />
          </Link>
          <Link to="/createpost">
            <CreateSVG />
          </Link>
          <Link to="/notifications">
            <NotificationSVG />
          </Link>
          <div onClick={openRightBarSlide}>
            <MoreSVG />
          </div>
        </div>
      </div>
    </>
  );
};
