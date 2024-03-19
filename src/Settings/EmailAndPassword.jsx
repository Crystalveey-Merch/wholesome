import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  db,
  doc,
  updateDoc,
  auth,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "../firebase/auth";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";
import {
  faArrowLeft,
  faCircleExclamation,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Email, Password } from "../components/Settings";
import { toast } from "react-toastify";

export const EmailAndPassword = () => {
  const navigate = useNavigate();

  const currentUser = auth.currentUser;
  const user = useSelector(selectUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [existingEmail, setExistingEmail] = useState("");
  const [showReAuthenicate, setShowReAuthenicate] = useState(false);

  useEffect(() => {
    if (user && currentUser) {
      setExistingEmail(currentUser.email);
    }
  }, [user, currentUser]);

  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleReAuthenticate = async () => {
    // if (currentUser) {
    setLoginLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        existingEmail,
        loginPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        lastLogin: new Date(),
      });
      toast.success("Password confirmed successfully");
      setLoginLoading(false);
      setShowReAuthenicate(false);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
      setIsError(true);
      setErrorMessage(error.message);
      setLoginLoading(false);
    }
    // }
  };

  return (
    <div className="w-full py-8 px-8 flex justify-center items-center sm:px-6">
      <div className="w-full max-w-2xl flex flex-col gap-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="hidden md:flex md:items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-black" />
          </button>
          <h2 className="text-black font-inter font-semibold text-lg">
            Change Email and Password
          </h2>
        </div>
        {showReAuthenicate ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-0.5">
              <h5 className="font-medium text-sm font-inter inline-flex gap-2 items-center text-center justify-center">
                <span className="text-red-500 font-medium text-base font-inter">
                  Re-authenticate your account
                </span>
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  className="text-red-500 h-5 w-5"
                />
              </h5>
              <p className="text-gray-600 font-normal text-sm text-center">
                You were asked to confirm your password or re-authenticate your
                account because you are required to do so before changing your
                email.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleReAuthenticate();
              }}
              className="flex flex-col gap-4"
            >
              <label htmlFor="password" className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-black font-inter">
                  Confirm your password to continue
                </p>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`w-full h[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300 focus:ring-transparent transition duration-300 ease-in-out ${
                      isError
                        ? "border-red-300"
                        : loginPassword.length > 0
                        ? "border-green-300"
                        : "border-gray-300"
                    }`}
                    value={loginPassword}
                    name="password"
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <FontAwesomeIcon
                    icon={showLoginPassword ? faEye : faEyeSlash}
                    className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  />
                </div>
              </label>
              {isError && (
                <p className="text-xs text-red-500 font-inter">
                  {errorMessage}
                </p>
              )}
              <button
                type="submit"
                className={`w-full py-3 text-white text-base font-inter font-semibold bg-[#ff5841] rounded-md focus:outline-none focus:ring-0 focus:border-red-300 focus:ring-transparent transition duration-300 ease-in-out sm:py-2.5 ${
                  loginLoading || loginPassword.length === 0
                    ? "opacity-50"
                    : "bg-[#ff5841] hover:bg-[#ff6d5a]"
                }`}
                disabled={
                  loginLoading || loginPassword.length === 0 ? true : false
                }
              >
                {loginLoading ? "Confirming..." : "Confirm Password"}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-8 pb-16">
            <Password
              password={password}
              confirmPassword={confirmPassword}
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
              setShowReAuthenicate={setShowReAuthenicate}
            />
            <hr className="border-gray-200" />
            <Email
              email={email}
              existinEmail={existingEmail}
              setEmail={setEmail}
              setExistingEmail={setExistingEmail}
              setShowReAuthenicate={setShowReAuthenicate}
            />
          </div>
        )}
      </div>
    </div>
  );
};
