import { arrayUnion, db, doc, updateDoc } from "../../firebase/auth.js";

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

  const newNotification = {
    type: "like",
    likeType: "reply",
    postId: post.id,
    commentId: commentId,
    replyId: replyId,
    id: loggedInUserId + "-" + Date.now(),
    content: `${post.postTitle}`,
    fromUserId: loggedInUserId,
    createdAt: new Date(),
    hasRead: false,
    hasSeen: false,
    hasDeleted: false,
    link: `/post/${post.id}`,
  };

  // Add a new notification to reply author's notifications
  const replyAuthorId = comments
    .find((comment) => comment.commentId === commentId)
    .firstTierReplies.find((reply) => reply.replyId === replyId).replyAuthorId;
  const replyAuthorRef = doc(db, "users", replyAuthorId);
  if (replyAuthorId !== loggedInUserId) {
    await updateDoc(replyAuthorRef, {
      notifications: arrayUnion(newNotification),
    });
  }

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
