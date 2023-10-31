import { useNavigate } from "react-router-dom";
import React from "react";

const CommentBox = ({ userId, userComment, setUserComment, handleComment, imgUrl }) => {
  const navigate = useNavigate();
  return (
    <>
      <form className="row blog-form  my-10">
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
            className="btn btn-primary m-auto flex"
            type="submit"
            onClick={handleComment}
            disabled={!userComment}
          >
            Post Comment
          </button>
        </>
      )}
    </>
  );
};

export default CommentBox;
