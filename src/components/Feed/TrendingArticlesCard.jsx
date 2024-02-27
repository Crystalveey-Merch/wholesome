/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { selectUsers } from "../../Features/usersSlice";
import { getProfileDetails } from "../../Hooks";

export const TrendingArticlesCard = ({ posts, users }) => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  // const users = useSelector(selectUsers);
  //get the top 1 post with the most likes plus top 1 post with the most comments
  // and top 1 post with the most analytics.vists (if no analytics.vists, then use the post with the most likes) and display them in the card

  const getMostLikedPost = (excludePosts = []) => {
    const filteredPosts = posts.filter((post) => !excludePosts.includes(post));
    if (filteredPosts.length === 0) return null;
    return filteredPosts.sort(
      (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
    )[0];
  };

  const getSecondMostLikedPost = (excludePosts = []) => {
    const mostLikedPost = getMostLikedPost(excludePosts);
    if (!mostLikedPost) return null;
    const postsExcludingMostLiked = posts.filter(
      (post) => post !== mostLikedPost && !excludePosts.includes(post)
    );
    if (postsExcludingMostLiked.length === 0) return null;
    return postsExcludingMostLiked.sort(
      (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
    )[0];
  };

  const getMostCommentedPost = (excludePosts = []) => {
    const filteredPosts = posts.filter((post) => !excludePosts.includes(post));
    if (filteredPosts.length === 0) return null;
    return filteredPosts.sort(
      (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
    )[0];
  };

  const getMostVisitedPost = (excludePosts = []) => {
    const filteredPosts = posts.filter((post) => !excludePosts.includes(post));
    const mostVisitedPost = filteredPosts.sort(
      (a, b) => (b.analytics?.visits || 0) - (a.analytics?.visits || 0)
    )[0];
    if (!mostVisitedPost || mostVisitedPost.analytics?.visits === 0) {
      return getSecondMostLikedPost(excludePosts);
    }
    return mostVisitedPost;
  };

  // Get the most liked, most commented, and most visited posts
  const mostLikedPost = getMostLikedPost(trendingPosts);
  const mostCommentedPost = getMostCommentedPost(trendingPosts);
  const mostVisitedPost = getMostVisitedPost(trendingPosts);

  useEffect(() => {
    // Filter out duplicate posts
    const uniquePosts = [
      ...new Set(
        [
          ...trendingPosts,
          mostLikedPost,
          mostCommentedPost,
          mostVisitedPost,
        ].filter((post) => post)
      ),
    ];

    // Update the trending posts state
    setTrendingPosts(uniquePosts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mostLikedPost, mostCommentedPost, mostVisitedPost]);

  if (!trendingPosts || trendingPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-max">
        <h2 className="text-2xl font-bold">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="w-full h-max p-5 border border-gray-200 rounded-xl flex flex-col gap-7">
      <h3 className="text-xl font-semibold text-black md:text-lg">
        🔥 Trending Articles
      </h3>
      <div className="flex flex-col gap-5">
        {trendingPosts.slice(0, 3).map((post, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Link
              to={`/${getProfileDetails(post?.userId, users)?.username}`}
              className="flex gap-2 items-center"
            >
              <img
                src={getProfileDetails(post?.userId, users)?.photoURL}
                alt="profile"
                className="w-6 h-6 rounded-full"
              />
              <p className="text-sm text-slate-500 font-inter font-medium">
                {getProfileDetails(post?.userId, users)?.name}
              </p>
            </Link>
            <Link to={`/readmore/${post?.id}`}>
              <h5 className="text-[0.95rem] font-semibold text-slate-600 font-inter md:text-sm">
                {post?.postTitle}
              </h5>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
