export const getReplyDetails = (replyId, interest) => {
  const reply = interest.replies.find((reply) => reply.id === replyId);
  return reply;
};
