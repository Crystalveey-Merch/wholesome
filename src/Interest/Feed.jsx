import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";
import { Link } from "react-router-dom";

export const Feed = ({ interests }) => {
  const loggedInUser = useSelector(selectUser);

  //   const getInterestPosts = interests.filter((interest) => {

  return (
    <div>
      {loggedInUser === null ? (
        <div className="flex justify-center flex-col items-center h-[400px] gap-5">
          <h4 className="text-3xl font-semibold text-gray-900">
            You are not logged in
            <span className="ml-2 text-2xl font-semibold text-gray-900">
              😢
            </span>
          </h4>
          <p className="text-gray-500 text-center">
            Log in to see the chatbox from your interests.
            <br />
            <span>
              You can log in{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                here
              </Link>
              .
            </span>
          </p>
        </div>
      ) : (
        <div>InterestFeed</div>
      )}
    </div>
  );
};
