import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  onAuthStateChanged,
  sendEmailVerification,
} from "../firebase/auth";
import { toast } from "react-toastify";

export const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsEmailVerified(user.emailVerified);
        console.log(user.emailVerified);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSendEmailVerification = async () => {
    setLoading(true);
    await sendEmailVerification(user, {
      url: "https://www.wholesquare.org/select-interests",
    });
    toast.success("Verification email sent");
    setLoading(false);
  };

  useEffect(() => {
    if (user && isEmailVerified) {
      navigate("/select-interests");
    }
  }, [user, isEmailVerified, navigate]);

  return (
    <div className="w-screen min-h-screen px-20 flex justify-center items-center sm:px-4">
      <div className="py-10 flex flex-col gap-6 items-center w-full max-w-xl font-inter">
        <div className="w-full flex flex-col items-center">
          <h3 className="font-semibold text-3xl text-center font-inter text-black mt-6 mb-3 sm:text-2xl">
            Check your email
          </h3>
          <p className="text-base font-normal text-gray-600 font-inter text-center">
            We have sent a verification link to <strong>{user.email}</strong>.
            Click the link to verify your email and continue.
          </p>
        </div>
        <button
          onClick={handleSendEmailVerification}
          className={`w-full py-3 text-white text-base font-inter font-semibold bg-[#ff5841] rounded-md focus:outline-none focus:ring-0 focus:border-red-300 focus:ring-transparent transition duration-300 ease-in-outt sm:py-2.5 ${
            loading ? "opacity-50" : "bg-[#ff5841] hover:bg-[#ff6d5a]"
          }`}
          disabled={loading ? true : false}
        >
          {loading ? "Sending..." : "Resend verification email"}
        </button>
      </div>
    </div>
  );
};
