/* eslint-disable react/prop-types */
import { Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";
import { useNavigate } from "react-router-dom";
import {
  faCalendarPlus,
  faNewspaper,
  faListCheck,
  faPodcast,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CreateModal = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
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

  return (
    <Modal
      open={isOpen}
      onClose={setIsOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={isOpen}>
        <Box sx={style}>
          <div className="flex flex-col gap-6 sm:p-2.5">
            <div className="border-b border-gray-200 pb-3 flex justify-between items-center sm:py-3.5">
              <h3 className="text-lg font-inter font-semibold text-black">
                Create
              </h3>
              <button onClick={setIsOpen} className="text-gray-500">
                <FontAwesomeIcon icon={faXmarkCircle} className="h-6 w-6" />
              </button>
            </div>
            <div className="flex gap-2">
              <img
                src={loggedInUser?.photoURL}
                alt="profile"
                className="w-[40px] h-[40px] min-h-10 min-w-10 max-h-[40px] max-w-[40px] rounded-sm object-cover border-2 border-red-50 shadow-md"
              />
              <div className="flex flex-col gap-0">
                <h1 className="text-lg font-inter font-semibold text-black">
                  {loggedInUser?.name}
                </h1>
                <p className="text-gray-500 text-xs font-inter">
                  @{loggedInUser?.username}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <h3 className="text-lg font-inter font-semibold text-black">
                What do you want to create?
              </h3>
              {/* article, event, activity and podcast */}
              <div className="flex gap-4 items-center">
                {/* <button
                  className="flex flex-col gap-1 p-2 border rounded-md border-[#ff5841] transition-all hover:bg-[#ff5841] hover:text-white group"
                  onClick={() => (setIsOpen(false), navigate("/createpost"))}
                >
                  <p className="text-sm font-semibold text-[#ff5841] font-inter transition-all group-hover:text-white">
                    Article
                  </p>
                </button> */}
                <button
                  className="flex gap-2 items-center p-2 rounded-md transition duration-300 ease-in-out hover:bg-gray-50"
                  onClick={() => (setIsOpen(false), navigate("/createpost"))}
                >
                  <FontAwesomeIcon
                    icon={faNewspaper}
                    className="text-[#e6d96d] h-6 w-6"
                  />
                  <p className="text-sm font-semibold text-[#000000] font-inter transition-all">
                    Article
                  </p>
                </button>
                <button
                  className="flex gap-2 items-center p-2 rounded-md transition duration-300 ease-in-out hover:bg-gray-50"
                  onClick={() => (setIsOpen(false), navigate("/hostevent"))}
                >
                  <FontAwesomeIcon
                    icon={faCalendarPlus}
                    className="text-[#007FFF] h-6 w-6"
                  />
                  <p className="text-sm font-semibold text-[#000000] font-inter transition-all">
                    Event
                  </p>
                </button>
                <button className="flex gap-2 items-center p-2 rounded-md transition duration-300 ease-in-out hover:bg-gray-50">
                  <FontAwesomeIcon
                    icon={faListCheck}
                    className="text-[#32de84] h-6 w-6"
                  />
                  <p className="text-sm font-semibold text-[#000000] font-inter transition-all">
                    Activity
                  </p>
                </button>
                <button className="flex gap-2 items-center p-2 rounded-md transition duration-300 ease-in-out hover:bg-gray-50">
                  <FontAwesomeIcon
                    icon={faPodcast}
                    className="text-[#EF0107] h-6 w-6"
                  />
                  <p className="text-sm font-semibold text-[#000000] font-inter transition-all">
                    Podcast
                  </p>
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};
