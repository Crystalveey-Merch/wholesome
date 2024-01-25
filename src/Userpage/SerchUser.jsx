import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import { Fragment, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/auth";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

import {
  Dialog,
  Disclosure,
  Popover,
  Transition,
  Menu,
} from "@headlessui/react";
import { useParams } from "react-router";
import { useEffect } from "react";
import { toast } from "react-toastify";
const SerchUser = () => {
  const { interestName } = useParams();
  const [users, setUsers] = useState([]);

  const [authUser, setAuthUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const postData = [];
        querySnapshot.forEach((doc) => {
          // Extract the data from each document
          const post = doc.data();
          post.id = doc.id;
          postData.push(post);
        });
        setUsers(postData);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  const handleOnSelect = (user) => {
    // Construct the target URL
    const targetUrl = `/profile/${user.id}`;

    // Use history.push() to navigate to the target URL
    navigate(targetUrl);
    setIsModalOpen(false);
  };
  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(string, results);
  };

  const handleOnHover = (result) => {
    // the item hovered
    console.log(result);
  };
  const handleOnFocus = () => {
    console.log("Focused");
  };
  const formatResult = (item) => {
    return (
      <>
        <div className="flex  w-60  gap-1" id={item.id}>
          <img src={item.photoURL} className="w-10" />

          <h1 className="text-sm">{item.name}</h1>
        </div>
      </>
    );
  };
  return (
    <div className="pt-40 h-screen bg-gradient-to-r from-blue-600 to-violet-600">
    <div className="text-center Aceh py-20 text-white text-2xl">
        Seach 🔍  and connect with Users of WHOLESQUARE 
    </div>
      <ReactSearchAutocomplete
        items={users}
        onSearch={handleOnSearch}
        onHover={handleOnHover}
        onSelect={handleOnSelect}
        onFocus={handleOnFocus}
        styling={{
          // borderRadius: "none",
          boxShadow: "none",
          border: "none",
          fontSize: "13px",
          // fontFamily: "A",
          padding: "2px",
          background: "rgba(0, 151, 19, 0.1)",
          borderRadius: "30px",
        }}
        placeholder="Input search"
        autoFocus
        className=" sm:w-full  Aceh  mx-60 z-0   text-sm sm:m-0"
        formatResult={formatResult}
      />
    </div>
  );
};

export default SerchUser;
