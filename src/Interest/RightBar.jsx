/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { selectUser } from "../Features/userSlice";
import { convertToLowercase } from "../Hooks";

export const RightBar = ({ interest }) => {
  const loggedInUser = useSelector(selectUser);
  const navigate = useNavigate();

  return (
    <div className="w-80 h-min  max-h-[calc(100vh-110px)] flex justify-end">
      <div className="w-full h-full flex flex-col gap-4 px-4 overflow-y-scroll scroll-bar-beauty border border-gray-200 rounded-xl">
        <div className="py-4 flex flex-col gap-4 border-bborder-gray-200">
          {" "}
          {interest.description !== "" ? (
            <div className="w-full flex flex-col gap-2">
              <h1 className="text-lg font-semibold text-black font-inter">
                About
              </h1>
              <p className="text-black font-inter text-sm">
                {interest.description}
              </p>
            </div>
          ) : (
            <>
              {interest?.moderators?.some(
                (moderator) => moderator?.userId === loggedInUser?.id
              ) ? (
                <div>
                  <button
                    onClick={() => {
                      navigate(`/i/${convertToLowercase(interest.name)}/edit`);
                    }}
                    className="w-full flex gap-2 items-center"
                  >
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      className="text-red-600 h-5 w-5"
                    />
                    <h4 className="text-base font-inter font-semibold text-black">
                      Add Description
                    </h4>
                  </button>
                </div>
              ) : (
                <></>
              )}
            </>
          )}
          <div className="">
            <p className="font-inter text-sm">
              <span className="font-semibold text-black">Members:</span>{" "}
              <span className="text-black font-medium">
                {interest?.members?.length}
              </span>
            </p>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};
