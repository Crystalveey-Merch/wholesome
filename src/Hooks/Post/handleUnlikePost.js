import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/auth.js";

export const handleUnlikePost = async (post, loggedInUser) => {
    const postRef = doc(db, 'posts', post.id);
    const updatedLikes = post.likes.filter((like) => like !== loggedInUser?.id);
    await updateDoc(postRef, {
        likes: updatedLikes,
    });
    // // Refresh the posts state to reflect the updated likes
    // setPosts((prevPosts) =>
    //     prevPosts.map((post) =>
    //         post.id === post.id ? { ...post, likes: updatedLikes } : post
    //     )
    // );
};