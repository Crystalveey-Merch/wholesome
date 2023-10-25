import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/auth.js";
import Spinner from "../components/Spinner.tsx";
import {
  addDoc,
  collection,
  DocumentSnapshot,
  endAt,
  endBefore,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  Timestamp,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faEye,
  faPen,
  faThumbsUp,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";


const Statistics = () => {
    const [loading, setLoading] = useState(false);
    const [authUser, setAuthUser] = useState(null);
    const [totalPost, setTotalPost] = useState(0);
    const [totalLikes, setTotalLikes] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [totalViews, setTotalViews] = useState(0);
    const[totalBookmarks, setTotalBookmarks] = useState(0);
  
    useEffect(() => {
      const listen = onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuthUser(user);
        } else {
          setAuthUser(null);
        }
      });
      return () => {
        listen();
      };
    }, []);
    const user = authUser?.uid;
  
    useEffect(() => {
      if (user) {
        getUserPosts();
      }
    }, [user]);
  
    if (loading) {
      return <Spinner />;
    }
    const getUserPosts = async () => {
        try {
          setLoading(true);
          const postRef = collection(db, "posts");
          const userPostQuery = query(postRef, where("userId", "==", user));
          const docSnapshot = await getDocs(userPostQuery);
          const userPostsData = docSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() ),
          }));
    
          const totalPosts = docSnapshot.size;
          setTotalPost(totalPosts);
    
       console.log(totalPosts)
          let totalLikes = 0;
          userPostsData.forEach((post) => {
            totalLikes += post.likes.length;
          });
          setTotalLikes(totalLikes);
    
          let totalComments = 0;
          userPostsData.forEach((post) => {
            totalComments += post.comments.length;
          });
          setTotalComments(totalComments);
    
          let totalViews = 0;
          userPostsData.forEach((post) => {
            totalViews += post.views.length;
          });

          setTotalViews(totalViews);

          let totalBookmarks =0;
          userPostsData.forEach((post) => {
            if (typeof post.count === 'number') {
              totalBookmarks += post.count;
            }
          });
          setTotalBookmarks(totalBookmarks);
    
          const postIds = userPostsData.map((post) => post.id);
          
    
        
          setLoading(false);
        } catch (error) {
          // Handle any errors that occur during fetching
          console.error("Error fetching user posts:", error);
        }
      };
  return (
    <div>
        <div className="  h-full w-full ">
      <div className="blog-heading text-left py-2 mb-4 text-2xl text-base-200 font-bold bg-slate-950 p-10">
        Your Analytics
      </div>
      <div className="stats m-auto w-full m-auto  sm:stats-vertical stats-horizontal shadow">
        <div className="stat">
          <div className="stat-title">Posts</div>
          <div className="stat-value">
            {totalPost} <i className="fas fa-feather text-accent"></i>
          </div>

          <div className="stat-desc">Jan 1st - Feb 1st</div>
        </div>
        <div className="stat">
          <div className="stat-title">Your Readers</div>
          <div className="stat-value">
            {totalViews} <i className="fab fa-readme text-primary"></i>
          </div>

          <div className="stat-desc">Jan 1st - Feb 1st</div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Likes</div>
          <div className="stat-value">
            {totalLikes} <i className="fas fa-thumbs-up text-secondary"></i>
          </div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Comments</div>
          <div className="stat-value">
            {totalComments} <i className="fas fa-comment text-info"></i>
          </div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
        <div className="stat">
          <div className="stat-title">Bookmarks</div>
          <div className="stat-value">
            {totalBookmarks} <i className="fas fa-bookmark text-info"></i>
          </div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Statistics