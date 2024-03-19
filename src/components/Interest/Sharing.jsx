/* eslint-disable react/prop-types */
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faXTwitter,
  faWhatsapp,
  faTelegram,
  faLinkedin,
  faReddit,
} from "@fortawesome/free-brands-svg-icons";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  RedditShareButton,
  TelegramShareButton,
} from "react-share";
import { toast } from "react-toastify";

export const Sharing = ({ url }) => {
  const copyToClipboard = (url) => {
    navigator.clipboard
      .writeText(url) // Writes the URL to the clipboard
      .then(() => {
        // Executes if the URL is successfully copied
        toast.success("Link copied to clipboard"); // Displays success toast
      })
      .catch((error) => {
        // Executes if there's an error while copying
        console.error("Failed to copy link: ", error); // Logs the error
        toast.error(error); // Displays error toast
      });
  };

  return (
    <div className="w-full z-20 max-w-sm px2.5">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? "text-gray-900" : "text-black"}
                group inline-flex text-black bg-gray-200 px-4 py-2  gap-2.5 items-center rounded-lg transition duration-300 ease-in-out hover:bg-gray-300 md:py-2`}
            >
              {" "}
              <p className="font-inter text-base font-medium sm:text-sm">
                Share
              </p>
              <FontAwesomeIcon
                icon={faShareNodes}
                className="h-4 w-4 text-black"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-0 z-10 mt-3 w-screen max-w-[200px] -translate-x-1/2 transform px-4 sm:px-0 sm:-left-20">
                <div className="overflow-hidden w-full rounded-lg shadow-lg ring-1 ring-black/5">
                  <div className="relative flex flex-col gap-1 bg-white p-2">
                    <button
                      onClick={() => copyToClipboard(url)}
                      className="flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none w-full"
                    >
                      <FontAwesomeIcon
                        icon={faLink}
                        className="h-5 w-5 text-gray-700 bg-white"
                      />
                      <div className="ml-4">
                        <p className="text-sm font-medium font-inter text-gray-700">
                          Copy Link
                        </p>
                      </div>
                    </button>
                    <FacebookShareButton
                      url={url}
                      quote="Check this out"
                      className=""
                    >
                      <button className="flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none w-full">
                        <FontAwesomeIcon
                          icon={faFacebook}
                          className="h-5 w-5 text-blue-500 bg-white"
                        />
                        <div className="ml-4">
                          <p className="text-sm font-medium font-inter text-gray-700">
                            Facebook
                          </p>
                        </div>
                      </button>
                    </FacebookShareButton>
                    <LinkedinShareButton url={url} className="w-full">
                      <button className="flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none w-full">
                        <FontAwesomeIcon
                          icon={faLinkedin}
                          className="h-5 w-5 text-blue-700 bg-white"
                        />
                        <div className="ml-4">
                          <p className="text-sm font-medium font-inter text-gray-700">
                            Linkedin
                          </p>
                        </div>
                      </button>
                    </LinkedinShareButton>
                    <TwitterShareButton
                      url={url}
                      title="Check this out"
                      className="w-full"
                    >
                      <button className="flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none w-full">
                        <FontAwesomeIcon
                          icon={faXTwitter}
                          className="h-5 w-5 text-black bg-white"
                        />
                        <div className="ml-4">
                          <p className="text-sm font-medium font-inter text-gray-700">
                            Twitter
                          </p>
                        </div>
                      </button>
                    </TwitterShareButton>
                    <WhatsappShareButton
                      url={url}
                      title="Check this out"
                      className="w-full"
                    >
                      <button className="flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none w-full">
                        <FontAwesomeIcon
                          icon={faWhatsapp}
                          className="h-5 w-5 text-green-500 bg-white"
                        />
                        <div className="ml-4">
                          <p className="text-sm font-medium font-inter text-gray-700">
                            Whatsapp
                          </p>
                        </div>
                      </button>
                    </WhatsappShareButton>
                    <TelegramShareButton
                      url={url}
                      title="Check this out"
                      className="w-full"
                    >
                      <button className="flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none w-full">
                        <FontAwesomeIcon
                          icon={faTelegram}
                          className="h-5 w-5 text-blue-500 bg-white"
                        />
                        <div className="ml-4">
                          <p className="text-sm font-medium font-inter text-gray-700">
                            Telegram
                          </p>
                        </div>
                      </button>
                    </TelegramShareButton>
                    <RedditShareButton
                      url={url}
                      title="Check this out"
                      className="w-full"
                    >
                      <button className="flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none w-full">
                        <FontAwesomeIcon
                          icon={faReddit}
                          className="h-5 w-5 text-red-500 bg-white"
                        />
                        <div className="ml-4">
                          <p className="text-sm font-medium font-inter text-gray-700">
                            Reddit
                          </p>
                        </div>
                      </button>
                    </RedditShareButton>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};
