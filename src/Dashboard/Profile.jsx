import { auth, db, storage } from "../firebase/auth.js";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Multiselect from "multiselect-react-dropdown";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner.tsx";
import { Helmet } from "react-helmet-async";

const Profile = () => {
    const [authUser, setAuthUser] = useState(null);
    const [photoURL, setphotoURL] = useState("");
    const [shortBio, setShortBio] = useState("");
    const [facebookLink, setFacebookLink] = useState("");
    const [twitterLink, setTwitterLink] = useState("");
    const [githubLink, setGithubLink] = useState("");
    const [linkedinLink, setLinkedinLink] = useState("");
    const [instagramLink, setInstagramLink] = useState("");
    const [country, setCountry] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [occupation, setOccupation] = useState("");
    const [name, setName] = useState("");
    const [profileData, setProfileData] = useState("");
    const [selectedOptions, setSelectedOptions] = useState([]);

    const [selectedImage, setSelectedImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

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
    const navigate = useNavigate();

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
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true)
                const profileDocRef = doc(db, "users", userId); // Assuming you have a "profiles" collection in Firebase
                const profileDocSnapshot = await getDoc(profileDocRef);

                if (profileDocSnapshot.exists()) {
                    const profileData = profileDocSnapshot.data();
                    //   const userSelectedOptions = profileData.selectedOptions || [];

                    setShortBio(profileData.shortBio || "");
                    setFacebookLink(profileData.facebookLink || "");
                    setTwitterLink(profileData.twitterLink || "");
                    setGithubLink(profileData.githubLink || "");
                    setLinkedinLink(profileData.linkedinLink || "");
                    setCountry(profileData.country || "");
                    setInstagramLink(profileData.instagramLink || "");
                    setWebsiteUrl(profileData.websiteUrl || "");
                    setOccupation(profileData.occupation || "");
                    setName(profileData.name || "");
                    setphotoURL(profileData.photoURL);
                    setSelectedOptions(profileData.selectedOptions);
                    // setProfileData(profileData)
                }
                setLoading(false)
            } catch (error) {
                console.error("Error fetching profile data: ", error);
            }
        };


        if (authUser) {
            fetchProfileData();
        }
    }, [authUser, userId]);
    console.log(selectedOptions.map((option) => option.key));

    console.log(selectedImage)
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        setSelectedImage(URL.createObjectURL(file));
        setProgress(0); // Reset progress when a new image is selected

        if (file) {
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const newProgress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(newProgress);
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        toast.info("Profile Image uploaded ");
                        setphotoURL(downloadUrl);
                        setProgress(0); // Reset progress when the upload is complete
                    });
                }
            );
        }
    };
    if (loading) {
        return <Spinner />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const selectedKeys = selectedOptions.map((option) => option.key);
            const selectedKeysObject = selectedKeys.map((key) => ({ key }));

            console.log(selectedKeys)

            const profileDocRef = doc(db, "users", authUser.uid); // Assuming you have a "profiles" collection in Firebase
            await setDoc(
                profileDocRef,
                {
                    shortBio,
                    facebookLink,
                    twitterLink,
                    instagramLink,
                    linkedinLink,
                    selectedOptions: selectedKeysObject,
                    country,
                    websiteUrl,
                    occupation,
                    name,
                    photoURL,
                },
                { merge: true }
            );
            setLoading(false)
            console.log("Profile updated successfully!");
            toast.success("Profile updated successfully!");

            navigate('/dashboard/profile', { replace: true, state: { key: Math.random() } });
            setLoading(false)
            // Optionally, display a success message or navigate to a different page
        } catch (error) {
            console.error("Error updating profile: ", error);
            // Display an error message to the user
        }
    };

    return (
        <><Helmet>
            <title>{name}</title>
            <meta
                name="description"
                content={name} />
            <link rel=" canonical" href="/dashboard/profile" />
        </Helmet><div className="w-full">
                {authUser ? (
                    <div className=" m-auto ">
                        <div className="  shadow-xl font-bold   border   ">
                            <div className="m-auto p-5 sm:p-0 flex gap-5 sm:flex-col">
                                <div>
                                    <img
                                        // width={80}
                                        src={photoURL}
                                        style={{ width: "10rem", height: "10rem" }}
                                        className=" rounded-full m-auto p-2 border " />
                                    <div className=" image-upload m-auto   mb-5 p-0  text-center">
                                        <label
                                            htmlFor="file-input"
                                            className="  text-red-500  h-100 m-auto"
                                        >
                                            <i className="fas fa-upload text-center text-red-500  "></i>{" "}
                                            Update Photo
                                        </label>

                                        <input
                                            className="hidden"
                                            id="file-input"
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            type="file" />

                                        {progress > 0 && (
                                            <div className="w-40 bg-gray-200 flex m-auto rounded-full h-2.5 dark:bg-gray-700 overflow-hidden transition-all duration-300 ease-in-out">
                                                <div
                                                    className="bg-red-600 h-2.5 rounded-full"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="my-auto">
                                    <h1 className="text-red-500 text-4xl sm:text-center">{name}</h1>
                                    <p className=" text-center text-base-800 dark:text-base-100">
                                        Last Activity: {authUser.metadata.lastSignInTime}
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
                                                    onChange={(e) => setName(e.target.value)} />
                                            </label>
                                            <label className="flex flex-col gap-4 justify-center">
                                                <div className="Aceh">Bio:</div>
                                                <input
                                                    type="text"
                                                    className="p-2 border rounded-full  text-slate-600 enabled:hover:border-gray-400 "
                                                    // style={{ width: "40rem" }}
                                                    placeholder="I Love Meeting new People"
                                                    value={shortBio}
                                                    onChange={(e) => setShortBio(e.target.value)} />
                                            </label>
                                            <label className="flex flex-col  gap-4 justify-center">
                                                <div className="my-auto text-black text-left Aceh">
                                                    Email:
                                                </div>
                                                <input
                                                    type="text"
                                                    disabled
                                                    className="p-2 border rounded-full o  text-slate-600 enabled:hover:border-gray-400 "
                                                    placeholder={authUser.email} />
                                            </label>
                                            <label className="flex flex-col gap-4 justify-center">
                                                <div className="my-auto text-black Aceh">Interests:</div>

                                                <Multiselect
                                                    placeholder="Select your Interest"
                                                    displayValue="key"
                                                    selectedValues={selectedOptions}
                                                    onKeyPressFn={function noRefCheck() { } }
                                                    onRemove={handleRemove}
                                                    onSearch={function noRefCheck() { } }
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
                                                    showCheckbox />
                                            </label>

                                            <label className="flex  flex-col gap-4 justify-center">
                                                <div className="my-auto text-black Aceh">Location:</div>
                                                <input
                                                    type="text"
                                                    className="p-2 border rounded-full   text-slate-600 enabled:hover:border-gray-400 "
                                                    // style={{ width: "40rem" }}
                                                    value={country}
                                                    placeholder="Lagos, Nigeria"
                                                    onChange={(e) => setCountry(e.target.value)} />
                                            </label>
                                            <label className="flex flex-col gap-4 justify-center">
                                                <div className=" text-black Aceh">Occupation:</div>
                                                <input
                                                    type="text"
                                                    className="p-2 border rounded-full text-slate-600 enabled:hover:border-gray-400 "
                                                    value={occupation}
                                                    // style={{ width: "40rem" }}
                                                    placeholder="fashion Designer"
                                                    onChange={(e) => setOccupation(e.target.value)} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className=" mt-10 px-10">
                                        <h2 className="py-5 Aceh text-red-500">Social Profile</h2>
                                        <hr></hr>
                                        <label className=" flex flex-col  m-auto gap-4 pt-5 justify-center">
                                            <div className=" Aceh text-black">Facebook:</div>
                                            <input
                                                type="url"
                                                className="p-2 border rounded-full  text-slate-600 enabled:hover:border-gray-400 "
                                                // style={{ width: "40rem" }}
                                                value={facebookLink}
                                                pattern="https://.*"
                                                onChange={(e) => setFacebookLink(e.target.value)} />
                                        </label>
                                        <label className="flex flex-col  gap-4 justify-center">
                                            <div className="Aceh text-black">Twitter:</div>

                                            <input
                                                type="url"
                                                className="p-2 border rounded-full  text-slate-600 enabled:hover:border-gray-400 "
                                                // style={{ width: "40rem" }}
                                                value={twitterLink}
                                                // pattern="https://.*"
                                                onChange={(e) => {
                                                    let url = e.target.value;
                                                    if (!url.match(/^(https?|ftp):\/\//)) {
                                                        url = 'http://' + url;
                                                    }
                                                    setTwitterLink(url);
                                                } } />
                                        </label>
                                        <label className="flex flex-col  gap-4 justify-center">
                                            <div className="Aceh text-black">Instagram:</div>

                                            <input
                                                type="url"
                                                className="p-2 border rounded-full  text-slate-600 enabled:hover:border-gray-400 "
                                                // style={{ width: "40rem" }}
                                                value={instagramLink}
                                                pattern="https://.*"
                                                onChange={(e) => setTwitterLink(e.target.value)} />
                                        </label>

                                        <label className="flex  flex-col gap-4 justify-center">
                                            <div className=" Aceh text-black">Linkedin:</div>

                                            <input
                                                type="url"
                                                className="p-2 border rounded-full   text-slate-600 enabled:hover:border-gray-400 "
                                                // style={{ width: "40rem" }}
                                                value={linkedinLink}
                                                pattern="https://.*"
                                                onChange={(e) => setLinkedinLink(e.target.value)} />
                                        </label>
                                        <label className="flex flex-col gap-4 justify-center">
                                            <div className=" Aceh text-black">Website:</div>

                                            <input
                                                type="url"
                                                pattern="https://.*"
                                                className="p-2 border rounded-full  text-slate-600 enabled:hover:border-gray-400 "
                                                // style={{ width: "40rem" }}
                                                value={websiteUrl}
                                                onChange={(e) => setWebsiteUrl(e.target.value)} />
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
            </div></>
    );
};

export default Profile;
