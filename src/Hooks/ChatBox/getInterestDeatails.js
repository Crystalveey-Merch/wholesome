export const getInterestDetails = (interestId, interests) => {
  const interest = interests?.find((interest) => interest?.id === interestId);
  return interest;
};
