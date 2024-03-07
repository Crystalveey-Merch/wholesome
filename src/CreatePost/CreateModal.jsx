/* eslint-disable react/prop-types */
import { Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";
import { useNavigate } from "react-router-dom";

export const CreateModal = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const loggedInUser = useSelector(selectUser);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(100% - 64px)",
    maxWidth: "600px",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "10px",
    p: "24px",
    zIndex: 100,
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
          <div className="flex flex-col gap-6">
            <div className="flex gap-2">
              <img
                src={loggedInUser?.photoURL}
                alt="profile"
                className="h-10 w-10 rounded-full"
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
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-inter font-semibold text-black">
                Create
              </h3>
              {/* article, event, activity and podcast */}
              <div className="flex gap-3 items-center">
                <button
                  className="flex flex-col gap-1 p-2 border rounded-md border-[#ff5841] transition-all hover:bg-[#ff5841] hover:text-white group"
                  onClick={() => (setIsOpen(false), navigate("/createpost"))}
                >
                  <p className="text-sm font-semibold text-[#ff5841] font-inter transition-all group-hover:text-white">
                    Article
                  </p>
                </button>
                <button
                  className="flex flex-col gap-1 p-2 border rounded-md border-[#ff5841] transition-all hover:bg-[#ff5841] hover:text-white group opacity-50"
                  disabled
                >
                  <p className="text-sm font-semibold text-[#ff5841] font-inter transition-all group-hover:text-white">
                    Event
                  </p>
                </button>
                <button
                  className="flex flex-col gap-1 p-2 border rounded-md border-[#ff5841] transition-all hover:bg-[#ff5841] hover:text-white group opacity-50"
                  disabled
                >
                  <p className="text-sm font-semibold text-[#ff5841] font-inter transition-all group-hover:text-white">
                    Activity
                  </p>
                </button>
                <button
                  className="flex flex-col gap-1 p-2 border rounded-md border-[#ff5841] transition-all hover:bg-[#ff5841] hover:text-white group opacity-50"
                  disabled
                >
                  <p className="text-sm font-semibold text-[#ff5841] font-inter transition-all group-hover:text-white">
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
