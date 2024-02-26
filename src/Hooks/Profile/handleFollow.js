import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/auth.js";
import { toast } from "react-toastify";


export const handleFollow = async (
  loggedInUser,
  routeUser
) => {
  if (loggedInUser?.following.includes(routeUser?.id)) {
    // Unfollow
    loggedInUser = {
      ...loggedInUser,
      following: loggedInUser.following.filter(
        (userId) => userId !== routeUser?.id
      ),
    };

    routeUser = {
      ...routeUser,
      followers: routeUser.followers.filter(
        (userId) => userId !== loggedInUser?.id
      ),
    };

    toast.info("User unfollowed");
    console.log(loggedInUser.displayName, routeUser.displayName);
  } else {
    // Follow
    loggedInUser = {
      ...loggedInUser,
      following: [...loggedInUser.following, routeUser?.id],
    };

    routeUser = {
      ...routeUser,
      followers: [...routeUser.followers, loggedInUser?.id],
    };

    toast.success("User followed");
    console.log(loggedInUser.displayName, routeUser.displayName);
  }

  await updateDoc(doc(db, "users", loggedInUser?.id), {
    following: loggedInUser.following,
  });

  await updateDoc(doc(db, "users", routeUser?.id), {
    followers: routeUser.followers,
  });
  // console.log(loggedInUser.displayName, routeUser.displayName)
};
