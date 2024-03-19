/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  db,
  auth,
  updateEmail,
  doc,
  updateDoc,
  verifyBeforeUpdateEmail,
} from "../../firebase/auth";
import { toast } from "react-toastify";

export const Email = ({
  email,
  existinEmail,
  setEmail,
  setExistingEmail,
  setShowReAuthenicate,
}) => {
  const currentUser = auth.currentUser;
  const [updateEmailLoading, setUpdateEmailLoading] = useState(false);
  const [emailIsAccepted, setEmailIsAccepted] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailInputFocused, setEmailInputFocused] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

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

  const handleUpdateEmail = async () => {
    if (currentUser) {
      setUpdateEmailLoading(true);
      try {
        await verifyBeforeUpdateEmail(currentUser, email, {
          url: "https://www.wholesquare.org/settings/account/email-and-password",
          handleCodeInApp: true,
        });
        await updateEmail(currentUser, email);
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          email: email,
        });
        toast.success("Email updated successfully");
        setExistingEmail(email);
        setEmail("");
        setUpdateEmailLoading(false);
        setShowReAuthenicate(false);
        setErrorMessage("");
      } catch (error) {
        toast.error(error.message);
        console.log(error);
        setUpdateEmailLoading(false);
        if (error.code === "auth/requires-recent-login") {
          setShowReAuthenicate(true);
          setErrorMessage(error.message);
        } else if (error.code === "auth/operation-not-allowed") {
          // verifyBeforeUpdateEmail(currentUser, email, {
          //   url: "https://www.wholesquare.org/settings/account/email-and-password",
          //   handleCodeInApp: true,
          // });
          // toast.error(error.message);
          setShowReAuthenicate(false);
          setErrorMessage(error.message + "Verify your email address first");
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-0.5">
        <h5 className="text-lack font-medium text-sm font-inter">
          Change Email
        </h5>
        <p className="text-gray-600 font-normal text-sm">
          We&rsquo;ll send you a verification email to your new email address.
        </p>
      </div>
      <form className="flex flex-col gap-4">
        <label htmlFor="email" className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-black font-inter">
            Email <span className="text-green-500">({existinEmail})</span>
          </p>
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
            <p className="text-xs font-normal text-red-500 font-inter">
              {errorMessage}
            </p>
          </div>
        </label>
        <button
          className={`w-full py-3 text-white text-base font-inter font-semibold bg-[#ff5841] rounded-md focus:outline-none focus:ring-0 focus:border-red-300 focus:ring-transparent transition duration-300 ease-in-out sm:py-2.5 ${
            updateEmailLoading || !emailIsAccepted
              ? "opacity-50"
              : "bg-[#ff5841] hover:bg-[#ff6d5a]"
          }`}
          onClick={handleUpdateEmail}
          disabled={updateEmailLoading || !emailIsAccepted}
        >
          {updateEmailLoading ? "Updating..." : "Update Email"}
        </button>
      </form>
    </div>
  );
};
