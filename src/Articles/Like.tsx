import { useEffect,  } from "react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbTack, faThumbsUp } from "@fortawesome/free-solid-svg-icons";



const Like = ({ handleLike, likes, userId }) => {


  function LikeStatus() {
    if (likes?.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return likes.find((id: any) => id === userId) ? (
        <>
<FontAwesomeIcon icon={faThumbsUp} className="text-red-500"/>
          &nbsp;{likes.length}
        </>
      ) : (
        <>
<FontAwesomeIcon icon={faThumbsUp} className="text-gray-300"/>
          &nbsp;{likes.length}
        </> 
      );
    }
    return (
      <>
<FontAwesomeIcon icon={faThumbsUp} className="text-gray-300"/>
        &nbsp;
      </>
    );
  }
  return (
    <>
      <span
        style={{ float: "right", cursor: "pointer"}}
        onClick={!userId ? null : handleLike}
      >
        {!userId ? (
          <div
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title="Please Login to like post"
          >
            <LikeStatus />
          </div>
        ) : (
          <div  className="">
            <LikeStatus />
          </div>
        )}
      </span>
    </>
  );
};

export default Like;