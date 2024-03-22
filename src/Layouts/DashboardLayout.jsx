/* eslint-disable react/prop-types */
import { DashboardHeader, MiniHeader } from "../components/Header";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../Features/userSlice";
import { MobileRightBar } from "../Feed/MobileRightBar";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  //   openRightBar,
  closeRightBar,
  selectOpenRightBar,
} from "../Features/openRightBarSlice";

export const DashboardLayout = ({
  children,
  users,
  allChats,
  posts,
  loading,
  events,
  activities,
}) => {
  const loggedInUser = useSelector(selectUser);
  const dispatch = useDispatch();

  const rightBarSlideOpen = useSelector(selectOpenRightBar);

  const closeRightBarSlide = () => {
    dispatch(closeRightBar());
  };
  return (
    <div className="flex">
      <div className="w-full">
        {loggedInUser ? (
          <DashboardHeader users={users} allChats={allChats} posts={posts} activities={activities} />
        ) : (
          <MiniHeader />
        )}
        {children}
      </div>
      <div
        className={`rightbar-link lg:z-40 ${
          rightBarSlideOpen
            ? "rightbar-link-active lg:bg-[rgba(0,0,0,0.4)] lg:items-end"
            : ""
        }`}
        style={{
          backgroundColor: rightBarSlideOpen ? "" : "transparent",
        }}
        onClick={closeRightBarSlide}
      >
        <div
          className="px-0 min- h-max pt-[16px] pb-9 hidden lg:overflow-y-auto lg:bg-white lg:w-max lg:place-self-end lg:h-full lg:px-4 lg:flex lg:flex-col lg:gap-8 lg:pt[106px] lg:items-end md:pt[90px] sm:mb-1"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="hidden pt-6 lg:block" onClick={closeRightBarSlide}>
            <FontAwesomeIcon
              icon={faXmark}
              className="text-gray-800 cursor-pointer h-6"
            />
          </div>
          <MobileRightBar
            posts={posts}
            loading={loading}
            events={events}
            users={users}
            activities={activities}
          />
        </div>
      </div>
    </div>
  );
};
