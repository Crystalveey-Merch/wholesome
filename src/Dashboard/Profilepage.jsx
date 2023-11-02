import React, { useState } from "react";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/auth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { NavLink } from "react-router-dom";
import { faEnvelope, faGlobe, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import {
    updateDoc,
    setDoc,
    arrayUnion,
    arrayRemove,
  } from "firebase/firestore";
import { toast } from "react-toastify";
const Profilepage = () => {
  const { profileId } = useParams();
  const [isFollowing, setIsFollowing] = useState(false); // Track whether the current user is following the profile.

  const [profileData, setProfileData] = useState(null);
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

  console.log(profileData);

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
        toast.success('Account unfollowed');
      } else {
        // Follow the user.
        await updateDoc(userDocRef, {
          followers: arrayUnion(auth.currentUser.uid),
        });
        await updateDoc(currentUserDocRef, {
          following: arrayUnion(profileId),
        });
        toast.success('Account followed');

      }

      // Update the follow state.
      setIsFollowing(!isFollowing);
    }
  };
  return (
    <div className="py-40 sm:py-10 h-full w-screen mx-auto flex ">
      <div className="flex sm:flex-col m-auto gap-20 sm:gap-10">
        <img src={profileData?.photoURL} className="w-96 h-96  my-auto"></img>
        <div className="px-5 bg-sky-100  w-96 p-10 sm:w-full">
          <h1 className="sm:text-center">{profileData?.displayName}</h1>
          <h2 className="sm:text-center text-red-500 text-xl">
            {profileData?.shortBio}
          </h2>
          <button className="flex m-auto  my-5" onClick={handleFollowToggle} >
       <FontAwesomeIcon icon={faPlus}className="m-auto px-2  text-gray-500"/> {isFollowing ? "Unfollow" : "Follow"}
      </button>

      <p className="m-auto bg-green-600 text-gray-100 p-5 flex badge text-center">{profileData?.followers.length} follower(s)
     </p>
          <br></br>
          <label className="text-xl Aceh my-2">
          <FontAwesomeIcon icon={faEnvelope} className="mx-2"/>Email</label>
          <hr></hr>

          <h1 className=" text-gray-500 text-xl AcehLight my-5">
            {profileData?.email}
          </h1>
          <label className="text-xl Aceh">
          <FontAwesomeIcon icon={faUser} className="mx-2"/>Interests</label>
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
          <FontAwesomeIcon icon={faGlobe} className="mx-2"/>Socials</label>
          <hr></hr>

          <div className="flex gap-5  text-2xl py-5">
            <a href={profileData?.twitterLink}>
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href={profileData?.facebookLink}>
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href={profileData?.instagramLink}>
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href={profileData?.linkedinLink}>
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </div>
          <h1 className=" text-gray-500 text-xl AcehLight"></h1>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Profilepage;
