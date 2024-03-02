import "./App.css";
import { useEffect, useState } from "react";
import Header from "./Header";
import Homepage from "./Home/Homepage";
import { Navigate, Route, Routes, useLocation } from "react-router";
import {
  db,
  collection,
  onSnapshot,
  onAuthStateChanged,
  createUserProfileDocument,
  auth,
} from "./firebase/auth.js";
import Account from "./Account";
import Aboutus from "./Aboutus";
import Whatwedo from "./Whatwedo";
import Login from "./Accunts/Login";
import Signip from "./Accunts/Signip";
import EventList from "./Events/EventList";
import EventDes from "./Events/EventDes";
import HostEvent from "./Events/HoseEvent";
import Articles from "./Articles/Articles";
import Podcast from "./Podcast/Podcast";
import Activity from "./Activity/ActivityDes";
import InterestOld from "./Interest/InterestOld.jsx";
import CreatePost from "./CreatePost/CreatePost";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./firebase/ProtectedRouteProps";
import ArticleList from "./Articles/ArticleList";
// import ReadMore from "./Articles/ReadMore";
import MyInterest from "./MyInterest/MyInterest";
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Dashboard/Profile";
import MyPosts from "./Dashboard/MyPosts";
import Statistics from "./Dashboard/Statistics";
import "hover.css";
import TagPosts from "./Articles/TagPosts";
import CategoryPosts from "./Articles/CollectionPosts.";
import ActivityForm from "./Activity/ActivityForm";
import Profilepage from "./Dashboard/Profilepage";
import ArticleInterest from "./MyInterest/ArticleInterest";
import EventsInterest from "./MyInterest/EventsInterest";
import PodcastAdmin from "./Podcast/PodcastAdmin";
import { FollowersFeed } from "./MyInterest/FollowersFeed";
// import Admin from "./Admin/Admin";
// import Allarticles from "./Admin/Allarticles";
// import Users from "./Admin/Users";
import Settings from "./Dashboard/Settings";
import ActivityInterest from "./MyInterest/ActivityInterest";
// import Podcasts from "./Admin/Podcasts";
// import AllActivity from "./Admin/AllActivity";
import PodcastInterest from "./MyInterest/PodcastInterest";
import MyEvents from "./Dashboard/MyEvents";
import ActivityList from "./Activity/ActivityList";
import { SearchModal, SearchUser, Topics } from "./Userpage";
import { selectSearchModal } from "./Features/searchModalSlice.js";
import { Messages, SelectMessage, ChatView } from "./Chats";
import { DefaultLayout } from "./Layouts/";
import { getDoc, limit } from "firebase/firestore";
// import { doc, getDocs, updateDoc } from "./firebase/auth.js";
import { Feed, FeedLayout, Content, Following } from "./Feed";
import {
  Profile20,
  FollowersAndFollowing,
  Followers,
  FollowingUsers,
} from "./Profile";
import {
  Feed as InterestFeed,
  Layout as InterestLayout,
  Create,
  Interest,
} from "./Interest";
import { Bookmarks, Drafts, Notifications } from "./Dashboard";
// import "@fortawesome/fontawesome-free"
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./Features/userSlice.js";
// import { setUsers } from "./Features/usersSlice.js";
import { openRightBar } from "./Features/openRightBarSlice.js";
import moreImg from "./Feed/assets/aurora.png";
import { BottomFeedTab } from "./components/Feed/";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [postId, setPostId] = useState([]);
  const [postTags, setPostTags] = useState([]);
  const [postCategories, setPostCategories] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventLoading, setEventLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [podcastLoading, setPodcastLoading] = useState(true);
  // const [loggedInUser, setLoggedInUser] = useState([]);
  const [users, setAllUsers] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [interests, setInterests] = useState([]);
  // const [chatId, setChatId] = useState(null);

  onAuthStateChanged(auth, async (userAuth) => {
    if (userAuth) {
      const userRef = await createUserProfileDocument(userAuth, {});
      if (!userRef) return;

      const snapShot = await getDoc(userRef);

      if (!snapShot.exists()) return;
      const user = { id: snapShot.id, ...snapShot.data() };
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(login(user));
      // setLoggedInUser(user);
      // console.log(user);

      // Fetch all users from Firestore
      // const usersRef = collection(db, "users");
      // const usersSnapshot = await getDocs(usersRef);
      // const users = [];
      // usersSnapshot.forEach((doc) => {
      //   users.push({
      //     id: doc.id,
      //     ...doc.data(),
      //     photoURL: doc.data().photoURL,
      //   });
      // });
      // dispatch(setUsers(users));
      // setAllUsers(users);
    } else {
      localStorage.removeItem("user");
      dispatch(logout());
      // setLoggedInUser(null);
    }
  });

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "users"));
  //       const userData = [];
  //       querySnapshot.forEach((doc) => {
  //         // Extract the data from each document
  //         const user = doc.data();
  //         user.id = doc.id;
  //       });
  //       setUsers(userData);
  //     } catch (error) {
  //       console.error("Error fetching posts:", error);
  //       setUsers([]);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  // console.log(loggedInUser?.id, users);

  useEffect(() => {
    const unsuscribPosts = onSnapshot(collection(db, "posts"), (snapshot) => {
      const postData = [];
      const postIds = [];
      const tags = [];
      const categories = [];
      snapshot.forEach((doc) => {
        const postDoc = doc.data();
        postDoc.id = doc.id;
        postIds.push(doc.id);
        postData.push({ ...doc.data(), id: doc.id });
        if (Array.isArray(postDoc.tags)) {
          tags.push(...postDoc.tags);
        }

        const category = postDoc.category;
        if (category) {
          categories.push(category);
        }
      });

      setPosts(postData);
      setPostId(postIds);
      setPostTags([...new Set(tags)]);
      setPostCategories(categories);
      setPostLoading(false);
    });
    const unsuscribEvents = onSnapshot(collection(db, "events"), (snapshot) => {
      const postData = [];
      snapshot.forEach((doc) => {
        postData.push({ ...doc.data(), id: doc.id });
      });
      setEvents(postData);
      setEventLoading(false);
    });
    const unsuscribActivities = onSnapshot(
      collection(db, "activities"),
      (snapshot) => {
        const postData = [];
        snapshot.forEach((doc) => {
          postData.push({ ...doc.data(), id: doc.id });
        });
        setActivities(postData);
      },
      limit(10)
    );

    const unsuscribUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = [];
      snapshot.forEach((doc) => {
        usersData.push({ ...doc.data(), id: doc.id });
      });
      setAllUsers(usersData);
      // dispatch(setUsers(users));
    });

    const unsuscribPodcasts = onSnapshot(
      collection(db, "podcast"),
      (snapshot) => {
        const postData = [];
        snapshot.forEach((doc) => {
          postData.push({ ...doc.data(), id: doc.id });
        });
        setPodcasts(postData);
        setPodcastLoading(false);
      }
    );

    const unsuscribInterests = onSnapshot(
      collection(db, "interests"),
      (snapshot) => {
        const interestData = [];
        snapshot.forEach((doc) => {
          interestData.push({ ...doc.data(), id: doc.id });
        });
        setInterests(interestData);
      }
    );

    return () => {
      unsuscribPosts();
      unsuscribEvents();
      unsuscribActivities();
      unsuscribUsers();
      unsuscribPodcasts();
      unsuscribInterests();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("ah");

  const openRightBarSlide = () => {
    dispatch(openRightBar());
  };

  useEffect(() => {
    const unsubscribeChats = onSnapshot(
      collection(db, "chats"),
      (chatSnapshot) => {
        const groupedChatsArr = [];

        chatSnapshot.forEach(async (chatDoc) => {
          const chatId = chatDoc.data().chatId;
          const chatDocId = chatDoc.id;

          const messagesRef = collection(chatDoc.ref, "messages");
          const unsubscribeMessages = onSnapshot(
            messagesRef,
            (messagesSnapshot) => {
              const groupedMessages = [];

              messagesSnapshot.forEach((messageDoc) => {
                groupedMessages.push({
                  id: messageDoc.id,
                  ...messageDoc.data(),
                });
              });

              const chatData = {
                chatId,
                chatDocId,
                chatData: chatDoc.data(),
                // sort message by newest first
                messages: groupedMessages.sort(
                  (a, b) => b.timestamp - a.timestamp
                ),
              };

              const existingChatIndex = groupedChatsArr.findIndex(
                (chat) => chat.chatId === chatId
              );
              if (existingChatIndex !== -1) {
                groupedChatsArr[existingChatIndex] = chatData;
              } else {
                groupedChatsArr.push(chatData);
              }
              setAllChats([...groupedChatsArr]);
            }
          );

          return () => unsubscribeMessages();
        });
      }
    );

    return () => unsubscribeChats();
  }, []);

  // console.log(allChats);

  // useEffect(() => {
  //   const fetchUsersAndUpdateRecentSearches = async () => {
  //     try {
  //       // Fetch all users
  //       const usersRef = collection(db, "users");
  //       const usersSnapshot = await getDocs(usersRef);

  //       // Iterate over each user
  //       usersSnapshot.forEach(async (userDoc) => {
  //         const userData = userDoc.data();

  //         // Check if the user has
  //         if (!userData.followers) {
  //           // If not, update the user data to include
  //           const userRef = doc(usersRef, userDoc.id);
  //           await updateDoc(userRef, {
  //             followers: [],
  //           });
  //         }
  //       });
  //     } catch (error) {
  //       console.error("Error updating recentSearches:", error);
  //     }
  //   };

  //   fetchUsersAndUpdateRecentSearches();
  // }, []); // Run once on component mount

  const showSearchModal = useSelector(selectSearchModal);

  return (
    <div className="">
      <Header users={users} allChats={allChats} />
      <Routes>
        <Route
          path="/aboutus"
          element={
            <DefaultLayout>
              <Aboutus />
            </DefaultLayout>
          }
        />
        <Route path="/whatwedo" element={<Whatwedo />} />
        <Route
          path="/"
          element={
            <DefaultLayout>
              <BottomFeedTab users={users}>
                <Homepage
                  users={users}
                  posts={posts}
                  postId={postId}
                  postLoading={postLoading}
                  events={events}
                  eventLoading={eventLoading}
                  activities={activities}
                />
              </BottomFeedTab>
            </DefaultLayout>
          }
        />
        <Route path="/account" element={<Account users={users} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signip />} />
        <Route
          path="/upcomingevents"
          element={<EventList events={events} loading={eventLoading} />}
        />
        <Route
          path="/hostevent"
          element={
            <ProtectedRoute>
              <HostEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/article/:articleName"
          element={<Articles users={users} posts={posts} />}
        />
        <Route
          path="/activities"
          element={<ActivityList activities={activities} />}
        />
        <Route
          path="/activity/:id"
          element={<Activity activities={activities} />}
        />
        <Route path="/activity/adminform" element={<ActivityForm />} />
        <Route path="/podcast/adminform" element={<PodcastAdmin />} />
        <Route path="/interest/:interestName" element={<InterestOld />} />
        <Route
          path="/upcomingevents/:id"
          element={<EventDes events={events} />}
        />
        <Route
          path="/podcast"
          element={<Podcast podcasts={podcasts} loading={podcastLoading} />}
        />
        <Route
          path="/createpost"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editpost/:id"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/articlelist"
          element={
            <ArticleList
              posts={posts}
              postId={postId}
              tags={postTags}
              category={postCategories}
              loading={postLoading}
            />
          }
        />
        <Route path="/articletag/:tag" element={<TagPosts />} />
        <Route path="/articlecategory/:category" element={<CategoryPosts />} />
        <Route
          path="/readmore/:id"
          element={<Content posts={posts} setPosts={setPosts} users={users} />}
        />
        <Route path="/myinterest" element={<MyInterest />}>
          <Route path="/myinterest/articles" element={<ArticleInterest />} />
          <Route path="/myinterest/events" element={<EventsInterest />} />

          <Route path="/myinterest/activities" element={<ActivityInterest />} />
          <Route path="/myinterest/feeds" element={<FollowersFeed />} />

          <Route path="/myinterest/podcast" element={<PodcastInterest />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {/*  */}
              <Dashboard />
              {/*  */}
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/myposts" element={<MyPosts />} />
          <Route path="/dashboard/statistics" element={<Statistics />} />
          <Route path="/dashboard/drafts" element={<Drafts />} />

          <Route path="/dashboard/bookmarks" element={<Bookmarks />} />

          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/events" element={<MyEvents />} />
        </Route>
        <Route path="/profile/:profileId" element={<Profilepage />} />
        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/articles" element={<Allarticles />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/podcasts" element={<Podcasts />} />
          <Route path="/admin/activities" element={<AllActivity />} />
        </Route> */}
        {/* <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages>
                <Route path="/" element={<SelectMessage />} />
                <Route path="/:chatId" element={<ChatView />} />
              </Messages>
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/search"
          element={
            <BottomFeedTab users={users}>
              <FeedLayout>
                <SearchUser
                  users={users}
                  posts={posts}
                  setPosts={setPosts}
                  activities={activities}
                  events={events}
                />
              </FeedLayout>
            </BottomFeedTab>
          }
        />
        <Route
          path="/topic/:topicSTR"
          element={
            <BottomFeedTab users={users}>
              <FeedLayout>
                <Topics
                  users={users}
                  setPosts={setPosts}
                  posts={posts}
                  activities={activities}
                  events={events}
                />
              </FeedLayout>
            </BottomFeedTab>
          }
        />
        <Route
          path="/:username"
          element={
            <BottomFeedTab users={users}>
              <FeedLayout>
                <Profile20
                  users={users}
                  posts={posts}
                  setPosts={setPosts}
                  events={events}
                />
              </FeedLayout>
            </BottomFeedTab>
          }
        />
        <Route
          path="/:username/followers"
          element={
            <BottomFeedTab users={users}>
              <FeedLayout>
                <FollowersAndFollowing users={users} />
                <Followers users={users} />
              </FeedLayout>
            </BottomFeedTab>
          }
        />
        <Route
          path="/:username/following"
          element={
            <BottomFeedTab users={users}>
              <FeedLayout>
                <FollowersAndFollowing users={users} />
                <FollowingUsers users={users} />
              </FeedLayout>
            </BottomFeedTab>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              {/* change this shit */}
              <BottomFeedTab users={users}>
                <Messages users={users} allChats={allChats}>
                  <SelectMessage users={users} />
                </Messages>
              </BottomFeedTab>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages/:chatId"
          element={
            <ProtectedRoute>
              <Messages users={users} allChats={allChats}>
                <ChatView users={users} allChats={allChats} />
              </Messages>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <BottomFeedTab users={users}>
                <FeedLayout>
                  <Notifications users={users} posts={posts} />
                </FeedLayout>
              </BottomFeedTab>
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <BottomFeedTab users={users}>
              <FeedLayout>
                <Feed posts={posts} setPosts={setPosts} users={users} />
              </FeedLayout>
            </BottomFeedTab>
          }
        />
        <Route
          path="/feed/following"
          element={
            <BottomFeedTab users={users}>
              <FeedLayout>
                <Following posts={posts} setPosts={setPosts} users={users} />
              </FeedLayout>
            </BottomFeedTab>
          }
        />
        <Route
          path="/i/interest"
          element={
            <BottomFeedTab users={users}>
              <InterestLayout interests={interests}>
                <InterestFeed interests={interests} />
              </InterestLayout>
            </BottomFeedTab>
          }
        />
        <Route
          path="/i/create"
          element={
            <BottomFeedTab users={users}>
              <InterestLayout interests={interests}>
                <Create interests={interests} />
              </InterestLayout>
            </BottomFeedTab>
          }
        />

        <Route
          path="/i"
          //redirect to account settings
          element={<Navigate to="/i/interest" />}
        />

        <Route
          path="/i/:name"
          element={
            <BottomFeedTab users={users}>
              <InterestLayout interests={interests}>
                <Interest interests={interests} />
              </InterestLayout>
            </BottomFeedTab>
          }
        />

        {/* <Route path="/content/123" element={<Content />} /> */}
      </Routes>
      {/* <Footer /> */}
      <div
        className={`${
          location.pathname.includes("/feed") &&
          !location.pathname.includes("/interest/feed")
            ? "hidden lg:block fixed z-10 right-10 bottom-10 cursor-pointer sm:hidden"
            : "hidden lg:hidden"
        }`}
        onClick={openRightBarSlide}
      >
        <img src={moreImg} className="h-16 w-16 brightness-95 rotate-45" />
      </div>

      {/* <BottomFeedTab /> */}
      {showSearchModal && (
        <SearchModal users={users} posts={posts} activities={activities} />
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
