import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase/auth.js";
// import { useParams } from 'react-router';
import { NavLink } from "react-router-dom";
import Spinner from "../components/Spinner.tsx";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
// import ReactPaginate from 'react-paginate';
import Pagination from "../components/pagination.jsx";

const Allarticles = () => {
  const [posts, setPosts] = useState([]);

  const [search, setSearch] = useState("");
  const [postPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [trendingPost, setTrendingPost] = useState([]);

  useEffect(() => {
    // setLoading(true);
    const fetchPosts = async () => {
      try {
        // setLoading(true);
        const querySnapshot = await getDocs(collection(db, "posts"));
        const postData = [];
        const postIds = [];
        const tags = [];
        const categories = [];

        // Parallelize fetching data
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const postDoc = doc.data();
            postDoc.id = doc.id;
            postData.push(postDoc);
            postIds.push(doc.id);

            if (Array.isArray(postDoc.tags)) {
              tags.push(...postDoc.tags);
            }

            const category = postDoc.category;
            if (category) {
              categories.push(category);
            }
          })
        );

        // Set the postId state with the collected post IDs
        setPostId(postIds);
        setPosts([...postData]);
        setTags([...new Set(tags)]);
        setCategory(categories);

        const randomIndex = Math.floor(Math.random() * postData.length);
        if (postData[randomIndex]) {
          setRandomPost([postData[randomIndex]]);
        }

        // setLoading(false)
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
        // setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = () => {
    if (search.trim() === "") {
      return posts; // Return all users when search input is empty
    } else {
      return posts.filter(
        (post) =>
          (post.postTitle &&
            post.postTitle.toLowerCase().includes(search.toLowerCase())) ||
          (post.author &&
            post.author.toLowerCase().includes(search.toLowerCase()))
      );
    }
  };

  const indexOfLastPage = currentPage * postPerPage;
  const indexOfFirstPage = indexOfLastPage - postPerPage;
  const currentPosts = handleSearch().slice(indexOfFirstPage, indexOfLastPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete the user post?")) {
      try {
        // Delete the document from Firestore
        await deleteDoc(doc(db, "posts", postId));

        // Update the state after successful deletion
        const updatedPosts = posts.filter((post) => post.postId !== postId);
        setPosts(updatedPosts);

        toast.success("Post deleted successfully");
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("An error occurred while deleting the post");
      }
    }
  };

  return (
    <div className="py-20 sm:px-2 px-8 w-full">
      <p className="text-center text-xl Aceh py-10">All Articles</p>
      <label htmlFor="table-search" className="sr-only">
        Search
      </label>
      <div className="relative my-5">
        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="https://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="text"
          id="table-search-users"
          className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search for users"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="relative overflow-x-auto sm:w-screen shadow-md sm:rounded-lg p-8">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Author
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Likes
              </th>
              <th scope="col" className="px-6 py-3">
                Comments
              </th>
              <th scope="col" className="px-6 py-3">
                Views
              </th>

              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          {currentPosts?.map((post) => (
            <tbody key={post.id}>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <NavLink to={`/readmore/${post.id}`}>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium Aceh  text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {post.postTitle}
                  </td>
                </NavLink>
                <td className="px-6 py-4">{post.author}</td>
                <td className="px-6 py-4">{post.category}</td>

                <td className="px-6 py-4">{post.likes.length}</td>

                <td className="px-6 py-4">{post.comments.length}</td>
                <td className="px-6 py-4">
                  {post.views ? post.views.length : 0}
                </td>
                <td className="px-6 py-4 text-right">
                  {/* <div
                    onClick={() =>
                      document.getElementById("my_modal_4").showModal()
                    }
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Delete
                  </div> */}
                  <button onClick={() => handleDelete(post.id)}>Delete</button>
                </td>
              </tr>
              <dialog id="my_modal_4" className="modal">
                <div className="modal-box text-center">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <FontAwesomeIcon
                    icon={faWarning}
                    className="text-red-500 text-2xl border rounded-full p-5 flex w-fit m-auto"
                  />

                  <h3 className="font-bold text-lg text-center ">
                    Are you sure you want to delete this Post?
                  </h3>
                  <div
                    className="btn bg-red-500 text-white my-2"
                    onClick={() => console.log(post.id)}
                  >
                    Yes, Sure
                  </div>

                  <p className="py-4">
                    Press ESC key or click on ✕ button to close
                  </p>
                </div>
              </dialog>
            </tbody>
          ))}
        </table>
        <Pagination
          className="flex m-auto"
          postPerPage={postPerPage}
          totalPosts={posts.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default Allarticles;
