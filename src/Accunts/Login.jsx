import React from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
// import {au } from "../../node_modules/firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../firebase/auth.js";
import "firebase/auth";
import { db } from "../firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const loginhandler = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        toast.success(
          <div className="text-black text-sm ">Login Successful</div>
        );

        navigate("/dashboard/profile");
      })
      .catch((err) => {
        toast.error(
            err.message
          );
        setError(err.message);
      });
  };
  return (
    <div>
      <div className="  pt-40 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 text-black w-screen h-screen ">
        <div className="text-center text-2xl">
          <div className="pt-34  m-auto   ">
            <div className=" h-full w-full flex rounded rounded-lg    ">
              <div className="w-2/5 m-auto  mt-36 sm:mt-20 sm:w-full sm:h-full mb-44 rounded">
                <div className="bg-white/50  flex flex-col text-xl rounded-2xl">
                  <div className="container  flex flex-col items-center justify-center px-10 sm:px-2 shadow">
                    <div className="  p-10  text-black w-full">
                      <h1 className="mb-8 text-xl text-center text-red-500">
                        Login
                      </h1>

                      <form onSubmit={loginhandler} className="form-control">
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          required
                          className="block border border-grey-light bg-gray-100 w-full p-3 rounded mb-4"
                          name="email"
                          placeholder="Email"
                        />

                        <span className="flex mt-3 gap-2 mb-4 border-grey-light bg-gray-100 w-full  rounded">
                          <input
                            value={password}
                            type={showPassword ? "text" : "password"}
                            id="password"
                            required
                            className="block  bg-gray-100 w-full p-3"
                            name="password"
                            placeholder="Password"
                            onChange={passwordChangeHandler}
                          />
                          <div
                            onClick={handleTogglePassword}
                            className="bg-transparent centre m-auto p-2 border-none"
                          >
                            {showPassword ? (
                              <FontAwesomeIcon
                                icon={faEye}
                                className="text-red-500 text-sm"
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faEyeSlash}
                                className="text-red-500 text-sm"
                              />
                            )}
                          </div>
                        </span>

                        <button
                          type="submit"
                          className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-1"
                        >
                          Login
                        </button>
                      </form>
                    </div>

                    <div className="text-grey-dark mt-6">
                      Dont have an account?
                      <NavLink
                        className="no-underline border-b border-blue text-blue"
                        to="/signup"
                      >
                        Sign up
                      </NavLink>
                      .
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
