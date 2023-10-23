import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { auth } from './auth.js';
import { onAuthStateChanged } from "firebase/auth";

function ProtectedRoute({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false); // The auth state has been determined, no longer loading

      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    // Render a loading indicator while the authentication state is being determined
    return <div>Loading...</div>;
  }

  if (!authUser) {
    // Redirect to the login page if the user is not authenticated
    return <Navigate to="/login" />;
  }

  // Render the children (the protected content) if the user is authenticated
  return <>{children}</>;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
