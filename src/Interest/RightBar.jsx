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

  const defaultRules = [
    {
      id: 1,
      title: "Be respectful",
      description:
        "Treat others the way you would like to be treated. Do not insult, bully, or harass others.",
    },
    {
      id: 2,
      title: "No hate speech",
      description:
        "Do not promote or encourage hatred, violence, or discrimination against individuals or groups.",
    },
    {
      id: 3,
      title: "No spam",
      description: "Do not post irrelevant or unsolicited messages or content.",
    },
    // {
    //   id: 4,
    //   title: "No self-promotion",
    //   description:
    //     "Do not use the interest group to promote your own content or business",
    // },
  ];
  return (
    <div className="w-80 h-min  max-h-[calc(100vh-110px)] flex justify-end">
      <div className="w-full h-full flex flex-col gap-4 py-6 px-4 overflow-y-scroll scroll-bar-beauty border border-gray-200 rounded-xl">
        <div className="flex flex-col gap-4">
          {" "}
          {interest.description !== "" ? (
            <div className="w-full flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-black font-inter">
                About
              </h3>
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
                      navigate(
                        `/i/${convertToLowercase(interest.name)}/settings/edit`
                      );
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
                <>
                  <h3 className="text-lg font-semibold text-black font-inter">
                    About
                  </h3>
                </>
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
        <hr className="bg-gray-200" />
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-black font-inter">Rules</h3>
          {interest?.rules?.length > 0 ? (
            <></>
          ) : (
            <ul className="flex flex-col gap-2">
              {defaultRules.map((rule, index) => (
                <li key={index} className="flex gap-2">
                  <p>{index + 1}.</p>
                  <div className="flex flex-col gap-1">
                    {/* title and description */}
                    <h4 className="text-black font-inter font-semibold">
                      {rule.title}
                    </h4>
                    <p className="text-gray-700 font-inter text-sm">
                      {rule.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
