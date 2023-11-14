import { useEffect, useState } from "react";
import {
    addDoc,
    collection,
    getDocs,
    doc,
    deleteDoc
} from "firebase/firestore";
import { deleteUser as deleteAuthUser } from "firebase/auth";
import 'flowbite';

import { auth, db, } from "../firebase/auth.js";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBiohazard, faInfo, faWarning } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";


const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkCount, setBookmarkCount] = useState(0);

    const [postId, setPostId] = useState([]);
    const [randomPost, setRandomPost] = useState([]);
    const [tags, setTags] = useState([]);
    const [category, setCategory] = useState([]);
    const [search, setSearch] = useState("");
    const [postPerPage] = useState(9);
    const [currentPage, setCurrentPage] = useState(1);
    const [trendingPost, setTrendingPost] = useState([]);

    useEffect(() => {
        // setLoading(true);
        const fetchPosts = async () => {
            try {
                // setLoading(true);
                const querySnapshot = await getDocs(collection(db, "users"));
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
                setUsers([...postData]);
                setTags([...new Set(tags)]);
                setCategory(categories);

                const randomIndex = Math.floor(Math.random() * postData.length);
                if (postData[randomIndex]) {
                    setRandomPost([postData[randomIndex]]);
                }

                // setLoading(false)
            } catch (error) {
                console.error("Error fetching posts:", error);
                setUsers([]);
                // setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const deleteUser = async ( user) => {
        if (window.confirm(`Are you sure you want to delete '${user.name}'?. This user will no longer have  access to Wholesome ` )) {
            try {
              // Delete the document from Firestore
              await deleteAuthUser(auth, user.id);
              await deleteDoc(doc(db, "users", user.id));
              toast.success("User deleted successfully")
              // Update the state after successful deletion
              const updatedUsers = users.filter((user) => user.user.id !== user.id);
              setUsers(updatedUsers);
        
              toast.success("User deleted successfully");
            } catch (error) {
              console.error("Error deleting User:", error);
              toast.error("An error occurred while deleting the user");
            }
          }
    
    };
    return (
        <div className="py-10 sm:px-2 px-8 w-full ">
            <p className="text-center text-xl Aceh py-10">Users Data</p>


            <div className="relative overflow-x-auto sm:w-screen shadow-md sm:rounded-lg">
                <label htmlFor="table-search" className="sr-only">Search</label>
                <div className="relative my-5">
                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="text" id="table-search-users" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for users" />
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overfloex-x-sccroll overflow-hidden">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">

                            </th>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Bio
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Occupation
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Followers
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Following
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    {users?.map((user) => (

                        <tbody key={user.id} >
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">

                                <th scope="row" className="px-6 py-4 font-medium Aceh  text-gray-900 whitespace-nowrap dark:text-white">
                                    <img src={user.photoURL} className="w-10 h-10 rounded-full"></img>
                                </th>
                                <NavLink to={`/profile/${user.id}`} key={user.id}>

                                    <th scope="row" className="px-6 py-4  Aceh  text-gray-900  dark:text-white">
                                        {user.name}
                                    </th>
                                </NavLink>
                                <td className="px-6 py-4">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4">
                                    {user.occupation}
                                </td>

                                <td className="px-6 py-4">
                                    {user.followers?.length}

                                </td>
                                <td className="px-6 py-4">
                                    {user.following?.length}

                                </td>
                                <td className="px-6 py-4">
                                    <NavLink to={`/profile/${user.id}`} key={user.id}>
                                        <button className="btn">Profile</button>
                                    </NavLink>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button type="button" onClick={() => deleteUser(user)} className=" block font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete User</button>

                                   
                                </td>

                            </tr>

                          
                   
                        </tbody>
                     
                    ))}
                </table>

               
            </div>


        </div>
    )
}
export default Users