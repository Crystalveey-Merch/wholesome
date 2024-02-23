export const getPostDetails = (postId, posts) => {
  const post = posts.find((post) => post.id === postId);
  return post;
};
