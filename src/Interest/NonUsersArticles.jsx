import { Link } from "react-router-dom";

export const NonUsersArticles = () => {
  return (
    <div>
      <div className="flex justify-center flex-col items-center h-[400px] gap-5">
        <h4 className="text-3xl font-semibold text-gray-900 sm:text-2xl text-center">
          No posts yet from this interest group
          <span className="ml-2 text-2xl font-semibold text-gray-900">😢</span>
        </h4>
        <p className="text-gray-500 text-center">
          Posts from different squaremates will appear here
          <br />
          <span>
            You can create a post for this interest group &nbsp;
            <Link to="/createpost" className="text-blue-500 hover:underline">
              here
            </Link>
            .
          </span>
        </p>
      </div>
    </div>
  );
};
