/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  convertForURL,
  handleFormatTimestampToDate2,
  HighlightedText,
} from "../Hooks";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { faSpotify, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faRssSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import appleImg from "./assets/apple_podcasts.png";
import googlePod from "./assets/google-podcasts-svgrepo-com.svg";

export const Podcast = ({ podcasts, users }) => {
  const { podcastTitle } = useParams();
  const [podcast, setPodcast] = useState(null);

  useEffect(() => {
    if (!podcastTitle) return;
    const podcast = podcasts.find(
      (podcast) => convertForURL(podcast.title) === podcastTitle
    );
    setPodcast(podcast);
  }, [podcastTitle, podcasts]);

  if (!podcast)
    return (
      <div className="flex justify-center flex-col items-center h-[400px] gap-5">
        <h4 className="text-3xl font-semibold text-gray-900">
          Podcast not found
        </h4>
      </div>
    );

  return (
    <div className="w-full max-w-5xl min-h-[80vh] px-16 pt-14 pb-20 flex flex-col justify-start gap-20 lg:px-8 md:px-6 sm:px-4">
      <div className="flex gap-6 items-center lg:gap-5 md:flex-col md:justify-center md:text-center">
        <img
          src={podcast?.logo}
          alt={podcast?.title}
          className="w-[250px] object-cover h-[250px] min-h-[250px] min-w-[250px] rounded md:w-[200px] md:h-[200px] md:min-h-[200px] md:min-w-[200px] sm:w-[200px] sm:h-[180px] sm:min-h-[180px] sm:min-w-[200px]"
        />
        <div className="flex flex-col gap-3.5 items-start md:items-center md:gap-4">
          <div className="flex flex-col gap-1.5 sm:gap-1">
            <h2 className="text-2xl text-black font-semibold lg:text-[1.3rem] sm:text-xl">
              {podcast.title}
            </h2>
            <p className="text-sm text-gray-500 font-medium sm:text-xs">
              By {podcast.owner}
            </p>
          </div>
          <div className="text-[rgb(60,64,67)] font-normal text-sm sm:text-[0.85rem]">
            <HighlightedText content={podcast.description} users={users} />
          </div>
          <div className="flex gap-6 items-center md:w-max">
            <button>
              <img src={googlePod} alt="Google Podcasts" className="h-8 w-8" />
            </button>
            <button>
              <img src={appleImg} alt="Apple Podcasts" className="h-6 w-6" />
            </button>
            <button>
              {" "}
              <FontAwesomeIcon
                icon={faSpotify}
                className="h-7 w-7 text-green-500 bgblack"
              />
            </button>
            <button>
              <FontAwesomeIcon
                icon={faYoutube}
                className="h-7 w-7 text-red-600 bgblack"
              />
            </button>
            <button>
              <FontAwesomeIcon
                icon={faRssSquare}
                className="h-7 w-7 text-orange-500 bgblack"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 sm:pb-20">
        <h3 className="text-xl font-semibold text-black">Episodes</h3>
        {podcast.episodes.map((episode) => (
          <Link
            to={`/pod/${convertForURL(podcast.title)}/episodes/${convertForURL(
              episode.title
            )}`}
            key={episode.id}
            className="flex flex-col gap-2"
          >
            <div>
              <p className="text-xs text-gray-500 font-medium inline-flex gap-2">
                <span>{handleFormatTimestampToDate2(episode.createdAt)}</span>
                <span>•</span>
                <span className="text-black">Episode 1 </span>
              </p>
              <h4 className="text-base font-semibold text-black">
                {episode.title}
              </h4>
            </div>
            <p className="text-sm text-gray-500 font-medium">...</p>
            <AudioPlayer
              // autoPlay
              src={episode.audioUrl}
              // onPlay={(_e) => console.log("onPlay")}
              layout="horizontal-reverse"
              showJumpControls={false}
              className="max-w-[400px]"
              // other props here
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
