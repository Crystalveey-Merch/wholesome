import { db, doc, updateDoc, arrayUnion } from "../../firebase/auth";

const handleSearchUser = (userId, loggedInUser) => {
  const userRef = doc(db, "users", loggedInUser.id);

  // first check all recentSearches if user id is part of the array of recent searches that has user as the type
  const recentSearches = loggedInUser.recentSearches;
  const userSearch = recentSearches.find(
    (search) => search.type === "user" && search.value === userId
  );
  // if user is not in recent searches, add user to recent searches
  if (!userSearch) {
    const newSearch = {
      type: "user",
      value: userId,
      createdAt: new Date(),
    };
    // add new search to recent searches
    updateDoc(userRef, {
      recentSearches: arrayUnion(newSearch),
    });
  }
};

const handleRemoveUserFromRecentSearches = (userId, loggedInUser) => {
  const userRef = doc(db, "users", loggedInUser.id);
  const recentSearches = loggedInUser.recentSearches;
  const userSearch = recentSearches.find(
    (search) => search.type === "user" && search.value === userId
  );
  if (userSearch) {
    const updatedRecentSearches = recentSearches.filter(
      (search) => search.value !== userId
    );
    updateDoc(userRef, {
      recentSearches: updatedRecentSearches,
    });
  }
};

export { handleSearchUser, handleRemoveUserFromRecentSearches };
