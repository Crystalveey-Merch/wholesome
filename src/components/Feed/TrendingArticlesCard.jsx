/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUsers } from "../../Features/usersSlice";
import { getProfileDetails } from "../../Hooks";

export const TrendingArticlesCard = ({ posts }) => {
  const users = useSelector(selectUsers);
  //get the top 1 post with the most likes plus top 1 post with the most comments
  // and top 1 post with the most analytics.vists (if no analytics.vists, then use the post with the most likes) and display them in the card

  const getMostLikedPost = () => {
    if (!posts || posts.length === 0) return null; // Return null if posts is undefined or empty
    return posts.sort(
      (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
    )[0];
  };

  const getSecondMostLikedPost = () => {
    const mostLikedPost = getMostLikedPost();
    if (!mostLikedPost) return null; // Return null if mostLikedPost is null
    return posts
      .filter((post) => post !== mostLikedPost)
      .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))[0];
  };

  const getMostCommentedPost = () => {
    if (!posts || posts.length === 0) return null; // Return null if posts is undefined or empty
    return posts.sort(
      (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
    )[0];
  };

  const getMostVisitedPost = () => {
    if (!posts || posts.length === 0) return null; // Return null if posts is undefined or empty
    const mostVisitedPost = posts.sort(
      (a, b) => (b.analytics?.visits || 0) - (a.analytics?.visits || 0)
    )[0];

    if (!mostVisitedPost || mostVisitedPost.analytics?.visits === 0) {
      // Get the second most liked post if there are no visits or posts are undefined
      return getSecondMostLikedPost();
    }

    return mostVisitedPost;
  };

  // if (!posts.length) {
  //   return null;
  // }

  const mostLikedPost = getMostLikedPost();
  const mostCommentedPost = getMostCommentedPost();
  const mostVisitedPost = getMostVisitedPost();

  const trendingPosts = [mostLikedPost, mostCommentedPost, mostVisitedPost];

  return (
    <div className="w-full h-max p-5 border border-gray-200 rounded-xl flex flex-col gap-7">
      <h3 className="text-xl font-semibold text-black">🔥 Trending Articles</h3>
      <div className="flex flex-col gap-5">
        {trendingPosts.map((post, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Link
              to={`/profile/${post.userId}`}
              className="flex gap-2 items-center"
            >
              <img
                src={getProfileDetails(post.userId, users)?.photoURL}
                alt="profile"
                className="w-6 h-6 rounded-full"
              />
              <p className="text-sm text-slate-500 font-inter font-medium">
                {getProfileDetails(post.userId, users)?.name}
              </p>
            </Link>
            <Link to={`/readmore/${post.id}`}>
              <h5 className="text-[0.95rem] font-semibold text-slate-600 font-inter">
                {post.postTitle}
              </h5>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
