/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/auth.js";

export const handleUnlikePost = async (post: any, loggedInUser: any, setPosts: any) => {
    const postRef = doc(db, 'posts', post.id);
    const updatedLikes = post.likes.filter((like: string | undefined) => like !== loggedInUser?.id);
    await updateDoc(postRef, {
        likes: updatedLikes,
    });
    // Refresh the posts state to reflect the updated likes
    setPosts((prevPosts: { id: any; }[]) =>
        prevPosts.map((post: { id: any; }) =>
            post.id === post.id ? { ...post, likes: updatedLikes } : post
        )
    );
};