/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";
// import { selectUsers } from "../Features/usersSlice";
import { getProfileDetails } from "../Hooks";
import { PostCard } from "../components/Feed";

export const Following = ({ posts, setPosts, users }) => {
  const loggedInUser = useSelector(selectUser);
  //   const users = useSelector(selectUsers);

  const getFollowingPosts = posts.filter((post) => {
    const authorProfile = getProfileDetails(post.userId, users);
    return loggedInUser?.following?.includes(authorProfile?.id);
  });

  return (
    <div className="sm:px-4">
      {loggedInUser === null ? (
        <div className="flex justify-center flex-col items-center h-[400px] gap-5">
          <h4 className="text-3xl font-semibold text-gray-900">
            You are not logged in
            <span className="ml-2 text-2xl font-semibold text-gray-900">
              😢
            </span>
          </h4>
          <p className="text-gray-500 text-center">
            Log in to see posts in your feed
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
        <div className="">
          {getFollowingPosts.length === 0 ? (
            <div className="flex justify-center flex-col items-center h-[400px] gap-5">
              <h4 className="text-3xl font-semibold text-gray-900">
                No posts yet
                <span className="ml-2 text-2xl font-semibold text-gray-900">
                  😢
                </span>
              </h4>
              <p className="text-gray-500 text-center">
                Follow users and topics to see posts in your feed
                <br />
                <span>
                  You can find users and topics to follow{" "}
                  <Link to="/feed" className="text-blue-500 hover:underline">
                    here
                  </Link>
                  .
                </span>
              </p>
            </div>
          ) : (
            <div className="min-w-[100%] flex flex-col gap-8">
              {getFollowingPosts
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    posts={posts}
                    setPosts={setPosts}
                    users={users}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
