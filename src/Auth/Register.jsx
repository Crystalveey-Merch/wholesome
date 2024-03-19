import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  auth,
  createUserProfileDocument,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "../firebase/auth";
import { toast } from "react-toastify";

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameIsAccepted, setNameIsAccepted] = useState(false);
  const [nameMessage, setNameMessage] = useState("");
  const [nameInputFocused, setNameInputFocused] = useState(false);

  const [emailIsAccepted, setEmailIsAccepted] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailInputFocused, setEmailInputFocused] = useState(false);

  useEffect(() => {
    if (name?.length > 0 && !nameInputFocused) {
      if (name.length < 3) {
        setNameIsAccepted(false);
        setNameMessage("Name must be at least 3 characters long");
      } else {
        setNameIsAccepted(true);
        setNameMessage("");
      }
    } else {
      setNameIsAccepted(false);
      setNameMessage("");
    }
  }, [name, nameInputFocused]);

  useEffect(() => {
    if (email?.length > 0 && !emailInputFocused) {
      if (!email.includes("@") || !email.includes(".")) {
        setEmailIsAccepted(false);
        setEmailMessage("Please enter a valid email address");
      } else {
        setEmailIsAccepted(true);
        setEmailMessage("");
      }
    } else {
      setEmailIsAccepted(false);
      setEmailMessage("");
    }
  }, [email, emailInputFocused]);

  //  password validation: password must be at least 6 characters long and contain at least one number, one uppercase letter, and one lowercase letter
  const [passwordIsAccepted, setPasswordIsAccepted] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordInputFocused, setPasswordInputFocused] = useState(false);

  useEffect(() => {
    if (password?.length > 0 && !passwordInputFocused) {
      if (password.length < 6) {
        setPasswordIsAccepted(false);
        setPasswordMessage("Password must be at least 6 characters long");
      } else if (!/[a-z]/.test(password)) {
        setPasswordIsAccepted(false);
        setPasswordMessage(
          "Password must contain at least one lowercase letter"
        );
      } else if (!/[A-Z]/.test(password)) {
        setPasswordIsAccepted(false);
        setPasswordMessage(
          "Password must contain at least one uppercase letter"
        );
      } else if (!/\d/.test(password)) {
        setPasswordIsAccepted(false);
        setPasswordMessage("Password must contain at least one number");
      } else {
        setPasswordIsAccepted(true);
        setPasswordMessage("");
      }
    } else {
      setPasswordIsAccepted(false);
      setPasswordMessage("");
    }
  }, [password, passwordInputFocused]);

  const [confirmPasswordIsAccepted, setConfirmPasswordIsAccepted] =
    useState(false);
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("");
  const [confirmPasswordInputFocused, setConfirmPasswordInputFocused] =
    useState(false);

  useEffect(() => {
    if (confirmPassword?.length > 0 && !confirmPasswordInputFocused) {
      if (confirmPassword !== password) {
        setConfirmPasswordIsAccepted(false);
        setConfirmPasswordMessage("Passwords do not match");
      } else {
        setConfirmPasswordIsAccepted(true);
        setConfirmPasswordMessage("");
      }
    } else {
      setConfirmPasswordIsAccepted(false);
      setConfirmPasswordMessage("");
    }
  }, [confirmPassword, confirmPasswordInputFocused, password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await createUserProfileDocument(user, {
        displayName: name,
        name,
        email,
        photoURL:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=1380&t=st=1701420226~exp=1701420826~hmac=2284e7a4b1f4cc634d76e02dc665ad6f93fc816574f3a3a605581318745e20a0",
      });
      await sendEmailVerification(user, {
        url: "https://www.wholesquare.org/select-interests",
        handleCodeInApp: true,
      });
      await navigate("/verify-email");
      await setLoading(false);
      await toast.success(
        "Account created successfully. Please check your email to complete your signup."
      );
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-screen px-20 flex justify-center items-center sm:px-4">
      <form
        onSubmit={handleRegister}
        className="pt-24 py-10 min-h-screen flex flex-col gap-2 items-center w-full max-w-xl font-inter sm:pt-20"
      >
        {/* <img
        src="../assets/logo.png"
        alt=""
        height="32"
        width="32"
        className="rounded-lg"
      /> */}
        <div className="w-full flex flex-col items-center">
          <h3
            onClick={() => navigate("/")}
            className="font-semibold text-3xl text-center font-inter text-black mt-6 mb-3 sm:text-2xl"
          >
            Create a Wholesquare account
          </h3>
          <p className="text-base font-normal text-gray-600 font-inter text-center">
            Join a global network of like-minded individuals
          </p>
        </div>

        <div className="w-full flex flex-col gap-5 mt-8 font-inter">
          <label htmlFor="name" className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-black font-inter">Name*</p>
            <div className="w-full flex flex-col">
              <input
                type="text"
                placeholder="Enter your name"
                className={`w-full h[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300 focus:ring-transparent transition duration-300 ease-in-out ${
                  name?.length > 0 && nameIsAccepted
                    ? "border-green500 border-green-300 bg-gray100"
                    : name?.length > 0 && !nameIsAccepted
                    ? "border-red-300 bg-white"
                    : nameInputFocused
                    ? "border-gray-200"
                    : "border-gray-200"
                }`}
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setNameInputFocused(true)}
                onBlur={() => setNameInputFocused(false)}
              />
              {name?.length > 0 && !nameIsAccepted && (
                <p className="text-xs font-normal text-red-500 font-inter">
                  {nameMessage}
                </p>
              )}
            </div>
          </label>

          <label htmlFor="email" className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-black font-inter">Email*</p>
            <div className="w-full flex flex-col">
              <input
                type="email"
                placeholder="Enter your email address"
                className={`w-full h[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300 focus:ring-transparent transition duration-300 ease-in-out ${
                  email?.length > 0 && emailIsAccepted
                    ? "border-green500 border-green-300 bg-gray100"
                    : email?.length > 0 && !emailIsAccepted
                    ? "border-red-300 bg-white"
                    : emailInputFocused
                    ? "border-gray-200"
                    : "border-gray-200"
                }`}
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailInputFocused(true)}
                onBlur={() => setEmailInputFocused(false)}
              />
              {email?.length > 0 && !emailIsAccepted && (
                <p className="text-xs font-normal text-red-500 font-inter">
                  {emailMessage}
                </p>
              )}
            </div>
          </label>

          <label htmlFor="password" className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-black font-inter">
              Password*
            </p>
            <div className="w-full flex flex-col relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full h[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300 focus:ring-transparent transition duration-300 ease-in-out ${
                  password?.length > 0 && passwordIsAccepted
                    ? "border-green500 border-green-300 bg-gray100"
                    : password?.length > 0 && !passwordIsAccepted
                    ? "border-red-300 bg-white"
                    : passwordInputFocused
                    ? "border-gray-200"
                    : "border-gray-200"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordInputFocused(true)}
                onBlur={() => setPasswordInputFocused(false)}
                name="password"
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="absolute top-5 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
              {password?.length > 0 && !passwordIsAccepted && (
                <p className="text-xs font-normal text-red-500 font-inter">
                  {passwordMessage}
                </p>
              )}
            </div>
          </label>
          <label htmlFor="confirmPassword" className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-black font-inter">
              Confirm Password*
            </p>
            <div className="w-full flex flex-col relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                className={`w-full h[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300 focus:ring-transparent transition duration-300 ease-in-out ${
                  confirmPassword?.length > 0 && confirmPasswordIsAccepted
                    ? "border-green500 border-green-300 bg-gray100"
                    : confirmPassword?.length > 0 && !confirmPasswordIsAccepted
                    ? "border-red-300 bg-white"
                    : confirmPasswordInputFocused
                    ? "border-gray-200"
                    : "border-gray-200"
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setConfirmPasswordInputFocused(true)}
                onBlur={() => setConfirmPasswordInputFocused(false)}
                name="confirmPassword"
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEye : faEyeSlash}
                className="absolute top-5 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              {confirmPassword?.length > 0 && !confirmPasswordIsAccepted && (
                <p className="text-xs font-normal text-red-500 font-inter">
                  {confirmPasswordMessage}
                </p>
              )}
            </div>
          </label>
        </div>
        <button
          type="submit"
          className={`mt-7 w-full py-3 text-white text-base font-inter font-semibold bg-[#ff5841] rounded-md focus:outline-none focus:ring-0 focus:border-red-300 focus:ring-transparent transition duration-300 ease-in-out sm:py-2.5 ${
            !nameIsAccepted ||
            !emailIsAccepted ||
            !passwordIsAccepted ||
            !confirmPasswordIsAccepted ||
            loading
              ? "opacity-50"
              : "bg-[#ff5841] hover:bg-[#ff6d5a]"
          }`}
          disabled={
            !nameIsAccepted ||
            !emailIsAccepted ||
            !passwordIsAccepted ||
            !confirmPasswordIsAccepted ||
            loading
          }
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
        <div className="flex flex-col gap-1 items-center text-center justify-center">
          <div className="text-sm font-normal font-inter text-gray-600 text-center mt-6 sm:mt-4">
            Already have an account? &nbsp;
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#ff5841] font-semibold"
            >
              Log in
            </button>
          </div>
          <div className="text-center text-sm text-gray-700 font-inter mt-4">
            By signing up, you agree to the &nbsp;
            <a
              className="no-underline border-b border-grey-dark text-red-600"
              href="#"
            >
              Terms of Service
            </a>
            &nbsp; and &nbsp;
            <a
              className="no-underline border-b border-grey-dark text-red-600"
              href="#"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};
