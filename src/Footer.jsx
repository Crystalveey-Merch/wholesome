import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="block smhidden">
      <div className=" footer-center  w-screen   p-4 bg-black  ">
        <>
          <div className=" w-full flex gap-5 flex-col justify-center m-auto  ">
            <h1 className="text-center text-red-500 text-3xl"> Wholesquare</h1>
            <ul className="menu menu-horizontal gap-40 sm:gap-5 px-1 m-auto text-white">
              <div className="dropdown dropdown-bottom cursor-pointer">
                <NavLink to="/aboutus">
                  <label
                    tabIndex={0}
                    className=" text-white border-none capitalize  m-1 cursor-pointer"
                  >
                    About us
                  </label>
                </NavLink>
              </div>
              <div className="dropdown dropdown-bottom cursor-pointer">
                <NavLink to="/i/discover">
                  <label
                    tabIndex={0}
                    className="text-white border-none capitalize  m-1 cursor-pointer"
                  >
                    Interest
                  </label>
                </NavLink>
              </div>
              <div className="dropdown dropdown-bottom cursor-pointer">
                <NavLink to="/feed">
                  <label
                    tabIndex={0}
                    className="text-white border-none capitalize  m-1 cursor-pointer"
                  >
                    Articles
                  </label>
                </NavLink>
              </div>
              {/* <div className="dropdown dropdown-bottom">
                <NavLink to="upcomingevents">
                  <label
                    tabIndex={0}
                    className=" text-white border-none capitalize  m-1 "
                  >
                    Events
                  </label>
                </NavLink>
              </div>
              <NavLink to="podcast">
                <label
                  tabIndex={0}
                  className=" text-white border-none capitalize  m-1 "
                >
                  Podcast
                </label>
              </NavLink> */}
            </ul>
            <p className="text-white">
              Copyright © 2023 - All right reserved by Wholesquare
            </p>
          </div>
        </>
      </div>
    </div>
  );
};

export default Footer;
