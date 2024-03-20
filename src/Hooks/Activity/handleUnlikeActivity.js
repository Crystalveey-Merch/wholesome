import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/auth.js";

export const handleUnlikeActivity = async (
  activity,
  loggedInUser,
  activities,
  setActivities
) => {
  const activityRef = doc(db, "activities", activity.id);
  const updatedLikes = activity.likes.filter(
    (like) => like !== loggedInUser?.id
  );
  await updateDoc(activityRef, {
    likes: updatedLikes,
  });
  // Update the activities state to reflect the change in likes
  const updatedActivities = activities.map((a) => {
    if (a.id === activity.id) {
      return { ...a, likes: updatedLikes };
    }
    return a;
  });
  await setActivities(updatedActivities);
};
