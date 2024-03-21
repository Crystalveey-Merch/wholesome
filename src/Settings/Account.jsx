/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  db,
  updateDoc,
  doc,
  auth,
  updateProfile,
  getDocs,
  collection,
  where,
  query,
} from "../firebase/auth";
import defAvatar from "../assets/avatar-default.png";
import { uploadImage } from "../firebase/storage.js";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, updateUser } from "../Features/userSlice";
import { faX, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { unusableUsernames } from "../unusableUsername.js";
import { OtherProfile } from "../components/Settings";

export const Account = ({ users, setUsers }) => {
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const [updateLoading, setUpdateLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(defAvatar);
  const [photo, setPhoto] = useState(null);
  const [modal, setModal] = useState(false);

  const createImagePreview = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Ensure reader.result is a string or provide a default value (empty string)
      const resultString = reader.result;
      setPhotoURL(resultString);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1048487) {
        alert("File size must be less than 1.5MB");
        return;
      }
      setPhoto(file);
      console.log(file);
      createImagePreview(file);
    } else {
      setPhoto(null);
    }
  };

  const handleImageClick = async () => {
    try {
      if (currentUser) {
        setImageLoading(true);
        await uploadImage(photo, currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          photoURL: photoURL,
        });
        await dispatch(updateUser({ id: currentUser.uid, photoURL: photoURL }));
        await setUsers(
          users.map((user) => {
            if (user.id === currentUser.uid) {
              return { ...user, photoURL: photoURL };
            }
            return user;
          })
        );
        //save to redux not yet implemented
        setModal(false);
        alert("Profile picture updated successfully");
        // console.log(currentUser.photoURL)
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert(error);
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    setName(user?.name);
    setUsername(user?.username);
    if (currentUser) {
      setPhotoURL(currentUser.photoURL || defAvatar);
    }
  }, [user, currentUser]);

  const [nameIsAccepted, setNameIsAccepted] = useState(false);
  const [nameMessage, setNameMessage] = useState("");
  const [nameInputFocused, setNameInputFocused] = useState(false);

  useEffect(() => {
    if (name?.length > 0 && !nameInputFocused) {
      if (name.length < 3) {
        setNameIsAccepted(false);
        setNameMessage("Name must be at least 3 characters long");
      } else {
        setNameIsAccepted(true);
        setNameMessage("");
      }
    } else {
      setNameIsAccepted(false);
      setNameMessage("");
    }
  }, [name, nameInputFocused]);

  const updateProfileInfo = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    if (currentUser) {
      try {
        const userRef = doc(db, "users", currentUser.uid);

        if (username === "") {
          toast.error("Username cannot be empty");
          setUsername(user.username);
          return;
        }

        if (unusableUsernames.includes(username)) {
          toast.error("Username is not allowed");
          setUsername(user.username);
          return;
        }

        // check if username is already taken

        // Check if username is taken
        if (username !== user.username) {
          const q = query(
            collection(db, "users"),
            where("username", "==", username)
          );

          const querySnapshot = await getDocs(q);

          if (querySnapshot.size > 0) {
            toast.error("Username is already taken");
            setUsername(user.username);
            return;
          }
        }
        await updateDoc(userRef, {
          name: name,
          username: username,
        });
        await updateProfile(currentUser, {
          displayName: name,
        });
        await dispatch(updateUser({ id: currentUser.uid, name, username }));
        // await setUsers(
        //   users.map((user) => {
        //     if (user.id === currentUser.uid) {
        //       return { ...user, name, username };
        //     }
        //     return user;
        //   })
        // );
        toast.success("Profile updated successfully");
        // navigate("/settings/account");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error(error.message);
        alert(error);
      } finally {
        setUpdateLoading(false);
      }
    }
  };

  const cancelUpdate = () => {
    setName(currentUser?.name);
    setUsername(user?.username);
  };

  return (
    <div className="w-full py-8 px-8 flex justify-center items-center sm:px-6">
      <div className="w-full max-w-2xl flex flex-col gap-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/settings")}
            className="hidden md:flex md:items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-black" />
          </button>
          <h2 className="text-black font-inter font-semibold text-lg">
            Edit Profile
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-0.5">
            <h5 className="text-lack font-medium text-sm font-inter">
              Personal info
            </h5>
            <p className="text-gray-600 font-normal text-sm">
              Update your photo and personal details.
            </p>
          </div>
          <form onSubmit={updateProfileInfo} className="flex flex-col gap-4">
            <button
              type="button"
              className="relative w-28 h-28 rounded-full border-4 border-white shadow-lg bg-white"
              onClick={() => setModal(true)}
            >
              <img
                src={user?.photoURL || photoURL}
                alt="avatar"
                className="w-full h-full rounded-full"
              />
              <div className="absolute top-0 right-0 bg-black rounded-full h-full w-full bg-opacity-40 flex justify-center items-center">
                <div className="absolute bg-black opacity-50 rounded-full p-2 w-10 h-10"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="w-6 h-6 z-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                  />
                </svg>
              </div>
            </button>
            <label className="flex flex-col gap-2">
              <p className="text-black font-inter text-base font-medium">
                Name*
              </p>
              <div className="w-full flex flex-col">
                <input
                  type="text"
                  placeholder="Enter your name"
                  className={`w-full text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300 focus:ring-transparent transition duration-300 ease-in-out ${
                    name?.length > 0 && nameIsAccepted
                      ? "border-green500 border-green-300 bg-gray100"
                      : name?.length >= 0 && !nameIsAccepted
                      ? "border-red-300 bg-white"
                      : nameInputFocused
                      ? "border-gray-200"
                      : "border-gray-200"
                  }`}
                  value={name}
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setNameInputFocused(true)}
                  onBlur={() => setNameInputFocused(false)}
                />
                {name?.length > 0 && !nameIsAccepted && (
                  <p className="text-xs font-normal text-red-500 font-inter">
                    {nameMessage}
                  </p>
                )}
              </div>
            </label>
            <label className="flex flex-col gap-2" htmlFor="username">
              <p className="text-black font-inter text-base font-medium">
                Username*
              </p>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-300 focus:ring-transparent transition duration-300 ease-in-out"
                value={username}
                name="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <div className="flex justify-end gap-5">
              <button
                className="px-4 h-10 self-end bg-red-700 text-white rounded-lg text-base font-medium shadow hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-100 focus:ring-offset-violet-100   disabled:cursor-not-allowed transition duration-500 ease-in-out"
                type="button"
                onClick={() => cancelUpdate()}
              >
                Cancel
              </button>
              <button
                className={`flex items-center gap-3 justify-center text-gray-900 bg-white px-4 h-11  rounded-lg border border-gray-300 text-base font-[600] shadow hover:text-gray-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-100 focus:ring-offset-violet-100disabled:cursor-not-allowed transition duration-500 ease-in-out ${
                  !nameIsAccepted || updateLoading
                    ? "opacity-50"
                    : "hover:bg-gray-50"
                }`}
                type="submit"
                disabled={!nameIsAccepted || updateLoading}
              >
                {updateLoading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
          <hr className="border-gray-200" />
          <OtherProfile users={users} setUsers={setUsers} />
        </div>
      </div>
      {modal && (
        <div
          className="fixed z-50 left-0 top-0 w-full h-screen overflow-auto bg-gray-950 bg-opacity-30 flex justify-center items-center"
          onClick={() => setModal(false)}
        >
          <div
            className="flex flex-col gap-4 bg-[#fefefe] m-auto p-6 border-[#888] w-[688px] shadow-lg rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b-gray-200 border-b pb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Upload your photo
              </h1>
              <div>
                <button
                  onClick={() => setModal(false)}
                  className="text-gray-500 hover:text-gray-600 transition duration-500 ease-in-out"
                >
                  {/* <img src={closeSVG} alt="close svg" className="h-5 w-5" /> */}
                  <FontAwesomeIcon icon={faX} />
                </button>
              </div>
            </div>
            <label htmlFor="upload" className="flex flex-col gap-1.5 relative">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
                id="photoURL"
                type="file"
                placeholder="Profile Picture"
                required
                name="photoURL"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
            <div className="justify-self-center flex justify-center">
              <img
                src={photoURL}
                alt="Preview of the selected image"
                className="h-64 w-64 object-cover"
              />
            </div>
            <div className="flex justify-end gap-5">
              <button
                className="px-4 h-10 flex items-center gap-3 justify-center text-black bg-white rounded-lg border border-gray-300 text-base font-[600] shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-100 focus:ring-offset-violet-100disabled:cursor-not-allowed transition duration-500 ease-in-out"
                onClick={() => setModal(false)}
              >
                Cancel upload
              </button>
              <button
                className={`px-4 h-10 self-end bg-blue-700 text-white rounded-lg text-base font-medium shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-100 focus:ring-offset-violet-100 transition duration-500 ease-in-out ${
                  !photo || imageLoading ? "opacity-50" : "hover:bg-blue-800"
                }`}
                onClick={handleImageClick}
                disabled={!photo || imageLoading}
                type="submit"
                id="upload-button"
              >
                {imageLoading ? "Uploading..." : "Upload Image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
