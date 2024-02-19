/* eslint-disable react/prop-types */
import { auth, db } from "../firebase/auth.js";
import { useEffect, useState } from "react";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import Multiselect from "multiselect-react-dropdown";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner.tsx";
import { Helmet } from "react-helmet-async";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, selectUser } from "../Features/userSlice.js";
import { updateUsers } from "../Features/usersSlice.js";
import defAvatar from "../assets/avatar-default.png";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { uploadImage } from "../firebase/storage.js";

const Profile = () => {
  const currentUser = auth.currentUser;
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  // const [photoURL, setphotoURL] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [country, setCountry] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [occupation, setOccupation] = useState("");
  const [name, setName] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  // const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleSelect = (selectedOption) => {
    setSelectedOptions(selectedOption);
    console.log(selectedOptions.map((option) => option.key));
  };

  const handleRemove = (removedOption) => {
    const updatedOptions = selectedOptions.filter(
      (option) => option.key !== removedOption.key
    );
    setSelectedOptions(updatedOptions);
  };

  // const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsEmailVerified(user.emailVerified);
        console.log(user.emailVerified);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setShortBio(user?.shortBio);
      setFacebookLink(user?.facebookLink);
      setTwitterLink(user?.twitterLink);
      setLinkedinLink(user?.linkedinLink);
      setCountry(user?.country);
      setInstagramLink(user?.instagramLink);
      setWebsiteUrl(user?.websiteUrl);
      setOccupation(user?.occupation);
      setSelectedOptions(user?.selectedOptions);
    }
  }, [user]);

  // console.log("ll");
  // console.log(selectedOptions.map((option) => option.key));

  // console.log(selectedImage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const selectedKeys = selectedOptions.map((option) => option.key);
      const selectedKeysObject = selectedKeys.map((key) => ({ key }));

      const profileDocRef = doc(db, "users", user.id);
      const updateData = {
        shortBio: shortBio ? shortBio : "",
        facebookLink: facebookLink ? facebookLink : "",
        twitterLink: twitterLink ? twitterLink : "",
        instagramLink: instagramLink ? instagramLink : "",
        linkedinLink: linkedinLink ? linkedinLink : "",
        selectedOptions: selectedKeysObject,
        country: country ? country : "",
        websiteUrl: websiteUrl ? websiteUrl : "",
        occupation: occupation ? occupation : "",
        name,
        // photoURL,
      };

      await updateDoc(profileDocRef, { ...updateData });

      dispatch(updateUser({ id: user.id, ...updateData }));
      dispatch(updateUsers({ id: user.id, ...updateData }));

      console.log("Profile updated successfully!");
      toast.success("Profile updated successfully!");

      // navigate("/dashboard/profile", {
      //   replace: true,
      //   state: { key: Math.random() },
      // });
    } catch (error) {
      console.error("Error updating profile: ", error);
      // Display an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationLink = () => {
    const user = auth.currentUser;

    if (user) {
      sendEmailVerification(user)
        .then(() => {
          toast.success("Verification email sent");

          console.log("Verification email sent");
        })
        .catch((error) => {
          toast.error("Verification not sent");

          console.error("Error sending verification email:", error);
        });
    }
  };
  const [imageLoading, setImageLoading] = useState(false);

  const [photoURL, setPhotoURL] = useState(defAvatar);
  const [photo, setPhoto] = useState(null);
  const [modal, setModal] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1048487) {
        alert("File size must be less than 1.5MB");
        return;
      }
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
      setPhotoURL(resultString);
    };
    reader.readAsDataURL(file);
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

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Helmet>
        <title>{name}</title>
        <meta name="description" content={name} />
        <link rel="canonical" href="/dashboard/profile" />
      </Helmet>
      <div className="w-full">
        {user ? (
          <div className=" m-auto ">
            <div className="  shadow-xl font-bold   border   ">
              <div className="m-auto p-5 sm:p-0 flex gap-5 sm:flex-col">
                <div>
                  <img
                    // width={80}
                    src={user.photoURL}
                    style={{ width: "10rem", height: "10rem" }}
                    className=" rounded-full m-auto p-2 border "
                  />
                  <button
                    type="button"
                    onClick={() => setModal(true)}
                    className=" image-upload m-auto   mb-5 p-0  text-center"
                  >
                    <label className="  text-red-500  h-100 m-auto">
                      <i className="fas fa-upload text-center text-red-500  "></i>{" "}
                      Update Photo
                    </label>
                  </button>
                </div>
                <div className="my-auto">
                  <h1 className="text-red-500 text-4xl sm:text-center">
                    {user.name}
                  </h1>
                  <p className=" text-center text-base-800 dark:text-base-100">
                    Last Activity: {user.lastLogin}
                  </p>
                </div>
              </div>
              <form onSubmit={handleSubmit} className=" text-black m-auto ">
                <div className="  ">
                  <div className="  m-auto mt-5 px-10 sm:px-2">
                    <h2 className="p-5 Aceh text-red-500">Basic Information</h2>
                    <hr></hr>
                    <div className="flex flex-col gap-5 my-5 px-10">
                      <label className="flex gap-4 flex-col justify-center">
                        <div className="Aceh">Display Name:</div>
                        <input
                          type="text"
                          className="p-2 border rounded-full sm:w-full  text-slate-600 enabled:hover:border-gray-400 "
                          // style={{ width: "40rem" }}
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </label>
                      <label className="flex flex-col gap-4 justify-center">
                        <div className="Aceh">Bio:</div>
                        <input
                          type="text"
                          className="p-2 border rounded-full  text-slate-600 enabled:hover:border-gray-400 "
                          // style={{ width: "40rem" }}
                          placeholder="I Love Meeting new People"
                          value={shortBio}
                          onChange={(e) => setShortBio(e.target.value)}
                        />
                      </label>
                      <label className="flex flex-col  gap-4 justify-center">
                        <div className="my-auto text-black text-left Aceh">
                          Email:
                        </div>
                        <input
                          type="email"
                          id="email"
                          disabled
                          className="p-2 border rounded-full o  text-slate-600 enabled:hover:border-gray-400 "
                          placeholder={user.email}
                        />
                        {isEmailVerified ? (
                          <span className="text-green-500">
                            Email is verified
                          </span>
                        ) : (
                          <span className="text-red-500 flex gap-4">
                            <p> Email is not verified </p>{" "}
                            <div
                              className=" cursor-pointer underline text-sky-500"
                              onClick={handleSendVerificationLink}
                            >
                              Send Verification Link
                            </div>
                          </span>
                        )}
                      </label>

                      <label className="flex flex-col gap-4 justify-center">
                        <div className="my-auto text-black Aceh">
                          Interests:
                        </div>

                        <Multiselect
                          placeholder="Select your Interest"
                          displayValue="key"
                          selectedValues={selectedOptions}
                          onKeyPressFn={function noRefCheck() {}}
                          onRemove={handleRemove}
                          onSearch={function noRefCheck() {}}
                          onSelect={handleSelect}
                          className=" rounded-full w-40"
                          options={[
                            {
                              key: "Lifestyle and Fashion",
                            },
                            {
                              key: "Health and wellness",
                            },
                            {
                              key: "Food and Nutrition",
                            },
                            {
                              key: "Travel and Events",
                            },
                            {
                              key: "Volunteer and Philanthropy",
                            },
                            {
                              key: "Business",
                            },
                            {
                              key: "Sports",
                            },
                          ]}
                          showCheckbox
                        />
                      </label>

                      <label className="flex  flex-col gap-4 justify-center">
                        <div className="my-auto text-black Aceh">Location:</div>
                        <input
                          type="text"
                          className="p-2 border rounded-full   text-slate-600 enabled:hover:border-gray-400 "
                          // style={{ width: "40rem" }}
                          value={country}
                          placeholder="Lagos, Nigeria"
                          onChange={(e) => setCountry(e.target.value)}
                        />
                      </label>
                      <label className="flex flex-col gap-4 justify-center">
                        <div className=" text-black Aceh">Occupation:</div>
                        <input
                          type="text"
                          className="p-2 border rounded-full text-slate-600 enabled:hover:border-gray-400 "
                          value={occupation}
                          // style={{ width: "40rem" }}
                          placeholder="fashion Designer"
                          onChange={(e) => setOccupation(e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                  <div className=" mt-10 px-10">
                    <h2 className="py-5 Aceh text-red-500">Social Profile</h2>
                    <hr></hr>
                    <label className=" flex flex-col  m-auto gap-4 pt-5 justify-center">
                      <div className=" Aceh text-black">
                        Facebook Profile Link:
                      </div>
                      <input
                        type="url"
                        className="p-2 border rounded-full  text-slate-600 enabled:hover:border-gray-400 "
                        // style={{ width: "40rem" }}
                        value={facebookLink}
                        pattern="https://.*"
                        onChange={(e) => setFacebookLink(e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col  gap-4 justify-center">
                      <div className="Aceh text-black">
                        Twitter Profile Link:
                      </div>

                      <input
                        type="url"
                        className="p-2 border rounded-full  text-slate-600 enabled:hover:border-gray-400 "
                        // style={{ width: "40rem" }}
                        value={twitterLink}
                        pattern="https://.*"
                        onChange={(e) => {
                          let url = e.target.value;
                          // if (!url.match(/^(https?|ftp):\/\//)) {
                          //   url = "https://www.twitter.com/" + url;
                          // }
                          setTwitterLink(url);
                        }}
                      />
                    </label>
                    <label className="flex flex-col  gap-4 justify-center">
                      <div className="Aceh text-black">
                        Instagram Profile Link:
                      </div>

                      <input
                        type="url"
                        className="p-2 border rounded-full  text-slate-600 enabled:hover:border-gray-400 "
                        // style={{ width: "40rem" }}
                        value={instagramLink}
                        pattern="https://.*"
                        onChange={(e) => setInstagramLink(e.target.value)}
                      />
                    </label>

                    <label className="flex  flex-col gap-4 justify-center">
                      <div className=" Aceh text-black">
                        Linkedin Profile Link:
                      </div>

                      <input
                        type="url"
                        className="p-2 border rounded-full   text-slate-600 enabled:hover:border-gray-400 "
                        // style={{ width: "40rem" }}
                        value={linkedinLink}
                        pattern="https://.*"
                        onChange={(e) => setLinkedinLink(e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col gap-4 justify-center">
                      <div className=" Aceh text-black">Website:</div>

                      <input
                        type="url"
                        pattern="https://.*"
                        className="p-2 border rounded-full  text-slate-600 enabled:hover:border-gray-400 "
                        // style={{ width: "40rem" }}
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="m-auto mt-10 mb-5 block bg-red-500 text-center text-white Aceh"
                >
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        ) : (
          ""
        )}
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
    </>
  );
};

export default Profile;
