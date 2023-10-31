
import React from "react";
const UserComment = ({ name, body, createdAt, msg, isAuthUserComment, imgUrl }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  const commentClassName = isAuthUserComment ? " w-auto " : "w-auto ml-auto";


  return (
    <div>
      <div className="row w-auto ">
        <div className="col-lg-12">
          <div className="comments-list">
            <div className="media dark:text-red-300">
              {msg ? (
                <h4 className="mt-5 text-red-300 text-xl  text-center">{msg}</h4>
              ) : (
                <>
                  <div className={isAuthUserComment ? "right  m-2 " : "left  m-2 "}>
                    <div className=" flex  gap-5 rounded-full overflow-hidden w-10 h-10">                    <img
                      src={imgUrl}
                      alt="user"
                      className=" m-auto"
                      // width={30}
                      // height={30}
                    />
                     <div className="chat-header text-sky-500 flex gap-2  my-auto">
                        {name}{" "}
                        <time className="text-sm opacity-50 text-red-500 flex gap-4">{createdAt.toDate().toDateString()}
                         
                        </time>
                      </div>
                    </div>

                    <div className="ml-10">
                     
                      <div className= {isAuthUserComment? "chat chat-start  ":"chat chat-start w-full "}>
                      <div className={isAuthUserComment ? "chat-bubble flex text-white    Aceh bg-red-500  " : "chat-bubble text-white chat-start Aceh bg-sky-800 flex gap-10  sm:gap-4"}>
                      <span className="text-green-400 Aceh">
                            {formatTime(createdAt.toDate())}</span>
                               {body}  
                      </div>
                      </div>
                     

                    </div>

                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserComment;
