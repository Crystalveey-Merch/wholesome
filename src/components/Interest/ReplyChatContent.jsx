/* eslint-disable react/prop-types */
import {
  HighlightedText,
  formatByInitialTime,
  getProfileDetails,
} from "../../Hooks";

export const ReplyChatContent = ({ chat, users }) => {
  const user = getProfileDetails(chat?.authorId, users);
  return (
    <div className="w-full flex gap-1.5 flex-col">
      <div className="w-full flex justify-between items-start">
        <div className="flex flex-col gap-0">
          <div className="flex gap-1 items-center">
            <h2 className="text-black font-inter font-semibold text-sm">
              {user?.name}{" "}
              {/* <span className="text-xs font-medium">
              @{user?.username}
            </span> */}
            </h2>

            <p className="text-gray-400">•</p>
            <p className="text-gray-500 font-inter font-medium text-xs">
              {formatByInitialTime(chat?.createdAt.seconds * 1000)}
            </p>
          </div>
          <p className="text-gray-500 font-inter font-medium text-xs">
            @{user?.username}
          </p>
        </div>
      </div>
      <div className="text-black font-inter font-medium text-[0.95rem]">
        <HighlightedText content={chat.text} users={users} />
      </div>
      <div className="">
        {chat.images.length + chat.videos.length === 1 ? (
          <div className="">
            {chat.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt=""
                className="w-full max-h-[400px] max-w-xl object-cover rounded-md"
              />
            ))}
            {chat.videos.map((video, index) => (
              <video
                key={index}
                src={video}
                controls
                className="w-full max-h-[400px] max-w-xl object-cover rounded-md"
              />
            ))}
          </div>
        ) : chat.images.length + chat.videos.length === 2 ? (
          <div className="flex gap-1">
            {chat.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt=""
                className="w-1/2 min-h-[180px] object-cover rounded-md"
              />
            ))}
            {chat.videos.map((video, index) => (
              <video
                key={index}
                src={video}
                controls
                className="w-1/2 min-h-[180px] object-cover rounded-md"
              />
            ))}
          </div>
        ) : chat.images.length + chat.videos.length === 3 ? (
          <div className="flex gap-1">
            <div className="w-1/2">
              {chat.images.length === 3 && (
                <div className="flex flex-col gap-1">
                  {chat.images.slice(0, 2).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt=""
                      className="w-full h-[180px] object-cover rounded-md"
                    />
                  ))}
                </div>
              )}

              {chat.videos.length === 3 && (
                <div className="flex flex-col gap-1">
                  {chat.videos.slice(0, 2).map((video, index) => (
                    <video
                      key={index}
                      src={video}
                      controls
                      className="w-full h-[180px] object-cover rounded-md"
                    />
                  ))}
                </div>
              )}

              {chat.images.length === 2 && (
                <div className="flex flex-col gap-1">
                  {chat.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt=""
                      className="w-full h-[180px] object-cover rounded-md"
                    />
                  ))}
                </div>
              )}

              {chat.videos.length === 2 && (
                <div className="flex flex-col gap-1">
                  {chat.videos.map((video, index) => (
                    <video
                      key={index}
                      src={video}
                      controls
                      className="w-full h-[180px] object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="w-1/2">
              {chat.images.length === 1 && (
                <img
                  src={chat.images[0]}
                  alt=""
                  className="w-full h-[360px] object-cover rounded-md"
                />
              )}

              {chat.videos.length === 1 && (
                <video
                  src={chat.videos[0]}
                  controls
                  className="w-full h-[360px] object-cover rounded-md"
                />
              )}

              {chat.images.length === 3 && (
                <img
                  src={chat.images[2]}
                  alt=""
                  className="w-full h-[360px] object-cover rounded-md"
                />
              )}

              {chat.videos.length === 3 && (
                <video
                  controls
                  src={chat.videos[2]}
                  className="w-full h-[360px] object-cover rounded-md"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-flow-row grid-cols-2 gap-1">
            {chat.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt=""
                className="w-full h-[180px] object-cover rounded-md"
              />
            ))}
            {chat.videos.map((video, index) => (
              <video
                key={index}
                src={video}
                controls
                className="w-full h-[180px] object-cover rounded-md"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
