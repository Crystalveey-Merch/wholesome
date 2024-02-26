/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";
import {
  handleFollow,
  handleSearchKeyWord,
  getProfileDetails,
  handleSearchUser,
  handleRemoveUserFromRecentSearches,
  handleSearchTopic,
  handleRemoveTopicFromRecentSearches,
  handleRemoveKeywordFromRecentSearches,
} from "../Hooks";
import { All, Articles, People } from ".";
// import { db } from "../firebase/auth";
// import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export const SearchUser = ({ users, posts, setPosts, activities, events }) => {
  const loggedInUser = useSelector(selectUser);
  // const { interestName } = useParams();
  // const [users, setUsers] = useState([]);

  // const [authUser, setAuthUser] = useState(null);
  // const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    if (users.length > 0) {
      const topUsersData = users
        ?.sort((a, b) => b.followers?.length - a.followers?.length)
        ?.slice(0, 8);
      setTopUsers(topUsersData);
    }
  }, [users]);

  // const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchedWord, setSearchedWord] = useState("");
  // const [usersMatched, setUsersMatched] = useState([]);
  // const [eventsMatched, setEventsMatched] = useState([]);
  // const [podcastsMatched, setPodcastsMatched] = useState([]);
  // const [activitiesMatched, setActivitiesMatched] = useState([]);
  // const [postsMatched, setPostsMatched] = useState([]);

  // set suggestions based on search query, suggestions are based on users, keywords, and topics

  // // get all words used in posts, activities, podcasts, and events
  // const extractWords = (text) => {
  //   return text?.toLowerCase().match(/\b\w+\b/g) || []; // Extract words ignoring punctuation
  // };

  // // Initialize an empty set to store unique words
  // const uniqueWords = new Set();

  // // Add all words from posts, activities, podcasts, and events to the set
  // posts.forEach((post) => {
  //   const titleWords = extractWords(post.postTitle || "");
  //   const contentWords = extractWords(post.content || "");
  //   // post .tags is an array of strings
  //   const tagWords = extractWords(post.tags.join(" "));
  //   titleWords.forEach((word) => uniqueWords.add(word));
  //   contentWords.forEach((word) => uniqueWords.add(word));
  //   tagWords.forEach((word) => uniqueWords.add(word));
  // });

  // activities.forEach((activity) => {
  //   // const titleWords = extractWords(activity.activityName || "");
  //   const contentWords = extractWords(activity.category || "");

  //   contentWords.forEach((word) => uniqueWords.add(word));
  // });

  // // Convert the set to an array
  // const allWordsUsed = [...uniqueWords];
  // console.log(allWordsUsed);
  // console.log(posts);

  // const handleSearch = (query) => {
  //   // remove hashtags and other special characters
  //   const cleanQuery = query.replace(/[#?]/g, "");
  //   // suggestions will be an arra of results that match the query with their type and value
  //   const suggestions = [];

  //   // search users
  //   const usersResults = users.filter((user) => {
  //     return (
  //       user.name?.toLowerCase().includes(cleanQuery.toLowerCase()) ||
  //       user.username?.toLowerCase().includes(cleanQuery.toLowerCase())
  //     );
  //   });

  //   // put each tag in each post tags array into a single array

  //   // search posts tags
  //   const topicsResults = posts.map((post) => post.tags);
  //   // flatten the array
  //   const allTags = [].concat.apply([], topicsResults);
  //   // remove duplicates
  //   const uniqueTags = [...new Set(allTags)];
  //   // filter tags that match the query
  //   const filteredTags = uniqueTags.filter((tag) => {
  //     return tag.toLowerCase().includes(cleanQuery.toLowerCase());
  //   });

  //   // keywordsResults will be an array of posts, activities, podcasts, and events that match the query
  //   const keywordsResults = allWordsUsed.filter((word) => {
  //     return word.includes(cleanQuery);
  //   });

  //   // add results to suggestions
  //   if (usersResults.length > 0) {
  //     suggestions.push({ type: "users", value: usersResults });
  //   }
  //   if (filteredTags.length > 0) {
  //     suggestions.push({ type: "topics", value: filteredTags });
  //   }

  //   if (keywordsResults.length > 0) {
  //     suggestions.push({ type: "keywords", value: keywordsResults });
  //   }

  //   setSuggestions(suggestions);
  // };

  useEffect(() => {
    // Parse the query parameter from the URL
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q") || ""; // Default value is empty string if 'q' parameter is not present
    const searchResults = [];
    // const postsMatched = [];
    // const activitiesMatched = [];
    // const podcastsMatched = [];
    // const eventsMatched = [];
    // const usersMatched = [];

    // Search for users
    const usersMatched = users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(query.toLowerCase()) ||
        user.username?.toLowerCase().includes(query.toLowerCase())
      );
    });

    // Search for posts
    const postsMatched = posts.filter((post) => {
      return (
        post.postTitle?.toLowerCase().includes(query.toLowerCase()) ||
        post.content?.toLowerCase().includes(query.toLowerCase()) ||
        post.tags?.join(" ").toLowerCase().includes(query.toLowerCase()) ||
        post.category?.toLowerCase().includes(query.toLowerCase()) ||
        getProfileDetails(post.userId, users)
          .name.toLowerCase()
          .includes(query.toLowerCase()) ||
        getProfileDetails(post.userId, users)
          .username.toLowerCase()
          .includes(query.toLowerCase())
      );
    });

    // Search for activities
    const activitiesMatched = activities.filter((activity) => {
      return (
        activity.activityName?.toLowerCase().includes(query.toLowerCase()) ||
        activity.category?.toLowerCase().includes(query.toLowerCase()) ||
        activity.location?.toLowerCase().includes(query.toLowerCase()) ||
        activity.writeup?.toLowerCase().includes(query.toLowerCase()) ||
        getProfileDetails(activity.userId, users)
          .name.toLowerCase()
          .includes(query.toLowerCase()) ||
        getProfileDetails(activity.userId, users)
          .username.toLowerCase()
          .includes(query.toLowerCase())
      );
    });

    // Search for events
    const eventsMatched = events.filter((event) => {
      return (
        event.eventName?.toLowerCase().includes(query.toLowerCase()) ||
        event.address?.toLowerCase().includes(query.toLowerCase()) ||
        event.eventDescription?.toLowerCase().includes(query.toLowerCase()) ||
        event.category?.toLowerCase().includes(query.toLowerCase()) ||
        event.organizerName?.toLowerCase().includes(query.toLowerCase()) ||
        event.tags?.join(" ").toLowerCase().includes(query.toLowerCase())
      );
    });

    // serach for tags
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
      return tag.toLowerCase().includes(query.toLowerCase());
    });

    // Add the search results to the searchResults array
    if (usersMatched.length > 0) {
      searchResults.push({ type: "users", value: usersMatched });
    }
    if (postsMatched.length > 0) {
      searchResults.push({ type: "posts", value: postsMatched });
    }
    if (activitiesMatched.length > 0) {
      searchResults.push({ type: "activities", value: activitiesMatched });
    }
    if (eventsMatched.length > 0) {
      searchResults.push({ type: "events", value: eventsMatched });
    }

    if (filteredTags.length > 0) {
      searchResults.push({ type: "tags", value: filteredTags });
    }

    // Set the searchResults state
    setSearchResults(searchResults);
    // Set the searchQuery state
    setSearchQuery(query);
    setSearchedWord(query);
  }, [location.search, users, posts, activities, events]);

  // const searchFromQuery = () => {

  const handleSearchWord = (searchQuery) => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    handleSearchKeyWord(searchQuery, loggedInUser);
    setSearchedWord(searchQuery);
  };

  const convertedTitle = (title) => {
    return title.toLowerCase().split(" ").join("-");
  };

  const [currenTab, setCurrentTab] = useState("all");

  const handleTabChange = (tabName) => {
    setCurrentTab(tabName);
  };

  if (
    users == undefined ||
    posts == undefined ||
    activities == undefined ||
    events == undefined ||
    loggedInUser == null
  ) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-10 min-h-full w-full px10 bggray-50 text-black flex flex-col gap-16">
      <div className="min-h-12 w-full max-w-[400px] border bg-white border-gray-200 mx-auto rounded-xl flex gap-2 items-center px-4 py-2.5">
        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
        <input
          type="text"
          placeholder="Enter to search..."
          className="w-full py-1 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-transparent transition duration-300 ease-in-out"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            // handleSearch(e.target.value);
          }}
          // on enter key press
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearchWord(searchQuery);
            }
          }}
        />
      </div>
      {searchedWord.length > 0 ? (
        <div className="flex flex-col gap-7 sm:w-[calc(100vw-2rem)]">
          <div className="w-full justify-center h-10 flex gap-8 sm:overflow-y-hidden sm:gap-4">
            <button className="w-40 px-4 hidden sm:block"></button>
            <button
              onClick={() => handleTabChange("all")}
              className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
                currenTab === "all"
                  ? "text-black border-[#FF5841]"
                  : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
              } `}
            >
              All
            </button>
            {/* <button
              onClick={() => handleTabChange("latest")}
              className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
                currenTab === "latest"
                  ? "text-black border-[#FF5841]"
                  : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
              } `}
            >
              Latest
            </button> */}
            <button
              onClick={() => handleTabChange("tags")}
              className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
                currenTab === "tags"
                  ? "text-black border-[#FF5841]"
                  : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
              } `}
            >
              Tags
            </button>
            <button
              onClick={() => handleTabChange("people")}
              className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
                currenTab === "people"
                  ? "text-black border-[#FF5841]"
                  : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
              } `}
            >
              People
            </button>
            <button
              onClick={() => handleTabChange("articles")}
              className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
                currenTab === "articles"
                  ? "text-black border-[#FF5841]"
                  : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
              } `}
            >
              Articles
            </button>
            <button
              onClick={() => handleTabChange("events")}
              className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
                currenTab === "events"
                  ? "text-black border-[#FF5841]"
                  : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
              } `}
            >
              Events
            </button>
            <button
              onClick={() => handleTabChange("activities")}
              className={`text-base font-semibold pb-3 border-b-2 cursor-pointer transition duration-500 ease-in-out ${
                currenTab === "activities"
                  ? "text-black border-[#FF5841]"
                  : "text-gray-500 border-b-transparent hover:text-black hover:border-[#FF5841]"
              } `}
            >
              Activities
            </button>
          </div>
          {currenTab === "all" ? (
            <All
              searchResults={searchResults}
              handleTabChange={handleTabChange}
              posts={posts}
              setPosts={setPosts}
              users={users}
            />
          ) : currenTab === "people" ? (
            <People searchResults={searchResults} />
          ) : currenTab === "articles" ? (
            <Articles
              searchResults={searchResults}
              posts={posts}
              setPosts={setPosts}
              users={users}
            />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center gap-8">
          {loggedInUser.recentSearches?.length > 0 ? (
            <div className="w-full max-w-[550px] flex flex-col gap-5">
              <div className="w-full flex justify-between">
                <h4 className="text-xl font-inter text-center font-semibold text-black">
                  Recent Searches
                </h4>
                <button>View All</button>
              </div>
              <div className="flex flex-col gap-3">
                {loggedInUser?.recentSearches?.slice(0, 8).map((search) => {
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
                            }}
                            className="flex gap-2 items-center w-full"
                          >
                            <img
                              src={
                                getProfileDetails(search?.value, users)
                                  ?.photoURL
                              }
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex flex-col gap-1">
                              <h4 className="text-sm font-inter font-semibold text-black">
                                {getProfileDetails(search.value, users)?.name}
                              </h4>
                              <p className="text-xs font-inter text-start text-gray-400">
                                @
                                {
                                  getProfileDetails(search.value, users)
                                    ?.username
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
              Try searching for users, posts, activities, podcasts, or events
            </p>
          )}
        </div>
        // <div className="w-full flex flex-col justify-center items-center gap-8">
        //   <h3 className="text-2xl font-inter text-center font-semibold text-black">
        //     Top Creators
        //   </h3>
        //   <div className="flex flex-col gap-5 w-full max-w-[550px] justify-center">
        //     {topUsers.map((user) => (
        //       <div
        //         key={user.id}
        //         className="flex flex-col gap-2 py-3 border-b border-gray-200"
        //       >
        //         <div className="w-full flex justify-between">
        //           <NavLink
        //             to={`/profile/${user.id}`}
        //             className="flex w-full gap-2"
        //           >
        //             <img
        //               src={user.photoURL}
        //               className="w-10 h-10 rounded-full mt-1"
        //             />
        //             <div className="flex flex-col">
        //               <h4 className="text-sm font-inter font-semibold text-black">
        //                 {user.name}
        //               </h4>
        //               <p className="text-xs font-inter text-gray-400">
        //                 @{user.username}{" "}
        //                 <span className="text-black">
        //                   {" "}
        //                   · {user.followers?.length} followers
        //                 </span>
        //               </p>
        //               {/* <h4 className="pt-1 text-sm font-inter font-semibold text-black">
        //               {user.followers?.length} followers
        //             </h4> */}
        //             </div>
        //           </NavLink>
        //           {loggedInUser ? (
        //             <>
        //               {loggedInUser.id === user.id ? (
        //                 <button
        //                   type="button"
        //                   onClick={() => {
        //                     navigate("/dashboard/profile");
        //                   }}
        //                   className="w-max h-max min-w-[120px] block px-4 py-2 rounded-xl bg-[#FF5841] border border-[#FF5841] text-[#FFFFFF] font-inter text-sm"
        //                 >
        //                   Edit Profile
        //                 </button>
        //               ) : loggedInUser.following.includes(user.id) ? (
        //                 <button
        //                   type="button"
        //                   onClick={() => {
        //                     handleFollow(loggedInUser, user);
        //                   }}
        //                   className="w-max h-max min-w-[120px] block px-4 py-2 rounded-xl bg-[#FF5841] border border-[#FF5841] text-[#FFFFFF] font-inter text-sm"
        //                 >
        //                   Following
        //                 </button>
        //               ) : (
        //                 <button
        //                   type="button"
        //                   onClick={() => {
        //                     handleFollow(loggedInUser, user);
        //                   }}
        //                   className="w-max h-max min-w-[120px] block px-4 py-2 rounded-xl border border-gray-300 text-[#FF5841] font-inter text-sm"
        //                 >
        //                   Follow
        //                 </button>
        //               )}
        //             </>
        //           ) : (
        //             <button
        //               type="button"
        //               onClick={() => {
        //                 navigate(`/profile/${user.id}`);
        //               }}
        //               className="w-max min-w-[120px] h-max block px-4 py-2 rounded-xl border border-gray-300 text-[#FF5841] font-inter text-sm"
        //             >
        //               View Profile
        //             </button>
        //           )}
        //         </div>
        //       </div>
        //     ))}
        //   </div>
        // </div>
      )}
    </div>
  );
};
