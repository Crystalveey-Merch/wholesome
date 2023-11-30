import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { events } from "../data/events";
import { articles } from '../data/artucles';
import { activities } from '../data/activity';
import { NavLink } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/auth'; 
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faCalendar,
  faComment,
  faEye,
  faHands,
  faLocation,
  faLocationPin,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
import Moment from "moment";


const Interest = () => {

    const { interestName } = useParams();
    const [event, setEvent] = useState(null);
    const [article, setArticle] = useState(null);
    const [activity, setActivity] = useState(null);

    const [eventsData, setEventsData] = useState([]);
    const [activitiesData, setActivitiesData] = useState([]);
    const [postsData, setPostsData] = useState([]);

    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
      const listen = onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuthUser(user);
        } else {
          setAuthUser(null);
        }
      });
  
      return () => {
        listen();
      };
    }, []);
    const userId = authUser?.uid;

    useEffect(() => {
      // if (interestName) {
        // Query the 'events' collection based on the selected category
        const eventsRef = collection(db, 'events');
        const eventsQuery = query(eventsRef, where('category', '==', interestName));
        getAndSetData(eventsQuery, setEventsData);
  

        // Query the 'activities' collection in a similar way
        const activitiesRef = collection(db, 'activities');
        const activitiesQuery = query(activitiesRef, where('category', '==', interestName));
        getAndSetData(activitiesQuery, setActivitiesData);
  
        // Query the 'posts' collection in a similar way
        const postsRef = collection(db, 'posts');
        const postsQuery = query(postsRef, where('category', '==', interestName));
        getAndSetData(postsQuery, setPostsData);
      }
    , [interestName]);
  
    const getAndSetData = (query, setDataFunction) => {
      getDocs(query)
        .then((querySnapshot) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            const postData = doc.data();
            postData.id = doc.id; // Include doc.id in the data
            data.push(postData);
          });
          setDataFunction(data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    };
    

    console.log(postsData)
    console.log(interestName)
    console.log(activitiesData)

    const breakpoints = {
        300: {
          slidesPerView: 1,
          spaceBetween: 5,
        },
        639: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 10,
          centeredSlides: true,
        },
      };
      const handleReadMoreClick = async () => {
        try {
          // Fetch the specific post based on postId
          const postDocRef = doc(db, "posts", eventsData.postId);
          const postDoc = await getDoc(postDocRef);
      
          if (postDoc.exists()) {
            let updatedViewers;
      
            if (userId) {
              // If userId exists, add it to the viewers array
              updatedViewers = [...postDoc.data().views, userId];
            } else {
              // If userId doesn't exist, pass an empty array
              updatedViewers = [];
            }
      
            await updateDoc(postDocRef, { views: updatedViewers });
          }
        } catch (error) {
          console.error("Error updating post document:", error);
        }
      };
      const excerpt = (str, count) => {
        if (str && str.length > count) {
          str = str.substring(0, count) + " ... ";
        }
        return str;
      };
    
      const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      };
   
    

  return (
    <><Helmet>
      <title>{interestName}</title>
      <meta name="description" property="og:description" content={`View contents based on ${interestName}`} />
        <meta
          name="keywords"
          content={`${interestName}, Acivities, Podcasts, Articles `}
        />
         <meta name="url" content={`http://wholesome.crystaleey.com/interest/${interestName}`} />
         <meta name="robots" content="index, follow" />
        <meta property="og:type" content="article" />
        <link rel=" canonical" href={`http://wholesome.crystaleey.com/interest/${interestName}`} />
        <meta property="og:title" content={interestName} />
        <meta property="og:url" content={`http://wholesome.crystaleey.com/interest/${interestName}`}/>
        {/* <meta property="og:image" content={post.imgUrl} /> */}
        <meta name="og:description" content={`View contents based on ${interestName}`} />
        <meta name="og:site_name" content="Wholesome" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`http://wholesome.crystaleey.com/interest/${interestName}`} />
        <meta name="twitter:title" content={interestName} />
        <meta name="twitter:description" content={`View contents based on ${interestName}`}/>
        {/* <meta name="twitter:image" content="../../public/20231116_210104-removebg-preview.png" /> */}

  <script
  type="application/ld+json"
    {...JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": `${interestName}`,
      url:`http://wholesome.crystaleey.com/interest/${interestName}`,

      // "image": `${post.imgUrl}`,
      "author": {
        "@type": "Person",
        "name": `Wholesome`,
      },
      "publisher": {
        "@type": "Organization",
        "name": "Wholesome",
        "logo": {
          "@type": "ImageObject",
          "url": "",
        },
      },
      // "datePublished": `${post.timestamp?.toDate()?.toDateString()}`,
    })}
  />
    </Helmet>
    <div className="mt-20 w-screen  sm:mt-18 bg-gray-100 ">
        <div className='bg-gradient-to-r from-indigo-300 to-purple-400 w-screen'>
          <h1 className='text-white text-center uppercase Aceh text-3xl sm:text-2xl py-10'>{interestName}</h1>
        </div>
        <div className="flex justify-center  sm:flex-col">
          <div>
            <div className='py-5'>
              <h1 className=' text-gray-500 text-xl  capitalize text-center py-5'>Articles/Publications</h1>
              <hr></hr>

            </div>
            <div className='flex flex-wrap gap-5 justify-center'>
              {postsData.length > 0 ? (
                postsData.map((post) => {
                  return (
                    <NavLink
                      to={`/readmore/${post.id}`}
                      onClick={handleReadMoreClick}
                      key={post.id}
                      className="hover:border p-5 hover:bg-red-100/50 hover:rounded-xl transition duration-300 ease-in-out"
                    >
                      <div key={post.id} className="w-80 bg-white   rounded-xl p-2 shadow ">
                        <div className="relative overflow-clip  h-40 sm:w-40">
                          <img src={post.imgUrl} height={200} className="p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out " />

                        </div>
                        <div className="px-5 sm:p-0">
                          <p className="badge bg-red-500 p-4 my-2  top-5 text-gray-100  sm:hidden border-none ">
                            {post.category}
                          </p>
                          <p className="mt-1 text-sm leading-5 text-red-300 border-b Aceh">
                            {post.timestamp.toDate().toDateString()} at{" "}
                            {formatTime(post.timestamp.toDate())}
                          </p>
                          <h2 className="Aceh text-xl py-2 text-black ">
                            {post.postTitle}
                          </h2>


                          <p className="h-14 text-gray-800 sm:hidden">
                            {excerpt(post.postDescription, 50)}
                          </p>
                          <span className="text-xl flex gap-5 ">
                            <FontAwesomeIcon
                              icon={faComment}
                              className="text-gray-500 my-auto " />{" "}
                            {post.comments.length}
                            <FontAwesomeIcon
                              icon={faThumbsUp}
                              className="text-gray-500 my-auto " />{" "}
                            {post.likes.length}
                            <FontAwesomeIcon
                              icon={faEye}
                              className="text-gray-500 my-auto " />{" "}
                            {post.views ? post.views.length : 0}
                            {/* <FontAwesomeIcon
                      onClick={handleAddBookmark}
                      icon={faBookmark}
                      style={buttonStyle}
                      className="my-auto "
                    />{" "}
                    {bookmarkCount} */}
                          </span>
                        </div>
                      </div>
                    </NavLink>

                  );
                })
              ) : (
                <div className="text-center text-2xl font-bold text-gray-500 mt-4 h-48">
                  No Posts found matching your search.
                </div>
              )}
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-300 via-red-200 to-yellow-100  mx-5">
            <div className='py-5'>
              <h1 className=' text-gray-500 text-xl  capitalize text-center py-5'> Events</h1>
              <hr></hr>
            </div>

            <div className='flex flex-wrap gap-5  sm:px-5'>
              {eventsData.length > 0 ? (
                eventsData.map((event) => {
                  return (
                    <div
                      key={event.id}
                      className="w-80 bg-gradient-to-r from-fuchsia-600 to-pink-600   shadow  dark:border-gray-700 rounded-xl"
                    >
                      <NavLink to={`/upcomingevents/${event.id}`}>
                        <div className="relative overflow-clip  h-40 ">
                          <img
                            src={event.imgUrl}
                            height={200}
                            className="p-2 absolute overflow-hidden hover:scale-125 transition duration-300 ease-in-out " />
                        </div>


                        <div className="p-5">
                          <div className="badge p-4 ">{event.category}</div>
                          <p className="m-3 font-normal text-md  text-gray-100 ">
                            <FontAwesomeIcon icon={faLocationPin} /> {event.address}
                          </p>
                          <h5 className="mb-2 text-xl  font-bold tracking-tight text-gray-100 Aceh">
                            {event.eventName}
                          </h5>

                          <p className="mb-1 font-normal text-md Aceh text-red-500 dark:text-red-500">
                            {event.date}
                          </p>

                          <p
                            className="mb-3 font-normal Aceh text-md text-black"
                          >
                            {event.organizerName}
                          </p>
                        </div>
                      </NavLink>

                    </div>
                  );
                })
              ) : (
                <div className="text-center text-2xl font-bold text-gray-500 mt-4 h-48">
                  No events found matching your search.
                </div>
              )}
            </div></div>
        </div>
        <div className='py-5'>
          <h1 className=' text-gray-500 text-xl  capitalize text-center my-5'>Community Activity</h1>
          <hr></hr>

        </div>
        <div className="  m-auto justify-center flex m-auto ">
          <Swiper
            slidesPerView={"auto"}
            centeredSlides={true}
            watchSlidesProgress
            navigation={true}
            grabCursor={true}
            spaceBetween={30}
            loop={true}
            breakpoints={breakpoints}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper w-full  mx-10 sm:mx-0 py-10 sm:px-10 lg:px-10"
          >
            {activitiesData.length > 0 ? (
              activitiesData.map((activity) => {
                return (
                  <SwiperSlide key={activity.id}>
                    <NavLink to={`/activity/${activity.id}`}>
                      <div className="relative w-72  bg-gray-800 rounded-xl  shadow-xl  image-full">
                        <figure>
                          <img src={activity.imgUrl} />
                        </figure>
                        <div className='p-5 bg-base-500'>
                          <p className="text-gray-100 flex  gap-4"><FontAwesomeIcon icon={faLocationPin} />{activity.location} </p>
                          <p className="text-gray-100 flex  gap-4  "><FontAwesomeIcon icon={faHands} className="p-2 rounded-full border" /> {activity.claps} Claps</p>
                          <div className="badge text-gray-200 bg-gray-600 p-4 my-3 flex gap-4 ">   <FontAwesomeIcon icon={faCalendar} />{" "}{Moment(activity.DateTime).format("DD-MM-YYYY")} - {Moment(activity.DateTime).format(" hh:mm a")}</div>
                          <h1 className="text-2xl py-2 text-gray-200"> {activity.activityName}</h1>
                        </div>
                      </div>

                    </NavLink>
                  </SwiperSlide>
                );
              })
            ) : (
              <div className="text-center text-2xl font-bold text-gray-500  ">
                No Activity found
              </div>
            )}


          </Swiper>
        </div>
      </div></>
  )
}

export default Interest