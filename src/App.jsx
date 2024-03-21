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
// import Account from "./Account";
import Aboutus from "./Aboutus";
import Whatwedo from "./Whatwedo";
import EventList from "./Events/EventList";
import EventDes from "./Events/EventDes";
import HostEvent from "./Events/HoseEvent";
import Articles from "./Articles/Articles";
import Podcast from "./Podcast/Podcast";
import Activity from "./Activity/ActivityDes";
import CreatePost from "./CreatePost/CreatePost";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./firebase/ProtectedRouteProps";
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
// import {Settings  } from "./Dashboard/Settings";
import ActivityInterest from "./MyInterest/ActivityInterest";
// import Podcasts from "./Admin/Podcasts";
// import AllActivity from "./Admin/AllActivity";
import PodcastInterest from "./MyInterest/PodcastInterest";
import MyEvents from "./Dashboard/MyEvents";
import ActivityList from "./Activity/ActivityList";
import { SearchModal, SearchUser, Topics } from "./Userpage";
import { selectSearchModal } from "./Features/searchModalSlice.js";
import { Messages, SelectMessage, ChatView } from "./Chats";
import { DashboardLayout, DefaultLayout } from "./Layouts/";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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
  Discover,
  Mine,
  Layout as InterestLayout,
  Create,
  Interest,
  ChatBox,
  ChatBoxView,
  Activities,
  Events,
  Articles as InterestArticles,
  Podcasts as InterestPodcasts,
  Settings as InterestSettings,
  AdminLayout,
  BasicSettings,
  InterestForNonUsers,
  NonUsersChatBox,
  NonUsersActivities,
  NonUsersArticles,
  NonUsersPodcasts,
  NonUsersEvents,
} from "./Interest";
import {
  AllActivities,
  AllArticles,
  AllChatBox,
  AllEvents,
  AllPodcasts,
} from "./Interest/AllInterest/";
import {
  Login as NewLogin,
  ForgotPassword,
  Register,
  SelectInterest,
  VerifyEmail,
  ProtectSignUpProcess,
} from "./Auth";
import { Settings, Account, EmailAndPassword } from "./Settings";
import { Bookmarks, Drafts, Notifications } from "./Dashboard";
// import "@fortawesome/fontawesome-free"
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./Features/userSlice.js";
// import { setUsers } from "./Features/usersSlice.js";
import { openRightBar } from "./Features/openRightBarSlice.js";
import {
  // openCreateModal,
  closeCreateModal,
  selectOpenCreateModal,
} from "./Features/openCreateModalSlice.js";
import moreImg from "./Feed/assets/aurora.png";
import { CreateModal } from "./CreatePost/CreateModal.jsx";
import { BottomFeedTab } from "./components/Feed/BottomFeedTab.jsx";
import { setUsers } from "./Features/usersSlice.js";
// import { BottomFeedTab } from "./components/Feed/";
// import { MiniHeader } from "./components/Header/MiniHeader.jsx";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventLoading, setEventLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [podcastLoading, setPodcastLoading] = useState(true);
  const [users, setAllUsers] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [interests, setInterests] = useState([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  // const loggedInUser = useSelector(selectUser);
  // const [chatId, setChatId] = useState(null);
  console.log(posts);

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
      // setIsUserLoggedIn(true);
    } else {
      localStorage.removeItem("user");
      dispatch(logout());
      // setIsUserLoggedIn(false);
      // setLoggedInUser(null);
    }
  });

  useEffect(() => {
    // Function to update the authentication email and Firestore document
    const updateAuthEmailAndDoc = async (userAuth) => {
      if (userAuth) {
        try {
          const userRef = doc(db, "users", userAuth.uid);
          await updateDoc(userRef, {
            email: userAuth.email,
          });
        } catch (error) {
          console.error("Error updating email and Firestore document:", error);
        }
      }
    };

    // Call updateAuthEmailAndDoc immediately to handle the initial authentication state
    onAuthStateChanged(auth, updateAuthEmailAndDoc);

    // Call updateAuthEmailAndDoc every hour
    const intervalId = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateAuthEmailAndDoc(currentUser);
      }
    }, 900000); // 1 hour in milliseconds

    // Clean up by clearing the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // check if user is logged in using local storage
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (user) {
      setIsUserLoggedIn(true);
      dispatch(login(user));
    } else {
      setIsUserLoggedIn(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
      snapshot.forEach((doc) => {
        postData.push({ ...doc.data(), id: doc.id });
      });
      setPosts(postData);
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
      }
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
  //   const fetchUsersAndUpdateInvites = async () => {
  //     try {
  //       const interestRef = collection(db, "interests");
  //       const usersSnapshot = await getDocs(interestRef);

  //       const batch = writeBatch(db); // Initialize batched write

  //       usersSnapshot.forEach((userDoc) => {
  //         const userData = userDoc.data();

  //         // Check if the user already has invites
  //         if (!userData.invites) {
  //           const userRef = doc(interestRef, userDoc.id);

  //           // Add update operation to batch
  //           batch.update(userRef, { invites: [] });
  //         }
  //       });

  //       // Commit batched write
  //       await batch.commit();
  //     } catch (error) {
  //       console.error("Error updating invites:", error);
  //     }
  //   };

  //   fetchUsersAndUpdateInvites();
  // }, []); // Run once on component mount

  const showSearchModal = useSelector(selectSearchModal);
  const showCreateModal = useSelector(selectOpenCreateModal);

  const setCreateModalClose = () => {
    dispatch(closeCreateModal());
  };

  return (
    <div className="">
      <Routes>
        {/* <Route element={<ProtectSignUpProcess />}> */}
        <Route
          path="/aboutus"
          element={
            <DefaultLayout>
              <Aboutus />
            </DefaultLayout>
          }
        />
        <Route path="/whatwedo" element={<Whatwedo />} />
        {/* {isUserLoggedIn ? (
          <Route
            path="/"
            element={
              // <BottomFeedTab users={users}>
               <DashboardLayout
                users={users}
                allChats={allChats}
                posts={posts}
                loading={postLoading}
                events={events}
                activities={activities}
              >
                <InterestLayout interests={interests}>
                  <InterestFeed>
                    <AllChatBox interests={interests} users={users} />
                  </InterestFeed>
                </InterestLayout>
              </DashboardLayout>
              //  </BottomFeedTab>
            }
          />
        ) : ( */}
        <Route
          path="/"
          element={
            // <DefaultLayout>
            <Homepage
              users={users}
              posts={posts}
              setPosts={setPosts}
              events={events}
              eventLoading={eventLoading}
              activities={activities}
              interests={interests}
              allChats={allChats}
            />
            // </DefaultLayout>
          }
        />
        {/* )} */}

        {/* <Route path="/account" element={<Account users={users} />} /> */}
        {/* <Route path="/signup" element={<Signip />} /> */}
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
              <DashboardLayout
                users={users}
                allChats={allChats}
                posts={posts}
                loading={postLoading}
                events={events}
                activities={activities}
              >
                <InterestLayout interests={interests}>
                  <CreatePost />
                </InterestLayout>
              </DashboardLayout>
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
        <Route path="/articletag/:tag" element={<TagPosts />} />
        <Route path="/articlecategory/:category" element={<CategoryPosts />} />
        <Route
          path="/readmore/:id"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <Content
                posts={posts}
                setPosts={setPosts}
                users={users}
                setUsers={setUsers}
              />
            </DashboardLayout>
          }
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
          {/* <Route path="/settings/account" element={<Profile />} /> */}
          <Route path="/dashboard/myposts" element={<MyPosts />} />
          <Route path="/dashboard/statistics" element={<Statistics />} />
          <Route path="/dashboard/drafts" element={<Drafts />} />

          <Route path="/dashboard/bookmarks" element={<Bookmarks />} />

          {/* <Route path="/dashboard/settings" element={<Settings />} /> */}
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
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <FeedLayout>
                  <BottomFeedTab users={users}>
                    <SearchUser
                      users={users}
                      posts={posts}
                      setPosts={setPosts}
                      activities={activities}
                      events={events}
                    />
                  </BottomFeedTab>
                </FeedLayout>
              </InterestLayout>
            </DashboardLayout>
          }
        />
        <Route
          path="/topic/:topicSTR"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <FeedLayout>
                  <BottomFeedTab users={users}>
                    <Topics
                      users={users}
                      setPosts={setPosts}
                      posts={posts}
                      activities={activities}
                      events={events}
                    />
                  </BottomFeedTab>
                </FeedLayout>
              </InterestLayout>
            </DashboardLayout>
          }
        />
        <Route
          path="/:username"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <FeedLayout>
                  <BottomFeedTab users={users}>
                    <Profile20
                      users={users}
                      posts={posts}
                      setPosts={setPosts}
                      events={events}
                    />
                  </BottomFeedTab>
                </FeedLayout>
              </InterestLayout>
            </DashboardLayout>
          }
        />
        <Route
          path="/:username/followers"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <FeedLayout>
                  <BottomFeedTab users={users}>
                    <FollowersAndFollowing users={users}>
                      <Followers users={users} />
                    </FollowersAndFollowing>
                  </BottomFeedTab>
                </FeedLayout>
              </InterestLayout>
            </DashboardLayout>
          }
        />
        <Route
          path="/:username/following"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <FeedLayout>
                  <BottomFeedTab users={users}>
                    <FollowersAndFollowing users={users}>
                      <FollowingUsers users={users} />
                    </FollowersAndFollowing>
                  </BottomFeedTab>
                </FeedLayout>
              </InterestLayout>
            </DashboardLayout>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <DashboardLayout
                users={users}
                allChats={allChats}
                posts={posts}
                loading={postLoading}
                events={events}
                activities={activities}
              >
                <InterestLayout interests={interests}>
                  <BottomFeedTab users={users}>
                    <Messages users={users} allChats={allChats}>
                      <SelectMessage users={users} />
                    </Messages>
                  </BottomFeedTab>
                </InterestLayout>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages/:chatId"
          element={
            <ProtectedRoute>
              <DashboardLayout
                users={users}
                allChats={allChats}
                posts={posts}
                loading={postLoading}
                events={events}
                activities={activities}
              >
                <InterestLayout interests={interests}>
                  <Messages users={users} allChats={allChats}>
                    <ChatView users={users} allChats={allChats} />
                  </Messages>
                </InterestLayout>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <DashboardLayout
                users={users}
                allChats={allChats}
                posts={posts}
                loading={postLoading}
                events={events}
                activities={activities}
              >
                <InterestLayout interests={interests}>
                  <BottomFeedTab users={users}>
                    <FeedLayout>
                      <Notifications
                        users={users}
                        posts={posts}
                        interests={interests}
                        setInterests={setInterests}
                      />
                    </FeedLayout>
                  </BottomFeedTab>
                </InterestLayout>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <FeedLayout>
                  <BottomFeedTab users={users}>
                    <Feed posts={posts} setPosts={setPosts} users={users} />
                  </BottomFeedTab>
                </FeedLayout>
              </InterestLayout>
            </DashboardLayout>
          }
        />
        <Route
          path="/feed/following"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <FeedLayout>
                  <BottomFeedTab users={users}>
                    <Following
                      posts={posts}
                      setPosts={setPosts}
                      users={users}
                    />
                  </BottomFeedTab>
                </FeedLayout>
              </InterestLayout>
            </DashboardLayout>
          }
        />

        <Route
          path="/i/discover"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <BottomFeedTab users={users}>
                  <Discover interests={interests} />
                </BottomFeedTab>
              </InterestLayout>
            </DashboardLayout>
          }
        />
        <Route
          path="/i/mine"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <BottomFeedTab users={users}>
                  <Mine interests={interests} />
                </BottomFeedTab>
              </InterestLayout>
            </DashboardLayout>
          }
        />
        <Route
          path="/i/create"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <BottomFeedTab users={users}>
                  <Create interests={interests} />
                </BottomFeedTab>
              </InterestLayout>
            </DashboardLayout>
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
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <Interest
                  interests={interests}
                  users={users}
                  setInterests={setInterests}
                  setUsers={setUsers}
                >
                  {" "}
                  <BottomFeedTab users={users}>
                    <ChatBox interests={interests} users={users} />
                  </BottomFeedTab>
                </Interest>
              </InterestLayout>
            </DashboardLayout>
          }
        />
        <Route
          path="/i/:name/chat/:chatBoxId"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <ChatBoxView interests={interests} users={users} />
              </InterestLayout>
            </DashboardLayout>
          }
        />

        {/* <Route
          path="/i/:name/chatbox"
          element={
          // <BottomFeedTab users={users}>
              <InterestLayout interests={interests}>
                <Interest
                  interests={interests}
                  users={users}
                  setInterests={setInterests}
                  setUsers={setUsers}
                >
                  {" "}
                  <ChatBox interests={interests} />
                </Interest>
              </InterestLayout>
         //  </BottomFeedTab> 
          }
        /> */}

        <Route
          path="/i/:name/activities"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <Interest
                  interests={interests}
                  users={users}
                  setInterests={setInterests}
                  setUsers={setUsers}
                >
                  <BottomFeedTab users={users}>
                    <Activities
                      interests={interests}
                      activities={activities}
                      setActivities={setActivities}
                      users={users}
                    />
                  </BottomFeedTab>
                </Interest>
              </InterestLayout>
            </DashboardLayout>
          }
        />

        <Route
          path="/i/:name/events"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <Interest
                  interests={interests}
                  users={users}
                  setInterests={setInterests}
                  setUsers={setUsers}
                >
                  <BottomFeedTab users={users}>
                    <Events
                      interests={interests}
                      events={events}
                      setEvents={setEvents}
                      users={users}
                    />
                  </BottomFeedTab>
                </Interest>
              </InterestLayout>
            </DashboardLayout>
          }
        />
        <Route
          path="/i/:name/articles"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <Interest
                  interests={interests}
                  users={users}
                  setInterests={setInterests}
                  setUsers={setUsers}
                >
                  <BottomFeedTab users={users}>
                    <InterestArticles
                      interests={interests}
                      posts={posts}
                      setPosts={setPosts}
                      users={users}
                    />
                  </BottomFeedTab>
                </Interest>
              </InterestLayout>
            </DashboardLayout>
          }
        />
        <Route
          path="/i/:name/podcasts"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <Interest
                  interests={interests}
                  users={users}
                  setInterests={setInterests}
                  setUsers={setUsers}
                >
                  <BottomFeedTab users={users}>
                    <InterestPodcasts
                      interests={interests}
                      podcasts={podcasts}
                    />
                  </BottomFeedTab>
                </Interest>
              </InterestLayout>
            </DashboardLayout>
          }
        />

        <Route
          path="/i/:name/settings"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <AdminLayout interests={interests}>
                  <InterestSettings interests={interests} />
                </AdminLayout>
              </InterestLayout>
            </DashboardLayout>
          }
        />

        <Route
          path="/i/:name/settings/edit"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <AdminLayout interests={interests}>
                  <InterestSettings interests={interests} />
                </AdminLayout>
              </InterestLayout>
            </DashboardLayout>
          }
        />
        <Route
          path="/interest/:name"
          element={
            <DefaultLayout>
              <InterestForNonUsers interests={interests}>
                <NonUsersChatBox interests={interests} />
              </InterestForNonUsers>
            </DefaultLayout>
          }
        />
        <Route
          path="/interest/:name/activities"
          element={
            <DefaultLayout>
              <InterestForNonUsers interests={interests}>
                <NonUsersActivities interests={interests} />
              </InterestForNonUsers>
            </DefaultLayout>
          }
        />
        <Route
          path="/interest/:name/articles"
          element={
            <DefaultLayout>
              <InterestForNonUsers interests={interests}>
                <NonUsersArticles
                  interests={interests}
                  posts={posts}
                  setPosts={setPosts}
                  users={users}
                />
              </InterestForNonUsers>
            </DefaultLayout>
          }
        />
        <Route
          path="/interest/:name/podcasts"
          element={
            <DefaultLayout>
              <InterestForNonUsers interests={interests}>
                <NonUsersPodcasts interests={interests} />
              </InterestForNonUsers>
            </DefaultLayout>
          }
        />
        <Route
          path="/interest/:name/events"
          element={
            <DefaultLayout>
              <InterestForNonUsers interests={interests}>
                <NonUsersEvents interests={interests} />
              </InterestForNonUsers>
            </DefaultLayout>
          }
        />
        <Route
          path="/interest/articles"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <InterestFeed>
                  <BottomFeedTab users={users}>
                    <AllArticles
                      interests={interests}
                      posts={posts}
                      setPosts={setPosts}
                      users={users}
                    />
                  </BottomFeedTab>
                </InterestFeed>
              </InterestLayout>
            </DashboardLayout>
          }
        />
        <Route
          path="/interest/activities"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <InterestFeed>
                  <BottomFeedTab users={users}>
                    <AllActivities
                      interests={interests}
                      activities={activities}
                      setActivities={setActivities}
                      users={users}
                    />
                  </BottomFeedTab>
                </InterestFeed>
              </InterestLayout>
            </DashboardLayout>
          }
        />
        <Route
          path="/interest/podcasts"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <InterestFeed>
                  <BottomFeedTab users={users}>
                    <AllPodcasts interests={interests} podcasts={podcasts} />
                  </BottomFeedTab>
                </InterestFeed>
              </InterestLayout>
            </DashboardLayout>
          }
        />
        <Route
          path="/interest/events"
          element={
            <DashboardLayout
              users={users}
              allChats={allChats}
              posts={posts}
              loading={postLoading}
              events={events}
              activities={activities}
            >
              <InterestLayout interests={interests}>
                <InterestFeed>
                  <BottomFeedTab users={users}>
                    <AllEvents
                      interests={interests}
                      events={events}
                      setEvents={setEvents}
                      users={users}
                    />
                  </BottomFeedTab>
                </InterestFeed>
              </InterestLayout>
            </DashboardLayout>
          }
        />

        {/* settings */}
        <Route
          path="/settings/"
          element={
            <ProtectedRoute>
              <DashboardLayout
                users={users}
                allChats={allChats}
                posts={posts}
                loading={postLoading}
                events={events}
                activities={activities}
              >
                <InterestLayout interests={interests}>
                  <BottomFeedTab users={users}>
                    <Settings>
                      <Account users={users} setUsers={setUsers} />
                    </Settings>
                  </BottomFeedTab>
                </InterestLayout>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/account"
          //redirect to account prfile settings
          element={<Navigate to="/settings/account/profile" />}
        />

        <Route
          path="/settings/account/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout
                users={users}
                allChats={allChats}
                posts={posts}
                loading={postLoading}
                events={events}
                activities={activities}
              >
                <InterestLayout interests={interests}>
                  <BottomFeedTab users={users}>
                    <Settings>
                      <Account users={users} setUsers={setUsers} />
                    </Settings>
                  </BottomFeedTab>
                </InterestLayout>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/account/email-and-password"
          element={
            <ProtectedRoute>
              <DashboardLayout
                users={users}
                allChats={allChats}
                posts={posts}
                loading={postLoading}
                events={events}
                activities={activities}
              >
                <InterestLayout interests={interests}>
                  <BottomFeedTab users={users}>
                    <Settings>
                      <EmailAndPassword />
                    </Settings>
                  </BottomFeedTab>
                </InterestLayout>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/register" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<NewLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* </Route> */}
        <Route
          path="/select-interests"
          element={<SelectInterest interests={interests} />}
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
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

      <CreateModal isOpen={showCreateModal} setIsOpen={setCreateModalClose} />
      <ToastContainer />
    </div>
  );
}

export default App;
