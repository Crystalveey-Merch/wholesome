import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/auth.js";
import { toast } from "react-toastify";

export const handleFollowTag = async (loggedInUser, tag) => {
  // Check if the tag is already in the user's selected options
  const isTagSelected = loggedInUser.selectedOptions.some(
    (option) => option.key === tag
  );

  try {
    if (isTagSelected) {
      // Remove the tag from the selected options
      const updatedSelectedOptions = loggedInUser.selectedOptions.filter(
        (option) => option.key !== tag
      );

      // Update the selected options in the database
      await updateSelectedOptions(loggedInUser.id, updatedSelectedOptions);

      toast.info(`Unfollowed ${tag}`);
    } else {
      // Add the tag to the selected options
      const updatedSelectedOptions = [
        ...loggedInUser.selectedOptions,
        { key: tag },
      ];

      // Update the selected options in the database
      await updateSelectedOptions(loggedInUser.id, updatedSelectedOptions);

      toast.success(`Followed ${tag}`);
    }
  } catch (error) {
    console.error("Error handling follow/unfollow:", error);
    toast.error("An error occurred. Please try again later.");
  }
};

const updateSelectedOptions = async (userId, selectedOptions) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    selectedOptions: selectedOptions,
  });
};
