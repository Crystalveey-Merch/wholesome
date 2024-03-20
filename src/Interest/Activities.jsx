/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { convertToLowercase } from "../Hooks";
import { ActivityBox } from "../components/Interest";

export const Activities = ({ interests, activities, setActivities, users }) => {
  const { name } = useParams();
  // const loggedInUser = useSelector(selectUser);
  const [interest, setInterest] = useState(null);
  const [interestActivities, setInterestActivities] = useState([]);

  useEffect(() => {
    if (!name) return;
    const interest = interests.find(
      (interest) => convertToLowercase(interest.name) === name
    );
    setInterest(interest);
  }, [name, interests]);

  useEffect(() => {
    if (!interest) return;
    const interestActivities = activities.filter(
      (activity) => convertToLowercase(activity.category) === name
    );
    setInterestActivities(interestActivities);
  }, [interest, activities, name]);

  return (
    <div className="pt-10 pb-10">
      <div className="flex flex-col gap-5 pb-10 md:w-full md:justify-center md:items-center">
        {interestActivities?.length > 0 ? (
          interestActivities
            ?.sort((a, b) => b.timestamp - a.timestamp)
            .map((activity) => {
              return (
                <ActivityBox
                  key={activity.id}
                  activity={activity}
                  activities={activities}
                  setActivities={setActivities}
                  users={users}
                />
              );
            })
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-base font-inter font-semibold text-black">
              {interest?.name} has no activities yet
              <span className="text-[#3a4e4d]"> Be the first contributor</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
