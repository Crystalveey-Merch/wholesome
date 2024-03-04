/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";
import { convertToLowercase } from "../Hooks";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavBar, Sharing, UploadWallpaperModal } from "../components/Interest";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateDoc, storage, doc, db } from "../firebase/auth";
import { RightBar } from ".";

export const Interest = ({ children, interests }) => {
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

  const [isImageOpen, setIsImageOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [wallPaperURL, setWallPaperURL] = useState(interest?.wallPaper || "");
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      //   if (file.size > 1048487) {
      //     alert("File size must be less than 1.5MB");
      //     return;
      //   }
      setPhoto(file);
      createImagePreview(file);
    } else {
      setPhoto(null);
    }
  };

  const createImagePreview = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Ensure reader.result is a string or provide a default value (empty string)
      const resultString = reader.result;
      setWallPaperURL(resultString);
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = async () => {
    try {
      if (loggedInUser) {
        setImageUploading(true);
        const storageRef = ref(storage, `wallpapers/${photo.name}`);
        const snapshot = await uploadBytes(storageRef, photo);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const interestRef = doc(db, `interests/${interest.id}`);
        await updateDoc(interestRef, {
          wallPaper: downloadURL,
          updatedAt: new Date(),
        });

        setIsImageOpen(false);
        alert("Wallpaper updated successfully");
        // console.log(currentUser.photoURL)
      }
    } catch (error) {
      console.error("Error updating wallpaper", error);
      toast.error(error.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleClose = () => {
    setIsImageOpen(false);
    setPhoto(null);
    setWallPaperURL(interest.wallPaper || "");
  };

  const url = `https://www.wholesquare.org/i/${name}`;

  //   console.log(url)

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
            (moderator) => moderator?.userId === loggedInUser?.id
          ) && (
            <button
              className="absolute top-10 right-10 bg-gray-200  h-10 w-10 rounded-md flex justify-center items-center shadow-md"
              onClick={() => setIsImageOpen(true)}
            >
              <FontAwesomeIcon icon={faPen} className="text-black" />
            </button>
          )}
        </div>
        <div className="px-10 flex justify-between items-center">
          {" "}
          <h2 className="text-3xl font-bold text-black font-inter">
            {interest.name}
          </h2>
          {loggedInUser ? (
            <div className="flex gap-3">
              {interest?.members?.some(
                (member) => member?.userId === loggedInUser?.id
              ) ? (
                <div className="flex gap-4 items-center">
                  <button className="text-black bg-gray-200 px-4 py-2 flex gap-2.5 items-center rounded-lg transition duration-300 ease-in-out hover:bg-gray-300 md:py-2">
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="text-black h-4 w-4"
                    />
                    <p className="font-inter text-base font-medium">Invite</p>
                  </button>
                  <button className="self-end bg-[#FF5841] font-inter text-white px-4 py-2 rounded-lg text-base font-medium md:py-2 transition duration-300 ease-in-out hover:bg-[#ec432d]">
                    Joined
                  </button>
                  <Sharing url={url} />
                </div>
              ) : (
                <button className="self-end bg-[#FF5841] text-white  px-4 py-2 rounded-lg text-base font-medium  md:py-2 transition duration-300 ease-in-out hover:bg-[#ec432d]">
                  Join
                </button>
              )}
            </div>
          ) : (
            <button
              className="self-end bg-[#FF5841] text-white  px-4 py-2 rounded-lg text-base font-inter font-medium md:py-2 transition duration-300 ease-in-out hover:bg-[#ec432d]"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
      <hr className="mx-10 border-t border-gray-200" />
      <div className="flex gap-10 w-full font-inter px-16 pb-3">
        <div className="w-full flex flex-col gap-6">
          {/* only show if location is /i/name or /i/name/events or /i/name/activities */}
          {location.pathname === `/i/${name}` ||
          location.pathname === `/i/${name}/events` ||
          location.pathname === `/i/${name}/activities` ? (
            <NavBar name={name} />
          ) : null}
          {children}
        </div>
        <div className="z-10 sticky top-0 h-max">
          <RightBar interest={interest} />
        </div>
      </div>
      <UploadWallpaperModal
        open={isImageOpen}
        handleClose={handleClose}
        photoURL={wallPaperURL}
        handleImageChange={handleImageChange}
        handleImageClick={handleImageClick}
        photo={photo}
        imageLoading={imageUploading}
      />
    </div>
  );
};
