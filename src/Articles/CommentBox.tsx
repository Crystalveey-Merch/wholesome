import { useNavigate } from "react-router-dom";
import React from "react";

const CommentBox = ({ userId, userComment, setUserComment, handleComment }) => {
  const navigate = useNavigate();
  return (
    <>
      <form className="row blog-form border my-10">
        <div className="col-12 py-3">
          <textarea 
          placeholder="write comment"
            rows= {4}
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            className="form-control description w-full p-4 text-black border-1 rounded-3 "
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
            className="btn btn-primary"
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
