/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";
import { convertToLowercase } from "../Hooks";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { updateDoc, storage } from "firebase/firestore";

export const Interest = ({ interests }) => {
  const { name } = useParams();
  const loggedInUser = useSelector(selectUser);
  const [interest, setInterest] = useState([]);

  useEffect(() => {
    if (!name) return;
    const interest = interests.find(
      (interest) => convertToLowercase(interest.name) === name
    );
    setInterest(interest);
  }, [name, interests]);

  //   const [photo, setPhoto] = useState(null);
  //   const [photoURL, setPhotoURL] = useState(interest?.wallPaper || "");

  //   const handleImageChange = (e) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //       if (file.size > 1048487) {
  //         alert("File size must be less than 1.5MB");
  //         return;
  //       }
  //       setPhoto(file);
  //       createImagePreview(file);
  //     } else {
  //       setPhoto(null);
  //     }
  //   };

  //   const createImagePreview = (file) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       // Ensure reader.result is a string or provide a default value (empty string)
  //       const resultString = reader.result;
  //       setPhotoURL(resultString);
  //     };
  //     reader.readAsDataURL(file);
  //   };

  if (!interest) return null;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        {/* check if wallPaper string is not empty */}
        <div className="w-full h-80 relative">
          {interest.wallPaper !== "" ? (
            <img
              src={interest.wallPaper}
              alt="interest wallpaper"
              className="w-full h-full object-cover block"
            />
          ) : (
            <div className="w-full h-full bg-gray-100"></div>
          )}
          {interest?.moderators?.some(
            (moderator) => moderator.userId === loggedInUser.id
          ) && (
            <button
              className="absolute top-10 right-10 bg-gray-200  h-10 w-10 rounded-md flex justify-center items-center shadow-md"
              onClick={() => console.log("edit")}
            >
              <FontAwesomeIcon icon={faPen} className="text-black" />
            </button>
          )}
        </div>
        <div className="px-10">
          {" "}
          <h2 className="text-3xl font-semibold text-black font-inter">
            {interest.name}
          </h2>
        </div>
      </div>
      <div></div>
    </div>
  );
};
