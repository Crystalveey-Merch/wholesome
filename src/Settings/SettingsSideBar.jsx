import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import mailPen from "./assets/mail-pencil.svg";
import { Link } from "react-router-dom";

export const SettingsSideBar = () => {
  return (
    <div className="border-r border-gray-200 w-96 flex flex-col h-full px-6 2xl:w-[350px] xl:w-80 lg:w-72 md:w-[calc(100vw-1rem)] sm:min-h-full md:overflow-auto">
      <div className="py-6 flex flex-col gap-8">
        <h3 className="text-xl font-bold text-black">Settings</h3>
        <div className="flex flex-col gap-4">
          {/* account settings */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-medium uppercase text-black">
              Account Settings
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to="/settings/account/profile"
                className={`flex gap-4 items-center px-4 py-2.5 rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-gray-100 ${
                  location.pathname === "/settings/account/profile"
                    ? "bg-gray-100"
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={location.pathname === "" ? faUserPen : faUserPen}
                  className="text-gray-900 h-5 w-5"
                />
                <p className="text-gray-900 font-inter text-sm font-medium">
                  Profile Information
                </p>
              </Link>
              <Link
                to="/settings/account/email-and-password"
                className={`flex gap-4 items-center px-4 py-2.5 rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-gray-100 ${
                  location.pathname === "/settings/account/email-and-password"
                    ? "bg-gray-100"
                    : ""
                }`}
              >
                <img src={mailPen} alt="mailPen" className="h-5 w-5" />

                <p className="text-gray-900 font-inter text-sm font-medium">
                  Email and Password
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
