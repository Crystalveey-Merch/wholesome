/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { RightBar } from "./RightBar";
import { db, onSnapshot, collection } from "../firebase/auth";

export const FeedLayout = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

    return () => {
      unsuscribPosts();
      unsuscribEvents();
    }
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

  return (
    <div className="flex justify-center min-h-[calc(100vh-0px)] w-screen gap-12 font-inter text-black overflowhidden">
      <div className="w-full pt-[126px] pb-9 max-w-3xl flex flex-col gap-4 overflowauto">
        {/* for you and following tabs */}
        <div className="w-full h-10 flex gap-8">
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
        {children}
      </div>
      <div ref={rightBarRef} className=" px min- h-max pt-[126px] pb-9">
        <RightBar posts={posts} loading={loading} events={events} />
      </div>
    </div>
  );
};
