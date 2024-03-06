/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { convertToLowercase } from "../Hooks";
import { NonUsersNavBar } from "../components/Interest/NonUsersNavBar";

export const InterestForNonUsers = ({ children, interests }) => {
  const { name } = useParams();
  const [interest, setInterest] = useState([]);

  useEffect(() => {
    if (!name) return;
    const interest = interests.find(
      (interest) => convertToLowercase(interest.name) === name
    );
    setInterest(interest);
  }, [name, interests]);
  return (
    <div className="py-16 text-black px-16 font-inter w-full flex flex-col gap-16 sm:px-4 sm:mb-6 sm:gap-8">
      <h4 className="text-xl font-semibold capitalize sm:text-lg">
        {interest?.name}
      </h4>
      <div>
        <NonUsersNavBar name={name} />
        {children}
      </div>
    </div>
  );
};
