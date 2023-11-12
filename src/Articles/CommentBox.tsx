import { useNavigate } from "react-router-dom";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight, faArrowPointer, faArrowTurnRight } from "@fortawesome/free-solid-svg-icons";

const CommentBox = ({ userId, userComment, setUserComment, handleComment, imgUrl }) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-5  bg-gray-100">
      <form className="row blog-form   w-full">
        <div className="col-12 py-3 flex gap-2">
        <div className="rounded-full overflow-hidden w-10 h-10 m-auto">               
                      <img
                      src={imgUrl}
                      alt="user"
                      className=" m-auto"
                      // width={30}
                      // height={30}
                    />
                    </div>
          <textarea 
          placeholder="write comment"
            rows= {1}
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            className="form-control description w-full p-4 text-black border-1 rounded-xl "
          />
        </div>
      </form>
      {!userId ? (
        <>
          <h5 className="text-red-500 text-center">Please login or Create an account to post comment</h5>
          <button className="btn btn-success flex m-auto my-5" onClick={() => navigate("/login")}>
            Login
          </button>
        </>
      ) : (
        <>
          <button
            className="btn btn-primary m-auto flex w-14 capitalize"
            type="submit"
            onClick={handleComment}
            disabled={!userComment}
          >
            Post
          </button>
        </>
      )}
    </div>
  );
};

export default CommentBox;
