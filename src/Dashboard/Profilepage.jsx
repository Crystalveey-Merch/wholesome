import React, { useState } from "react";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Timestamp, doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/auth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { NavLink } from "react-router-dom";
import {
  faBookmark,
  faComment,
  faEnvelope,
  faEye,
  faGlobe,
  faPlus,
  faThumbsUp,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  updateDoc,
  setDoc,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
  arrayRemove,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const Profilepage = () => {
  const { profileId } = useParams();
  const [isFollowing, setIsFollowing] = useState(false); // Track whether the current user is following the profile.
  const [userPosts, setUserPosts] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [postId, setPostId] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileDocRef = doc(db, "users", profileId); // Assuming you have a "users" collection in Firebase
        const profileDocSnapshot = await getDoc(profileDocRef);
        setProfileData(profileDocSnapshot.data());
      } catch (error) {
        console.error("Error fetching profile data: ", error);
      }
    };
    fetchProfileData();
    if (auth.currentUser && profileData && profileData.followers) {
      setIsFollowing(profileData.followers.includes(auth.currentUser.uid));
    }
  }, [profileData, profileId]);

  useEffect(() => {
    const getUserPosts = async () => {
      try {
        const blogRef = collection(db, "posts");
        const userBlogQuery = query(blogRef, where("userId", "==", profileId));
        const docSnapshot = await getDocs(userBlogQuery);
        const userPosts = [];
        docSnapshot.forEach((doc) => {
          userPosts.push({ id: doc.id, ...doc.data() });
        });
        console.log(docSnapshot);
        setUserPosts(userPosts);
        if (userPosts.length > 0) {
          setPostId(userPosts[0].id); // Set the ID of the first post
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };
    if (profileId) {
      getUserPosts();
    }
  }, [profileId]);
  console.log(); // Update the variable name here

  const handleFollowToggle = async () => {
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", profileId);
      const currentUserDocRef = doc(db, "users", auth.currentUser.uid);

      if (isFollowing) {
        // Unfollow the user.
        await updateDoc(userDocRef, {
          followers: arrayRemove(auth.currentUser.uid),
        });
        await updateDoc(currentUserDocRef, {
          following: arrayRemove(profileId),
        });
        toast.success("Account unfollowed");
      } else {
        // Follow the user.
        await updateDoc(userDocRef, {
          followers: arrayUnion(auth.currentUser.uid),
        });
        await updateDoc(currentUserDocRef, {
          following: arrayUnion(profileId),
        });
        toast.success("Account followed");
      }

      // Update the follow state.
      setIsFollowing(!isFollowing);
    }
  };
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleReadMoreClick = async (randomPost) => {
    try {
      // Fetch the specific post based on postId
      const postDocRef = doc(db, "posts", randomPost.id);
      const postDoc = await getDoc(postDocRef);

      if (postDoc.exists()) {
        let updatedViewers;

        if (profileId) {
          // If userId exists, add it to the viewers array
          updatedViewers = [...postDoc.data().views, profileId];
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
  const excerpt = (str, count) => {
    if (str && str.length > count) {
      str = str.substring(0, count) + " ... ";
    }
    return str;
  };
  return (
    <div className="py-40 sm:pt-20 h-full w-screen mx-auto flex flex-col  bg-gradient-to-r from-rose-100 to-teal-100">
      <Helmet>
        <title>{profileData?.displayName}</title>
        <meta name="description" content={profileData?.shortBio} />
        <link
          rel="canonical"
          href={`https://wholesome.crystaleey.com/articlelist/${profileId}`}
        />
        <meta
          name="keywords"
          content={`Wholesome, Crystalveey
         , Profile, Blog, ${profileData?.displayName}, Article, marketing, content creation, crystalveey, tell your story, Business, marketing, Technology, Fashion, Nutrition, Food, Art, Travel and Adventure, Game and sports, Book club, Environmental and Sustainability`}
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Article List" />
        <meta
          property="og:url"
          content={`https://wholesome.crystaleey.com/articlelist/${profileId}`}
        />
        {/* <meta property="og:image" content={posts} /> */}
        <meta name="og:description" content={profileData?.shortBio} />
        <meta name="og:site_name" content="Wholesome" />

        <meta name="og:image" content={profileData?.photoURL} />

        <meta name="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content={`https://wholesome.crystaleey.com/articlelist/${profileId}`}
        />
        <meta name="twitter:title" content={profileData?.displayName} />
        <meta name="twitter:description" content={profileData?.shortBio} />
        <meta name="twitter:image" content={profileData?.photoURL} />

        <script
          type="application/ld+json"
          {...JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: `${profileData?.displayName}`,
            image: `${profileData?.photoURL}`,
            // birthDate: "1980-01-01",
            // nationality: "United States",
            // occupation: "Software Engineer",
            website: `https://wholesome.crystaleey.com/articlelist/${profileId}`,
            email: `${profileData?.email}`,
            followers: `${profileData?.followers}`,
            // phone: "1-800-555-1212",
            // address: {
            //   "@type": "PostalAddress",
            //   streetAddress: "123 Main Street",
            //   city: "Anytown",
            //   state: "CA",
            //   postalCode: "91234",
            // },

            // "datePublished": `${posts.timestamp?.toDate()?.toDateString()}`,
          })}
        />
      </Helmet>
      <div className="">
        <div className=" m-auto gap-20 sm:gap-10 ">
        <div className="m-auto">  
        <img
            src={profileData?.photoURL}
            className="w-40 h-40  mx-auto  rounded-full shadow-2xl"
          ></img>         
         <p className="sm:text-center text-2xl Aceh mt-5 text-black">{profileData?.name}</p>
         <h2 className="sm:text-center text-red-500 text-xl px-40">
              {profileData?.shortBio}
            </h2>
            <div className=" text-lg Aceh my-2  text-gray-600 flex m-auto text-center">
              <h1 className=" text-lg AcehLight m-auto  ">
              <FontAwesomeIcon icon={faEnvelope} className="" />

              {profileData?.email}
            </h1>

            </div>

            <div className="flex gap-5 justify-center  text-2xl py-5 text-gray-500">
              <a href={profileData?.twitterLink} className="text-gray-700">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href={profileData?.facebookLink} className="text-gray-700">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href={profileData?.instagramLink} className="text-gray-700">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href={profileData?.linkedinLink} className="text-gray-700">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </div>
            <button
              className="flex m-auto  my-5 text-gray-500"
              onClick={handleFollowToggle}
            >

              <FontAwesomeIcon
                icon={faPlus}
                className="m-auto px-2  text-gray-500"
              />{" "}
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
           
</div>
         <div className="bg-white  m-auto text-center  flex  ">
         <div className="m-auto flex">
         <p className="m-auto text-gray-600 p-2 flex Aceh text-center ">
              {profileData?.followers
                ? `${profileData.followers.length} follower(s)`
                : "No followers"}
            </p> 
            <p className="m-auto text-gray-600 p-2 flex Aceh text-center">
              {profileData?.following
                ? `${profileData.following.length} following`
                : "No following"}
            </p> 
            <p className="m-auto text-gray-600 p-2 flex Aceh text-center">
              {userPosts?.length
                ? `${userPosts.length} articles`
                : `${userPosts.length} articles`}
            </p> 
            </div>
            
         </div>
          <div className="px-2 bg-gradient-to-r from-rose-700 to-pink-600 text-white   sm:w-full">
          <div className="flex justify-center m-auto gap-3 flex-wrap sm:gap-3 ">
          
              {profileData?.selectedOptions &&
            Array.isArray(profileData.selectedOptions) ? (
              profileData.selectedOptions.map((option) => (
                <span key={option.id} className=" flex w-fit gap-2  hvr-grow">
                  <p className="p-2 border my-1  Aceh text-center rounded-full text-sm text-white">
                    {" "}
                    {option.key}
                  </p>
                </span>
              ))
            ) : (
              <p>No selected Interest available.</p>
            )}
            
          </div></div>
        </div>
      </div>
      <div className="h-97 bg-gray-100">
        <p className="text-center text-2xl p-10 Aceh text-black">{profileData?.name} Posts</p>
        <div className="flex sm:hidden  flex-wrap m-auto justify-center gap-5 sm:gap-0">
            {userPosts.map((post) => (
              <div className=" " key={post.id}>
                <NavLink
                  to={`/readmore/${post.id}`}
                  onClick={() => handleReadMoreClick(post)}
                  key={post.id}
                  className=" sm:hover:border-none p-8 sm:p-0  hover:rounded-xl transition duration-300  sm:m-0 ease-in-out "
                >
                  <div
                    key={post.id}
                    className="w-72   sm:w-full bg-white dark:bg-gray-700 sm:p-10 hover:scale-105   transition duration-300 ease-in-out sm:rounded-none  rounded-xl p-2 shadow "
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
                      <h2 className="Aceh text-l py-2 text-black dark:text-white  ">
                        {excerpt(post.postTitle, 50)}
                      </h2>
                      <div className="">
                        <p className=" text-gray-500  dark:text-gray-200 ">
                          {excerpt(post.postDescription, 100)}
                        </p>
                      </div>
                      <span className="text-l flex gap-5 ">
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
                          // style={buttonStyle}
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
            {userPosts.map((post) => (
              <div className=" my-2 " key={post.id}>
                <NavLink
                  to={`/readmore/${post.id}`}
                  onClick={() => handleReadMoreClick(post)}
                  key={post.id}
                  className="  p-8 sm:p-0  hover:rounded-xl transition duration-300  sm:my-2 ease-in-out "
                >
                  <div
                    key={post.id}
                    className="w-96 sm:w-full sm:flex sm:w-full bg-white  dark:bg-gray-700  sm:p-2    transition duration-300 ease-in-out   rounded-xl p-2 shadow "
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
                      <h2 className="Aceh text-md py-2 text-black dark:text-white ">
                        {post.postTitle}
                      </h2>
                      <div className="">
                        <p className=" text-gray-500 dark:text-gray-300 ">
                          {excerpt(post.postDescription, 100)}
                        </p>
                      </div>
                      <span className="text-l flex gap-5 ">
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
      </div>
    </div>
  );
};

export default Profilepage;
