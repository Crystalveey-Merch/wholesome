/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../Features/userSlice";
import { Link } from "react-router-dom";
import { convertToLowercase } from "../../Hooks";
import { PostCard } from ".";

export const AllArticles = ({ interests, posts, setPosts, users }) => {
  const loggedInUser = useSelector(selectUser);
  const [allArticles, setAllArticles] = useState([]);
  const [userInterests, setUserInterests] = useState([]);

  useEffect(() => {
    if (loggedInUser) {
      const userInterests = interests.filter((interest) =>
        interest.members.some((member) => member.userId === loggedInUser.id)
      );
      setUserInterests(userInterests);
    }
  }, [interests, loggedInUser]);
  // console.log(userInterests);
  // console.log(articles);

  useEffect(() => {
    if (userInterests.length > 0 && posts.length > 0) {
      const articles = posts.filter((post) =>
        userInterests.some(
          (interest) =>
            convertToLowercase(interest.name) ===
            convertToLowercase(post.category)
        )
      );
      setAllArticles(articles);
    }
  }, [userInterests, posts]);

  return (
    <div className="pt-10 pb-20">
      <div className="flex justify-center items-center w-full">
        {allArticles?.length === 0 ? (
          <div className="flex justify-center flex-col items-center h-[400px] gap-5">
            <h4 className="text-3xl font-semibold text-gray-900">
              No articles found
              <span className="ml-2 text-2xl font-semibold text-gray-900">
                😢
              </span>
            </h4>
            <p className="text-gray-500 text-center">
              Join more interest group to see articles from your interests.
              <br />
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
          <div className="w-full max-w-3xl flex flex-col gap-5 pb-10 xl:mx-auto">
            {allArticles
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
    </div>
  );
};
