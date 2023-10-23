import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  DocumentSnapshot,
  endAt,
  endBefore,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import {auth, db} from "../firebase/auth.js";
// import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import Spinner from "../components/Spinner.tsx";
import { onAuthStateChanged } from "firebase/auth";

import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faEye, faThumbsUp } from "@fortawesome/free-solid-svg-icons";



const ArticleList = () => {
    const [authUser, setAuthUser] = useState(null);

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
      const userId = authUser?.uid;

    const [posts, setPosts] = useState([]);

    const [postId, setPostId] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
          try {
            
            const querySnapshot = await getDocs(collection(db, 'posts'));
            const postData = [];
            querySnapshot.forEach((doc) => {
              // Extract the data from each document
              const post = doc.data();
              post.id = doc.id;
               setPostId (post.id)



              postData.push(post);
            });
            setPosts(postData);
          } catch (error) {

            console.error('Error fetching posts:', error);
          }

        };
    
        fetchPosts();
        
      }, []);

    
  if (posts === undefined) {
    return <Spinner />;

  }

  const excerpt = (str, count) => {
    if (str && str.length > count) {
      str = str.substring(0, count) + " ... ";
    }
    return str;
  };
  const handleReadMoreClick = async () => {
    if (userId) {
      try {
        // Fetch the specific post based on postId
        const postDocRef = doc(db, "posts", postId);
        const postDoc = await getDoc(postDocRef);

        if (postDoc.exists()) {
          // Update the Firestore document with the user's ID
          const updatedViewers = [...postDoc.data().views, userId];
          await updateDoc(postDocRef, { views: updatedViewers });
        }
      } catch (error) {
        console.error("Error updating post document:", error);
      }
    }
  };

      const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
      };


  return ( 
    <div className=' mt-30 py-40 px-20 sm:px-5 w-screen bg-gray-200 flex  flex-wrap justify-center gap-10 relative'>
    {posts.map((post) => (
      <div key={post.id} className='w-96 bg-white'>
      <div className='relative' style={{height:"250px"}}>
      <img src={post.imgUrl} className='h-full m-auto'/> 
      <p className='badge bg-red-500 p-4 absolute top-5 text-white uppercase border-none ml-2'>{post.category}</p>

      </div>
      <div className="px-5">
      <span className="text-xl flex gap-5 py-2">
            <FontAwesomeIcon
              icon={faComment}
              className="text-gray-300 my-auto "
            />{" "}
            {post.comments.length}

            <FontAwesomeIcon
              icon={faThumbsUp}
              className="text-gray-300 my-auto "
            />{" "}
            {post.likes.length}

            <FontAwesomeIcon
              icon={faEye}
              className="text-gray-300 my-auto "
            />{" "}
{post.views ? post.views.length : 0}
          </span>
        <h2 className='Aceh text-xl py-2 h-24'>{post.postTitle}</h2>
       <p className="mt-1 text-sm leading-5 text-red-500 border-b Aceh">
          Posted on {post.timestamp.toDate().toDateString()} at  {formatTime(post.timestamp.toDate())}
        </p>
        {post.tags.map((tag) =>(
            <div key={post.id} className="badge mr-4 sm:mr-2 bg-sky-800 p-3 my-2 text-white">{tag}</div>
        ))}
        <p className='h-20'>{excerpt(post.postDescription, 150)}</p>

       <NavLink to= {`/readmore/${post.id}`} onClick={handleReadMoreClick} > <button className='btn bg-red-500 text-white Aceh px-10 my-5'>Read</button></NavLink>
      </div>
      </div>
    ))}
  </div>
  )
}

export default ArticleList