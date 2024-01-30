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
import { Helmet } from "react-helmet-async";

const HostEvent = () => {
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
  const [progress, setProgress] = useState(null);

  const [form, setForm] = useState({
    eventName: "",
    theme: "",
    StartDateTime: "",
    EndDateTime: "",
    category: "",
    address: "",
    eventDescription: "",
    tags: [],
    organizerName: "",
    twitter: "",
    website: "",
    phoneNumber: "",
    aboutOrganizer: "",
  });
  const categoryOption = [
    "Fitnes",
    "Photography",
    "Travel",
    "Exploration",
    "Lifestyle",
    "Fashion",
    "Music",
    "Health & Wellness",
    "Art & craft",
    "Volunteering & Philanthropy",
    "Food",
    "Business & Finance",
    "Tech",
    "Books",
    "Games & Sports",
    "Comedy & entertainment",
    "Night life",
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
      await addDoc(collection(db, "events"), {
        ...form,
        timestamp: serverTimestamp(),
        userId: userId,
      });
      toast.success("Event created successfully");

      setForm({
        eventName: "",
        theme: "",
        dateTime: "",
        category: "",
        address: "",
        eventDescription: "",
        tags: [],
        organizerName: "",
        twitter: "",
        website: "",
        phoneNumber: "",
        aboutOrganizer: "",
      });
    } catch (err) {
      console.error(err);
      // Handle the error appropriately
    }
  };

  return (
    <>
      <Helmet>
        <title>Host an Event</title>
        <meta
          name="description"
          content="Empower Your Community: Create a Meetup/ Eevent Today
    "
        />

        <link
          rel="canonical"
          href="https://wholesome.crystaleey.com/hostevent/"
        />
        <meta
          name="keywords"
          content="`Wholesome, Crystalveey,
         , Events,  Attend, Calender, Create Events, Host Events, Search Events, City , Location, Time, Venue, schedule, event listings , event calendar , upcoming events, activities, city events, Art, Travel and Adventure"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Host Event Lst" />
        <meta
          property="og:url"
          content="https://wholesome.crystaleey.com/hostevent/"
        />
        {/* <meta property="og:image" content={posts} /> */}
        <meta
          name="og:description"
          content="Empower Your Community: Create a Meetup/ Eevent Today"
        />
        <meta name="og:site_name" content="Wholesome" />
        <meta name="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content="https://wholesome.crystaleey.com/hostevent/"
        />
        <meta name="twitter:title" content="Host an Event" />
        <meta
          name="twitter:description"
          content="Empower Your Community: Create a Meetup/ Eevent Today"
        />
        {/* <meta name="twitter:image" content="../../public/20231116_210104-removebg-preview.png" /> */}

        <script
          type="application/ld+json"
          {...JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: "Host an Event",
            url: "https://wholesome.crystaleey.com/hostevent",

            // "image": {posts.imgUrl},

            publisher: {
              "@type": "Organization",
              name: "Wholesome",
              logo: {
                "@type": "ImageObject",
                url: "",
              },
            },
            // "datePublished": `${posts.timestamp?.toDate()?.toDateString()}`,
          })}
        />
      </Helmet>
      <div className="w-screen">
        <div className=" ">
          <div className="h-full bg-red-800 sm:py-5 relative w-full">
            <img
              src="/Images/Events/host/meeeting2.jpeg"
              className="w-full relative"
            ></img>
            <div className="absolute sm:relative sm:top-0 sm:right-0 px-5 top-80 right-10">
              <h1 className="text-white text-left sm:text-4xl pt-10 sm:pt-10 text-8xl">
                Host a Meetup
              </h1>
              <hr className="w-64 my-5"></hr>
              <p className="text-white text-left text-2xl  Aceh font-bolder">
                Empower Your Community: Create a Meetup Today
              </p>
            </div>
          </div>
          <div className="bg-gray-800 py-20 ">
            <h1 className="text-red-500  text-center text-2xl">
              Reach the right people
            </h1>
            <div className="m-auto flex sm:flex-col  gap-5 sm:gap-10 px-5   sm:px-0 sm:py-5  py-10 justify-center ">
              <div className="flex gap-5  flex-col w-72 sm:w-full p-5">
                <img
                  src="/Images/Events/host/meeting.jpeg"
                  className="m-auto"
                />
                <div className="text-center">
                  <h1 className="text-xl text-green-500">Attendee Discovery</h1>
                  <p className="text-gray-200 ">
                    Personalised recommendations are tailored to attendees
                    interests and location, matching them with events they’d be
                    most interested in attending
                  </p>
                </div>
              </div>
              <div className="flex gap-5 flex-col  w-72 sm:w-full  p-5">
                <img
                  src="/Images/Events/host/meeting3.jpeg"
                  className="m-auto"
                />
                <div className="text-center">
                  <h1 className="text-xl text-green-500">Promotion</h1>
                  <p className="text-gray-200 ">
                    Promote your event across wholesome and get 14x more
                    visibility on our homepage, related events, search results,
                    and more
                  </p>
                </div>
              </div>
              <div className="flex  gap-5 flex-col w-72 sm:w-full  p-5">
                <img
                  src="/Images/Events/host/meeting4.jpeg"
                  className="m-auto"
                />
                <div className="text-center">
                  <h1 className="text-xl text-green-500 text-center">
                    Attendee Discovery
                  </h1>
                  <p className="text-gray-200 ">
                    Personalised recommendations are tailored to attendees'
                    interests and location, matching them with events they’d be
                    most interested in attending
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-40 px-40 sm:mx-5 sm:px-5">
            <h1 className="text-center text-black py-10 text-2xl ">
              Fill Event/Meetup Details
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2 py-5">
                <label className="text-gray-500 Aceh text-sm">
                  {" "}
                  Event Name
                </label>
                <input
                  name="eventName"
                  value={form.eventName}
                  onChange={handleChange}
                  className="p-3 bg-transparent border rounded-xl text-black"
                ></input>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-500 Aceh text-sm"> Theme</label>
                <input
                  name="theme"
                  value={form.theme}
                  onChange={handleChange}
                  className="p-3 bg-transparent border rounded-xl text-black"
                ></input>
              </div>
              <div className="flex flex-col gap-2 py-2">
                <label className="text-gray-500 Aceh text-sm">
                  {" "}
                  Start Date/Time
                </label>
                <input
                  name="StartDateTime"
                  value={form.StartDateTime}
                  onChange={handleChange}
                  type="datetime-local"
                  className="p-3 bg-transparent border rounded-xl text-black"
                ></input>
              </div>
              <div className="flex flex-col gap-2 py-2">
                <label className="text-gray-500 Aceh text-sm">
                  {" "}
                  End Date/Time
                </label>
                <input
                  name="EndDateTime"
                  value={form.EndDateTime}
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
                <label className="text-gray-600 mt-5 text-md Aceh">
                  Add Image
                </label>
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
                <label className="text-gray-500 Aceh text-sm"> Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  type="text"
                  className="p-3  bg-transparent border rounded-xl  text-black"
                ></input>
              </div>
              <div className="flex flex-col gap-2 py-2">
                <label className="text-gray-500 Aceh text-sm">
                  {" "}
                  Description of Event
                </label>
                <textarea
                  name="eventDescription"
                  value={form.eventDescription}
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
                  separators={[" ", ","]}
                  onChange={handleTags}
                  required
                  editable
                  placeHolder="Enter Post Tags"
                  classNames="text-black  w-full text-xl rti--container "
                />{" "}
              </div>
              <p className="text-center text-xl text-red-300 py-2 my-5 border-b">
                Organizers Details
              </p>
              <div className="flex flex-col gap-2 py-2">
                <label className="text-gray-500 Aceh text-sm">
                  {" "}
                  Organizers Name
                </label>
                <input
                  name="organizerName"
                  value={form.organizerName}
                  onChange={handleChange}
                  type="text"
                  className="p-3 bg-transparent border rounded-xl text-black"
                ></input>
              </div>
              <div className="flex flex-col gap-2 py-2">
                <label className="text-gray-500 Aceh text-sm"> Twitter</label>
                <input
                  name="twitter"
                  value={form.twitter}
                  onChange={handleChange}
                  type="text"
                  className="p-3 bg-transparent border rounded-xl  text-black"
                ></input>
              </div>
              <div className="flex flex-col gap-2 py-2">
                <label className="text-gray-500 Aceh text-sm"> Website</label>
                <input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  type="text"
                  className="p-3 bg-transparent border rounded-xl text-black"
                ></input>
              </div>
              <div className="flex flex-col gap-2 py-2">
                <label className="text-gray-500 Aceh text-sm">
                  {" "}
                  Phone Number
                </label>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  type="text"
                  className="p-3 bg-transparent border rounded-xl text-black"
                ></input>
              </div>
              <div className="flex flex-col gap-2 py-2">
                <label className="text-gray-500 Aceh text-sm">
                  {" "}
                  About Organiser
                </label>
                <input
                  name="aboutOrganizer"
                  value={form.aboutOrganizer}
                  onChange={handleChange}
                  type="text"
                  className="p-3 bg-transparent border rounded-xl text-black"
                ></input>
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
      </div>
    </>
  );
};

export default HostEvent;
