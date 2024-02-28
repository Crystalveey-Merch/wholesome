/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PostCard } from "../components/Feed";
import { SuggestedUsers } from ".";


export const Posts = ({ posts, setPosts, users, loggedInUser, routeUser }) => {
  const userPosts = posts.filter((post) => post.userId === routeUser.id);

  const [displayedPosts, setDisplayedPosts] = useState(0);

  useEffect(() => {
    // Update the displayedPosts count after the component has rendered
    setDisplayedPosts(userPosts.slice(0, 3).length);
  }, [userPosts]);

  return (
    <div>
      {userPosts.length > 0 ? (
        <>
          {userPosts.length > 0 && (
            <div className="flex flex-col gap-6 w-full">
              {userPosts
                .slice(0, 3) // Only display the first three posts
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
          {displayedPosts >= 3 && (
            <SuggestedUsers users={users} loggedInUser={routeUser} />
          )}
          {userPosts.length > 3 && (
            <div className="flex flex-col gap-6 w-full">
              {userPosts.slice(3).map((post) => (
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
        </>
      ) : (
        <SuggestedUsers users={users} loggedInUser={loggedInUser} />
      )}
    </div>
  );
};
