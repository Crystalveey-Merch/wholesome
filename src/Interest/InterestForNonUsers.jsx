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
    <div className="py-16 text-black px-10 font-inter w-full flex flex-col gap-16 place-self-center pb-10 max-w-3xl xl:max-w-[650px] mx-auto lg:max-w-3xl lg:px-5 md:max-w-[650px] md:px-2 sm:px-4 sm:mb-6 sm:gap-8">
      <h4 className="text-xl font-semibold capitalize sm:text-lg">
        {interest?.name}
      </h4>
      <div className="w-full">
        <NonUsersNavBar name={name} />
        {children}
      </div>
    </div>
  );
};
