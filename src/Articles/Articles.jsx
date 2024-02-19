/* eslint-disable react/prop-types */
import { useParams } from "react-router";
import { articles } from "../data/artucles";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { auth, db } from "../firebase/auth.js";
import { onAuthStateChanged } from "firebase/auth";
// import {
//   // collection,
//   doc,
//   // getDoc,
//   // getDocs,
//   // query,
//   serverTimestamp,
//   // setDoc,
//   updateDoc,
//   // where,
// } from "firebase/firestore";

const Articles = ({ users, posts }) => {
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
  const url = window.location.href;
  const userId = authUser?.uid;
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);
  // const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  // const [comments, setComments] = useState([]);
  // const [likes, setLikes] = useState([]);
  // const [userComment, setUserComment] = useState("");
  const [profileData, setProfileData] = useState(null);
  // const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchProfileData = () => {
      const profileData = users.find((user) => user.id === post.userId);
      setProfileData(profileData);
    };
    console.log(profileData);
    if (post?.userId) {
      fetchProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, users]);

  useEffect(() => {
    id && getPostDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getPostDetail = async () => {
    setLoading(true);
    // const blogRef = collection(db, "posts");
    // const docRef = doc(db, "posts", id);
    // const postDetail = await getDoc(docRef);
    // const posts = await getDocs(blogRef);
    const tags = [];
    if (posts && Array.isArray(posts)) {
      posts.forEach((post) => {
        tags.push(...post.tags);
      });
    }

    const uniqueTags = [...new Set(tags)];
    setTags(uniqueTags);

    const post = posts.find((post) => post.id === id);

    setPost(post);
    // const relatedPostQuery = query(
    //   blogRef,
    //   where("tags", "array-contains-any", postDetail.data().tags)
    // );
    // setComments(postDetail.data().comments ? postDetail.data().comments : []);
    // setLikes(post?.likes ? post.likes : []);
    // const relatedPostsnapshot = await getDocs(relatedPostQuery);
    // const relatedPosts = [];
    // relatedPostsnapshot.forEach((doc) => {
    //   relatedPosts.push({ id: doc.id, ...doc.data() });
    // });
    // setRelatedPosts(relatedPosts);
    // setActive(null);
    setLoading(false);

    console.log(post.userId);
  };

  // const handleLike = async () => {
  //   if (userId) {
  //     if (post?.likes) {
  //       const index = likes.findIndex((id) => id === userId);
  //       const updatedLikes = [...likes]; // Create a new array to modify

  //       if (index === -1) {
  //         updatedLikes.push(userId);
  //         setLikes([...new Set(updatedLikes)]);
  //       } else {
  //         updatedLikes.splice(index, 1);
  //         setLikes(updatedLikes);
  //       }

  //       await updateDoc(doc(db, "posts", id), {
  //         ...post,
  //         likes: updatedLikes,
  //         timestamp: serverTimestamp(),
  //       });
  //     }
  //   }
  // };

  const { articleName } = useParams();

  const [article, setArticle] = useState(null);

  useEffect(() => {
    // Find the selected article by comparing the name as a string
    const selectedArticle = articles.find((a) => a.topic === articleName);

    if (selectedArticle) {
      // Set the selected article in the state
      setArticle(selectedArticle);
    }
  }, [articleName]);

  if (!article) {
    return <div>article not found.</div>;
  }

  return (
    <div className="mt-20 sm:mt-18 flex flex-col m-auto justify-center">
      <div className="m-auto">
        <img src={article.src} alt={article.name} width={600} />
      </div>
      <div className="mx-40 my-20 sm:mx-5 sm:my-10">
        {/* <h1 className="text-red-500 text-xl">{article.date}</h1> */}
        <div className="badge btn-primary">{article.category}</div>
        <h1 className="text-black text-4xl"> {article.topic}</h1>
        <hr></hr>
        <p className="text-green-500 text-xl ">{article.theme}</p>
        <p className="text-red-500 py-5">{article.author}</p>

        <p className="text-gray-500">
          <FontAwesomeIcon icon="" /> {article.date}
        </p>
        <p className="text-gray-500">
          <FontAwesomeIcon icon="" /> {article.time}
        </p>

        <p className="text-gray-500">
          <FontAwesomeIcon icon="" /> {article.content}
        </p>
      </div>
    </div>
  );
};

export default Articles;
