import { faSpotify, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faMicrophone, faPodcast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  DocumentSnapshot,
  endAt,
  endBefore,
  getDocs,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  deleteField,
  where,
  increment,
} from "firebase/firestore";
import Spinner from "../components/Spinner.tsx";
import { auth, db } from "../firebase/auth.js";

const Podcast = () => {
  const [loading, setLoading] = useState(false);
  const [podcast, setPodcast] = useState([]);

 
  useEffect(() => {
    const fetchPodcast = async () => {
      setLoading(true);

      try {
        const querySnapshot = await getDocs(collection(db, "podcast"));
        const podcastData = [];
        const postIds = [];
        // const postIds = []; // Create an array to store post IDs

        querySnapshot.forEach((doc) => {
          const post = doc.data();
          post.id = doc.id;
          podcastData.push(post);
          postIds.push(doc.id); // Collect post IDs in the array
        });
        
        // Set the postId state with the collected post IDs
        
        // setPostId(postIds);
    
        setPodcast(podcastData);


       

       
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPodcast([]);
      }
    };


    fetchPodcast();
  },[] );
  console.log(podcast)

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="mt-20 sm:mt-18 w-screen">
      <div className="relative">
        <img src="/Images/modern-microphone.jpeg" className="sm:w-full"></img>
        <div className=" absolute sm:relative sm:top-0 sm:px-5 top-40 px-20 flex flex-col gap-5 sm:gap-2">
          <h1 className="text-white sm:text-black sm:w-full text-8xl w-40 sm:text-center sm:text-5xl">
            THE WHOLESOME PODCAST
          </h1>
          <p className="text-2xl text-gray-500 Aceh sm:text-xl sm:text-center">
            Hosted By:
          </p>
          <p className="text-4xl text-red-500 Aceh sm:text-2xl sm:text-center">
            {" "}
            Victoria Evelyn
          </p>
          <div className="flex gap-5 sm:gap-0">
            <div className="border p-5  rounded-2xl text-2xl flex text-gray-300 m-auto gap-4">
              <FontAwesomeIcon icon={faSpotify} className="m-auto" />
              <h1 className="text-2xl m-auto sm:hidden ">Spotify</h1>
            </div>
            <div className="border p-5  rounded-2xl text-2xl flex text-gray-300 m-auto gap-4">
              <FontAwesomeIcon icon={faPodcast} className="m-auto" />
              <h1 className="text-2xl m-auto sm:hidden  ">Apple Podcast</h1>
            </div>
            <div className="border p-5  rounded-2xl text-2xl flex text-gray-300 m-auto gap-4">
              <FontAwesomeIcon icon={faYoutube} className="m-auto" />
              <h1 className="text-2xl m-auto sm:hidden  ">Youtube</h1>
            </div>
          </div>
        </div>
        <div className="py-20 bg-gradient-to-b from-gray-900 to-gray-600 bg-gradient-to-r">
          <h1 className="text-4xl text-center text-white">
            Why Wholesome Podcast?
          </h1>
          <p className="px-60 sm:px-5 py-10 text-xl text-center text-gray-200">
            Wholesome is creating a digital nation where Africans and the
            diaspora can build abundant lives. On the Wholesome Podcast, we
            continue the African tradition of oral storytelling to preserve our
            history, knowledge, and achievements. We extract blueprints of
            fearlessness and innovation from Wholesome citizens building the
            future of a bold and progressive nation. Through in-depth interviews
            with Wholesome citizens, we delve into their stories, their
            struggles, and their triumphs. We explore the challenges they have
            faced and the solutions they have found to overcome them. Our goal
            is to inspire and empower Afropolitans to reclaim their abundance
            and build the future they want to see. Join us as we challenge the
            status quo, question the norm, and create a new narrative for the
            Wholesome. Listen to the Wholesome Podcast and be a part of building
            the future of a bold and progressive nation.
          </p>
        </div>
        <div className="bg-gray-100">
          <h1 className="text-4xl text-center py-5 text-black ">
            Our recent Episodes
          </h1>

          <div className="py-5  flex flex-wrap mx-20 sm:mx-5 gap-10 justify-center">
          {podcast?.map((item) => (

            <div key={item.id}
            dangerouslySetInnerHTML={{
    __html: `
     ${item.spotify}
    `,}}
            />
          ))}
          <div
  dangerouslySetInnerHTML={{
    __html: `
      <iframe
        style="border-radius: 12px"
        src="https://open.spotify.com/embed/track/1AhDOtG9vPSOmsWgNW0BEY?utm_source=generator"
        width="100%"
        height="352"
        frameBorder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    `,
  }}
/>

            <div>
              <iframe
                style={{ borderRadius: "12px" }}
                src="https://open.spotify.com/embed/episode/7rDpsdkTIIWrpKbA0jQhz4?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allowfullscreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
            <div>
              <iframe
                style={{ bordeRadius: "12px" }}
                src="https://open.spotify.com/embed/track/4jDt1y2gCPiqC3PgWuzLjW?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allowfullscreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
            <div>
              <iframe
                style={{ borderRadius: "12px" }}
                src="https://open.spotify.com/embed/track/5MxNLUsfh7uzROypsoO5qe?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allowfullscreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
            <div>
              <iframe
                style={{ borderRadius: "12px" }}
                src="https://open.spotify.com/embed/track/371VkfwKiXJxgH5ZPoQNHD?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allowfullscreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Podcast;
