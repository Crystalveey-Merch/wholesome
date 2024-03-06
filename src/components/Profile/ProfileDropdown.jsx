import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../Features/userSlice";
import { auth, signOut } from "../../firebase/auth.js";
import { toast } from "react-toastify";
import { Menu, Transition } from "@headlessui/react";
import devAvatar from "../../assets/avatar-default.png";
import { NavLink } from "react-router-dom";
import {
  DuplicateInactiveIcon,
  DuplicateActiveIcon,
  MoveInactiveIcon,
  MoveActiveIcon,
  DeleteInactiveIcon,
  DeleteActiveIcon,
} from "../../Icons/Icons.jsx";

export const ProfileDropdown = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const SignOut = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await signOut(auth);
        dispatch(logout);
        localStorage.removeItem("user");
        window.location.href = "/login";
        toast.success("Logout successful");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="text-right z-40">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="h-12 w-12 rounded-full bg-gray-50 border-4 cursor-pointer transition duration-500 ease-in-out flex items-center justify-center border-purple-50 hover:border-purple-100  lg:h-10 lg:w-10">
            <img
              src={user?.photoURL || devAvatar}
              alt="avatar"
              className="h-10 w-10 rounded-full lg:h-8 lg:w-8"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                <div className="w-full flex gap-3 pl-4 py-3 border-b-2 border-gray-50 cursor-pointer">
                  <div className="relative w-max h-max">
                    <img
                      alt="avatar"
                      src={user?.photoURL || devAvatar}
                      className="h-10 w-10 rounded-full"
                    />
                    <p className="h-3 w-3 absolute bg-green-500 rounded-full border-white border-2 bottom-0 right-0"></p>
                  </div>

                  <div>
                    <p className="font-semibold text-sm text-gray-700">
                      {user?.name}
                    </p>
                    <p className="text-gray-600 text-xs">{user?.email}</p>
                  </div>
                </div>
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <NavLink to={`/${user?.username}`}>
                    <button
                      className={`${
                        active ? "bg-violet-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      {active ? (
                        <DuplicateActiveIcon
                          className="mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                      ) : (
                        <DuplicateInactiveIcon
                          className="mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                      )}
                      View Profile
                    </button>
                  </NavLink>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <NavLink to="/settings">
                    <button
                      className={`${
                        active ? "bg-violet-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      {active ? (
                        <MoveActiveIcon
                          className="mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                      ) : (
                        <MoveInactiveIcon
                          className="mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                      )}
                      Settings
                    </button>
                  </NavLink>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={SignOut}
                  >
                    {active ? (
                      <DeleteActiveIcon
                        className="mr-2 h-5 w-5 text-violet-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <DeleteInactiveIcon
                        className="mr-2 h-5 w-5 text-violet-400"
                        aria-hidden="true"
                      />
                    )}
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};
