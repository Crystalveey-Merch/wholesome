import { arrayUnion, db, doc, updateDoc } from "../../firebase/auth.js";

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

  const newNotification = {
    type: "like",
    likeType: "comment",
    commentId: commentId,
    postId: post.id,
    id: loggedInUserId + "-" + Date.now(),
    content: `${post.postTitle}`,
    fromUserId: loggedInUserId,
    createdAt: new Date(),
    hasRead: false,
    hasSeen: false,
    hasDeleted: false,
    link: `/post/${post.id}`,
  };

  // Add a new notification to comment author's notifications
  const commentAurthorId = comments.find(
    (comment) => comment.commentId === commentId
  ).commentAuthorId;
  const commentAuthorRef = doc(db, "users", commentAurthorId);
  if (commentAurthorId !== loggedInUserId) {
    await updateDoc(commentAuthorRef, {
      notifications: arrayUnion(newNotification),
    });
  }

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
