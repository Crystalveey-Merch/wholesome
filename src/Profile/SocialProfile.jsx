/* eslint-disable react/prop-types */

// import webSVG from "../../assets/Svg/Profile/web.svg";
// import locationSVG from "../../assets/Svg/Profile/location.svg";
// import facebookSVG from "../../assets/Svg/Profile/facebook.svg";
// import twitterSVG from "../../assets/Svg/Profile/twitter.svg";
// import linkedinSVG from "../../assets/Svg/Profile/linkedin.svg";
// import instagramSVG from "../../assets/Svg/Profile/instagram.svg";
// import githubSVG from "../../assets/Svg/Profile/github.svg";
// import youtubeSVG from "../../assets/Svg/Profile/youtube.svg";

import { faGlobe, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HighlightedText } from "../Hooks";

export const SocialProfile = ({ routeUser, users }) => {
  return (
    <div className="flex flex-col gap-4 sm:gap-2 overflow-hidden">
      {routeUser?.shortBio ? (
        <div className="text-gray-700 text-base font-inter font-normal w-80">
          <HighlightedText content={routeUser.shortBio} users={users} />
        </div>
      ) : (
        <p className="text-gray-700 text-base font-normal w-80">No bio yet</p>
      )}
      <div className="flex gap-4">
        {routeUser.websiteUrl && (
          <a
            href={routeUser.websiteUrl}
            target="_blank"
            className="flex gap-2 items-center"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faGlobe} className="h-4 w-4" />
            <p className="text-blue-400 text-sm font-normal hover:underline hover:text-blue-500 transition duration-500 ease-in-out">
              {routeUser.websiteUrl.split("/")[2]}
            </p>
          </a>
        )}
        {routeUser.location && (
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4" />
            <p className="text-gray-600 text-sm font-normal font-inter">
              {routeUser.location}
            </p>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 grid-flow-row gap-2 gap-x-3 w-max">
        {routeUser.twitterLink && (
          <a
            href={routeUser.twitterLink}
            target="_blank"
            className="flex gap-2 items-center"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faXTwitter} className="h-4 w-4" />
            <p className="text-gray-600 text-sm font-normal font-inter">
              {routeUser.twitterLink.split("/")[3]}
            </p>
          </a>
        )}
        {routeUser.facebookLink && (
          <a
            href={routeUser.facebookLink}
            target="_blank"
            className="flex gap-2 items-center"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faFacebook} className="h-4 w-4" />
            <p className="text-gray-600 text-sm font-normal font-inter">
              {routeUser.facebookLink.split("/")[3]}
            </p>
          </a>
        )}
        {routeUser.linkedinLink && (
          <a
            href={routeUser.linkedinLink}
            target="_blank"
            className="flex gap-2 items-center"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedin} className="h-4 w-4" />
            <p className="text-gray-600 text-sm font-normal font-inter">
              {routeUser.linkedinLink.split("/")[4]}
            </p>
          </a>
        )}
        {routeUser.instagramLink && (
          <a
            href={routeUser.instagramLink}
            target="_blank"
            className="flex gap-2 items-center"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
            <p className="text-gray-600 text-sm font-normal font-inter">
              {routeUser.instagramLink.split("/")[3]}
            </p>
          </a>
        )}
        {routeUser.youtubeLink && (
          <a
            href={routeUser.youtubeLink}
            target="_blank"
            className="flex gap-2 items-center"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faYoutube} className="h-4 w-4" />
            <p className="text-gray-600 text-sm font-normal font-inter">
              {routeUser.youtubeLink.split("/")[3]}
            </p>
          </a>
        )}
      </div>
    </div>
  );
};
