import { faSpotify, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faMicrophone, faPodcast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Podcast = () => {
  return (
    <div className="mt-20 sm:mt-18 w-screen">
      <div className="relative">
        <img
          src="src/Podcast/modern-microphone.jpeg"
          className="sm:w-full"
        ></img>
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
        <div className="py-10">
          <h1 className="text-4xl text-center text-black">Why Wholesome Podcast?</h1>
          <p className="px-60 sm:px-5 py-10 text-xl text-gray-800">
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
            Wholesome. Listen to the Wholesome Podcast and be a part of
            building the future of a bold and progressive nation.
          </p>
        </div>
        <div className="bg-red-100">
          <h1 className="text-4xl text-center py-5 text-black ">Our recent Episodes</h1>

          <div className="py-5  flex flex-wrap mx-20 sm:mx-5">
            <div className=" flex w-auto sm:flex-col   gap-4  p-2 m-auto justify-center">
              <div className="avatar">
                <div className="border border-4 border-red-500 border-double   h-fit p-4 rounded-full absolute -top-4 bg-white -left-3">
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className=" text-red-600"
                  />
                </div>
              </div>
              <div className="h-full flex flex-col shadow-2xl  shadow gap-2 border border-2xl bg- rounded py-10 rounded-lg bg-red-500  p-2">
                <p className=" w-64 text-white Aceh text-2xl">
                  How to Travel Abroad With Daniel
                </p>
                <p className="text-white ">May, 17, 2023 . 20min</p>
              </div>
            </div>
            <div className=" flex w-auto sm:flex-col   gap-4  p-2 m-auto justify-center">
              <div className="avatar">
                <div className="border border-4 border-red-500 border-double   h-fit p-4 rounded-full absolute -top-4 bg-white -left-3">
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className=" text-red-600"
                  />
                </div>
              </div>
              <div className="h-full flex flex-col shadow-2xl  shadow gap-2 border border-2xl bg- rounded py-10 rounded-lg bg-red-500  p-2">
                <p className=" w-64 text-white Aceh text-2xl">
                  How to Travel Abroad With Daniel
                </p>
                <p className="text-white ">May, 17, 2023 . 20min</p>
              </div>
            </div>
            <div className=" flex w-auto sm:flex-col   gap-4  p-2 m-auto justify-center">
              <div className="avatar">
                <div className="border border-4 border-red-500 border-double   h-fit p-4 rounded-full absolute -top-4 bg-white -left-3">
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className=" text-red-600"
                  />
                </div>
              </div>
              <div className="h-full flex flex-col shadow-2xl  shadow gap-2 border border-2xl bg- rounded py-10 rounded-lg bg-red-500  p-2">
                <p className=" w-64 text-white Aceh text-2xl">
                  How to Travel Abroad With Daniel
                </p>
                <p className="text-white ">May, 17, 2023 . 20min</p>
              </div>
            </div>
            <div className=" flex w-auto sm:flex-col   gap-4  p-2 m-auto justify-center">
              <div className="avatar">
                <div className="border border-4 border-red-500 border-double   h-fit p-4 rounded-full absolute -top-4 bg-white -left-3">
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className=" text-red-600"
                  />
                </div>
              </div>
              <div className="h-full flex flex-col shadow-2xl  shadow gap-2 border border-2xl bg- rounded py-10 rounded-lg bg-red-500  p-2">
                <p className=" w-64 text-white Aceh text-2xl">
                  How to Travel Abroad With Daniel
                </p>
                <p className="text-white ">May, 17, 2023 . 20min</p>
              </div>
            </div>
            <div className=" flex w-auto sm:flex-col   gap-4  p-2 m-auto justify-center">
              <div className="avatar">
                <div className="border border-4 border-red-500 border-double   h-fit p-4 rounded-full absolute -top-4 bg-white -left-3">
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className=" text-red-600"
                  />
                </div>
              </div>
              <div className="h-full flex flex-col shadow-2xl  shadow gap-2 border border-2xl bg- rounded py-10 rounded-lg bg-red-500  p-2">
                <p className=" w-64 text-white Aceh text-2xl">
                  How to Travel Abroad With Daniel
                </p>
                <p className="text-white ">May, 17, 2023 . 20min</p>
              </div>
            </div>
            <div className=" flex w-auto sm:flex-col   gap-4  p-2 m-auto justify-center">
              <div className="avatar">
                <div className="border border-4 border-red-500 border-double   h-fit p-4 rounded-full absolute -top-4 bg-white -left-3">
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className=" text-red-600"
                  />
                </div>
              </div>
              <div className="h-full flex flex-col shadow-2xl  shadow gap-2 border border-2xl bg- rounded py-10 rounded-lg bg-red-500  p-2">
                <p className=" w-64 text-white Aceh text-2xl">
                  How to Travel Abroad With Daniel
                </p>
                <p className="text-white ">May, 17, 2023 . 20min</p>
              </div>
            </div>
            <div className=" flex w-auto sm:flex-col   gap-4  p-2 m-auto justify-center">
              <div className="avatar">
                <div className="border border-4 border-red-500 border-double   h-fit p-4 rounded-full absolute -top-4 bg-white -left-3">
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className=" text-red-600"
                  />
                </div>
              </div>
              <div className="h-full flex flex-col shadow-2xl  shadow gap-2 border border-2xl bg- rounded py-10 rounded-lg bg-red-500  p-2">
                <p className=" w-64 text-white Aceh text-2xl">
                  How to Travel Abroad With Daniel
                </p>
                <p className="text-white ">May, 17, 2023 . 20min</p>
              </div>
            </div>
            <div className=" flex w-auto sm:flex-col   gap-4  p-2 m-auto justify-center">
              <div className="avatar">
                <div className="border border-4 border-red-500 border-double   h-fit p-4 rounded-full absolute -top-4 bg-white -left-3">
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className=" text-red-600"
                  />
                </div>
              </div>
              <div className="h-full flex flex-col shadow-2xl  shadow gap-2 border border-2xl bg- rounded py-10 rounded-lg bg-red-500  p-2">
                <p className=" w-64 text-white Aceh text-2xl">
                  How to Travel Abroad With Daniel
                </p>
                <p className="text-white ">May, 17, 2023 . 20min</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Podcast;
