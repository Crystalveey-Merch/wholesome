import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, sendPasswordResetEmail } from "../firebase/auth";
import { toast } from "react-toastify";

export const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email, {
        url: "https://www.wholesquare.org/login",
      });
      toast.success("Password reset link sent to your email");
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-screen px-20 flex justify-center items-center sm:px-4">
      <form
        onSubmit={handleForgotPassword}
        className="pt-24 py-10 min-h-screen flex flex-col gap-2 items-center w-full max-w-lg font-inter sm:pt-20"
      >
        <div className="w-full flex flex-col items-center">
          <h3 className="font-semibold text-3xl text-center font-inter text-black mt-6 mb-3 sm:text-2xl">
            Forgot Password
          </h3>
          <p className="text-base font-normal text-gray-600 font-inter text-center">
            Enter your email to reset your password. We&rsquo;ll email you a
            password reset link.
          </p>
        </div>
        <div className="w-full flex flex-col gap-6 mt-8 font-inter">
          <label htmlFor="email" className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-black font-inter">Email*</p>
            <input
              type="email"
              placeholder="Enter your email address"
              className={`w-full h[40px] text-gray-900 text-sm font-inter font-medium border border-gray-300 px-3 py-2.5 rounded-md focus:outline-none focus:ring-0 focus:border-green-300 focus:ring-transparent transition duration-300 ease-in-out`}
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className={`w-full py-3 text-white text-base font-inter font-semibold bg-[#ff5841] rounded-md focus:outline-none focus:ring-0 focus:border-red-300 focus:ring-transparent transition duration-300 ease-in-outt sm:py-2.5 ${
              loading || email.length === 0
                ? "opacity-50"
                : "bg-[#ff5841] hover:bg-[#ff6d5a]"
            }`}
            disabled={loading || email.length === 0 ? true : false}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="text-sm font-medium text-[#ff5841] font-inter focus:outline-none focus:ring-0 focus:border-red-300 focus:ring-transparent transition duration-300 ease-in-out"
        >
          Back to login
        </button>
      </form>
    </div>
  );
};
