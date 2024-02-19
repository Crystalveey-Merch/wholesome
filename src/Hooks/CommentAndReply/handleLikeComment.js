import { updateDoc } from "../../firebase/auth.js";

const handleLikeComment = async (
  loggedInUserId,
  post,
  setPost,
  commentId,
  comments,
  postRef
) => {
  //const post = posts.find((post) => post.id === postId);
  await updateDoc(postRef, {
    comments: comments.map((comment) =>
      comment.commentId === commentId
        ? { ...comment, likes: [...(comment?.likes || []), loggedInUserId] }
        : comment
    ),
  });

  //   set the state of the post to reflect the updated likes
  const updatedPost = {
    ...post,
    comments: comments.map((comment) =>
      comment.commentId === commentId
        ? { ...comment, likes: [...(comment?.likes || []), loggedInUserId] }
        : comment
    ),
  };
  setPost(updatedPost);

  // Refresh the posts state to reflect the updated likes
  //   setPosts((prevPosts) =>
  //     prevPosts.map((post) =>
  //       post.id === post.id
  //         ? {
  //             ...post,
  //             comments: comments.map((comment) =>
  //               comment.commentId === commentId
  //                 ? {
  //                     ...comment,
  //                     likes: [...comment.likes, loggedInUser?.id],
  //                   }
  //                 : comment
  //             ),
  //           }
  //         : post
  //     )
  //   );
};

const handleUnlikeComment = async (
    loggedInUserId,
  post,
  setPost,
  commentId,
  comments,
  postRef
) => {
  //const post = posts.find((post) => post.id === postId);
  await updateDoc(postRef, {
    comments: comments.map((comment) =>
      comment.commentId === commentId
        ? {
            ...comment,
            likes: comment.likes.filter((id) => id !== loggedInUserId),
          }
        : comment
    ),
  });

  //   set the state of the post to reflect the updated likes
  const updatedPost = {
    ...post,
    comments: comments.map((comment) =>
      comment.commentId === commentId
        ? {
            ...comment,
            likes: comment.likes.filter((id) => id !== loggedInUserId),
          }
        : comment
    ),
  };
  setPost(updatedPost);

  // Refresh the posts state to reflect the updated likes
  //   setPosts((prevPosts) =>
  //     prevPosts.map((post) =>
  //       post.id === post.id
  //         ? {
  //             ...post,
  //             comments: comments.map((comment) =>
  //               comment.commentId === commentId
  //                 ? {
  //                     ...comment,
  //                     likes: comment.likes.filter(
  //                       (id) => id !== loggedInUser?.id
  //                     ),
  //                   }
  //                 : comment
  //             ),
  //           }
  //         : post
  //     )
  //   );
};

export { handleLikeComment, handleUnlikeComment };
