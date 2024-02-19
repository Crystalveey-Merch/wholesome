/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { PostCard } from "../components/Feed";
export const Feed = ({ posts, setPosts }) => {
  return (
    <div>
      {posts.length === 0 ? (
        <div className="flex justify-center flex-col items-center h-[400px] gap-5">
          <h4 className="text-3xl font-semibold text-gray-900">
            No posts yet
            <span className="ml-2 text-2xl font-semibold text-gray-900">
              😢
            </span>
          </h4>
          <p className="text-gray-500 text-center">
            Posts from different creators will appear here
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
        <div className="min-w[100%] flex flex-col gap-8">
          {posts
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((post) => (
              <PostCard
                key={post.id}
                post={post}
                posts={posts}
                setPosts={setPosts}
              />
            ))}
        </div>
      )}
    </div>
  );
};
