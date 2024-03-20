import { getInterestDetails } from "./getInterestDeatails";

export const getChatBoxDetails = (chatBoxId, interestId, interests) => {
  const interest = getInterestDetails(interestId, interests);

  const chatBox = interest?.chatBox.find((chatB) => chatB.id === chatBoxId);

  return chatBox;
};
