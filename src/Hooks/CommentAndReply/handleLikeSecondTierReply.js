import { arrayUnion, db, doc, updateDoc } from "../../firebase/auth.js";

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

  const newNotification = {
    type: "like",
    likeType: "secondTierReply",
    commentId: commentId,
    firstTierReplyId: firstTierReplyId,
    secondTierReplyId: secondTierReplyId,
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

  //   Add a new notification to second tier reply author's notifications
  const secondTierReplyAuthorId = comments
    .find((comment) => comment.commentId === commentId)
    .firstTierReplies.find((reply) => reply.replyId === firstTierReplyId)
    .secondTierReplies.find(
      (reply) => reply.replyId === secondTierReplyId
    ).replyAuthorId;
  const secondTierReplyAuthorRef = doc(db, "users", secondTierReplyAuthorId);
  if (secondTierReplyAuthorId !== loggedInUserId) {
    await updateDoc(secondTierReplyAuthorRef, {
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
