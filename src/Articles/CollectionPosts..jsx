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
const CategoryPosts = () => {
  const [categoryBlogs, setCategoryBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { category } = useParams();


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

  const handleReadMoreClick = async () => {
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
      <div className="
        mt-5  pt-10 h-100 w-screen bg-stone-300 overflow-hidden">
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
              onClick={handleReadMoreClick}
              key={item.id}
              className="hover:border hvr-float"
            >
              <div key={item.id} className="w-80 bg-white">
                <div className="relative" style={{ height: "250px" }}>
                  <img src={item.imgUrl} className="h-full m-auto" />
                  <p className="badge bg-red-500 p-4 absolute top-5 text-white uppercase border-none ml-2">
                    {item.category}
                  </p>
                </div>
                <div className="px-5">
                  <h2 className="Aceh text-xl py-2 text-black ">
                    {item.postTitle}
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-red-500 border-b Aceh">
                    Posted on {item.timestamp.toDate().toDateString()} at{" "}
                    {formatTime(item.timestamp.toDate())}
                  </p>

                  <p className="h-20 text-gray-600">
                    {excerpt(item.postDescription, 100)}
                  </p>
                  <span className="text-xl flex gap-5 py-2">
                    <FontAwesomeIcon
                      icon={faComment}
                      className="text-gray-300 my-auto "
                    />{" "}
                    {item.comments.length}
                    <FontAwesomeIcon
                      icon={faThumbsUp}
                      className="text-gray-300 my-auto "
                    />{" "}
                    {item.likes.length}
                    <FontAwesomeIcon
                      icon={faEye}
                      className="text-gray-300 my-auto "
                    />{" "}
                    {item.views ? item.views.length : 0}
                    <FontAwesomeIcon
                      icon={faBookmark}
                      className="my-auto  text-gray-200"
                    />{" "}
                    {item.bookmarks.length}
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