/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/auth.js";

export const handleLikePost = async (post: any, loggedInUser: any, setPosts: any) => {
    const postRef = doc(db, 'posts', post.id);
    //const post = posts.find((post) => post.id === postId);
    await updateDoc(postRef, {
        likes: [...(post?.likes || []), loggedInUser?.id],
    });
    // Refresh the posts state to reflect the updated likes
    setPosts((prevPosts: any[]) =>
        prevPosts.map((post) =>
            post.id === post.id ? { ...post, likes: [...post.likes, loggedInUser?.id] } : post
        )
    );
};


