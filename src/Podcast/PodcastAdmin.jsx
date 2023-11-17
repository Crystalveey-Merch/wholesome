import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { TagsInput } from "react-tag-input-component";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase/auth";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/auth.js";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router";

const PodcastAdmin = () => {
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

  const [selectedFile, setSelectedFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [selectedImageFile, setSelectedImageFile] = useState();
  const [previewImageUrl, setPreviewImageUrl] = useState();
  const [progress, setProgress] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    podcastName: "",
    DateTime: "",
    category: "",
    spotify: "",
    podcast: "",
    youtube: "",
    writeup: "",
    tags: [],
  });
  const categoryOption = [
    "Lifestyle and Fashion",
    "Health and wellness",
    "Travel and Adventure",
    "Volunteer and Philanthropy",
    "Business and Finance",
    "Games & Sports",
    "Art & crafts",
    "Environmental & Sustainability",
    "Book club",
  ];
  const handleTags = (tags = []) => {
    setForm({ ...form, tags });
    console.log(form.tags);
  };

  const onCategoryChange = (e) => {
    setForm({ ...form, category: e.target.value });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const handleAudioChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.log(e.target.files);
      setSelectedFile();
      setPreviewUrl();
      return;
    }
    setSelectedFile(e.target.files[0]);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };

    fileReader.readAsDataURL(e.target.files[0]);
  };
  useEffect(() => {
    const uploadFile = (file) => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is done");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            toast.info("File upload");
            if (file === selectedFile) {
              setForm((prev) => ({ ...prev, audioUrl: downloadUrl }));
            } else if (file === selectedImageFile) {
              setForm((prev) => ({ ...prev, imageUrl: downloadUrl }));
              setPreviewImageUrl(downloadUrl);
            }
          });
        }
      );
    };

    if (selectedFile) {
      uploadFile(selectedFile);
    }

    if (selectedImageFile) {
      uploadFile(selectedImageFile);
    }
  }, [selectedFile, selectedImageFile]);

  const handleImageChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.log(e.target.files);
      setSelectedImageFile();
      setPreviewImageUrl();
      return;
    }
    setSelectedImageFile(e.target.files[0]);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewImageUrl(fileReader.result);
    };

    fileReader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Iterate through the keys in the 'form' object
    for (const key in form) {
      if (!form[key] === undefined) {
        // If any field is empty, display an error and exit
        return toast.error("All fields are mandatory to fill");
      }
    }

    try {
      // If all fields are filled, proceed to submit the form
      await addDoc(collection(db, "podcast"), {
        ...form,
        timestamp: serverTimestamp(),
        userId: userId,
      });
      toast.success("Podcast submitted successfully");
      navigate("/podcast");

      setForm({
        podcastName: "",
        DateTime: "",
        category: "",
        spotify: "",
        podcast: "",
        youtube: "",
        writeup: "",
        tags: [],
      });
    } catch (err) {
      console.error(err);
      // Handle the error appropriately
    }
  };

  return (
    <div className="w-screen my-20">
      <div className="mx-40 px-40 sm:mx-5 sm:px-5">
        <h1 className="text-center text-black py-10 text-2xl ">
          Fill Podcast Details
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 py-5">
            <label className="text-gray-500 Aceh text-sm"> Podcast Title</label>
            <input
              name="podcastName"
              value={form.activityName}
              onChange={handleChange}
              className="p-3 bg-transparent border rounded-xl text-black"
            ></input>
          </div>

          <div className="flex flex-col gap-2 py-2">
            <label className="text-gray-500 Aceh text-sm"> Category</label>
            <select
              value={form.category}
              onChange={onCategoryChange}
              className="bg-white text-black border p-4 rounded-xl w-full"
            >
              <option>Please select category</option>
              {categoryOption.map((option, index) => (
                <option value={option || ""} key={index}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 py-2">
            <label className="text-gray-500 Aceh text-sm">Podcast Image </label>
            <input
              name="filnamee"
              id="myFile"
              onChange={handleImageChange}
              accept="image/*, video/*"
              type="file"
              className="p-3  bg-transparent border rounded-xl  text-black"
            ></input>
          </div>
          <div className="card p-4 m-auto">
            {previewImageUrl && (
              <img
                className="w-full h-30"
                src={previewImageUrl}
                alt="File Preview"
              />
            )}
          </div>
          <div className="flex flex-col gap-2 py-2">
            <label className="text-gray-500 Aceh text-sm">
              Podcast Audio file
            </label>
            <input
              name="filnamee"
              id="myFile"
              onChange={handleAudioChange}
              accept="audio/*"
              type="file"
              className="p-3  bg-transparent border rounded-xl  text-black"
            ></input>
          </div>
          <div className="card p-4 m-auto">
            {previewUrl && (
              <audio className="w-full h-30" src={previewUrl} controls />
            )}
          </div>

          <div className="flex flex-col gap-2 py-2">
            <label className="text-gray-500 Aceh text-sm"> Spotify Link</label>
            <input
              name="spotify"
              value={form.spotify}
              onChange={handleChange}
              type="text"
              className="p-3  bg-transparent border rounded-xl  text-black"
            ></input>
          </div>

          <div className="flex flex-col gap-2 py-2">
            <label className="text-gray-500 Aceh text-sm"> Youtube Link</label>
            <input
              name="youtube"
              value={form.youtube}
              onChange={handleChange}
              type="text"
              className="p-3  bg-transparent border rounded-xl  text-black"
            ></input>
          </div>
          <div className="flex flex-col gap-2 py-2">
            <label className="text-gray-500 Aceh text-sm">
              {" "}
              Podcast Content
            </label>
            <textarea
              name="writeup"
              value={form.writeup}
              onChange={handleChange}
              type="text"
              className="p-3 bg-transparent border rounded-xl text-black"
            ></textarea>
          </div>
          <div className="flex flex-col gap-2 py-2">
            <label className="text-gray-500 Aceh text-sm">
              Tags
              <span className="text-sky-500">
                (Seperate tags with spacebar or comma "," )
              </span>
            </label>
            <TagsInput
              value={form.tags}
              name="Tags"
              onChange={handleTags}
              separators={[" ", ","]}
              required
              editable
              placeHolder="Enter Post Tags"
              classNames="text-black  w-full text-xl rti--container "
            />{" "}
          </div>

          <button
            className=" btn m-auto flex my-5 p-3 w-40 bg-green-500 text-white border-none "
            type="submit"
            disabled={progress < 100}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PodcastAdmin;
