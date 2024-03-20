/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { convertToLowercase } from "../Hooks";
import { PostCardHome } from "../components/Feed";

export const NonUsersArticles = ({ interests, posts, setPosts, users }) => {
  const { name } = useParams();
  const [interest, setInterest] = useState([]);
  const [interestPosts, setInterestPosts] = useState([]);

  useEffect(() => {
    if (!name) return;
    const interest = interests.find(
      (interest) => convertToLowercase(interest.name) === name
    );
    setInterest(interest);
  }, [name, interests]);

  useEffect(() => {
    if (!interest) return;
    const interestPosts = posts.filter(
      (post) => convertToLowercase(post.category) === name
    );
    setInterestPosts(interestPosts);
  }, [interest, posts, name]);

  return (
    <div>
      <div className="py-10">
        {interestPosts.length === 0 ? (
          <div className="flex justify-center flex-col items-center h-[400px] gap-5">
            <h4 className="text-3xl font-semibold text-gray-900 sm:text-2xl text-center">
              No posts yet from this interest group
              <span className="ml-2 text-2xl font-semibold text-gray-900">
                😢
              </span>
            </h4>
            <p className="text-gray-500 text-center">
              Posts from different squaremates will appear here
              <br />
              <span>
                You can create a post for this interest group &nbsp;
                <Link
                  to="/createpost"
                  className="text-blue-500 hover:underline"
                >
                  here
                </Link>
                .
              </span>
            </p>
          </div>
        ) : (
          <div className="min-w[100%] w-max flex flex-col gap-8 sm:w-full">
            {interestPosts
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((post) => (
                <PostCardHome
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
    </div>
  );
};
