/* eslint-disable react/prop-types */
import { Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const UploadWallpaperModal = ({
  open,
  handleClose,
  photoURL,
  handleImageChange,
  handleImageClick,
  photo,
  imageLoading,
}) => {
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
      open={open}
      onClose={() => handleClose()}
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
          <div
            className="flex flex-col gap-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b-gray-200 border-b pb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Upload your photo
              </h1>
              <div>
                <button
                  onClick={() => handleClose()}
                  className="text-gray-500 hover:text-gray-600 transition duration-500 ease-in-out"
                >
                  {/* <img src={closeSVG} alt="close svg" className="h-5 w-5" /> */}
                  <FontAwesomeIcon icon={faX} />
                </button>
              </div>
            </div>
            <label htmlFor="upload" className="flex flex-col gap-1.5 relative">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
                id="photoURL"
                type="file"
                placeholder="Profile Picture"
                required
                name="photoURL"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
            <div className="justify-self-center flex justify-center">
              <img
                src={photoURL}
                alt="Preview of the selected image"
                className="h-64 w-full object-cover"
              />
            </div>
            <div className="flex justify-end gap-5">
              <button
                className="px-4 h-10 flex items-center gap-3 justify-center text-black bg-white rounded-lg border border-gray-300 text-base font-[600] shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-100 focus:ring-offset-violet-100disabled:cursor-not-allowed transition duration-500 ease-in-out"
                onClick={() => handleClose()}
              >
                Cancel upload
              </button>
              <button
                className={`px-4 h-10 self-end bg-blue-700 text-white rounded-lg text-base font-medium shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-100 focus:ring-offset-violet-100 transition duration-500 ease-in-out ${
                  !photo || imageLoading ? "opacity-50" : "hover:bg-blue-800"
                }`}
                onClick={handleImageClick}
                disabled={!photo || imageLoading}
                type="submit"
                id="upload-button"
              >
                {imageLoading ? "Uploading..." : "Upload Image"}
              </button>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};
