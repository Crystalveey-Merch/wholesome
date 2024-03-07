/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { auth, onAuthStateChanged } from "../firebase/auth";

export const ProtectSignUpProcess = () => {
  //   const navigate = useNavigate();
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

  useEffect(() => {
    if (user) {
      setIsEmailVerified(user.emailVerified);
    }
  }, [user]);

  //   console.log(user, isEmailVerified);

  //   useEffect(() => {
  //     if (user && !isEmailVerified) {
  //       navigate("/verify-email");
  //     } else if (user && isEmailVerified) {
  //       navigate("/");
  //     }
  //   }, [user, isEmailVerified, navigate]);

  return user && isEmailVerified ? <Outlet /> : <Navigate to="/verify-email" />;
};
