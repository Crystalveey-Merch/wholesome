/* eslint-disable react/prop-types */
// import { useSelector } from "react-redux";
import { SettingsSideBar } from ".";
// import { selectUser } from "../Features/userSlice";

export const Settings = ({ children }) => {
  //   const loggedInUser = useSelector(selectUser);

  return (
    <div className="flex place-self-end justify-self-end align-bottom justify-items-end h-[calc(100vh)] pt-[90px] overflow-hidden flex-row w-screen md:pt-[78px]">
      <SettingsSideBar />
      <div className="flex-1 overflow-auto w-full">{children}</div>
    </div>
  );
};
