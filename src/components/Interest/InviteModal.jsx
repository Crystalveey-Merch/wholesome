/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
// import { useSelector } from "react-redux";
// import { selectUser } from "../../Features/userSlice";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InviteUser } from ".";

export const InviteModal = ({
  open,
  setOpen,
  interest,
//   interests,
  users,
  setInterest,
//   setInterests,
  setUsers,
}) => {
//   const loggedInUser = useSelector(selectUser);

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
                <InviteUser
                  key={user.id}
                  user={user}
                  interest={interest}
                  setOpen={setOpen}
                  users={users}
                  setUsers={setUsers}
                  setInterest={setInterest}
                />
              ))}
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};
