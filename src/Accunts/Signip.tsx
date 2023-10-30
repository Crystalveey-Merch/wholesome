import React from "react";
import { NavLink } from "react-router-dom";
import PasswordStrengthBar from "react-password-strength-bar";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Multiselect from "multiselect-react-dropdown";

const Signip = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [displayName, setDisplayname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };
  const [showPassword, setShowPassword] = useState(false);
  const confirmPasswordChangeHandler = (e) => {
    setConfirmPassword(e.target.value);
  };

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelect = (selectedOption) => {
    setSelectedOptions(selectedOption);
    console.log(selectedOptions.map((option) => option.key));
  };

  const handleRemove = (removedOption) => {
    const updatedOptions = selectedOptions.filter(
      (option) => option.key !== removedOption.key
    );
    setSelectedOptions(updatedOptions);
  };

  const handlePasswordValidation = () => {
    setPasswordMatch(password === confirmPassword);
  };

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  console.log(selectedOptions.map((option) => option.key));

  const signup = async (e) => {
    e.preventDefault();

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Update the user's profile with additional information

    const userData = {
      email,
      password,
      displayName,
      selectedOptions,
    };

    // Use setDoc to add the user data to the "users" collection with the user's UID as the document ID
    await setDoc(doc(db, "users", user.uid), userData);

    // Display a success message
    toast.success(<div className="text-black text-sm">Sign-up Successful</div>);

    // Redirect to the login page
    navigate("/login");

    console.log(userCredential);
  };

  return (
    <div>
      <div className="  pt-10 bg-white text-black w-screen ">
        <div className="text-center text-2xl">
          <div className="pt-34  m-auto   ">
            <div className=" h-full w-full flex rounded rounded-lg    ">
              <div
                className="w-1/2 text-lg h-screen  sm:hidden "
                style={{
                  backgroundImage: "url(/Images/world.jpeg)",
                  backgroundPosition: "center",
                  backgroundRepeat: "none",
                  backdropFilter: "black",
                }}
              >
              
              </div>
              <div className="w-1/2 sm:m-auto pt-36 sm:pt-10 sm:w-full sm:h-full ">
                <div className="bg-grey-lighter  flex flex-col text-xl">
                  <div className="container max-w-xl mx-auto flex-1 flex flex-col items-center justify-center px-2">
                    <div className=" px-6 py-8  text-black w-full">
                      <h1 className="mb-8 text-xl text-center text-red-500">
                        Sign up
                      </h1>
                

                      <form onSubmit={signup} className="form-control">
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayname(e.target.value)}
                          className="block border border-grey-100 bg-gray-100 w-full p-3 rounded mb-2 text-xl"
                          name="fullname"
                          placeholder="Full Name"
                        />

                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          required
                          className="block border border-grey-light bg-gray-100 w-full p-3 rounded mb-2"
                          name="email"
                          placeholder="Email"
                        />
                        <label className="text-sm text-gray-400">
                          Select at least 2 interests
                        </label>
                        <Multiselect
                          placeholder="Select your Interest"
                          displayValue="key"
                          onKeyPressFn={function noRefCheck() {}}
                          onRemove={handleRemove}
                          onSearch={function noRefCheck() {}}
                          onSelect={handleSelect}
                          className="mb-2"
                          options={[
                            {
                              key: "Lifestyle and Fashion",
                            },
                            {
                              key: "Health and wellness",
                            },
                            {
                              key: "Food and Nutrition",
                            },
                            {
                              key: "Travel and Events",
                            },
                            {
                              key: "Volunteer and Philanthropy",
                            },
                            {
                              key: "Business",
                            },
                            {
                              key: "Sports",
                            },
                          ]}
                          showCheckbox
                        />
                        <span className="flex  gap-2 mb-4 border-grey-light bg-gray-100 w-full  rounded">
                          <input
                            value={password}
                            type={showPassword ? "text" : "password"}
                            id="password"
                            required
                            className="block  bg-gray-100 w-full p-3"
                            name="password"
                            placeholder="Password"
                            onChange={passwordChangeHandler}
                            onBlur={handlePasswordValidation}
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
                        <PasswordStrengthBar
                          password={password}
                          className="mt-5"
                        />

                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={confirmPasswordChangeHandler}
                          onBlur={handlePasswordValidation}
                          className="block border border-grey-light bg-gray-100 w-full p-3 rounded "
                          name="confirm_password"
                          placeholder="Confirm Password"
                        />
                        {passwordMatch ? (
                          <div className="text-green-500 text-left text-sm">
                            Passwords match
                          </div>
                        ) : (
                          <div className="text-red-500 text-left text-sm">
                            Passwords do not match
                          </div>
                        )}
                        <div className="form-control">
                          <label className="label cursor-pointer">
                            <span className="label-text text-green-500">
                              Remember me
                            </span>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </div>
                        <button
                          type="submit"
                          className="w-full text-center py-3 mt-4 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-1"
                        >
                          Create Account
                        </button>
                      </form>

                      <div className="text-center text-sm text-grey-dark mt-4">
                        By signing up, you agree to the
                        <a
                          className="no-underline border-b border-grey-dark text-grey-dark"
                          href="#"
                        >
                          Terms of Service
                        </a>{" "}
                        and
                        <a
                          className="no-underline border-b border-grey-dark text-grey-dark"
                          href="#"
                        >
                          Privacy Policy
                        </a>
                      </div>
                    </div>

                    <div className="text-grey-dark mt-6">
                      Already have an account?
                      <NavLink
                        className="no-underline border-b border-blue text-blue"
                        to="/login"
                      >
                        Log in
                      </NavLink>
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

export default Signip;
