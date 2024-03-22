/* eslint-disable react/prop-types */
import { updateDoc, doc, db } from "../firebase/auth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../Features/userSlice";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const SelectInterest = ({ interests }) => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const handleInterestClick = async (interest) => {
    // first check if the user is already a member of the interest
    const interestRef = doc(db, "interests", interest.id);

    if (interest.members.some((member) => member.userId === user.id)) {
      // if the user is already a member, remove the user member from the interest
      const updatedMembers = interest.members.filter(
        (member) => member.userId !== user.id
      );
      await updateDoc(interestRef, {
        members: updatedMembers,
      });
    } else {
      // if the user is not a member, add the user to the interest
      await updateDoc(interestRef, {
        members: [
          ...interest.members,
          { userId: user.id, joinedAt: new Date() },
        ],
      });
    }
  };

  const numberOfInterestsJoined = interests?.filter((interest) =>
    interest?.members?.some((member) => member?.userId === user?.id)
  ).length;

  return (
    <div className="w-screen min-h-screen px-20 flex justify-center items-center sm:px-4">
      <div className="w-full max-w-2xl py-10 flex flex-col gap-16 justify-center items-center">
        <div className="flex flex-col gap-2 justify-center text-center">
          <h1 
          onClick={() => navigate("/")}
          className="text-3xl font-semibold text-black font-inter">
            Select your interests
          </h1>
          <p className="text-base font-normal text-gray-600 font-inter text-center">
            Choose at least 4 interests to get started
          </p>
        </div>
        <div className="flex flex-col gap-6 justify-center">
          <div className="flex flex-wrap gap-6 justify-center">
            {interests.map((interest) => (
              <button
                key={interest.id}
                className={`rounded-full px-4 py-2 flex gap-2 items-center font-inter text-sm transition durstion-300 ease-in-out ${
                  interest?.members?.some(
                    (member) => member?.userId === user?.id
                  )
                    ? "bg-[#000000] text-white hover:bg-gray-700"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
                onClick={() => handleInterestClick(interest)}
              >
                {/* <FontAwesomeIcon icon={faPlus} /> */}
                <img
                  src={interest.wallPaper}
                  alt={interest.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                {interest.name}
              </button>
            ))}
          </div>
        </div>
        <button
          className={`w-max px-8 py-3 text-white text-base font-inter font-semibold bg-[#ff5841] rounded-md focus:outline-none focus:ring-0 focus:border-red-300 focus:ring-transparent transition duration-300 ease-in-outt sm:py-2.5 ${
            numberOfInterestsJoined < 2
              ? "opacity-50"
              : "bg-[#ff5841] hover:bg-[#ff6d5a]"
          }`}
          disabled={numberOfInterestsJoined < 2}
          onClick={() => navigate("/")}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
