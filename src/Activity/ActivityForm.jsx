import { useState, useEffect } from "react";
import { TagsInput } from "react-tag-input-component";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";
import {
  addDoc,
  collection,
  // doc,
  // getDoc,
  serverTimestamp,
  // updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase/auth";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const ActivityForm = () => {
  const user = useSelector(selectUser);
  const userId = user.id;

  const [selectedFile, setSelectedFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [progress, setProgress] = useState(null);

  const [form, setForm] = useState({
    activityName: "",
    DateTime: "",
    category: "",
    location: "",
    writeup: "",
    tags: [],
    claps: 0,
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
  const handleImageChange = (e) => {
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
    const uploadFile = () => {
      const storageRef = ref(storage, selectedFile.name);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
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
            toast.info("Image upload ");
            setForm((prev) => ({ ...prev, imgUrl: downloadUrl }));
          });
        }
      );
    };

    selectedFile && uploadFile();
  }, [selectedFile]);
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
      await addDoc(collection(db, "activities"), {
        ...form,
        timestamp: serverTimestamp(),
        userId: userId,
      });
      toast.success("Activity created successfully");

      setForm({
        activityName: "",
        DateTime: "",
        category: "",
        location: "",
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
          Fill Activity Details
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 py-5">
            <label className="text-gray-500 Aceh text-sm"> Activity Name</label>
            <input
              name="activityName"
              value={form.activityName}
              onChange={handleChange}
              className="p-3 bg-transparent border rounded-xl text-black"
            ></input>
          </div>

          <div className="flex flex-col gap-2 py-2">
            <label className="text-gray-500 Aceh text-sm"> Date</label>
            <input
              name="DateTime"
              value={form.DateTime}
              onChange={handleChange}
              type="datetime-local"
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
            <label className="text-gray-600 mt-5 text-md Aceh">Add Image</label>
            <input
              type="file"
              id="myFile"
              onChange={handleImageChange}
              accept="image/*, video/*"
              name="filename"
              className="file-input file-input-bordered w-full bg-white text-gray-500"
            />
            {progress > 0 && (
              <div className="w-40 bg-gray-200 flex m-auto rounded-full h-2.5 dark:bg-gray-700 overflow-hidden transition-all duration-300 ease-in-out">
                <div
                  className="bg-red-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
            <div className="card p-4 m-auto">
              {previewUrl && (
                <img
                  className="w-full h-30"
                  src={previewUrl}
                  alt="File Preview"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 py-2">
            <label className="text-gray-500 Aceh text-sm"> Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              type="text"
              className="p-3  bg-transparent border rounded-xl  text-black"
            ></input>
          </div>
          <div className="flex flex-col gap-2 py-2">
            <label className="text-gray-500 Aceh text-sm">
              {" "}
              Activity Write-up
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
                (Seperate tags with spacebar or comma &rdquo;,&rdquo; )
              </span>
            </label>
            <TagsInput
              value={form.tags}
              name="Tags"
              onChange={handleTags}
              required
              separators={[" ", ","]}
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

export default ActivityForm;
