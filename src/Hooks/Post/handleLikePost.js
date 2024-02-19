import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/auth.js";

export const handleLikePost = async (post, loggedInUser) => {
//   const postId = post.id;
  const postRef = doc(db, "posts", post.id);
  //const post = posts.find((post) => post.id === postId);
  await updateDoc(postRef, {
    likes: [...(post?.likes || []), loggedInUser?.id],
  });
  // Refresh the posts state to reflect the updated likes
//   setPosts((prevPosts) =>
//     prevPosts.map((post) =>
//       post.id === postId
//         ? { ...post, likes: [...post.likes, loggedInUser?.id] }
//         : post
//     )
//   );
};
