import { updateDoc } from "../../firebase/auth.js";

export const handleLikeSecondTierReply = async (
  loggedInUserId,
  post,
  setPost,
  commentId,
  firstTierReplyId,
  secondTierReplyId,
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
              reply.replyId === firstTierReplyId
                ? {
                    ...reply,
                    secondTierReplies: reply.secondTierReplies.map(
                      (secondReply) =>
                        secondReply.replyId === secondTierReplyId
                          ? {
                              ...secondReply,
                              likes: [
                                ...(secondReply?.likes || []),
                                loggedInUserId,
                              ],
                            }
                          : secondReply
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
              reply.replyId === firstTierReplyId
                ? {
                    ...reply,
                    secondTierReplies: reply.secondTierReplies.map(
                      (secondReply) =>
                        secondReply.replyId === secondTierReplyId
                          ? {
                              ...secondReply,
                              likes: [
                                ...(secondReply?.likes || []),
                                loggedInUserId,
                              ],
                            }
                          : secondReply
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

export const handleUnlikeSecondTierReply = async (
  loggedInUserId,
  post,
  setPost,
  commentId,
  firstTierReplyId,
  secondTierReplyId,
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
              reply.replyId === firstTierReplyId
                ? {
                    ...reply,
                    secondTierReplies: reply.secondTierReplies.map(
                      (secondReply) =>
                        secondReply.replyId === secondTierReplyId
                          ? {
                              ...secondReply,
                              likes: secondReply.likes.filter(
                                (id) => id !== loggedInUserId
                              ),
                            }
                          : secondReply
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
              reply.replyId === firstTierReplyId
                ? {
                    ...reply,
                    secondTierReplies: reply.secondTierReplies.map(
                      (secondReply) =>
                        secondReply.replyId === secondTierReplyId
                          ? {
                              ...secondReply,
                              likes: secondReply.likes.filter(
                                (id) => id !== loggedInUserId
                              ),
                            }
                          : secondReply
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
