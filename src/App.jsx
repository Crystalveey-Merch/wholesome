import "./App.css";
import Header from "./Header";
import Homepage from "./Home/Homepage";
import Footer from "./Footer";
import { Route, Routes } from "react-router";
import Account from "./Account";
import Aboutus from "./Aboutus";
import Whatwedo from "./Whatwedo";
import { useEffect } from "react";
import Login from "./Accunts/Login";
import Signip from "./Accunts/Signip";
import EventList from "./Events/EventList";
import EventDes from "./Events/EventDes";
import HostEvent from "./Events/HoseEvent";
import Articles from "./Articles/Articles";
import Podcast from "./Podcast/Podcast";
import Activity from "./Activity/ActivityDes";
import Interest from "./Interest/Interest";
import CreatePost from "./CreatePost/CreatePost";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./firebase/ProtectedRouteProps";
import ArticleList from "./Articles/ArticleList";
import ReadMore from "./Articles/ReadMore";
import MyInterest from "./MyInterest/MyInterest";
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Dashboard/Profile";
import MyPosts from "./Dashboard/MyPosts";
import Statistics from "./Dashboard/Statistics";
import "hover.css"
import TagPosts from "./Articles/TagPosts";
import CategoryPosts from "./Articles/CollectionPosts.";
import Bookmarks from "./Dashboard/Bookmarks";
import ActivityForm from "./Activity/ActivityForm";
import Drafts from "./Dashboard/Drafts";
import Profilepage from "./Dashboard/Profilepage";
import ArticleInterest from "./MyInterest/ArticleInterest";
import EventsInterest from "./MyInterest/EventsInterest";
import PodcastAdmin from "./Podcast/PodcastAdmin";
import { FollowersFeed } from "./MyInterest/FollowersFeed";
import Admin from "./Admin/Admin";
import Allarticles from "./Admin/Allarticles";
import Users from "./Admin/Users";
import Settings from "./Dashboard/Settings";
import ActivityInterest from "./MyInterest/ActivityInterest";
import Podcasts from "./Admin/Podcasts";
import AllActivity from "./Admin/AllActivity";
import PodcastInterest from "./MyInterest/PodcastInterest";
import MyEvents from "./Dashboard/MyEvents";

// import "@fortawesome/fontawesome-free"

function App() {
    // Scroll to the section based on the hash in the URL
    
  return (
    <div className="">
      <Header />
      <Routes>
        <Route path="/aboutus" element={<Aboutus />} />

        <Route path="/whatwedo" element={<Whatwedo />} />

        <Route path="/" element={<Homepage />} />

        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signip />} />
        <Route path="/upcomingevents" element={<EventList />} />
        <Route path="/hostevent" element={
        <ProtectedRoute>
        <HostEvent />
          </ProtectedRoute>}
         />

        <Route path="/article/:articleName" element={<Articles />} />
        <Route path="/activity/:id" element={<Activity />} />
        <Route path="/activity/adminform" element={<ActivityForm />} />

        <Route path="/podcast/adminform" element={<PodcastAdmin />} />

        <Route path="/interest/:interestName" element={<Interest />} />

        <Route path="/upcomingevents/:id" element={<EventDes />} />
        <Route path="/podcast" element={<Podcast />} />
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

        <Route path="/articlelist" element={<ArticleList />} />
        <Route path="/articletag/:tag" element={<TagPosts />} />
        <Route path="/articlecategory/:category" element={<CategoryPosts />} />

        <Route path="/readmore/:id" element={<ReadMore />} />
        <Route path="/myinterest" element={<MyInterest />}>
        <Route path="/myinterest/articles" element={<ArticleInterest/>} />
        <Route path="/myinterest/events" element={<EventsInterest/>} />

        <Route path="/myinterest/activities" element={<ActivityInterest/>} />
        <Route path="/myinterest/feeds" element={<FollowersFeed/>} />

        <Route path="/myinterest/podcast" element={<PodcastInterest/>} />




        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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


        <Route
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




        </Route>
      </Routes>
    
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
