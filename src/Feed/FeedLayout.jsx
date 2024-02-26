/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RightBar } from "./RightBar";
import {
  //   openRightBar,
  closeRightBar,
  selectOpenRightBar,
} from "../Features/openRightBarSlice";
import { db, onSnapshot, collection } from "../firebase/auth";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const FeedLayout = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const rightBarSlideOpen = useSelector(selectOpenRightBar);

  //   const openRightBarSlide = () => {
  //     dispatch(openRightBar());
  //   };

  const closeRightBarSlide = () => {
    dispatch(closeRightBar());
  };

  useEffect(() => {
    const unsuscribPosts = onSnapshot(collection(db, "posts"), (snapshot) => {
      const postData = [];
      //   const postIds = [];
      //   const tags = [];
      //   const categories = [];
      snapshot.forEach((doc) => {
        const postDoc = doc.data();
        postDoc.id = doc.id;
        postData.push({ ...doc.data(), id: doc.id });
        //   if (Array.isArray(postDoc.tags)) {
        //     tags.push(...postDoc.tags);
        //   }

        //   const category = postDoc.category;
        //   if (category) {
        //     categories.push(category);
        //   }
      });

      setPosts(postData);
      // setPostId(postIds);
      // setPostTags([...new Set(tags)]);
      // setPostCategories(categories);
      setLoading(false);
    });

    const unsuscribEvents = onSnapshot(collection(db, "events"), (snapshot) => {
      const eventData = [];
      snapshot.forEach((doc) => {
        eventData.push({ ...doc.data(), id: doc.id });
      });
      setEvents(eventData);
    });

    const unsuscribUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const userData = [];
      snapshot.forEach((doc) => {
        userData.push({ ...doc.data(), id: doc.id });
      });
      setUsers(userData);
    });

    return () => {
      unsuscribPosts();
      unsuscribEvents();
      unsuscribUsers();
    };
  }, []);

  const rightBarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const rightBarHeight = rightBarRef.current.offsetHeight;
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Check if the scroll position is greater than or equal to the height of the RightBar
      if (scrollPosition >= rightBarHeight - windowHeight) {
        // Add sticky class
        rightBarRef.current.classList.add("sticky-rightbar");
        rightBarRef.current.style.top = `${windowHeight - rightBarHeight}px`;
      } else {
        // Remove sticky class
        rightBarRef.current.classList.remove("sticky-rightbar");
        rightBarRef.current.style.top = "0";
      }
    };

    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //   useEffect(() => {
  //     const rightBarLinks = document.querySelectorAll(".rightbar-link");
  //     if (rightBarSlideOpen) {
  //       rightBarLinks.classList.add("rightbar-link-active");
  //     } else {
  //       rightBarLinks.classList.remove("rightbar-link-active");
  //     }
  //   }, [rightBarSlideOpen]);

  //   console.log(rightBarSlideOpen);

  return (
    <div className="flex justify-center min-h-[calc(100vh-0px)] w-screen gap-12 font-inter text-black overflowhidden px-4 xl:gap-6 sm:px-0">
      <div
        className={`w-full pt-[126px] pb-9 max-w-3xl flex flex-col gap-4 overflowauto xl:max-w-[650px] lg:max-w-3xl md:max-w-[650px] lg:px-5 md:px-2 sm:px-0 ${location.pathname.includes(
          ""
        )}`}
      >
        {/* for you and following tabs */}
        {location.pathname.includes("/feed") && (
          <div className="w-full h-10 flex gap-8 sm:px-4">
            <Link
              className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
                location.pathname === "/feed"
                  ? "text-black border-[#FF5841]"
                  : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
              } `}
              to="/feed"
            >
              For You
            </Link>
            <Link
              className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
                location.pathname === "/feed/following"
                  ? "text-black border-[#FF5841]"
                  : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
              } `}
              to="/feed/following"
            >
              Following
            </Link>
          </div>
        )}
        {children}
      </div>
      <div
        className={`rightbar-link z-20 ${
          rightBarSlideOpen
            ? "rightbar-link-active lg:bg-[rgba(0,0,0,0.4)] lg:items-end"
            : ""
        }`}
        style={{
          backgroundColor: rightBarSlideOpen ? "" : "transparent",
        }}
        onClick={closeRightBarSlide}
      >
        <div
          ref={rightBarRef}
          className="px min- h-max pt-[126px] pb-9 lg:overflow-y-auto lg:bg-white lg:w-max lg:place-self-end lg:h-full lg:px-4 lg:flex lg:flex-col lg:gap-8 lg:pt-[106px] lg:items-end md:pt-[90px] sm:"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="hidden lg:block" onClick={closeRightBarSlide}>
            <FontAwesomeIcon
              icon={faXmark}
              className="text-2xl text-gray-800 cursor-pointer md:text-xl"
            />
          </div>
          <RightBar
            posts={posts}
            loading={loading}
            events={events}
            users={users}
          />
        </div>
      </div>
    </div>
  );
};
