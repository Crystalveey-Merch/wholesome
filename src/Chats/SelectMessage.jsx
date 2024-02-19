/* eslint-disable react/prop-types */
import { useSelector, useDispatch } from "react-redux";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NewMessageModal } from "./NewMessageModal";
import {
  selectOpenNewMessageModal,
  openNewMessageModal,
} from "../Features/openNewMessageModalSlice";
import { selectUser } from "../Features/userSlice";

export const SelectMessage = ({  users }) => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectUser);
  const showModal = useSelector(selectOpenNewMessageModal);

  const openModal = () => {
    dispatch(openNewMessageModal());
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 mx-auto h-full">
      <div className="flex flex-col justify-center items-center gap-2">
        {/* <img
          src="../../assets/profileIcons/messages-1.svg"
          alt="messages"
          className="h-28 w-28"
        /> */}
        <FontAwesomeIcon
          icon={faMessage}
          className="text-5xl text-gray-300 h-20 w-20"
        />
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <p className="block text-gray-500 text-center w-96 font-medium text-base">
          You have several options to continue your messaging journey. You can
          choose from your existing conversations, start a new one with someone
          new, or simply keep swimming and wait for someone to message you. The
          choice is yours!
        </p>
      </div>
      <button
        className="bg-red-500 text-white p-3 rounded-lg shadow-lg"
        onClick={openModal}
        type="button"
      >
        New Message
      </button>
      {showModal && (
        <NewMessageModal loggedInUser={loggedInUser} users={users} />
      )}
    </div>
  );
};
