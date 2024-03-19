/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { auth, updatePassword } from "../../firebase/auth";
import { toast } from "react-toastify";

export const Password = ({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  setShowReAuthenicate,
}) => {
  const currentUser = auth.currentUser;
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleUpdatePassword = async () => {
    setUpdatePasswordLoading(true);
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      setUpdatePasswordLoading(false);
      return;
    }

    if (currentUser) {
      try {
        await updatePassword(currentUser, password);
        toast.success("Password updated successfully");
        setUpdatePasswordLoading(false);
        setPassword("");
        setConfirmPassword("");
      } catch (error) {
        toast.error(error.message);
        setUpdatePasswordLoading(false);
        if (error.code === "auth/requires-recent-login") {
          setShowReAuthenicate(true);
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-0.5">
        <h5 className="text-lack font-medium text-sm font-inter">
          Change Password
        </h5>
        <p className="text-gray-600 font-normal text-sm">
          Use at least one letter, one numeral, and at least six characters.
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdatePassword();
        }}
        className="flex flex-col gap-4"
      >
        <label htmlFor="password" className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-black font-inter">Password*</p>
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
        <button
          className={`w-full py-3 text-white text-base font-inter font-semibold bg-[#ff5841] rounded-md focus:outline-none focus:ring-0 focus:border-red-300 focus:ring-transparent transition duration-300 ease-in-out sm:py-2.5 ${
            updatePasswordLoading ||
            !passwordIsAccepted ||
            !confirmPasswordIsAccepted
              ? "opacity-50"
              : "bg-[#ff5841] hover:bg-[#ff6d5a]"
          }`}
          disabled={
            updatePasswordLoading ||
            !passwordIsAccepted ||
            !confirmPasswordIsAccepted
              ? true
              : false
          }
        >
          {updatePasswordLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};
