import { collection, getDocs, query, where } from "firebase/firestore";
import  { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faComment, faEye, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import {
  addDoc,
  DocumentSnapshot,
  endAt,
  endBefore,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  limit,
  limitToLast,
  orderBy,
  startAfter,
  deleteField,
  increment,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/auth.js";
import { Helmet } from "react-helmet-async";

const CategoryPosts = () => {
  const [categoryBlogs, setCategoryBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { category } = useParams();

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

  const getCategoryBlogs = async () => {
    setLoading(true);
    const blogRef = collection(db, "posts");
    const categoryBlogQuery = query(blogRef, where("category", "==", category));
    const docSnapshot = await getDocs(categoryBlogQuery);
    const blogs = await getDocs(blogRef);
    const categoryBlogs = [];
    docSnapshot.forEach((doc) => {
      categoryBlogs.push({ id: doc.id, ...doc.data() });
    });
    setCategoryBlogs(categoryBlogs);
    setLoading(false);
    const categories = [];
  blogs.docs.map((doc) => categories.push(...doc.get("category")));
  console.log(categories)

  };
  useEffect(() => {
    getCategoryBlogs();
    // setActive(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Spinner />;
  }
  const excerpt = (str, count) => {
    if (str && str.length > count) {
      str = str.substring(0, count) + " ... ";
    }
    return str;
  };
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleReadMoreClick = async (category) => {
    try {
      // Fetch the specific post based on postId
      const postDocRef = doc(db, "posts", category.id);
      const postDoc = await getDoc(postDocRef);

      if (postDoc.exists()) {
        let updatedViewers;

        if (userId) {
          // If userId exists, add it to the viewers array
          updatedViewers = [...postDoc.data().views, userId];
        } else {
          // If userId doesn't exist, pass an empty array
          updatedViewers = [];
        }

        await updateDoc(postDocRef, { views: updatedViewers });
      }
    } catch (error) {
      console.error("Error updating post document:", error);
    }
  };

  return (
    <div>
    <Helmet>
      <title>{category} Category</title>
      <meta
        name="description"
        content={`Post Based on ${category} category`} />
      <link rel=" canonical" href="/createpost" />
    </Helmet>
      <div className="
        mt-5  pt-10 h-100 w-screen bg-gradient-to-r from-rose-100 to-teal-100 overflow-hidden">
        <div className="m-10 m-10 m_5 h-full ">
          <div className="blog-heading text-white shadow z-10  border-b-base-300 bg-green-600 text-left p-2 mb-4 fixed  hvr-bob ">
            category: <strong>{category.toLocaleUpperCase()}</strong>
          </div>
         
        <ul
        key={categoryBlogs.id}
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
        role="list"
        className=" flex flex-wrap  justify-content-center align-items-center  w-full p-10 mob_width my-20 pointer gap-10">
          {categoryBlogs?.map((item) => (
            <li className="mt-10 " key={category.id}>
            <NavLink
              to={`/readmore/${item.id}`}
              onClick={() => handleReadMoreClick(item)}
              key={item.id}
              className="hover:border hvr-float"
            >
             <div key={item.id} className="w-96 bg-white hover:bg-gradient-to-r hover:scale-105  hover:from-orange-400 hover:to-rose-400 transition duration-300 ease-in-out  rounded-xl p-2 shadow ">
              <div className="relative overflow-clip  h-40 sm:w-40" >
                <img src={item.imgUrl}  height={200} className="p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out " />
              
              </div>
              <div className="px-5 sm:p-0 ">
              <p className="badge  bg-gradient-to-r from-orange-400 to-rose-400 p-4 my-5  top-5 text-gray-100   border-none ">
                  {item.category}
                </p>
                <p className="mt-1 text-sm leading-5 text-red-300 border-b Aceh">
                  {item.timestamp.toDate().toDateString()} at{" "}
                  {formatTime(item.timestamp.toDate())}
                </p>
                <h2 className="Aceh text-xl py-2 text-black ">
                  {item.postTitle}   
                </h2>
               

                <p className=" text-gray-800 ">
                  {excerpt(item.postDescription, 100)}
                </p>
                <span className="text-xl flex gap-5 ">
                  <FontAwesomeIcon
                    icon={faComment}
                    className="text-gray-500 my-auto "
                  />{" "}
                  {item.comments.length}
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    className="text-gray-500 my-auto "
                  />{" "}
                  {item.likes.length}
                  <FontAwesomeIcon
                    icon={faEye}
                    className="text-gray-500 my-auto "
                  />{" "}
                  {item.views ? item.views.length : 0}
                  {/* <FontAwesomeIcon
                    onClick={handleAddBookmark}
                    icon={faBookmark}
                    style={buttonStyle}
                    className="my-auto "
                  />{" "}
                  {bookmarkCount} */}
                </span>
              </div>
            </div>
            </NavLink>
           </li>
          ))}
        
        </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryPosts;