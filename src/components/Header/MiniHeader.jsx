import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../Features/userSlice";

export const MiniHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenu = () => {
    const headerLinks = document.querySelector(".header-links");
    headerLinks?.classList.toggle("open");

    const linkItems = document.querySelectorAll(".link-item");
    linkItems.forEach((item) => {
      item.addEventListener("click", () => {
        headerLinks?.classList.remove("open");
        setMenuOpen(false);
      });
    });
    setMenuOpen((prev) => !prev);
  };

  const preventScroll = () => {
    if (menuOpen) {
      document.body.classList.add("is-side-menu-open");
    } else {
      document.body.classList.remove("is-side-menu-open");
    }
  };

  useEffect(() => {
    preventScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  const user = useSelector(selectUser);

  return (
    <header className="fixed font-inter top-0 left-0 w-full z-30 px-36  flex justify-between py-5 items-center bg-white border-b border-gray-200 2xl:px-20 lg:px-10 md:px-6">
      <Link to="/">
        <h2 className="font-bold font-inter text-2xl text-[#ff5841] lg:text-xl">
          Wholesquare
        </h2>
      </Link>
      <ul className="flex justify-center items-center gap-10 lg:gap-6 md:hidden">
        <li>
          <Link
            to="/aboutus"
            className="text-[#000000] text-base block font-medium lg:text-sm"
          >
            About Us
          </Link>
        </li>
        {!user && (
          <li className="flex gap-6">
            <Link
              to="/login"
              className="w-max px-8 py-3 text-[#000000] text-base font-inter font-semibold bg-white border border-gray-100 rounded-md focus:outline-none focus:ring-0 focus:border-red-300 focus:ring-transparent transition duration-300 ease-in-out lg:py-2.5 lg:px-6 lg:font-medium lg:text-sm"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="w-max px-8 py-3 text-white text-base font-inter font-semibold bg-[#ff5841] rounded-md focus:outline-none focus:ring-0 focus:border-red-300 focus:ring-transparent transition duration-300 ease-in-out lg:py-2.5 lg:px-6 lg:font-medium lg:text-sm"
            >
              Sign Up
            </Link>
          </li>
        )}
      </ul>
      <button
        id="menu-btn"
        onClick={handleMenu}
        className={`hamburger  ${
          menuOpen ? "open" : ""
        } hidden md:block focus:outline-none z-30 `}
      >
        <span className="harburger-top bg-black transition duration-500 ease-in-out  "></span>
        <span className="harburger-middle bg-black transition duration-500 ease-in-out  "></span>
        <span className="harburger-bottom bg-black transition duration-500 ease-in-out  "></span>
      </button>
      <div className="header-links hidden md:block z-20" onClick={handleMenu}>
        <div
          className="bg-white lg:flex flex-col gap-5 h-screen px-10 py-5 pr-20 sm:w-[500px] sm:pr-8 sm:px-6"
          // just find a way to close the menu when you click outside the menu
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="flex flex-col gap-5 pt-6 text-base font-semibold text-black">
            <li className="border-b border-gray-700 pb-3">
              <Link to="/" className="link-item">
                Home
              </Link>
            </li>
            <li className="border-b border-gray-700 pb-3">
              <Link to="/aboutus" className="link-item">
                About Us
              </Link>
            </li>
            {/* <li className="border-b border-gray-700 pb-3">
              <Link to="/" className="link-item">
                Contact
              </Link>
            </li> */}
          </ul>
          {!user && (
            <div className="flex flex-col gap-5">
              <Link
                to="/login"
                className="w-max link-item px-8 py-3 text-white text-base font-inter font-semibold bg-[#ff5841] rounded-md focus:outline-none focus:ring-0 focus:border-red-300 focus:ring-transparent transition duration-300 ease-in-out lg:py-2.5 lg:px-6 lg:font-medium lg:text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="w-max link-item px-8 py-3 text-white text-base font-inter font-semibold bg-[#ff5841] rounded-md focus:outline-none focus:ring-0 focus:border-red-300 focus:ring-transparent transition duration-300 ease-in-out lg:py-2.5 lg:px-6 lg:font-medium lg:text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
