/* eslint-disable react/prop-types */
import { useState } from "react";
import { db, doc } from "../../firebase/auth";
import { convertToLowercase } from "../../Hooks";
import { writeBatch } from "firebase/firestore";
import { toast } from "react-toastify";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { selectUser } from "../../Features/userSlice";
export const InviteUser = ({
  user,
  interest,
  setOpen,
  users,
  setUsers,
  setInterest,
}) => {
  const loggedInUser = useSelector(selectUser);
  const [inviteLoading, setInviteLoading] = useState(false);

  const handleInvite = async (user) => {
    setInviteLoading(true);

    try {
      const interestRef = doc(db, "interests", interest.id);
      const userRef = doc(db, "users", user.id);
      const newInvite = {
        invitedBy: loggedInUser.id,
        invitedUserId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        inviteAccepted: false,
      };

      // Initialize batched write
      const batch = writeBatch(db);

      // Update interest document with new invite
      batch.update(interestRef, { invites: [...interest.invites, newInvite] });

      // Add notification to the invited user
      const newNotification = {
        type: "invite",
        inviteType: "interest",
        fromUserId: loggedInUser.id,
        id: `${loggedInUser.id}-${Date.now()}`,
        content: `You have been invited to join ${interest.name} by ${loggedInUser.name}`,
        interestId: interest.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        hasRead: false,
        hasSeen: false,
        hasDeleted: false,
        link: `/i/${convertToLowercase(interest.name)}`,
      };

      batch.update(userRef, {
        notifications: [...user.notifications, newNotification],
      });

      // Commit batched write
      await batch.commit();

      // Update local state
      const updatedInterest = {
        ...interest,
        invites: [...interest.invites, newInvite],
      };
      setInterest(updatedInterest);

      const updatedUsers = users.map((u) => {
        if (u.id === user.id) {
          return { ...u, notifications: [...u.notifications, newNotification] };
        }
        return u;
      });
      setUsers(updatedUsers);
      toast.success(`Invite sent to ${user.name}`);
      setInviteLoading(false);
      setOpen(false);
    } catch (error) {
      console.error("Error sending invite: ", error);
      setInviteLoading(false);
      toast.error(error.message);
      // Handle error, show error message to the user
    }
  };
  return (
    <div className="flex w-full justify-between gap-2 items-center">
      <div className="flex items-center gap-4 py-4">
        {" "}
        <img
          src={
            user.photoURL
              ? user.photoURL
              : "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
          }
          alt="avatar"
          className="h-10 w-10 rounded-full"
        />
        <div className="flex flex-col">
          <p className="font-medium text-gray-900 font-inter">
            {user.name ? user.name : ""}
          </p>
          <p className="text-gray-500 text-sm font-inter">{user.username}</p>
        </div>
      </div>
      <button
        className="h-max text-black bg-gray-200 px-4 py-3 flex gap-2.5 items-center rounded-lg transition duration-300 ease-in-out hover:bg-gray-300 md:py-2.5"
        // check if user has already been invited
        onClick={() => {
          if (
            interest?.invites?.some(
              (invite) => invite?.invitedUserId === user.id
            )
          ) {
            toast.error("User has already been invited");
          } else {
            handleInvite(user);
          }
        }}
      >
        {!interest?.invites?.some(
          (invite) => invite?.invitedUserId === user.id
        ) && <FontAwesomeIcon icon={faPlus} className="text-black h-4 w-4" />}
        <p className="font-inter text-base font-medium sm:text-sm">
          {inviteLoading && user.id === user.id
            ? "Sending..."
            : interest?.invites?.some(
                (invite) => invite?.invitedUserId === user.id
              )
            ? "Invited"
            : "Invite"}
        </p>
      </button>
    </div>
  );
};
