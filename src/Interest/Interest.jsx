/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";
import { convertToLowercase } from "../Hooks";

export const Interest = ({ interests }) => {
  const { name } = useParams();
  const loggedInUser = useSelector(selectUser);
  const [interest, setInterest] = useState([]);

  useEffect(() => {
    if (!name) return;
    const interest = interests.find(
      (interest) => convertToLowercase(interest.name) === name
    );
    setInterest(interest);
  }, [name, interests]);

  if (!interest) return null;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {/* check if wallPaper string is not empty */}
        {interest.wallPaper !== "" ? (
          <img
            src={interest.wallpaper}
            alt="interest wallpaper"
            className="w-full h-60 object-cover"
          />
        ) : (
          <div className="w-full h-60 bg-gray-100"></div>
        )}
      </div>
      <div>{name}</div>
    </div>
  );
};
