/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { useSelector } from "react-redux";
import { selectUser } from "../../Features/userSlice";
import { faXmarkCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { db, doc, updateDoc } from "../../firebase/auth";
import { convertToLowercase } from "../../Hooks";
import { writeBatch } from "firebase/firestore";
import { toast } from "react-toastify";

export const InviteModal = ({
  open,
  setOpen,
  interest,
  interests,
  users,
  setInterest,
  setInterests,
  setUsers,
}) => {
  const loggedInUser = useSelector(selectUser);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(100% - 64px)",
    maxWidth: "580px",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "10px",
    p: "20px",
    zIndex: 100,
    // responsive
    "@media (max-width: 639px)": {
      width: "calc(100% - 0px)",
      height: "calc(100% - 0px)",
      borderRadius: "0px",
      p: "10px",
    },
  };

  const [inviteLoading, setInviteLoading] = useState(false);
  const [usersToInvite, setUsersToInvite] = useState([]);

  useEffect(() => {
    if (!interest) return;
    // only get users that are not in the interest
    const usersToInvite = users.filter(
      (user) => !interest?.members?.some((member) => member?.userId === user.id)
    );
    setUsersToInvite(usersToInvite);
  }, [interest, users]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = usersToInvite?.filter((user) => {
    return (
      user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <div className="flex flex-col gap-6 sm:h-full">
            <div className="border-b border-gray-200 pb-3 flex justify-between items-center sm:py-3.5">
              <h3 className="text-lg font-inter font-semibold text-black">
                Invite to {interest?.name}
              </h3>
              <button onClick={() => setOpen(false)} className="text-gray-500">
                <FontAwesomeIcon icon={faXmarkCircle} className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center gap-1">
              {/* search svg */}
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-red-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <input
                className="w-full border-none focus:ring-0 focus:outline-none shadow-none bg-gray-50 text-gray-900 pl-2 text-lg"
                placeholder="Search for people"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="max-h-[400px] flex flex-col gap-2 overflow-y-scroll px-2 sm:max-h-[calc(100vh-100px)]">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex w-full justify-between gap-2 items-center"
                >
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
                      <p className="text-gray-500 text-sm font-inter">
                        {user.username}
                      </p>
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
                    ) && (
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="text-black h-4 w-4"
                      />
                    )}
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
              ))}
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};
