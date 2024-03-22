/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faXmark,
  faXmarkCircle,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { selectUser } from "../Features/userSlice";
import {
  closeSearchModal,
  openSearchModal,
  selectSearchModal,
} from "../Features/searchModalSlice";
import {
  getProfileDetails,
  handleSearchUser,
  handleRemoveUserFromRecentSearches,
  handleSearchTopic,
  handleRemoveTopicFromRecentSearches,
  handleSearchKeyWord,
  handleRemoveKeywordFromRecentSearches,
} from "../Hooks";

export const SearchModal = ({ users, posts, activities }) => {
  const loggedInUser = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showSearchModal = useSelector(selectSearchModal);

  const openSearch = () => {
    dispatch(openSearchModal());
  };

  const closeModal = () => {
    dispatch(closeSearchModal());
  };

  const modalRef = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        showSearchModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showSearchModal]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // set suggestions based on search query, suggestions are based on users, keywords, and topics

  // get all words used in posts, activities, podcasts, and events
  const extractWords = (text) => {
    return text?.toLowerCase().match(/\b\w+\b/g) || []; // Extract words ignoring punctuation
  };

  // Initialize an empty set to store unique words
  const uniqueWords = new Set();

  // Add all words from posts, activities, podcasts, and events to the set
  posts.forEach((post) => {
    const titleWords = extractWords(post.postTitle || "");
    const contentWords = extractWords(post.content || "");
    // post .tags is an array of strings
    const tagWords = extractWords(post.tags.join(" "));
    titleWords.forEach((word) => uniqueWords.add(word));
    contentWords.forEach((word) => uniqueWords.add(word));
    tagWords.forEach((word) => uniqueWords.add(word));
  });

  activities.forEach((activity) => {
    // const titleWords = extractWords(activity.activityName || "");
    const contentWords = extractWords(activity.category || "");

    contentWords.forEach((word) => uniqueWords.add(word));
  });

  // Convert the set to an array
  const allWordsUsed = [...uniqueWords];
  // console.log(allWordsUsed);
  // console.log(posts);

  const handleSearch = (query) => {
    // remove hashtags and other special characters
    const cleanQuery = query.replace(/[#?]/g, "");
    // suggestions will be an arra of results that match the query with their type and value
    const suggestions = [];

    // search users
    const usersResults = users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(cleanQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(cleanQuery.toLowerCase())
      );
    });

    // put each tag in each post tags array into a single array

    // search posts tags
    const topicsResults = posts.map((post) => post.tags);
    // flatten the array
    const allTags = [].concat.apply([], topicsResults);

    const allCategories = posts.map((post) => post.category);
    // remove duplicates
    const uniqueTags = [...new Set(allTags)];

    uniqueTags.push(...allCategories);

    // filter tags that match the query
    const filteredTags = uniqueTags.filter((tag) => {
      return tag.toLowerCase().includes(cleanQuery.toLowerCase());
    });

    // keywordsResults will be an array of posts, activities, podcasts, and events that match the query
    const keywordsResults = allWordsUsed.filter((word) => {
      return word.toLowerCase().includes(cleanQuery.toLowerCase());
    });

    // add results to suggestions
    if (usersResults.length > 0) {
      suggestions.push({ type: "users", value: usersResults });
    }
    if (filteredTags.length > 0) {
      suggestions.push({ type: "topics", value: filteredTags });
    }

    if (keywordsResults.length > 0) {
      suggestions.push({ type: "keywords", value: keywordsResults });
    }

    setSuggestions(suggestions);
    setIsSuggestionsOpen(true);
    console.log(suggestions);
  };

  const handleSearchWord = (searchQuery) => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    handleSearchKeyWord(searchQuery, loggedInUser);
    closeModal();
  };

  const convertedTitle = (title) => {
    return title.toLowerCase().split(" ").join("-");
  };

  return (
    <div className="block relative sm:z-50" ref={modalRef}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-gray-500 dark:text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
      <input
        type="text"
        onClick={openSearch}
        placeholder="Search Wholesquare"
        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-[400px] pl-10 p-2.5 transition duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 lg:w-[300px] sm:w-[220px] sm:py-2"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        // on enter key press
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSearchWord(searchQuery);
          }
        }}
      />
      {searchQuery && (
        <button
          onClick={() => {
            setSearchQuery("");
            closeModal();
          }}
          className="absolute inset-y-0 right-4"
        >
          <FontAwesomeIcon icon={faXmarkCircle} className="text-red-800" />
        </button>
      )}
      {showSearchModal && (
        <div
          className="fixed z-20 font-inter top-20 left1 sm:justify-start sm:items-start sm:w-full sm:h-full sm:top-0 sm:bg-white sm:left-0"
          // onClick={closeModal}
        >
          <div
            className="bg-[#fefefe] overflow-hidden h-[500px] p-6 border border-[#fefefe] w-[400px] rounded-xl flex flex-col gap-4 sm:h-[calc(100vh-0px)] sm:w-full sm:rounded-none"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow:
                "0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)",
            }}
          >
            <div className="sm:flex gap-6 items-center hidden">
              <button onClick={() => closeModal()}>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="text-black h-5 w-5"
                />
              </button>

              <div className="relative min-h-12 w-full border bg-white border-gray-200 mx-auto rounded-xl flex gap-2 items-center px-4 py-2.5">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Wholesquare"
                  className="w-full py-1 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-transparent transition duration-300 ease-in-out"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  // on enter key press
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearchWord(searchQuery);
                    }
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="">
                    <FontAwesomeIcon
                      icon={faXmarkCircle}
                      className="text-red-800"
                    />
                  </button>
                )}
              </div>
            </div>
            {!isSuggestionsOpen || searchQuery === "" ? (
              <div className="w-full flex flex-col justify-center items-center gap-8">
                {loggedInUser?.recentSearches?.length > 0 ? (
                  <div className="flex flex-col gap-5 w-full">
                    <div className="w-full flex justify-between">
                      <h4 className="text-xl font-inter text-center font-semibold text-black">
                        Recent Searches
                      </h4>
                      <button>View All</button>
                    </div>
                    <div className="flex flex-col gap-3">
                      {loggedInUser.recentSearches.slice(0, 8).map((search) => {
                        return (
                          <div
                            key={search.type}
                            className="w-full flex flex-col gap-2"
                          >
                            {search.type === "user" ? (
                              <div className="w-full flex justify-between py-1">
                                <button
                                  onClick={() => {
                                    navigate(
                                      `/${
                                        getProfileDetails(search.value, users)
                                          .username
                                      }`
                                    );
                                    closeModal();
                                  }}
                                  className="flex gap-2 items-center w-full"
                                >
                                  <img
                                    src={
                                      getProfileDetails(search?.value, users)
                                        .photoURL
                                    }
                                    className="w-10 h-10 rounded-full"
                                  />
                                  <div className="flex flex-col gap-1">
                                    <h4 className="text-sm font-inter font-semibold text-black">
                                      {
                                        getProfileDetails(search.value, users)
                                          .name
                                      }
                                    </h4>
                                    <p className="text-xs font-inter text-start text-gray-400">
                                      @
                                      {
                                        getProfileDetails(search.value, users)
                                          .username
                                      }
                                    </p>
                                  </div>
                                </button>
                                <button
                                  onClick={() =>
                                    handleRemoveUserFromRecentSearches(
                                      search.value,
                                      loggedInUser
                                    )
                                  }
                                  className="text-red-500"
                                >
                                  <FontAwesomeIcon
                                    icon={faXmark}
                                    className="text-red-500"
                                  />
                                </button>
                              </div>
                            ) : search.type === "topics" ? (
                              <div className="w-full flex justify-between py-1">
                                <button
                                  onClick={() => {
                                    navigate(
                                      `/topic/${convertedTitle(search.value)}`
                                    );
                                    closeModal();
                                  }}
                                  className="text-sm font-inter font-semibold text-black lowercase"
                                >
                                  #{search.value}
                                </button>
                                <button
                                  onClick={() =>
                                    handleRemoveTopicFromRecentSearches(
                                      search.value,
                                      loggedInUser
                                    )
                                  }
                                  className="text-red-500"
                                >
                                  <FontAwesomeIcon
                                    icon={faXmark}
                                    className="text-red-500"
                                  />
                                </button>
                              </div>
                            ) : (
                              <div className="w-full flex justify-between py-1">
                                <button
                                  onClick={() => {
                                    navigate(`/search?q=${search.value}`);
                                    closeModal();
                                  }}
                                  className="text-sm font-inter font-semibold text-black"
                                >
                                  {search.value}
                                </button>
                                <button
                                  onClick={() =>
                                    handleRemoveKeywordFromRecentSearches(
                                      search.value,
                                      loggedInUser
                                    )
                                  }
                                  className="text-red-500"
                                >
                                  <FontAwesomeIcon
                                    icon={faXmark}
                                    className="text-red-500"
                                  />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 font-inter text-center text-[0.85rem]">
                    Try searching for users or topics
                  </p>
                )}
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-scroll py-3 sm:max-h-[calc(100vh-100px)]">
                <div className="flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={() => handleSearchWord(searchQuery)}
                    className="flex gap-3.5 items-center hover:bg-gray-100 p-2 rounded-xl transition duration-300 ease-in-out"
                  >
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="text-gray-900"
                    />
                    <p className="text-gray-900 font-inter font-semibold">
                      Search for &ldquo;{searchQuery}&ldquo;
                    </p>
                  </button>
                  {suggestions.map((suggestion) => {
                    return (
                      <div
                        key={suggestion.type}
                        className="w-full flex flex-col gap-3"
                      >
                        {suggestion.type === "users" ? (
                          <div className="flex flex-col gap-1 w-full border-b border-gray-200">
                            <h3 className="text-base font-inter font-semibold text-black uppercase">
                              People
                            </h3>
                            {suggestion.value.slice(0, 4).map((user) => (
                              <div
                                key={user.id}
                                className="flex flex-col gap-0.5 py-1"
                              >
                                <div className="w-full flex justify-between">
                                  <button
                                    onClick={() => {
                                      handleSearchUser(user.id, loggedInUser);
                                      navigate(`/${user.username}`);
                                      closeModal();
                                    }}
                                    className="flex w-full gap-2 items-center hover:bg-gray-100 p-2 rounded-xl transition duration-300 ease-in-out"
                                  >
                                    <img
                                      src={user.photoURL}
                                      className="w-10 h-10 rounded-full"
                                    />
                                    <div className="flex flex-col justify-start">
                                      <h4 className="text-sm font-inter font-semibold text-black">
                                        {user.name}
                                      </h4>
                                      <p className="text-xs text-start font-inter text-gray-400">
                                        @{user.username}{" "}
                                      </p>
                                    </div>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : suggestion.type === "topics" ? (
                          <div className="flex flex-col gap-2.5 w-full border-b border-gray-200 pb-2">
                            <h3 className="text-base font-inter font-semibold text-black uppercase">
                              Topics/Tags
                            </h3>
                            {suggestion.value.slice(0, 4).map((result) => (
                              <button
                                key={result}
                                onClick={() => {
                                  handleSearchTopic(result, loggedInUser);
                                  navigate(`/topic/${convertedTitle(result)}`);
                                  closeModal();
                                }}
                                className="w-full flex flex-col gap-2 py-3 hover:bg-gray-100 p-2 rounded-xl transition duration-300 ease-in-out"
                              >
                                <div className="w-full flex justify-between">
                                  <p className="text-sm font-inter font-semibold text-black lowercase">
                                    #{result}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="w-full">
                            {suggestion.value.slice(0, 4).map((result) => (
                              <button
                                key={result}
                                onClick={() => {
                                  handleSearchKeyWord(result, loggedInUser);
                                  navigate(
                                    `/search?q=${encodeURIComponent(result)}`
                                  );
                                  closeModal();
                                }}
                                className="w-full flex flex-col gap-2 py-3 hover:bg-gray-100 p-2 rounded-xl transition duration-300 ease-in-out"
                              >
                                <div className="w-full flex gap-3.5 items-center">
                                  <FontAwesomeIcon
                                    icon={faSearch}
                                    className="text-gray-900"
                                  />
                                  <p className="text-sm font-inter font-semibold text-black">
                                    {result}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
