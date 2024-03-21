/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faArrowLeft,
  faGear,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";
import { UploadWallpaperModal } from "../../components/Interest";
import { convertToLowercase } from "../../Hooks";
import { useSelector } from "react-redux";
import { selectUser } from "../../Features/userSlice";
import { db, doc, storage, updateDoc } from "../../firebase/auth";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const AdminSideBar = ({ interests }) => {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
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
  const [wallPaperURL, setWallPaperURL] = useState(interest?.wallPaper);
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
        setInterest({ ...interest, wallPaper: downloadURL });

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

  return (
    <div
      className={`border-r border-gray-200 w-96 flex flex-col h-full px-6 2xl:w-[350px] xl:w-80 lg:w-72 md:w-[calc(100vw)] sm:min-h-full md:overflow-auto ${
        location.pathname === `/i/${name}/settings` ? "md:block" : "md:hidden"
      }`}
    >
      <div className="py-6 flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="hidden md:flex md:items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-black" />
          </button>
          <h3 className="text-xl font-bold text-black">Admin Tools</h3>
        </div>
        <div className="flex flex-col gap-4">
          {/* interest basic settings */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-medium uppercase text-black">
              Interest Group Settings
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to={`/i/${name}/settings/edit`}
                className={`flex gap-4 items-center px-4 py-2.5 rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-gray-100 ${
                  location.pathname === `/i/${name}/settings/edit`
                    ? "bg-gray-100"
                    : location.pathname === `/i/${name}/settings`
                    ? "bg-gray-100"
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={location.pathname === "" ? faGear : faGear}
                  className="text-gray-900 h-5 w-5"
                />
                <p className="text-gray-900 font-inter text-sm font-medium">
                  Interest Group Information
                </p>
              </Link>
              <button
                onClick={() => setIsImageOpen(true)}
                className={`flex gap-4 items-center px-4 py-2.5 rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-gray-100 `}
              >
                <FontAwesomeIcon
                  icon={faPen}
                  className="text-gray-900 h-5 w-5"
                />
                <p className="text-gray-900 font-inter text-sm font-medium">
                  Edit WallPaper
                </p>
              </button>
              <Link
                to={`/i/${name}/settings/rules`}
                className={`flex gap-4 items-center px-4 py-2.5 rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-gray-100 ${
                  location.pathname === `/i/${name}/settings/rules`
                    ? "bg-gray-100"
                    : // : location.pathname === "/settings"
                      // ? "bg-gray-100"
                      ""
                }`}
              >
                <FontAwesomeIcon
                  icon={location.pathname === "" ? faScroll : faScroll}
                  className="text-gray-900 h-5 w-5"
                />
                <p className="text-gray-900 font-inter text-sm font-medium">
                  Interest Group Rules
                </p>
              </Link>
            </div>
          </div>
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
