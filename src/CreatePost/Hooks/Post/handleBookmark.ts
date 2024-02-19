/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/auth.js";
//import { toast } from "react-toastify";


export const handleBookmark = async (postId: any, loggedInUser: any, setPosts: any, posts: any) => {
    const postIndex = posts.findIndex((post: { id: any; }) => post.id === postId);
    const post = { ...posts[postIndex] };

    if (post.bookmarkedBy && post.bookmarkedBy.includes(loggedInUser?.id)) {
        post.bookmarkedBy = post.bookmarkedBy.filter((id: string) => id !== loggedInUser?.id);
        //toast.info('Post removed from bookmarks');
    } else {
        post.bookmarkedBy.push(loggedInUser?.id);
        //toast.success('Post added to bookmarks');
    }

    const updatedPosts = [...posts];
    updatedPosts[postIndex] = post;
    setPosts(updatedPosts);

    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
        bookmarkedBy: post.bookmarkedBy,
    });
}