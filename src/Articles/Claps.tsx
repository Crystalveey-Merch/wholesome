import { useEffect, } from "react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHands, faThumbTack, faThumbsUp } from "@fortawesome/free-solid-svg-icons";



const Clap = ({ handleClap2, claps, userId, commentId }) => {


  function LikeStatus() {
    if (claps?.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return claps.find((id) => id === userId) ? (
        <>
          <FontAwesomeIcon icon={faHands} className="text-yellow-500 hover:scale-125 active:text-sky-300 transition duration-150 ease-in-out" />
          &nbsp;{claps.length}
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faHands} className="text-gray-800 hover:scale-120 active:text-sky-300 transition duration-150 ease-in-out" />
          &nbsp;{claps.length}
        </>
      );
    }
    return (
      <>
        <FontAwesomeIcon icon={faHands} className="text-gray-800 hover:scale-125 active:text-sky-300   transition duration-150 ease-in-out" />
        &nbsp;
      </>
    );
  }
  return (
    <>
      <span
        style={{ float: "right", cursor: "pointer" }}
        onClick={!userId ? undefined : () => handleClap2(commentId)}
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
          <div className="text-black">
            <LikeStatus />
          </div>
        )}
      </span>
    </>
  );
};

export default Clap;