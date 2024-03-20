import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/auth.js";

export const handleLikeActivity = async (
  activity,
  loggedInUser,
  activities,
  setActivities
) => {
  const activityRef = doc(db, "activities", activity.id);

  const newNotification = {
    type: "like",
    likeType: "activity",
    activityId: activity.id,
    id: loggedInUser?.id + "-" + Date.now(),
    content: `${activity.activityName}`,
    fromUserId: loggedInUser?.id,
    createdAt: new Date(),
    hasRead: false,
    hasSeen: false,
    hasDeleted: false,
    link: `/`,
  };

  await updateDoc(activityRef, {
    likes: [...(activity?.likes || []), loggedInUser?.id],
  });

  // Add a new notification to activity author's notifications
  const activityAuthorRef = doc(db, "users", activity.userId);
  if (activity.userId !== loggedInUser?.id) {
    await updateDoc(activityAuthorRef, {
      notifications: arrayUnion(newNotification),
    });
  }

  // Update the activities state to reflect the change in likes
  const updatedActivities = activities.map((a) => {
    if (a.id === activity.id) {
      return { ...a, likes: [...(a.likes || []), loggedInUser?.id] };
    }
    return a;
  });
  await setActivities(updatedActivities);
};
