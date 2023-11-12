import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  DocumentSnapshot,
  endAt,
  endBefore,
  getDocs,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  deleteField,
  where,
  increment,
} from "firebase/firestore";
import { auth, db } from "../firebase/auth.js";
// import { useParams } from 'react-router';
import { NavLink } from "react-router-dom";
import Spinner from "../components/Spinner.tsx";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faComment,
  faEye,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
// import ReactPaginate from 'react-paginate';
import Pagination from "../components/pagination.jsx";


const Allarticles = () => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkCount, setBookmarkCount] = useState(0);
  
    const [postId, setPostId] = useState([]);
    const [randomPost, setRandomPost] = useState([]);
    const [tags, setTags] = useState([]);
    const [category, setCategory] = useState([]);
    const [search, setSearch] = useState("");
    const [postPerPage] = useState(9);
    const [currentPage, setCurrentPage] = useState(1);
    const [trendingPost, setTrendingPost] = useState([]);


    useEffect(() => {
        // setLoading(true);
        const fetchPosts = async () => {
          try {
            // setLoading(true);
            const querySnapshot = await getDocs(collection(db, "posts"));
            const postData = [];
            const postIds = [];
            const tags = [];
            const categories = [];
    
            // Parallelize fetching data
            await Promise.all(
              querySnapshot.docs.map(async (doc) => {
                const postDoc = doc.data();
                postDoc.id = doc.id;
                postData.push(postDoc);
                postIds.push(doc.id);
    
                if (Array.isArray(postDoc.tags)) {
                  tags.push(...postDoc.tags);
                }
    
                const category = postDoc.category;
                if (category) {
                  categories.push(category);
                }
              })
            );
    
            // Set the postId state with the collected post IDs
            setPostId(postIds);
            setPosts([...postData]);
            setTags([...new Set(tags)]);
            setCategory(categories);
    
            const randomIndex = Math.floor(Math.random() * postData.length);
            if (postData[randomIndex]) {
              setRandomPost([postData[randomIndex]]);
            }
    
            // setLoading(false)
          } catch (error) {
            console.error("Error fetching posts:", error);
            setPosts([]);
            // setLoading(false);
          }
        };
    
        fetchPosts();
      }, []);

  return (
    <div className="py-20 sm:px-2 px-8 w-full">Allarticles


<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Title
                </th>
                <th scope="col" className="px-6 py-3">
                    Author
                </th>
                <th scope="col" className="px-6 py-3">
                    Likes
                </th>
                <th scope="col" className="px-6 py-3">
                    Comments
                </th>
                <th scope="col" className="px-6 py-3">
                    Views
                </th>
                <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
        {posts?.map((post) => (
        <tbody key={post.id}>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium Aceh  text-gray-900 whitespace-nowrap dark:text-white">
                {post.postTitle}
                </th>
                <td className="px-6 py-4">
                {post.author}
                </td>
                <td className="px-6 py-4">
                {post.likes.length}
                </td>
               
                <td className="px-6 py-4">
                {post.comments.length}

                </td>
                <td className="px-6 py-4">
                {post.views ? post.views.length : 0}
                </td>
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</a>
                </td>
            </tr>
           
        </tbody>
        ))}
    </table>
</div>


    </div>
  )
}

export default Allarticles