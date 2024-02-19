export const getProfileDetails = (userId, users) => {
  const user = users.find((user) => user.id === userId);
  return user;
};
