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

  return (
    <div className="py-40 sm:py-10 h-full w-screen mx-auto flex flex-col  bg-gradient-to-r from-rose-100 to-teal-100">
      <Helmet>
        <title>{profileData?.displayName}</title>
        <meta
          name="description"
          content={profileData?.shortBio}
        />
        <link
          rel=" canonical"
          href={`http://wholesome.crystaleey.com/articlelist/${profileId}`}
        />
        <meta
          name="keywords"
          content={`Wholesome, Crystalveey
         , Profile, Blog, ${profileData?.displayName}, Article, marketing, content creation, crystalveey, tell your story, Business, marketing, Technology, Fashion, Nutrition, Food, Art, Travel and Adventure, Game and sports, Book club, Environmental and Sustainability`}
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Article List" />
        <meta
          property="og:url"
          content={`http://wholesome.crystaleey.com/articlelist/${profileId}`}
        />
        {/* <meta property="og:image" content={posts} /> */}
        <meta
          name="og:description"
          content={profileData?.shortBio}
        />
        <meta name="og:site_name" content="Wholesome" />

        <meta name="og:image" content={profileData?.photoURL}/>

        <meta name="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content={`http://wholesome.crystaleey.com/articlelist/${profileId}`}
        />
        <meta name="twitter:title" content={profileData?.displayName} />
        <meta
          name="twitter:description"
          content={profileData?.shortBio}
        />
        <meta name="twitter:image" content={profileData?.photoURL}/>

        <script
          type="application/ld+jason"
          {...JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: `${profileData?.displayName}`,
            image: `${profileData?.photoURL}`,
            // birthDate: "1980-01-01",
            // nationality: "United States",
            // occupation: "Software Engineer",
            website: `http://wholesome.crystaleey.com/articlelist/${profileId}`,
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
      <div className="flex">
        <div className="flex sm:flex-col m-auto gap-20 sm:gap-10">
          <img
            src={profileData?.photoURL}
            className="w-96 h-96  my-auto  rounded-full"
          ></img>
          <div className="px-5 bg-gradient-to-r from-rose-700 to-pink-600 text-white  w-96 p-10 sm:w-full">
            <h1 className="sm:text-center">{profileData?.displayName}</h1>
            <h2 className="sm:text-center text-gray-200 text-xl">
              {profileData?.shortBio}
            </h2>
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

            <p className="m-auto bg-green-600 text-gray-100 p-5 flex badge text-center">
              {profileData?.followers
                ? `${profileData.followers.length} follower(s)`
                : "No followers"}
            </p>
            <br></br>
            <label className="text-xl Aceh my-2">
              <FontAwesomeIcon icon={faEnvelope} className="mx-2" />
              Email
            </label>
            <hr></hr>

            <h1 className=" text-gray-100 text-xl AcehLight my-5">
              {profileData?.email}
            </h1>
            <label className="text-xl Aceh">
              <FontAwesomeIcon icon={faUser} className="mx-2" />
              Interests
            </label>
            <hr></hr>
            <br></br>
            {profileData?.selectedOptions &&
            Array.isArray(profileData.selectedOptions) ? (
              profileData.selectedOptions.map((option) => (
                <span key={option.id} className=" flex w-fit  hvr-grow">
                  <p className="p-2 bg-red-500 my-2  Aceh text-center rounded-full text-sm text-white">
                    {" "}
                    {option.key}
                  </p>
                </span>
              ))
            ) : (
              <p>No selected Interest available.</p>
            )}
            <br></br>
            <label className="text-xl   Aceh py-2">
              <FontAwesomeIcon icon={faGlobe} className="mx-2" />
              Socials
            </label>
            <hr></hr>

            <div className="flex gap-5  text-2xl py-5 text-gray-500">
              <a href={profileData?.twitterLink} className="text-gray-200">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href={profileData?.facebookLink} className="text-gray-200">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href={profileData?.instagramLink} className="text-gray-200">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href={profileData?.linkedinLink} className="text-gray-200">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </div>
            <h1 className=" text-gray-500 text-xl AcehLight"></h1>
          </div>
        </div>
      </div>
      <div className="h-97 bg-gradient-to-r from-rose-100 to-teal-100">
        <p className="text-center text-2xl p-10 Aceh">User Posts</p>
        <ul className="flex flex-wrap justify-center gap-5 sm:px-10 ">
          {userPosts.map((post) => (
            <li key={post.id} className="w-96 border bg-black/25 rounded-xl">
              <NavLink
                to={`/readmore/${post.id}`}
                onClick={() => handleReadMoreClick(post)}
                key={post.id}
                className="flex flex-col gap-5 hover:bg-black/50 p-5 rounded-xl  transition duration-300   ease-in-out  "
              >
                <div className="relative overflow-clip  h-40 sm:w-full">
                  <img
                    src={post.imgUrl}
                    height={200}
                    className="p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out m-auto "
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
                      className="my-auto  text-gray-800 "
                    />
                    {post.count}
                  </span>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profilepage;
