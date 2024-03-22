/* eslint-disable react/prop-types */
import { updateDoc, doc, db } from "../firebase/auth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../Features/userSlice";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

export const Interest = ({ interests, setInterests }) => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const handleInterestClick = async (interest) => {
    // first check if the user is already a member of the interest
    const interestRef = doc(db, "interests", interest.id);

    if (interest.members.some((member) => member.userId === user.id)) {
      // if the user is already a member, remove the user member from the interest
      if (interest.members.length === 1) {
        toast.error("You cannot leave an interest group with only one member");
        return;
      }
      if (
        interest.moderators.length === 1 &&
        interest.moderators[0].userId === user.id
      ) {
        toast.error(
          "You cannot leave an interest as the only moderator, delete the interest instead"
        );
        return;
      }
      const updatedMembers = interest.members.filter(
        (member) => member.userId !== user.id
      );
      await updateDoc(interestRef, {
        members: updatedMembers,
      });
      const updatedInterests = interests.map((i) => {
        if (i.id === interest.id) {
          return {
            ...i,
            members: updatedMembers,
          };
        }
        return i;
      });
      setInterests(updatedInterests);
    } else {
      // if the user is not a member, add the user to the interest
      await updateDoc(interestRef, {
        members: [
          ...interest.members,
          { userId: user.id, joinedAt: new Date() },
        ],
      });
      const updatedInterests = interests.map((i) => {
        if (i.id === interest.id) {
          return {
            ...i,
            members: [...i.members, { userId: user.id, joinedAt: new Date() }],
          };
        }
        return i;
      });
      setInterests(updatedInterests);
    }
  };

  const numberOfInterestsJoined = interests?.filter((interest) =>
    interest?.members?.some((member) => member?.userId === user?.id)
  ).length;

  return (
    <div className="w-full py-8 px-8 flex justify-center items-center sm:px-6">
      <div className="w-full max-w-2xl flex flex-col gap-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/settings")}
            className="hidden md:flex md:items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-black" />
          </button>
          <h2 className="text-black font-inter font-semibold text-lg">
            Interests
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-0.5">
            <h5 className="text-lack font-medium text-sm font-inter">
              {numberOfInterestsJoined} Interests Joined
            </h5>
            <p className="text-gray-600 font-normal text-sm">
              Select the interests you want to join
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
        </div>
      </div>
    </div>
  );
};
