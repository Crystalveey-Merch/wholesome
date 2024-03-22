/* eslint-disable react/prop-types */
// import { useSelector } from "react-redux";
// import { selectUser } from "../Features/userSlice";
// import { Link } from "react-router-dom";
import { AllInterestNavBar } from "../components/Interest";

export const Feed = ({ children }) => {
  // const loggedInUser = useSelector(selectUser);

  //   const getInterestPosts = interests.filter((interest) => {

  return (
    <div className="py-4 px-4 w-full">
      <div className="w-full md:max-w-[650px]">
        <AllInterestNavBar />
        {children}
      </div>
    </div>
  );
};
