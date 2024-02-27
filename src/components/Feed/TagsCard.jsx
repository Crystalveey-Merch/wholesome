/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const TagsCard = ({ posts, activities }) => {
  const [trendingTags, setTrendingTags] = useState([]);

  const convertedTitle = (title) => {
    return title.toLowerCase().split(" ").join("-");
  };

  useEffect(() => {
    // Function to extract tags from posts and activities
    const extractTags = (data) => {
      const tags = [];
      data.forEach((item) => {
        // Extract tags from post.tags
        if (item.tags) {
          item.tags.forEach((tag) => tags.push(tag.toLowerCase()));
        }
        // Extract tags from post.category and activity.category
        if (item.category) {
          tags.push(item.category.toLowerCase());
        }
        if (item.activity && item.activity.category) {
          tags.push(item.activity.category.toLowerCase());
        }
      });
      return tags;
    };

    // Combine tags from posts and activities
    const allTags = extractTags(posts).concat(extractTags(activities));

    // Count occurrences of each tag
    const tagCounts = {};
    allTags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    // console.log(allTags);

    // Sort tags based on their occurrences
    const sortedTags = Object.entries(tagCounts).sort(
      ([, countA], [, countB]) => countB - countA
    );

    // Take the top 5 tags
    const topTags = sortedTags.slice(0, 10).map(([tag]) => tag);

    // Update state with trending tags
    setTrendingTags(topTags);
  }, [posts, activities]);
  //   console.log(trendingTags);

  return (
    <div className="w-full h-max p-5 border border-gray-200 rounded-xl flex flex-col gap-7">
      <div className="flex gap-1 items-centertext-xl font-semibold text-black md:text-lg">
        <FontAwesomeIcon icon={faHashtag} className="text-gray-700 h-6 w-6" />
        <h3>Trending Tags and Topics</h3>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {trendingTags.map((tag) => (
          <Link
            to={`/topic/${convertedTitle(tag)}`}
            onClick={() => window.scrollTo(0, 0)}
            key={tag.id}
            className="text-sm text-black bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors duration-300 ease-in-out"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};
