import { faSpotify, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faPodcast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import Spinner from "../components/Spinner.tsx";
import { db } from "../firebase/auth.js";
import { Helmet } from "react-helmet-async";

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
  }, []);
  console.log(podcast);

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <Helmet>
        <title>Wholesquare Podcast</title>
        <meta
          name="description"
          content="Wholesquare is creating a digital nation where Africans and the diaspora can build abundant lives. On the Wholesquare Podcast, we continue the African tradition of oral storytelling to preserve our history, knowledge, and achievements. "
        />
        <link rel="canonical" href="/podcast" />
      </Helmet>
      <div className="mt-20 sm:mt-18 w-screen">
        <div className="relative">
          <img src="/Images/modern-microphone.jpeg" className="sm:w-full"></img>
          <div className=" absolute sm:relative sm:top-0 sm:px-5 top-40 px-20 flex flex-col gap-5 sm:gap-2">
            <h1 className="text-white sm:text-black sm:w-full text-8xl w-40 sm:text-center sm:text-5xl">
              THE WHOLESQUARE PODCAST
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
              Why Wholesquare Podcast?
            </h1>
            <p className="px-60 sm:px-5 py-10 text-xl text-center text-gray-200">
              Wholesquare is creating a digital nation where Africans and the
              diaspora can build abundant lives. On the Wholesquare Podcast, we
              continue the African tradition of oral storytelling to preserve
              our history, knowledge, and achievements. We extract blueprints of
              fearlessness and innovation from Wholesquare citizens building the
              future of a bold and progressive nation. Through in-depth
              interviews with Wholesquare citizens, we delve into their stories,
              their struggles, and their triumphs. We explore the challenges
              they have faced and the solutions they have found to overcome
              them. Our goal is to inspire and empower Afropolitans to reclaim
              their abundance and build the future they want to see. Join us as
              we challenge the status quo, question the norm, and create a new
              narrative for the Wholesquare. Listen to the Wholesquare Podcast and
              be a part of building the future of a bold and progressive nation.
            </p>
          </div>
          <div className="bg-gray-100">
            <h1 className="text-4xl text-center py-5 text-black ">
              Our recent Episodes
            </h1>

            <div className="py-5  flex flex-wrap px-20 sm:w-full sm:px-5  gap-4  justify-center">
              {podcast?.map((item) => (
                <div
                  key={item.key}
                  className="flex flex-col gap-4 bg-gray-800 h-56 "
                >
                  <div
                    key={item.id}
                    className=" relative flex rounded-xl shadow w-96 sm:w-full"
                  >
                    <div className=" relative w-40 overflow-clip p-2  rounded-xl ">
                      <img
                        src={item.imageUrl}
                        className="absolute  hover:scale-125  m-auto  transition duration-300 ease-in-out"
                      ></img>
                    </div>
                    <div className=" p-4">
                      <p className="text-white Aceh text-2xl sm:text-xl">
                        {item.podcastName}{" "}
                      </p>
                      <p className="text-gray-300   ">{item.category} </p>

                      <div className="flex  gap-2">
                        <a href={item.spotify}>
                          <FontAwesomeIcon
                            icon={faSpotify}
                            className=" text-2xl text-gray-500 hover:text-gray-200 cursor-pointer hover:scale-125 transition duration-300 ease-in-out"
                          />
                        </a>
                        <a href={item.youtube}>
                          <FontAwesomeIcon
                            icon={faYoutube}
                            className="text-2xl text-gray-500 hover:text-gray-200 cursor-pointer hover:scale-125 transition duration-300 ease-in-out"
                          />{" "}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="px-5">
                    <audio
                      className="w-full h-10 "
                      src={item.audioUrl}
                      controls
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Podcast;
