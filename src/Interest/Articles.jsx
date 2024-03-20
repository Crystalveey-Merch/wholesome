/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import { selectUser } from "../Features/userSlice";
import { convertToLowercase } from "../Hooks";
import { PostCard } from "../components/Feed";

export const Articles = ({ interests, posts, setPosts, users }) => {
  const { name } = useParams();
  // const loggedInUser = useSelector(selectUser);
  const [interest, setInterest] = useState(null);
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
    <div className="pt-10 pb-10">
      <div className="flex flex-col gap-5 pb-10">
        {interestPosts?.length > 0 ? (
          interestPosts
            ?.sort((a, b) => b.timestamp - a.timestamp)
            .map((post) => {
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  posts={posts}
                  setPosts={setPosts}
                  users={users}
                />
              );
            })
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-base font-inter font-semibold text-black">
              {interest?.name} has no articles yet
              <span className="text-[#3a4e4d]"> Be the first contributor</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
