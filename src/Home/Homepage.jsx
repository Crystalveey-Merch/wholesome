/* eslint-disable react/prop-types */
// import Sectiom2 from "./Sectiom2";
// import Section3 from "./Section3";
// import Section4 from "./Section4";
// import Section1plus from "./Section1plus";
// import Section2first from "./Section2first";
// import Section2new from "./Section2new";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";
import { NewHome } from ".";
import { DashboardLayout, DefaultLayout } from "../Layouts";
import { Layout, Feed } from "../Interest";
import { AllChatBox } from "../Interest/AllInterest";
import { BottomFeedTab } from "../components/Feed";

const Homepage = ({
  users,
  posts,
  setPosts,
  postLoading,
  events,
  activities,
  interests,
  allChats,
}) => {
  const user = useSelector(selectUser);

  return (
    <>
      <Helmet>
        <title>Wholesquare</title>
        <meta
          name="description"
          content="Wholesquare helps foster connections with like-minds that transcends borders and also share your experiences, knowledge and creativity"
        />
        <link rel="canonical" href="https://Wholesquare.crystalveey.com/" />
        <meta
          name="keywords"
          content="Wholesquare, Crystalveey,
         , Blog article, Blog, writing, Business, marketing, Technology, Fashion, Nutrition, Food, Art, Travel and Adventure, Game and sports, Book club, Environmental and Sustainability"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Wholesquare" />
        <meta property="og:url" content="https://Wholesquare.org" />
        {/* <meta property="og:image" content={posts} /> */}
        <meta
          name="og:description"
          content="Wholesquare helps foster connections with like-minds that transcends borders and also share your experiences, knowledge and creativity"
        />
        <meta name="og:site_name" content="Wholesquare" />
        <meta name="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://Wholesquare.org" />
        <meta name="twitter:title" content="Article List" />
        <meta
          name="twitter:description"
          content="Wholesquare helps foster connections with like-minds that transcends borders and also share your experiences, knowledge and creativity"
        />
        {/* <meta name="twitter:image" content="../../public/20231116_210104-removebg-preview.png" /> */}

        <script
          type="application/ld+json"
          {...JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: "Article List",
            url: "https://Wholesquare.org",

            // "image": {posts.imgUrl},

            publisher: {
              "@type": "Organization",
              name: "Wholesquare",
              logo: {
                "@type": "ImageObject",
                url: "",
              },
            },
            // "datePublished": `${posts.timestamp?.toDate()?.toDateString()}`,
          })}
        />
      </Helmet>
      {user ? (
        <DashboardLayout
          users={users}
          allChats={allChats}
          posts={posts}
          loading={postLoading}
          events={events}
          activities={activities}
        >
          <Layout interests={interests}>
            <BottomFeedTab users={users}>
              <Feed>
                <AllChatBox interests={interests} users={users} />
              </Feed>
            </BottomFeedTab>
          </Layout>
        </DashboardLayout>
      ) : (
        <DefaultLayout>
          <NewHome
            users={users}
            posts={posts}
            setPosts={setPosts}
            loading={postLoading}
            events={events}
            activities={activities}
            interests={interests}
          />
        </DefaultLayout>
        // <div className="h-full  w-screen pt-20 sm:pt-14  bg-stone-100">
        //   <Section1 />
        //   <Section1plus />

        //   <Section2new
        //     users={users}
        //     posts={posts}
        //     postId={postId}
        //     loading={postLoading}
        //   />
        //   <Section4 events={events} loading={eventLoading} />

        //   <Section2first activities={activities} />

        //   <Section3 />
        // </div>
      )}
    </>
  );
};

export default Homepage;
