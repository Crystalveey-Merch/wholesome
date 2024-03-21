/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { db, doc, updateDoc } from "../../../firebase/auth";
import { toast } from "react-toastify";
import { useAutosizeTextArea } from "../../../Hooks";

export const AddRuleModal = ({ interest, open, setOpen, setInterest }) => {
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
  const [formerRules, setFormerRules] = useState([]);
  useEffect(() => {
    if (interest) {
      setFormerRules(interest.rules);
    }
  }, [interest]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const descriptionRef = useRef(null);
  useAutosizeTextArea(descriptionRef.current, description);

  const [isTitleAccepted, setIsTitleAccepted] = useState(false);
  const [titleMessage, setTitleMessage] = useState("");
  const [titleInputFocused, setTitleInputFocused] = useState(false);

  useEffect(() => {
    if (title?.length > 0 && !titleInputFocused) {
      if (title.length < 3) {
        setIsTitleAccepted(false);
        setTitleMessage("Name must be at least 3 characters long");
      } else if (title.length > 65) {
        setIsTitleAccepted(false);
        setTitleMessage("Name must not exceed 65 characters");
      } else {
        setIsTitleAccepted(true);
        setTitleMessage("");
      }
    } else {
      setIsTitleAccepted(false);
      setTitleMessage("");
    }
  }, [title, titleInputFocused]);

  const [isDescriptionAccepted, setIsDescriptionAccepted] = useState(false);
  const [descriptionMessage, setDescriptionMessage] = useState("");
  const [descriptionInputFocused, setDescriptionInputFocused] = useState(false);

  useEffect(() => {
    if (description?.length > 0 && !descriptionInputFocused) {
      if (description.length > 200) {
        setIsDescriptionAccepted(false);
        setDescriptionMessage("Description must not exceed 200 characters");
      } else {
        setIsDescriptionAccepted(true);
        setDescriptionMessage("");
      }
    } else {
      setIsDescriptionAccepted(true); // Allow empty description
      setDescriptionMessage("");
    }
  }, [description, descriptionInputFocused]);

  const [creating, setCreating] = useState(false);

  const handleAddRule = async () => {
    setCreating(true);
    try {
      // Check if the title is unique
      const isTitleUnique = formerRules.every((rule) => rule.title !== title);
      if (!isTitleUnique) {
        toast.error("Rule name must be unique");
        setCreating(false);
        return;
      }

      // Find the maximum sortNumber
      const maxSortNumber = Math.max(
        ...formerRules.map((rule) => rule.sortNumber)
      );

      const newRule = {
        sortNumber: maxSortNumber + 1,
        title,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedRules = [...formerRules, newRule];
      const updatedInterest = { ...interest, rules: updatedRules };
      await updateDoc(doc(db, "interests", interest.id), updatedInterest);
      setInterest(updatedInterest);
      toast.success("Rule added successfully");
      setOpen(false);
      setCreating(false);
      setTitle("");
      setDescription("");
    } catch (error) {
      toast.error(error.message);
      setCreating(false);
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
                Add New Rule
              </h3>
              <button onClick={() => setOpen(false)} className="text-gray-500">
                <FontAwesomeIcon icon={faXmarkCircle} className="h-6 w-6" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddRule();
              }}
              className="flex flex-col gap-4"
            >
              <label className="flex flex-col gap-2">
                <p className="text-black font-inter text-base font-medium">
                  Title*
                </p>
                <div className="w-full flex flex-col">
                  <input
                    type="text"
                    placeholder="Enter rule title"
                    className={`w-full text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300 focus:ring-transparent transition duration-300 ease-in-out ${
                      title?.length > 0 && isTitleAccepted
                        ? "border-green500 border-green-300 bg-gray100"
                        : title?.length >= 0 && !isTitleAccepted
                        ? "border-red-300 bg-white"
                        : titleInputFocused
                        ? "border-gray-200"
                        : "border-gray-200"
                    }`}
                    value={title}
                    required
                    name="title"
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={() => setTitleInputFocused(true)}
                    onBlur={() => setTitleInputFocused(false)}
                  />
                  {title?.length > 0 && !isTitleAccepted && (
                    <p className="text-xs font-normal text-red-500 font-inter">
                      {titleMessage}
                    </p>
                  )}
                </div>
              </label>
              <label className="flex flex-col gap-2">
                <p className="text-black font-inter text-base font-medium">
                  Description
                </p>
                <div className="w-full flex flex-col">
                  <textarea
                    placeholder="Enter rule description"
                    className={`w-full text-gray-900 text-sm font-inter font-medium px-3 py-4 resize-none overflow-hidden rounded-md focus:outline-none focus:ring-0 focus:border-gray-300 focus:ring-transparent transition duration-300 ease-in-out ${
                      description?.length > 0 && isDescriptionAccepted
                        ? "border-green500 border-green-300 bg-gray100"
                        : description?.length >= 0 && !isDescriptionAccepted
                        ? "border-red-300 bg-white"
                        : descriptionInputFocused
                        ? "border-gray-200"
                        : "border-gray-200"
                    }`}
                    value={description}
                    name="description"
                    ref={descriptionRef}
                    onChange={(e) => setDescription(e.target.value)}
                    onFocus={() => setDescriptionInputFocused(true)}
                    onBlur={() => setDescriptionInputFocused(false)}
                  />
                  {description?.length > 0 && !isDescriptionAccepted && (
                    <p className="text-xs font-normal text-red-500 font-inter">
                      {descriptionMessage}
                    </p>
                  )}
                </div>
              </label>
              <button
                type="submit"
                className={`h-11 w-max justify-self-end place-self-end px-3 py-2 bg-red-500 text-white font-inter font-semibold text-sm rounded-md focus:outline-none focus:ring-0 transition duration-300 ease-in-out ${
                  creating || !isTitleAccepted || !isDescriptionAccepted
                    ? "opacity-50 cursor-default"
                    : "hover:bg-red-600"
                }`}
                disabled={
                  creating || !isTitleAccepted || !isDescriptionAccepted
                }
              >
                {creating ? "Adding Rule..." : "Add Rule"}
              </button>
            </form>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};
