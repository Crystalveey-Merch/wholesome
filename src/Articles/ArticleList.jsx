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
import { Helmet } from "react-helmet-async";
import { jsonLdScriptProps } from "react-schemaorg";
import { BlogPosting } from "schema-dts";

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
        setLoading(true);
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

        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
        // setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const trendingPost = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const postData = [];

      // Parallelize fetching data
      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const postDoc = doc.data();
          postDoc.id = doc.id;
          postData.push(postDoc);
        })
      );

      const sortedPosts = postData.sort(
        (a, b) => b.views.length - a.views.length
      ); // Get the top 10 posts with highest views
      const trendingPosts = sortedPosts.slice(0, 10);
      setTrendingPost(trendingPosts);
      console.log(trendingPosts);
    };
    trendingPost();
  }, []);

  const handleSearch = () => {
    return posts.filter(
      (blogs) =>
        blogs.postTitle.toLowerCase().includes(search) ||
        blogs.postDescription.toLowerCase().includes(search) ||
        blogs.content.toLowerCase().includes(search)
    );
  };

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        if (userId && postId) {
          const bookmarkDocRef = doc(db, "bookmarks", userId);
          const bookmarkDocSnapshot = await getDoc(bookmarkDocRef);
          const blogRef = doc(db, "posts", postId);

          if (bookmarkDocSnapshot.exists()) {
            const bookmarks = bookmarkDocSnapshot.data();
            const isBookmarked = postId in bookmarks;
            setIsBookmarked(isBookmarked);

            console.log(bookmarks.length);
          } else {
            setIsBookmarked(false); // Document doesn't exist, so it's not bookmarked
          }
          const blogSnapshot = await getDoc(blogRef);
          if (blogSnapshot.exists()) {
            const blogData = blogSnapshot.data();
            console.log(blogData);
            setBookmarkCount(blogData.count);
          }
        }
      } catch (error) {
        console.error("Error checking bookmark status: ", error);
      }
    };

    checkBookmarkStatus();
  }, [userId, postId]);

  if (loading) {
    return <Spinner />;
  }

  const excerpt = (str, count) => {
    if (str && str.length > count) {
      str = str.substring(0, count) + " ... ";
    }
    return str;
  };

  const handleReadMoreClick = async (randomPost) => {
    try {
      // Fetch the specific post based on postId
      const postDocRef = doc(db, "posts", randomPost.id);
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

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  const buttonStyle = {
    color: isBookmarked ? "gold" : "gray",
    opacity: isBookmarked ? "100%" : "75%",
    // Add any other button styles as needed
  };

  const indexOfLastPage = currentPage * postPerPage;
  const indexOfFirstPage = indexOfLastPage - postPerPage;
  const currentPosts = handleSearch().slice(indexOfFirstPage, indexOfLastPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Helmet>
        <title>Article List</title>
        <meta
          name="description"
          content="Search and Navigate through posts on Wholesome"
        />
        <link
          rel="canonical"
          href="https://wholesome.crystaleey.com/articlelist/"
        />
        <meta
          name="keywords"
          content="`Wholesome, Crystalveey,
         , Blog rticle, Blog, writing, Article, marketing, content creation, crystalveey, tell your story, Business, marketing, Technology, Fashion, Nutrition, Food, Art, Travel and Adventure, Game and sports, Book club, Environmental and Sustainability"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Article List" />
        <meta
          property="og:url"
          content="https://wholesome.crystaleey.com/articlelist/"
        />
        {/* <meta property="og:image" content={posts} /> */}
        <meta
          name="og:description"
          content="Search and Navigate through posts on Wholesome"
        />
        <meta name="og:site_name" content="Wholesome" />
        <meta name="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content="https://wholesome.crystaleey.com/articlelist/"
        />
        <meta name="twitter:title" content="Article List" />
        <meta
          name="twitter:description"
          content="Search and Navigate through posts on Wholesome"
        />
        {/* <meta name="twitter:image" content="../../public/20231116_210104-removebg-preview.png" /> */}

        <script
          type="application/ld+json"
          {...JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: "Article List",
            url: "https://wholesome.crystaleey.com/articlelist",

            // "image": {posts.imgUrl},

            publisher: {
              "@type": "Organization",
              name: "Wholesome",
              logo: {
                "@type": "ImageObject",
                url: "",
              },
            },
            // "datePublished": `${posts.timestamp?.toDate()?.toDateString()}`,
          })}
        />
      </Helmet>
      <div className="  py-20 sm:px-2 px-8  w-screen  flex sm:flex-col  m-auto  justify-center bg-stone-200  relative">
        <div className="w-full">
          <div className="flex m-auto my-10 justify-center ">
            {Array.isArray(randomPost) &&
              randomPost.map((post) => (
                <NavLink
                  to={`/readmore/${post.id}`}
                  onClick={() => handleReadMoreClick(post)}
                  key={post.id}
                  className=""
                >
                  <div className="card card-side  sm:flex-col w-full bg-gradient-to-r from-teal-200 to-lime-200  ">
                    <figure
                      className="w-2/5 sm:w-full overflow-hidden"
                      style={{}}
                    >
                      <img src={post.imgUrl} alt="Album" />
                    </figure>
                    <div className="card-body">
                      <div className="m-auto flex flex-col justify-center ">
                        <h2 className="Aceh text-3xl py-5 text-black  card-title">
                          {post.postTitle}
                        </h2>
                        <p className="mt-1 text-sm leading-5 text-red-500 border-b Aceh">
                          Posted on {post.timestamp.toDate().toDateString()} at{" "}
                          {formatTime(post.timestamp.toDate())}
                        </p>

                        <p className="text-gray-600 py-5">
                          {excerpt(post.postDescription, 300)}
                        </p>
                        <span className="text-xl flex gap-5 py-2">
                          <FontAwesomeIcon
                            icon={faComment}
                            className="text-gray-800 my-auto "
                          />{" "}
                          {post.comments.length}
                          <FontAwesomeIcon
                            icon={faThumbsUp}
                            className="text-gray-800 my-auto "
                          />{" "}
                          {post.likes.length}
                          <FontAwesomeIcon
                            icon={faEye}
                            className="text-gray-800 my-auto "
                          />{" "}
                          {post.views ? post.views.length : 0}
                          <FontAwesomeIcon
                            icon={faBookmark}
                            style={buttonStyle}
                            className="my-auto "
                          />
                          {post.count}
                        </span>
                      </div>
                    </div>
                  </div>
                </NavLink>
              ))}
          </div>
          <div className=" m-auto p-5  bg-white sm:w-full  ">
            <p className="text-center text-2xl py-5 text-red-500">
              Search Post
            </p>
            <input
              className=" seearh w-96 sm:w-full flex m-auto bg-red/50  input input-bordered border-black text-red-600 "
              id="floatingInputCustom"
              type="text"
              placeholder="Search Article"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex sm:hidden  flex-wrap m-auto justify-center gap-5 sm:gap-0">
            {currentPosts.map((post) => (
              <div className=" " key={post.id}>
                <NavLink
                  to={`/readmore/${post.id}`}
                  onClick={() => handleReadMoreClick(post)}
                  key={post.id}
                  className="hover:border sm:hover:border-none p-8 sm:p-0  hover:rounded-xl transition duration-300  sm:m-0 ease-in-out "
                >
                  <div
                    key={post.id}
                    className="w-96   sm:w-full bg-white  sm:p-10 hover:scale-105   transition duration-300 ease-in-out sm:rounded-none  rounded-xl p-2 shadow "
                  >
                    <div className="relative overflow-clip  h-40 ">
                      <img
                        src={post.imgUrl}
                        height={200}
                        className="p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out "
                      />
                    </div>
                    <div className="px-5 sm:p-0 ">
                      <p className="badge  bg-gradient-to-r from-orange-400 to-rose-400 p-4 my-5  top-5 text-gray-100   border-none ">
                        {post.category}
                      </p>
                      <p className="mt-1 text-sm leading-5 text-red-300 border-b Aceh">
                        {post?.timestamp.toDate().toDateString()} at{" "}
                        {formatTime(post?.timestamp.toDate())}
                      </p>
                      <h2 className="Aceh text-xl py-2 text-black ">
                        {post.postTitle}
                      </h2>
                      <div className="">
                        <p className=" text-gray-800 ">
                          {excerpt(post.postDescription, 100)}
                        </p>
                      </div>
                      <span className="text-xl flex gap-5 ">
                        <FontAwesomeIcon
                          icon={faComment}
                          className="text-gray-500 my-auto "
                        />{" "}
                        {post.comments.length}
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          className="text-gray-500 my-auto "
                        />{" "}
                        {post.likes.length}
                        <FontAwesomeIcon
                          icon={faEye}
                          className="text-gray-500 my-auto "
                        />{" "}
                        {post.views ? post.views.length : 0}
                        <FontAwesomeIcon
                          icon={faBookmark}
                          style={buttonStyle}
                          className="my-auto   "
                        />
                        {post.count}
                      </span>
                    </div>
                  </div>
                </NavLink>
              </div>
            ))}
          </div>
          <div className="flex hidden sm:block w-full  flex-wrap m-auto justify-center gap-5 sm:gap-0">
            {currentPosts.map((post) => (
              <div className="border my-2 " key={post.id}>
                <NavLink
                  to={`/readmore/${post.id}`}
                  onClick={() => handleReadMoreClick(post)}
                  key={post.id}
                  className="hover:border sm:hover:border-none p-8 sm:p-0  hover:rounded-xl transition duration-300  sm:my-2 ease-in-out "
                >
                  <div
                    key={post.id}
                    className="w-96 sm:w-full sm:flex sm:w-full bg-white  sm:p-2    transition duration-300 ease-in-out sm:rounded-none  rounded-xl p-2 shadow "
                  >
                    <div className="relative overflow-clip  h-40  w-40 my-auto flex ">
                      <img
                        src={post.imgUrl}
                        height={200}
                        className="p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out "
                      />
                    </div>
                    <div className="px-5 sm:p-0 ">
                      <p className="badge  bg-gradient-to-r from-orange-400 to-rose-400 p-4  top-5 text-gray-100   border-none ">
                        {post.category}
                      </p>
                      <p className="mt-1 text-sm leading-5 text-red-300 border-b Aceh">
                        {post?.timestamp.toDate().toDateString()} at{" "}
                        {formatTime(post?.timestamp.toDate())}
                      </p>
                      <h2 className="Aceh text-md py-2 text-black ">
                        {post.postTitle}
                      </h2>
                      <div className="">
                        <p className=" text-gray-800 hidden ">
                          {excerpt(post.postDescription, 100)}
                        </p>
                      </div>
                      <span className="text-xl flex gap-5 ">
                        <FontAwesomeIcon
                          icon={faComment}
                          className="text-gray-500 my-auto "
                        />{" "}
                        {post.comments.length}
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          className="text-gray-500 my-auto "
                        />{" "}
                        {post.likes.length}
                        <FontAwesomeIcon
                          icon={faEye}
                          className="text-gray-500 my-auto "
                        />{" "}
                        {post.views ? post.views.length : 0}
                        <FontAwesomeIcon
                          icon={faBookmark}
                          style={buttonStyle}
                          className="my-auto   "
                        />
                        {post.count}
                      </span>
                    </div>
                  </div>
                </NavLink>
              </div>
            ))}
          </div>
          <Pagination
            postPerPage={postPerPage}
            totalPosts={posts.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
        <div className="tags p-5  ml-4 bg-gradient-to-r from-orange-400 to-rose-400 w-96  sm:w-full sm:m-0 sm:my-10 ">
          <div key={trendingPost.id}>
            <h2 className="text-xl Aceh text-white">Trending Posts</h2>
            <hr></hr>
            <br></br>
            <div className="flex flex-col gap-5">
              {trendingPost?.map((post) => (
                <NavLink
                  to={`/readmore/${post.id}`}
                  onClick={() => handleReadMoreClick(post)}
                  key={post.id}
                  className="flex flex-col gap-5 hover:bg-white/50 p-5 bg-black rounded-xl  transition duration-300   ease-in-out  "
                >
                  <div className="relative overflow-clip  h-20 ">
                    <img
                      src={post.imgUrl}
                      height={200}
                      className="p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out "
                    />
                  </div>
                  <div key={post.id}>
                    <p className="mt-1 text-sm leading-5 text-gray-200 border-b Aceh">
                      {post?.timestamp.toDate().toDateString()} at{" "}
                      {formatTime(post?.timestamp.toDate())}
                    </p>
                    <p className="Aceh text-white text-xl">{post.postTitle}</p>
                    <span className="text-xl flex gap-5  text-white ">
                      <FontAwesomeIcon
                        icon={faComment}
                        className="text-gray-200 my-auto "
                      />{" "}
                      {post.comments.length}
                      <FontAwesomeIcon
                        icon={faThumbsUp}
                        className="text-gray-200 my-auto "
                      />{" "}
                      {post.likes.length}
                      <FontAwesomeIcon
                        icon={faEye}
                        className="text-gray-200 my-auto "
                      />{" "}
                      {post.views ? post.views.length : 0}
                      <FontAwesomeIcon
                        icon={faBookmark}
                        className="my-auto  text-gray-200 "
                      />
                      {post.count}
                    </span>
                  </div>
                </NavLink>
              ))}
            </div>
            <h2 className="text-xl Aceh text-white">Tags</h2>
            <hr></hr>
            {tags?.map((tag) => (
              <div
                className="badge bg-white   m-1 p-4 hvr-bounce-in"
                key={tag.id}
              >
                <NavLink
                  to={`/articletag/${tag}`}
                  className="text-green-800 Aceh"
                  style={{ textDecoration: "none" }}
                >
                  {tag}
                </NavLink>
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-xl Aceh text-white my-4">Categories</h2>
            <hr></hr>
            <br></br>

            {category?.map((category) => (
              <div
                className="badge bg-white   m-1 p-4 hvr-bounce-in"
                key={category.id}
              >
                <NavLink
                  to={`/articlecategory/${category}`}
                  className="text-sky-500 Aceh"
                  style={{ textDecoration: "none" }}
                >
                  {category}
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleList;
