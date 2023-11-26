import { updatePassword, signOut } from "firebase/auth";
import { auth, db, storage } from "../firebase/auth.js";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";

const Settings = () => {
  const [authUser, setAuthUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  console.log(authUser);


  const changePassword = async () => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Password changed successfully");
      await signOut(auth);
      toast.info("You have been logged out.");

    } catch (error) {
      toast.error("Error changing password: " + error.message);
    }
  };

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };
  const handleTogglePassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div>
    <Helmet>
            <title>Account Settings</title>
            <meta
                name="description"
                content="Account settings" />
            <link rel=" canonical" href="/dashboard/settings" />
        </Helmet>
      <p className="text-center text-xl Aceh">Account Settings</p>

      <div className="my-20 flex flex-col gap-5">
        <p className="text-center text-xl">Change Password</p>
        <form>
          <div className="flex flex-col gap-5">
          <div className="flex">
            <input
              type={showPassword ? "text" : "password"}
              value={oldPassword}
              name="password"

              onChange={handleOldPasswordChange}
              placeholder="Enter old password"
              className="rounded-full p-4 w-96 text-black  text-xl"
            />
            <div
              onClick={handleTogglePassword}
              className="bg-transparent centre m-auto p-2 border-none"
            >
              {showPassword ? (
                <FontAwesomeIcon
                  icon={faEye}
                  className="text-gray-500 text-sm"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faEyeSlash}
                  className="text-gray-500 text-sm"
                />
              )}
            </div></div>
            <input
              type={showPassword ? "text" : "password"}
              onChange={handleNewPasswordChange}
              placeholder="Enter new password"
              className="rounded-full p-4 w-96 text-black text-xl"
            />

          </div></form>
        <button onClick={changePassword} className="w-96 rounded-full bg-blue-500 text-white  p-4">
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Settings;
