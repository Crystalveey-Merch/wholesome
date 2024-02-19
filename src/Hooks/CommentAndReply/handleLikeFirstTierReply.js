import { updateDoc } from "../../firebase/auth.js";

const handleLikeFirstTierReply = async (
  loggedInUserId,
  post,
  setPost,
  commentId,
  replyId,
  comments,
  postRef
) => {
  //const post = posts.find((post) => post.id === postId);
  await updateDoc(postRef, {
    comments: comments.map((comment) =>
      comment.commentId === commentId
        ? {
            ...comment,
            firstTierReplies: comment.firstTierReplies.map((reply) =>
              reply.replyId === replyId
                ? { ...reply, likes: [...(reply?.likes || []), loggedInUserId] }
                : reply
            ),
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
            firstTierReplies: comment.firstTierReplies.map((reply) =>
              reply.replyId === replyId
                ? { ...reply, likes: [...(reply?.likes || []), loggedInUserId] }
                : reply
            ),
          }
        : comment
    ),
  };
  setPost(updatedPost);
};

const handleUnlikeFirstTierReply = async (
  loggedInUserId,
  post,
  setPost,
  commentId,
  replyId,
  comments,
  postRef
) => {
  //const post = posts.find((post) => post.id === postId);
  await updateDoc(postRef, {
    comments: comments.map((comment) =>
      comment.commentId === commentId
        ? {
            ...comment,
            firstTierReplies: comment.firstTierReplies.map((reply) =>
              reply.replyId === replyId
                ? {
                    ...reply,
                    likes: reply.likes.filter(
                      (like) => like !== loggedInUserId
                    ),
                  }
                : reply
            ),
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
            firstTierReplies: comment.firstTierReplies.map((reply) =>
              reply.replyId === replyId
                ? {
                    ...reply,
                    likes: reply.likes.filter(
                      (like) => like !== loggedInUserId
                    ),
                  }
                : reply
            ),
          }
        : comment
    ),
  };
  setPost(updatedPost);
};

export { handleLikeFirstTierReply, handleUnlikeFirstTierReply };
