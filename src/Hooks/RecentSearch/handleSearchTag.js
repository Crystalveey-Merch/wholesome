import { db, doc, updateDoc, arrayUnion } from "../../firebase/auth";

const handleSearchTopic = (topic, loggedInUser) => {
  const userRef = doc(db, "users", loggedInUser.id);

  // first check all recentSearches if topic is part of the array of recent searches that has topics as the type
  const recentSearches = loggedInUser.recentSearches;
  const topicSearch = recentSearches.find(
    (search) => search.type === "topics" && search.value === topic
  );
  // if topic is not in recent searches, add topic to recent searches
  if (!topicSearch) {
    const newSearch = {
      type: "topics",
      value: topic,
      createdAt: new Date(),
    };
    // add new search to recent searches
    updateDoc(userRef, {
      recentSearches: arrayUnion(newSearch),
    });
  }
};

const handleRemoveTopicFromRecentSearches = (topic, loggedInUser) => {
  const userRef = doc(db, "users", loggedInUser.id);
  const recentSearches = loggedInUser.recentSearches;
  const topicSearch = recentSearches.find(
    (search) => search.type === "topics" && search.value === topic
  );
  if (topicSearch) {
    const updatedRecentSearches = recentSearches.filter(
      (search) => search.value !== topic
    );
    updateDoc(userRef, {
      recentSearches: updatedRecentSearches,
    });
  }
};

export { handleSearchTopic, handleRemoveTopicFromRecentSearches };
