import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { deleteUser as deleteAuthUser } from "firebase/auth";
import "flowbite";

import { auth, db } from "../firebase/auth.js";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBiohazard,
  faInfo,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Pagination from "../components/pagination.jsx";

const AllActivity = () => {
  const [activity, setActivity] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(10);

  useEffect(() => {
    // setLoading(true);
    const fetchActivity = async () => {
      try {
        // setLoading(true);
        const querySnapshot = await getDocs(collection(db, "activities"));
        const postData = [];

        // Parallelize fetching data
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const postDoc = doc.data();
            postDoc.id = doc.id;
            postData.push(postDoc);
          })
        );

        // Set the postId state with the collected post IDs
        setActivity([...postData]);

        // setLoading(false)
      } catch (error) {
        console.error("Error fetching Activity:", error);
        setActivity([]);
        // setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const deleteActivity = async (activity) => {
    if (window.confirm("Are you sure you want to delete this Activity?")) {
      try {
        // Delete the document from Firestore
        await deleteDoc(doc(db, "posts", activity.id));

        // Update the state after successful deletion
        const updatedPosts = activity.filter(
          (post) => post.postId !== activity.id
        );
        setActivity(updatedPosts);

        toast.success("Post deleted successfully");
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("An error occurred while deleting the post");
      }
    }
  };

  const handleSearch = () => {
    if (search.trim() === "") {
      return activity; // Return all users when search input is empty
    } else {
      return activity.filter(
        (activity) =>
          (activity.activityName &&
            activity.activityName
              .toLowerCase()
              .includes(search.toLowerCase())) ||
          (activity.location &&
            activity.location.toLowerCase().includes(search.toLowerCase()))
      );
    }
  };

  const indexOfLastPage = currentPage * postPerPage;
  const indexOfFirstPage = indexOfLastPage - postPerPage;
  const currentPosts = handleSearch().slice(indexOfFirstPage, indexOfLastPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {" "}
      <div className="py-10 sm:px-2 w-full ">
        <p className="text-center text-xl Aceh py-10">Activity Data</p>

        <div className="relative overflow-x-auto sm:w-screen shadow-md sm:rounded-lg  py-5">
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
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overfloex-x-sccroll overflow-hidden">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Location
                </th>
                <th scope="col" className="px-6 py-3">
                  claps
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>

                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            {currentPosts?.map((activity) => (
              <tbody key={activity.id}>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th
                    scope="row"
                    className="px-6 py-4  Aceh  text-gray-900  dark:text-white"
                  >
                    {activity.activityName}
                  </th>
                  <td className="px-6 py-4">{activity.location}</td>
                  <td className="px-6 py-4">{activity.claps}</td>

                  <td className="px-6 py-4">{activity.category}</td>

                  <td className="px-6 py-4">
                    <NavLink to={`/activity/${activity.id}`} key={activity.id}>
                      <button className="btn bg-sky-700 text-white">
                        View
                      </button>
                    </NavLink>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => deleteActivity(activity.id)}
                      className=" block font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Delete activity
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>

          <Pagination
            postPerPage={postPerPage}
            totalPosts={activity.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default AllActivity;
