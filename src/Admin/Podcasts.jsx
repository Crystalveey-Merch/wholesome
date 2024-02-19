/* eslint-disable react/prop-types */
// import { useEffect, useState } from "react";
import {
  // addDoc,
  // collection,
  // getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
// import { deleteUser as deleteAuthUser } from "firebase/auth";
import "flowbite";

import {  db } from "../firebase/auth.js";
// import { NavLink } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faBiohazard,
//   faInfo,
//   faWarning,
// } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const Podcasts = ({ podcasts, setPodcasts }) => {
  // const [podcasts, setPodcasts] = useState([]);

  // useEffect(() => {
  //   // setLoading(true);
  //   const fetchPodcasts = async () => {
  //     try {
  //       // setLoading(true);
  //       const querySnapshot = await getDocs(collection(db, "podcast"));
  //       const postData = [];

  //       // Parallelize fetching data
  //       await Promise.all(
  //         querySnapshot.docs.map(async (doc) => {
  //           const postDoc = doc.data();
  //           postDoc.id = doc.id;
  //           postData.push(postDoc);
  //         })
  //       );

  //       // Set the postId state with the collected post IDs
  //       setPodcasts([...postData]);

  //       // setLoading(false)
  //     } catch (error) {
  //       console.error("Error fetching posts:", error);
  //       setPodcasts([]);
  //       // setLoading(false);
  //     }
  //   };

  //   fetchPodcasts();
  // }, []);

  const deletepodcast = async (podcast) => {
    if (window.confirm("Are you sure you want to delete this Podcast?")) {
      try {
        // Delete the document from Firestore
        await deleteDoc(doc(db, "podcast", podcast.id));

        // Update the state after successful deletion
        // const updatedPosts = podcast.filter(
        //   (podcast) => podcast.postId !== podcast.id
        // );
        // setPodcasts(updatedPosts);
        setPodcasts((prevPosts) =>
          prevPosts.filter((podcasts) => podcasts.id !== podcast.id)
        );
        toast.success("Podcast deleted successfully");
      } catch (error) {
        console.error("Error deleting Podcast:", error);
        toast.error("An error occurred while deleting the Podcast");
      }
    }
  };

  return (
    <div>
      {" "}
      <div className="py-10 sm:px-2 px-8 w-full ">
        <p className="text-center text-2xl Aceh py-10 text-gray-500">
          Podcasts Data
        </p>
        <div className="btn btn-success text-3xl py-10">
          {podcasts.length} Podcasts
        </div>

        <div className="relative overflow-x-auto sm:w-screen shadow-md sm:rounded-lg">
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
            />
          </div>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overfloex-x-sccroll overflow-hidden">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3"></th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Bio
                </th>

                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            {podcasts?.map((podcast) => (
              <tbody key={podcast.id}>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium Aceh  text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <img
                      src={podcast.photoURL}
                      className="w-10 h-10 rounded-full"
                    ></img>
                  </th>

                  <th
                    scope="row"
                    className="px-6 py-4  Aceh  text-gray-900  dark:text-white"
                  >
                    {podcast.podcastName}
                  </th>
                  <td className="px-6 py-4">{podcast.category}</td>

                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => deletepodcast(podcast)}
                      className=" block font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Delete podcast
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Podcasts;
