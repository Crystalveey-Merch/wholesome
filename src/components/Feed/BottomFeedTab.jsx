/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openRightBar } from "../../Features/openRightBarSlice";
import { openCreateModal } from "../../Features/openCreateModalSlice";
import { selectUser } from "../../Features/userSlice";
import {
  CreateSVG,
  HomeSVG,
  MessageSVG,
  MoreSVG,
  NotificationSVG,
} from "../../SVG";
import { getProfileDetails } from "../../Hooks";

export const BottomFeedTab = ({ children, users }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectUser);

  const openRightBarSlide = () => {
    dispatch(openRightBar());
  };

  const unseenNotifications = getProfileDetails(
    user?.id,
    users
  )?.notifications.filter((notification) => !notification.hasSeen);

  const setCreateModalOpen = () => {
    dispatch(openCreateModal());
  };

  return (
    <>
      {children}
      <div
        className={` ${
          location.pathname === "/feed"
            ? "hidden fixed z-20 left-0 right-0 w-full bottom-0 cursor-pointer sm:block"
            : "hidden fixed z-20 left-0 right-0 w-full bottom-0 cursor-pointer sm:block"
        }`}
      >
        <div className="bg-white w-full px-5 py-3.5 flex justify-between items-center border-t border-gray-300">
          <Link to="/">
            <HomeSVG />
          </Link>
          <Link to="/messages">
            <MessageSVG />
          </Link>
          <button onClick={setCreateModalOpen}>
            <CreateSVG />
          </button>
          <Link to="/notifications" className="relative">
            <NotificationSVG />
            {unseenNotifications?.length > 0 && (
              <div className="absolute -top-1.5 -right-1.5 font-inter bg-[#FF5841] text-white h-5 w-5 flex justify-center items-center text-xs rounded-full">
                {unseenNotifications.length}
              </div>
            )}
          </Link>
          <div onClick={openRightBarSlide}>
            <MoreSVG />
          </div>
        </div>
      </div>
    </>
  );
};
