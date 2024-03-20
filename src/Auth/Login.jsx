import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  auth,
  signInWithEmailAndPassword,
  doc,
  db,
  updateDoc,
  getDoc,
} from "../firebase/auth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../Features/userSlice";
// import { useSelector } from "react-redux";
// import { selectUser } from "../Features/userSlice";

export const Login = () => {
  const dispatch = useDispatch();
  // const user = useSelector(selectUser);
  // const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  // useEffect(() => {
  //   if (user) {
  //     setIsUserLoggedIn(true);
  //   } else {
  //     setIsUserLoggedIn(false);
  //   }
  // }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        lastLogin: new Date(),
      });
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        const userData = { id: snapshot.id, ...snapshot.data() };
        dispatch(login(userData));
        localStorage.setItem("user", JSON.stringify(userData));
      }
      navigate("/");
      toast.success("Login Successful");
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      console.error("Error logging in:", error);
      setIsError(true);
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  if (user) {
    navigate("/");
  }

  return (
    <div className="w-screen px-20 flex justify-center items-center sm:px-4">
      <form
        onSubmit={handleLogin}
        className="pt-24 py-10 min-h-screen flex flex-col gap-2 items-center w-full max-w-xl font-inter sm:pt-20"
      >
        <div className="w-full flex flex-col items-center">
          <h3
            onClick={() => navigate("/")}
            className="font-semibold text-3xl text-center font-inter text-black mt-6 mb-3 sm:text-2xl"
          >
            Login in to your account
          </h3>
          <p className="text-base font-normal text-gray-600 font-inter text-center">
            Welcome back! Please enter your details.
          </p>
        </div>
        <div className="w-full flex flex-col gap-5 mt-8 font-inter">
          <label htmlFor="email" className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-black font-inter">Email*</p>
            <input
              type="email"
              placeholder="Enter your email address"
              className={`w-full h[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300 focus:ring-transparent transition duration-300 ease-in-out ${
                isError
                  ? "border-red-300"
                  : email.length > 0
                  ? "border-green-300"
                  : "border-gray-300"
              }`}
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label htmlFor="password" className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-black font-inter">
              Password*
            </p>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full h[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300 focus:ring-transparent transition duration-300 ease-in-out ${
                  isError
                    ? "border-red-300"
                    : password.length > 0
                    ? "border-green-300"
                    : "border-gray-300"
                }`}
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </label>
          {isError && (
            <p className="text-xs text-red-500 font-inter">{errorMessage}</p>
          )}
        </div>
        <button
          type="submit"
          className={`mt-7 w-full py-3 text-white text-base font-inter font-semibold bg-[#ff5841] rounded-md focus:outline-none focus:ring-0 focus:border-red-300 focus:ring-transparent transition duration-300 ease-in-outt sm:py-2.5 ${
            loading || email.length === 0 || password.length === 0
              ? "opacity-50"
              : "bg-[#ff5841] hover:bg-[#ff6d5a]"
          }`}
          disabled={
            loading || email.length === 0 || password.length === 0
              ? true
              : false
          }
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="w-full flex items-center justify-between mt-1">
          <label
            htmlFor="remember"
            className="block text-sm text-gray-900 font-medium"
          >
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="mr-2 text-red-600 border-red-600 rounded h-4 w-4 cursor-pointer font-inter"
            />
            Remember for 30 days
          </label>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm font-semibold text-red-600 font-inter"
          >
            Forgot password
          </button>
        </div>
        <div className="text-sm  font-inter font-normal text-black mt-6 sm:mt-4">
          Don’t have an account? &nbsp;
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-red-600 font-semibold font-inter"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};
