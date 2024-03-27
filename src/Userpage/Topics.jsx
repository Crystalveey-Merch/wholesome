/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { PostCard } from "../components/Feed";
import { handleFollowTag, convertToLowercase } from "../Hooks";
import { selectUser } from "../Features/userSlice";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Topics = ({ users, posts, setPosts, activities, events }) => {
  const loggedInUser = useSelector(selectUser);
  const { topicSTR } = useParams();

  const [filteredPosts, setFilteredPosts] = useState([]);

  // const convertedTitle = (title) => {
  //   return title.toLowerCase().split(" ").join("-");
  // };

  const reverseTitle = (title) => {
    if (!title) {
      return "";
    }

    return title
      .toLowerCase()
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const filteredTags = posts.filter((post) =>
      post.tags.some((tag) => tag.toLowerCase() === topicSTR.toLowerCase())
    );

    const categoryPosts = posts.filter(
      (post) => convertToLowercase(post.category) === topicSTR
    );

    // Combine filteredTags and categoryPosts into a single array
    const combinedPosts = [...filteredTags, ...categoryPosts];

    // Set the state of filteredPosts
    setFilteredPosts(combinedPosts);
  }, [posts, topicSTR]);

  // console.log(topicSTR);
  // console.log(filteredPosts);

  // console.log(
  //   reverseTitle(loggedInUser?.selectedOptions[2].key),
  //   reverseTitle(topicSTR)
  // );



  return (
    <div className="w-full flex flex-col gap-16 sm:px-4 sm:mb-6 sm:gap-8">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <FontAwesomeIcon
            icon={faHashtag}
            className="h-16 w-16 sm:h-11 sm:w-11"
          />
          <div className="flex flex-col gap-1">
            <h4 className="text-xl font-semibold capitalize sm:text-lg">
              {reverseTitle(topicSTR)}
            </h4>
            <p className="text-gray-500 text-base font-semibold font-inter sm:text-sm">
              {filteredPosts.length} articles
            </p>
          </div>
        </div>
        {loggedInUser && (
          <>
            {loggedInUser?.selectedOptions?.some(
              (option) =>
              convertToLowercase(option.key) === convertToLowercase(topicSTR)
            ) ? (
              <button
                type="button"
                onClick={() => {
                  handleFollowTag(loggedInUser, reverseTitle(topicSTR));
                }}
                className="w-max h-max min-w-[120px] block px-4 py-2 rounded-xl bg-[#FF5841] border border-[#FF5841] text-[#FFFFFF] font-inter text-sm"
              >
                Following
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  handleFollowTag(loggedInUser, reverseTitle(topicSTR));
                }}
                className="w-max h-max min-w-[120px] block px-4 py-2 rounded-xl bg-white border border-gray-300 text-[#FF5841] font-inter text-sm"
              >
                Follow
              </button>
            )}
          </>
        )}
      </div>
      {filteredPosts.length === 0 ? (
        <div className="flex justify-center flex-col items-center h-[400px] gap-5">
          <h4 className="text-3xl font-semibold text-gray-900">
            No posts found for this tag
            <span className="ml-2 text-2xl font-semibold text-gray-900">
              😢
            </span>
          </h4>
          <p className="text-gray-500 text-center font-inter">
            There are currently no posts associated with the tag or topic{" "}
            <strong>{topicSTR}</strong>.
            <br />
            <span>
              Create an article with this tag by clicking on the link{" "}
              <Link to="/createpost" className="text-blue-500 hover:underline">
                here
              </Link>
              .
            </span>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full">
          {filteredPosts.map((post) => (
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
  );
};
