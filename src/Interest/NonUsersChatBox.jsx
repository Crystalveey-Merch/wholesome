import { Link } from "react-router-dom";

export const NonUsersChatBox = () => {
  return (
    <div className="flex h-[40vh] w-full justify-center items-center">
      <div className="flex justify-center flex-col items-center gap-5">
        <h4 className="text-3xl font-semibold text-gray-900 sm:text-2xl text-center">
          You are not logged in
          <span className="ml-2 text-2xl font-semibold text-gray-900">😢</span>
        </h4>
        <p className="text-gray-500 text-center">
          Log in to see chatbox from this interest group
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
    </div>
  );
};
