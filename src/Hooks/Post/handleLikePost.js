import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/auth.js";

export const handleLikePost = async (post, loggedInUser) => {
  //   const postId = post.id;
  const postRef = doc(db, "posts", post.id);

  const newNotification = {
    type: "like",
    likeType: "post",
    postId: post.id,
    id: loggedInUser?.id + "-" + Date.now(),
    content: `${post.postTitle}`,
    fromUserId: loggedInUser?.id,
    createdAt: new Date(),
    hasRead: false,
    hasSeen: false,
    hasDeleted: false,
    link: `/post/${post.id}`,
  };

  //const post = posts.find((post) => post.id === postId);
  await updateDoc(postRef, {
    likes: [...(post?.likes || []), loggedInUser?.id],
  });

  // Add a new notification to post author's notifications
  const postAuthorRef = doc(db, "users", post.userId);
  if (post.userId !== loggedInUser?.id) {
    await updateDoc(postAuthorRef, {
      notifications: arrayUnion(newNotification),
    });
  }
  // Refresh the posts state to reflect the updated likes
  //   setPosts((prevPosts) =>
  //     prevPosts.map((post) =>
  //       post.id === postId
  //         ? { ...post, likes: [...post.likes, loggedInUser?.id] }
  //         : post
  //     )
  //   );
};
