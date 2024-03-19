// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  EmailAuthProvider,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { unusableUsernames } from "../unusableUsername";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// real config
const firebaseConfig = {
  apiKey: "AIzaSyD6vyy9OAQQ3yVzow-XLKv-6G28D4N5rG0",
  authDomain: "wholesome-7e669.firebaseapp.com",
  projectId: "wholesome-7e669",
  storageBucket: "wholesome-7e669.appspot.com",
  messagingSenderId: "634791042728",
  appId: "1:634791042728:web:2b80af64c82b37a7ddac9d",
  measurementId: "G-504X3JVGWS",
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBmV-7tQ04d9invkBuOlr6Q-SXFyS_Qau0",
//   authDomain: "wahala-test.firebaseapp.com",
//   projectId: "wahala-test",
//   storageBucket: "wahala-test.appspot.com",
//   messagingSenderId: "891438277484",
//   appId: "1:891438277484:web:c1701d0b789c89b4d40949",
//   measurementId: "G-FYEZVXJX1P"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = doc(db, `users/${userAuth.uid}`);
  const snapShot = await getDoc(userRef);

  if (!snapShot.exists()) {
    const { displayName, email, photoURL } = userAuth;
    const createdAt = new Date().toISOString();

    const name = "";
    const followers = [];
    const following = [];
    const lastLogin = new Date().toISOString();
    const selectedOptions = [];
    const notifications = [];
    const recentSearches = [];
    //const bookmarkedPosts: Array<string> | undefined = [];

    //Generate username from email
    if (email) {
      const username = email.split("@")[0].replace(/[^a-z]/g, "");
      if (!username || unusableUsernames.includes(username)) return;
      // if (!username) return;
      let usernameTaken = true;
      let usernameToSave = username;
      let i = 1;

      // Check if username is already taken
      while (usernameTaken) {
        const querySnapshot = await getDocs(
          query(
            collection(db, "users"),
            where("username", "==", usernameToSave)
          )
        );
        if (querySnapshot.empty) {
          usernameTaken = false;
        } else {
          usernameToSave = username + i;
          i++;
        }
      }

      try {
        await setDoc(userRef, {
          displayName,
          name,
          email,
          photoURL,
          createdAt,
          followers,
          following,
          selectedOptions,
          notifications,
          recentSearches,
          lastLogin,
          //bookmarkedPosts,
          username: usernameToSave, // set the final value of usernameToSave
          ...additionalData,
        });
        //await updateDoc(userRef, { lastLoginAt});
      } catch (error) {
        console.log("error creating user", error.message);
      }
    } else {
      const username = displayName?.replace(/\s+/g, "").toLowerCase();
      if (!username || unusableUsernames.includes(username)) return;
      let usernameTaken = true;
      let usernameToSave = username;
      let i = 1;

      // Check if username is already taken
      while (usernameTaken) {
        const querySnapshot = await getDocs(
          query(
            collection(db, "users"),
            where("username", "==", usernameToSave)
          )
        );
        if (querySnapshot.empty) {
          usernameTaken = false;
        } else {
          usernameToSave = username + i;
          i++;
        }
      }

      try {
        await setDoc(userRef, {
          displayName, //no forget to have john for users with no displayName
          name,
          email,
          photoURL,
          createdAt,
          followers,
          following,
          selectedOptions,
          notifications,
          recentSearches,
          lastLogin,
          //bookmarkedPosts,
          username: usernameToSave, // set the final value of usernameToSave
          ...additionalData,
        });
        //await updateDoc(userRef, { lastLoginAt});
      } catch (error) {
        console.log("error creating user", error.message);
      }
    }

    // Check if username is "muzardemoses" and if user is not already following "muzardemoses"

    // if (email && email.toLowerCase() !== "muzardemoses@gmail.com") {
    //   const querySnapshot = await getDocs(
    //     query(
    //       collection(db, "users"),
    //       where("email", "==", "muzardemoses@gmail.com")
    //     )
    //   );
    //   if (!querySnapshot.empty) {
    //     const muzarUser = querySnapshot.docs[0];
    //     const muzarUserId = muzarUser.id;
    //     const muzarData = muzarUser.data();
    //     const muzarFollowers = muzarData.followers || [];
    //     const muzarFollowing = muzarData.following || [];

    //     // Check if user is not already following "muzardemoses"
    //     if (!muzarFollowing.includes(userAuth.uid)) {
    //       // Add user to "muzardemoses" list of followers
    //       await updateDoc(doc(db, "users", muzarUserId), {
    //         followers: [...muzarFollowers, userAuth.uid],
    //       });

    //       // Add "muzardemoses" to user's list of following
    //       await updateDoc(userRef, {
    //         following: [...following, muzarUserId],
    //       });
    //     }
    //   }
    // }
  }
  return userRef;
};

export {
  analytics,
  auth,
  storage,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  EmailAuthProvider,
  verifyBeforeUpdateEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  db,
  collection,
  query,
  where,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  onSnapshot,
};

// const analytics = getAnalytics(app);
