/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { convertToLowercase } from "../Hooks";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";

export const Mine = ({ interests }) => {
  const [userInterest, setUserInterest] = useState([]);
  const loggedInUser = useSelector(selectUser);

  // check for user interest by checking if the user is in the interest group
  useEffect(() => {
    if (loggedInUser) {
      setUserInterest(
        interests.filter((interest) =>
          interest.members.some((member) => member.userId === loggedInUser.id)
        )
      );
    }
  }, [interests, loggedInUser]);
  return (
    <div className="py-10 mb-10 px-10 flex justifycenter w-full lg:px-6">
      <div className="flex flex-col gap-10 itemsstart justify-start w-max md:w-full">
        <h2 className="text-2xl font-bold text-black sm:text-xl">
          My Interest Groups ({userInterest.length})
        </h2>
        {userInterest.length === 0 ? (
          <div className="flex justify-center flex-col items-center h-[400px] gap-5">
            <h4 className="text-3xl font-semibold text-gray-900">
              You are not in any interest group
              <span className="ml-2 text-2xl font-semibold text-gray-900">
                😶
              </span>
            </h4>
            <p className="text-gray-500 text-center">
              <span>
                You can join an interest group{" "}
                <Link
                  to="/i/discover"
                  className="text-blue-500 hover:underline"
                >
                  here
                </Link>
                .
              </span>
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-10 gap-y-6 pb-20">
            {userInterest.map((interest) => (
              //   <Link
              //     to={`/i/${convertToLowercase(interest.name)}`}
              //     key={interest.id}
              //     className="w-maxmin- w-[150px] p-0 border border-gray-200 rounded-md flex flex-col gap-0 justify-start items-center transition ease-in-out duration-300 hover:bg-gray-100 cursor-pointer"
              //   >
              //     <img
              //       src={interest.wallPaper}
              //       alt={interest.name}
              //       className="w-full max-w-10 h-16 rounded-t-md object-cover"
              //     />
              //     <div className="flex flex-col bg-gray-100 gap-2 w-full p-2">
              //       <h3 className="text-base text-center font-semibold text-black sm:text-[0.95rem] one-line-text">
              //         {interest.name}
              //       </h3>
              //     </div>
              //   </Link>
              <Link
                to={`/i/${convertToLowercase(interest.name)}`}
                key={interest.id}
                className="w-max min-w-[150px] p-2 border border-gray-200 rounded-full flex gap-2 justify-start items-center transition ease-in-out duration-300 hover:bg-gray-100 cursor-pointer"
              >
                <img
                  src={interest.wallPaper}
                  alt={interest.name}
                  className="w-10 max-w-10 h-10 max-w-[40px] rounded-full object-cover"
                />
                <div className="flex flex-col gap-2 w-full">
                  <h3 className="text-base font-semibold text-black sm:text-[0.95rem] one-line-text">
                    {interest.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-10 gap-y-6"></div>
      </div>
    </div>
  );
};
