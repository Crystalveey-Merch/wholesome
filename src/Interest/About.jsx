/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  convertToLowercase,
  getProfileDetails,
  handleFollow,
  handleFormatTimestampToDate,
} from "../Hooks";
import {
  faGlobe,
  faPeopleGroup,
  faCalendarPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";

export const About = ({ interests, users }) => {
  const { name } = useParams();
  const navigate = useNavigate();
  const loggedInUser = useSelector(selectUser);
  const [interest, setInterest] = useState(null);

  useEffect(() => {
    if (!name) return;
    const interest = interests.find(
      (interest) => convertToLowercase(interest.name) === name
    );
    setInterest(interest);
  }, [name, interests]);

  if (!interest) return null;

  return (
    <div className="pt10 pb-10 sm:px-2">
      <div className="flex flex-col gap-7 pb-10">
        <div className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-lg font-semibold text-black font-inter">
              Interest Group Info
            </h3>
            <p className="font-inter text-[0.95rem] text-gray-500">
              {interest?.description}
            </p>
          </div>
          <div className="flex flex-col gap-3.5">
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon
                icon={faPeopleGroup}
                className="h-6 w-6 text-black sm:h-5 sm:w-5"
              />
              <div className="flex flex-col gap-1">
                <h4 className="text-base font-inter font-semibold text-black">
                  General
                </h4>
                <p className="text-gray-500 font-inter text-sm">
                  Anyone can create articles, activities, events and podcasts
                  but only members can engage in chatBox.
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon
                icon={faGlobe}
                className="h-6 w-6 text-black sm:h-5 sm:w-5"
              />
              <div className="flex flex-col gap-1">
                <h4 className="text-base font-inter font-semibold text-black">
                  Privacy
                </h4>
                <p className="text-gray-500 font-inter text-sm">
                  Anyone can see the interest group and join it.
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon
                icon={faCalendarPlus}
                className="h-6 w-6 text-black sm:h-5 sm:w-5"
              />
              <div className="flex flex-col gap-1">
                <h4 className="text-base font-inter font-semibold text-black">
                  History
                </h4>
                <p className="text-gray-500 font-inter text-sm">
                  Created on {handleFormatTimestampToDate(interest?.createdAt)}{" "}
                  by{" "}
                  <span
                    className="text-black font-semibold text-sm hover:underline hover:text-blue-500 cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/${
                          getProfileDetails(interest?.createdBy, users)
                            ?.username
                        }`
                      )
                    }
                  >
                    {" "}
                    @{getProfileDetails(interest?.createdBy, users)?.username}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        {interest.rules.length > 0 && (
          <div className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-semibold text-black font-inter">
                Rules
              </h3>
              <p className="font-inter text-[0.95rem] text-gray-500">
                {/* say something about wholesquare interest group rules */}
                Rules are set by the admin of the interest group and are to be
                followed by all members.
              </p>
            </div>
            <ul className="flex flex-col gap-2">
              {interest.rules.map((rule, index) => (
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
          </div>
        )}
        <div className="w-full flex flex-col gap-5">
          <h3 className="text-lg font-semibold text-black font-inter">
            Moderators
          </h3>
          <div className="flex flex-col gap-2">
            {interest?.moderators?.length > 0 &&
              interest?.moderators?.map((moderator) => (
                <div
                  key={moderator.userId}
                  className="flex flex-col gap-0.5 py-1"
                >
                  <div className="w-full flex justify-between hover:bg-gray-100 p-2 rounded-xl transition duration-300 ease-in-out">
                    <button
                      onClick={() => {
                        navigate(
                          `/${
                            getProfileDetails(moderator.userId, users)?.username
                          }`
                        );
                      }}
                      className="flex w-full gap-2 items-center"
                    >
                      <img
                        src={
                          getProfileDetails(moderator.userId, users)?.photoURL
                        }
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col justify-start">
                        <h4 className="text-sm font-inter text-left font-semibold text-black">
                          {getProfileDetails(moderator.userId, users)?.name}
                        </h4>
                        <p className="text-xs text-left font-inter text-gray-400">
                          @
                          {getProfileDetails(moderator.userId, users)?.username}{" "}
                        </p>
                      </div>
                    </button>
                    {loggedInUser ? (
                      <>
                        {loggedInUser.id === moderator.userId ? (
                          <button
                            type="button"
                            onClick={() => {
                              navigate("/settings/account");
                            }}
                            className="w-max h-max min-w-[120px] block px-4 py-2 rounded-xl bg-[#FF5841] border border-[#FF5841] text-[#FFFFFF] font-inter text-sm"
                          >
                            Edit Profile
                          </button>
                        ) : loggedInUser.following.includes(
                            moderator.userId
                          ) ? (
                          <button
                            type="button"
                            onClick={() => {
                              handleFollow(
                                loggedInUser,
                                getProfileDetails(moderator.userId, users)
                              );
                            }}
                            className="w-max h-max min-w-[120px] block px-4 py-2 rounded-xl bg-[#FF5841] border border-[#FF5841] text-[#FFFFFF] font-inter text-sm"
                          >
                            Following
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              handleFollow(
                                loggedInUser,
                                getProfileDetails(moderator.userId, users)
                              );
                            }}
                            className="w-max h-max min-w-[120px] block px-4 py-2 rounded-xl bg-white border border-gray-300 text-[#FF5841] font-inter text-sm"
                          >
                            Follow
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          navigate(
                            `/${
                              getProfileDetails(moderator.userId, users)
                                ?.username
                            }`
                          );
                        }}
                        className="w-max min-w-[120px] h-max block px-4 py-2 rounded-xl border border-gray-300 text-[#FF5841] font-inter text-sm"
                      >
                        View Profile
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="w-full flex flex-col gap-5">
          <h3 className="text-lg font-semibold text-black font-inter">
            Members
          </h3>
          <div className="flex flex-col gap-2">
            {interest?.members?.length > 0 &&
              interest?.members?.map((member) => (
                <div key={member.userId} className="flex flex-col gap-0.5 py-1">
                  <div className="w-full flex justify-between hover:bg-gray-100 p-2 rounded-xl transition duration-300 ease-in-out">
                    <button
                      onClick={() => {
                        navigate(
                          `/${
                            getProfileDetails(member.userId, users)?.username
                          }`
                        );
                      }}
                      className="flex w-full gap-2 items-center"
                    >
                      <img
                        src={getProfileDetails(member.userId, users)?.photoURL}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col justify-start">
                        <h4 className="text-sm font-inter text-left font-semibold text-black">
                          {getProfileDetails(member.userId, users)?.name}
                        </h4>
                        <p className="text-xs text-left font-inter text-gray-400">
                          @{getProfileDetails(member.userId, users)?.username}{" "}
                        </p>
                      </div>
                    </button>
                    {loggedInUser ? (
                      <>
                        {loggedInUser.id === member.userId ? (
                          <button
                            type="button"
                            onClick={() => {
                              navigate("/settings/account");
                            }}
                            className="w-max h-max min-w-[120px] block px-4 py-2 rounded-xl bg-[#FF5841] border border-[#FF5841] text-[#FFFFFF] font-inter text-sm"
                          >
                            Edit Profile
                          </button>
                        ) : loggedInUser.following.includes(member.userId) ? (
                          <button
                            type="button"
                            onClick={() => {
                              handleFollow(
                                loggedInUser,
                                getProfileDetails(member.userId, users)
                              );
                            }}
                            className="w-max h-max min-w-[120px] block px-4 py-2 rounded-xl bg-[#FF5841] border border-[#FF5841] text-[#FFFFFF] font-inter text-sm"
                          >
                            Following
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              handleFollow(
                                loggedInUser,
                                getProfileDetails(member.userId, users)
                              );
                            }}
                            className="w-max h-max min-w-[120px] block px-4 py-2 rounded-xl bg-white border border-gray-300 text-[#FF5841] font-inter text-sm"
                          >
                            Follow
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          navigate(
                            `/${
                              getProfileDetails(member.userId, users)?.username
                            }`
                          );
                        }}
                        className="w-max min-w-[120px] h-max block px-4 py-2 rounded-xl border border-gray-300 text-[#FF5841] font-inter text-sm"
                      >
                        View Profile
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
