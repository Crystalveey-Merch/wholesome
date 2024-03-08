import { useState } from "react";
import { TagsInput } from "react-tag-input-component";
// import { Component } from "react";
import MDEditor from "@uiw/react-md-editor";
// import MDEditor, { selectWord } from "@uiw/react-md-editor";
import MarkdownIt from "markdown-it";
import { db, storage } from "../firebase/auth";
// import { auth } from "../firebase/auth.js";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice.js";

const initialState = {
  postTitle: "",
  tags: [],
  category: "",
  postDescription: "",
  content: "",
  comments: [],
  likes: [],
  views: [],
  bookmarks: [],
  analytics: {
    views: 0,
    visits: 0,
    viewers: [],
    visitors: [],
  },
};
const categoryOption = [
  "Fitness",
  "Photography",
  "Travel",
  "Exploration",
  "Creators",
  "Fashion",
  "Music",
  "Dance",
  "Health and Wellness",
  "Art and crafts",
  "Volunteering",
  "Food",
  "Movies",
  "Business",
  "Finance",
  "Tech",
  "Books",
  "Games",
  "Sports",
  "Nightlife",
  // "Comedy & entertainment",
  "SDGs",
];

// import "./tagsInput.css"

const CreatePost = () => {
  // const [selected, setSelected] = useState([]);
  const mdParser = new MarkdownIt();
  const [form, setForm] = useState(initialState);
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  // const [userName, setUsername] = useState();
  const { postTitle, category, tags, postDescription, content } = form;
  const [progress, setProgress] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(postTitle, form.postDescription);
  };
  const handleTags = (tags = []) => {
    setForm({ ...form, tags });
    console.log(form.tags);
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
  const onCategoryChange = (e) => {
    setForm({ ...form, category: e.target.value });
    console.log(category);
  };
  const handleEditorChange = (text) => {
    console.log(text);
    const content = text;
    setForm({ ...form, content });
  };

  const user = useSelector(selectUser);

  useEffect(() => {
    const getDraft = async () => {
      const draftCollection = doc(db, "drafts", id);
      const snapshot = await getDoc(draftCollection);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setForm({ ...data });
      }
    };
    getDraft();
  });
  useEffect(() => {
    const handleImageEdit = async () => {
      const docRef = doc(db, "blogs", id);
      const snapshot = await getDoc(docRef);
      const data = snapshot.data();
      if (data) {
        const imgUrl = data.imgUrl;
        setPreviewUrl(imgUrl);
      }
    };
    handleImageEdit();
  });
  // Use another useEffect to log the username
  // useEffect(() => {
  //   console.log(userName);
  // }, [userName]);

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

  const getPostDetail = async () => {
    const docRef = doc(db, "posts", id);
    const snapshot = await getDoc(docRef);
    //  const blogId = id
    if (snapshot.exists()) {
      const data = snapshot.data();

      setForm({ ...data });
      console.log(data);
    }
  };
  useEffect(() => {
    id && getPostDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddPost = async (e) => {
    e.preventDefault();

    if (category && tags && postTitle && content) {
      if (!id) {
        try {
          await addDoc(collection(db, "posts"), {
            ...form,
            timestamp: serverTimestamp(),
            author: user.name,
            userId: user.id,
          });
          toast.success("Post created successfully");
          navigate("/feed");
        } catch (err) {
          console.log(err);
        }
      } else {
        if (id) {
          try {
            await updateDoc(doc(db, "posts", id), {
              ...form,
              timestamp: serverTimestamp(),
              author: user.name,
              userId: user.id,
            });
            toast.success("Post updated successfully");
            navigate("/feed");
          } catch (err) {
            console.log(err);
            toast.error("Click on Publish Draft Instead");
          }
        }
      }
    } else {
      return toast.error("All fields are mandatory to fill");
    }
  };

  const handlepublishDraft = async (e) => {
    e.preventDefault();

    if (category && tags && postTitle && postDescription && content) {
      try {
        await addDoc(collection(db, "posts"), {
          ...form,
          timestamp: serverTimestamp(),
          author: user.name,
          userId: user.id,
        });
        toast.success("Draft Published");
        navigate("/feed");
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handleAddDraft = async (e) => {
    e.preventDefault();

    if (category && tags && postTitle && content) {
      if (!id) {
        try {
          await addDoc(collection(db, "drafts"), {
            ...form,
            timestamp: serverTimestamp(),
            author: user.name,
            userId: user.id,
          });
          toast.success("Added to Draft");
        } catch (err) {
          console.log(err);
        }
      } else {
        if (id) {
          try {
            await updateDoc(doc(db, "drafts", id), {
              ...form,
              timestamp: serverTimestamp(),
              author: user.name,
              userId: user.id,
            });
            toast.success("Draft updated ");
          } catch (err) {
            console.log(err);
            // toast.error("Click on Publish Draft Instead")
          }
        }
      }
    } else {
      try {
        toast.info(
          "Opps!! Ensure you have some contents in Title, category, tags, Post Description and content"
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Create a Post</title>
        <meta name="description" content="Create Post on Wholesquare" />
        <link rel="canonical" href="/createpost" />
      </Helmet>
      <div className="pt-20  flex m-auto  justify-center w-full sm:pt-16">
        <div
          style={{}}
          className="bg-white mx-20  xl:mx-10 xl:px-10 sm:mx-0 px-40 sm:px-5 dark:text-white  w-full  "
        >
          <div className="flex flex-col gap-10 bg-white ">
            <h3 className="text-black font-bold text-center my-10 text-4xl lg:text-3xl sm:text-2xl">
              {id ? "Edit Post" : "Create Post on Wholesquare"}
            </h3>
            <form className="form-control" onSubmit={handleAddPost}>
              {id ? (
                <div
                  className=" text-red-500 cursor-pointer"
                  onClick={handleAddDraft}
                >
                  <FontAwesomeIcon icon={faSave} /> Update Draft
                </div>
              ) : (
                <div
                  className=" text-red-500 cursor-pointer"
                  onClick={handleAddDraft}
                >
                  <FontAwesomeIcon icon={faSave} /> Save to draft
                </div>
              )}
              <label className="text-gray-600 mt-5 text-md Aceh"> Title</label>
              <input
                required
                value={postTitle}
                name="postTitle"
                onChange={handleChange}
                type="text"
                className="input input-bordered w-full  bg-transparent text-gray-800 mt-3 text-xl font-bold"
              />
              <label className="text-gray-600 mt-5 text-md Aceh">
                Sub Title
              </label>
              <input
                type="text"
                value={postDescription}
                name="postDescription"
                onChange={handleChange}
                className="input input-bordered w-full   bg-transparent text-gray-800  text-xl"
              ></input>
              <label className=" flex text-gray-600 mt-5 text-md Aceh">
                Tags
                <span className="text-sky-500">
                  (Seperate tags with spacebar or comma &quot;,&quot; )
                </span>
              </label>
              <TagsInput
                value={tags}
                name="Tags"
                onChange={handleTags}
                separators={[" ", ","]}
                required
                editable
                placeHolder="Enter Post Tags"
                classNames="text-black  w-full text-xl rti--container "
              />{" "}
              <div className=" border-1 rounded-1 cursor-text">
                <div className="tags flex m-2 border-1"></div>
              </div>
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
              <div className="card p-4 m-auto">
                {previewUrl && (
                  <img
                    className="w-full h-30"
                    src={previewUrl}
                    alt="File Preview"
                  />
                )}
              </div>
              <label className="text-gray-600 mt-5 text-md Aceh">
                Select Category
              </label>
              <div className="col-12 py-3">
                <select
                  value={category}
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
              <label className="text-gray-600 mt-5 text-md Aceh">Content</label>
              <div>
                <div className="container" data-color-mode="light">
                  <MDEditor
                    style={{ height: "500px", display: "" }}
                    value={content}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={handleEditorChange}
                    preview="edit"
                  />
                  <MDEditor.Markdown
                    source={content}
                    style={{ whiteSpace: "pre-wrap" }}
                  />
                </div>
              </div>
              <div className="m-auto py-5">
                {id ? (
                  <button
                    type="submit"
                    className="btn mr-10"
                    disabled={progress < 100}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn mr-10"
                    disabled={progress < 100}
                  >
                    Submit
                  </button>
                )}

                {id ? (
                  <button
                    onClick={handlepublishDraft}
                    className="btn mr-10"
                    disabled={progress < 100}
                  >
                    Publish Draft
                  </button>
                ) : (
                  ""
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
