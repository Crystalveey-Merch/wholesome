import { db, doc, updateDoc, arrayUnion } from "../../firebase/auth";

const handleSearchKeyWord = (keyword, loggedInUser) => {
  const userRef = doc(db, "users", loggedInUser.id);

  // first check all recentSearches if keyword is part of the array of recent searches that has keywords as the type
  const recentSearches = loggedInUser.recentSearches;
  const keywordSearch = recentSearches.find(
    (search) => search.type === "keywords" && search.value === keyword
  );
  // if keyword is not in recent searches, add keyword to recent searches
  if (!keywordSearch) {
    const newSearch = {
      type: "keywords",
      value: keyword,
      createdAt: new Date(),
    };
    // add new search to recent searches
    updateDoc(userRef, {
      recentSearches: arrayUnion(newSearch),
    });
  }
};

const handleRemoveKeywordFromRecentSearches = (keyword, loggedInUser) => {
  const userRef = doc(db, "users", loggedInUser.id);
  const recentSearches = loggedInUser.recentSearches;
  const keywordSearch = recentSearches.find(
    (search) => search.type === "keywords" && search.value === keyword
  );
  if (keywordSearch) {
    const updatedRecentSearches = recentSearches.filter(
      (search) => search.value !== keyword
    );
    updateDoc(userRef, {
      recentSearches: updatedRecentSearches,
    });
  }
};

export { handleSearchKeyWord, handleRemoveKeywordFromRecentSearches };
