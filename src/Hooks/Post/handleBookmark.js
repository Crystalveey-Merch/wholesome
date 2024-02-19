import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/auth.js";
//import { toast } from "react-toastify";


export const handleBookmark = async (postId, loggedInUser, setPosts, posts) => {
    const postIndex = posts.findIndex((post) => post.id === postId);
    const post = { ...posts[postIndex] };

    if (post.bookmarks && post.bookmarks.includes(loggedInUser?.id)) {
        post.bookmarks = post.bookmarks.filter((id) => id !== loggedInUser?.id);
        //toast.info('Post removed from bookmarks');
    } else {
        post.bookmarks.push(loggedInUser?.id);
        //toast.success('Post added to bookmarks');
    }

    const updatedPosts = [...posts];
    updatedPosts[postIndex] = post;
    setPosts(updatedPosts);

    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
        bookmarks: post.bookmarks,
    });
}