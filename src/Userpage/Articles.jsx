/* eslint-disable react/prop-types */
import { PostCard } from "../components/Feed";

export const Articles = ({ searchResults, posts, setPosts, users }) => {
  const articleResults = searchResults.filter(
    (result) => result.type === "posts"
  );

  //   console.log(articleResults);

  return (
    <div>
      {articleResults.length > 0 ? (
        <div className="flex flex-col gap-3">
          {articleResults[0].value.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              posts={posts}
              setPosts={setPosts}
              users={users}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">No Result Found</div>
      )}
    </div>
  );
};
