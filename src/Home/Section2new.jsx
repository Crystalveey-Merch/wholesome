/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  // collection,
  // getDocs,
  doc,
  getDoc,
  updateDoc,
} from "../firebase/auth.js";
import { auth, db } from "../firebase/auth.js";
// import { useParams } from 'react-router';
import { NavLink } from "react-router-dom";
import Spinner from "../components/Spinner.tsx";
import { onAuthStateChanged } from "firebase/auth";

// import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faBookmark,
  faComment,
  faEye,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import "swiper/css/effect-fade";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import { HomePostCard } from "../components/Feed";

const Section2new = ({ users, posts, postId, loading }) => {
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

  // const [posts, setPosts] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [isBookmarked, setIsBookmarked] = useState(false);
  // const [bookmarkCount, setBookmarkCount] = useState(0);

  // const [postId, setPostId] = useState([]);
  // const [randomPost, setRandomPost] = useState([]);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       setLoading(true);
  //       const querySnapshot = await getDocs(collection(db, "posts"));
  //       const postData = [];
  //       querySnapshot.forEach((doc) => {
  //         // Extract the data from each document
  //         const post = doc.data();
  //         post.id = doc.id;
  //         setPostId(post.id);

  //         postData.push(post);
  //       });

  //       setPosts(postData);

  //       const randomIndex = Math.floor(Math.random() * postData.length);

  //       if (postData[randomIndex]) {
  //         setRandomPost([postData[randomIndex]]);
  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching posts:", error);
  //       setLoading(false);
  //       // setPosts([]);
  //     }
  //   };

  //   fetchPosts();
  // }, []);

  // useEffect(() => {
  //   if (posts.length > 0) {
  //     const randomIndex = Math.floor(Math.random() * posts.length);
  //     setRandomPost([posts[randomIndex]]);

  //     if (posts[randomIndex]) {
  //       setRandomPost([posts[randomIndex]]);
  //     }
  //   }
  // }, [posts]);

  if (loading) {
    return <Spinner />;
  }

  const excerpt = (str, count) => {
    if (str && str.length > count) {
      str = str.substring(0, count) + " ... ";
    }
    return str;
  };
  const handleReadMoreClick = async () => {
    try {
      // Fetch the specific post based on postId
      const postDocRef = doc(db, "posts", postId);
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
  // const buttonStyle = {
  //   color: isBookmarked ? "gold" : "gray",
  //   opacity: isBookmarked ? "100%" : "50%",
  //   // Add any other button styles as needed
  // };
  const limitedPosts = posts.slice(0, 10);

  return (
    <div className="p-5 flex flex-col gap-4 sm:p-5 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 w-screen">
      <h1 className="text-black text-xl  sm:my-2 my-5 text-center Aceh text-md">
        MUST READS
      </h1>
      <hr></hr>
      <Swiper
        slidesPerView={"auto"}
        watchSlidesProgress
        navigation={true}
        loop={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay, Navigation]}
        className="mySwiper w-[calc(100vw-20px)] px-10 hidden"
      >
        {limitedPosts.map((post) => (
          <SwiperSlide key={post.id} className="w-max sm:h-max">
            <div className="p-1.5 px-5 sm:px-1.5">
              <NavLink
                to={`/readmore/${post.id}`}
                onClick={handleReadMoreClick}
                className="p-2 w-72 flex flex-col gap-4 sm:w-full sm:max-w-[300px] bg-white rounded-xl pt-4 px-4 pb-3 shadow transition duration-500 hover:scale-90 ease-in-out"
              >
                <div className="overflow-clip h-[180px] sm:w-full">
                  <img
                    src={post.imgUrl}
                    height={200}
                    className="p-2 hover:scale-125 transition duration-300 ease-in-out rounded-md maxh-36 h-full w-full object-cover object-top"
                  />
                  {/* <p className="text-black z-0 top-1  sm:hidden  ">
                    {post.category}
                  </p> */}
                </div>
                <div className="px-2 flex flex-col gap-1 justify-between h-[170px] sm:p-0">
                  <div>
                    <p className="text-sm leading-5 text-gray-500 border-b Aceh">
                      {post.timestamp.toDate().toDateString()} at{" "}
                      {formatTime(post.timestamp.toDate())}
                    </p>
                    <h2 className="Aceh text-l py-2 text-red-500 ">
                      {/* {post.postTitle}    */}
                      {excerpt(post.postTitle, 24)}
                    </h2>
                    <p className=" text-gray-800 ">
                      {/* {post.postDescription} */}
                      {excerpt(post.postDescription, 80)}
                    </p>
                  </div>
                  <div className="text-l flex gap-5 justify-selfend z-10">
                    <div className="flex gap-2">
                      <FontAwesomeIcon
                        icon={faComment}
                        className="text-gray-500 my-auto "
                      />{" "}
                      {post.comments.length}
                    </div>
                    <div className="flex gap-2">
                      <FontAwesomeIcon
                        icon={faThumbsUp}
                        className="text-gray-500 my-auto "
                      />{" "}
                      {post.likes.length}
                    </div>
                    <div className="flex gap-2">
                      <FontAwesomeIcon
                        icon={faEye}
                        className="text-gray-500 my-auto "
                      />{" "}
                      {post.views ? post.views.length : 0}
                    </div>
                    {/* <FontAwesomeIcon
                    onClick={handleAddBookmark}
                    icon={faBookmark}
                    style={buttonStyle}
                    className="my-auto "
                  />{" "}
                  {bookmarkCount} */}
                  </div>
                </div>
              </NavLink>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {limitedPosts.length > 0 && (
        <Swiper
          slidesPerView={"auto"}
          watchSlidesProgress
          navigation={true}
          loop={true}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Pagination, Autoplay, Navigation]}
          className="mySwiper w-[calc(100vw-20px)] px-10"
        >
          {limitedPosts.map((post) => (
            <SwiperSlide key={post.id} className="w-max sm:h-max">
              <div className="p-1.5 px-5 sm:px-1.5">
                <HomePostCard key={post.id} post={post} users={users} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <div className="flex justify-center">
        <NavLink
          to="/feed"
          onClick={() => window.scrollTo(0, 0)}
          className="w-28"
        >
          <button className="btn bg-black flex mauto Aceh text-white">
            {" "}
            See More
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default Section2new;
