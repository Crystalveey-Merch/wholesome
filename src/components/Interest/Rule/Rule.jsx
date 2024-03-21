/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import {
  faEllipsis,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { db, doc, updateDoc } from "../../../firebase/auth";
import { toast } from "react-toastify";
import { EditRuleModal } from ".";

export const Rule = ({ interest, setInterest, rule }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const pageClickEvent = (e) => {
      if (
        dropdownRef.current !== null &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(!showDropdown);
      }
    };

    if (showDropdown) {
      window.addEventListener("click", pageClickEvent);
    }

    return () => {
      window.removeEventListener("click", pageClickEvent);
    };
  }, [showDropdown]);

  const [deleting, setDeleting] = useState(false);

  const handleDeleteRule = async () => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      setShowDropdown(false);
      setDeleting(true);
      try {
        const updatedRules = interest.rules
          .filter((r) => r.sortNumber !== rule.sortNumber)
          .map((r, index) => ({ ...r, sortNumber: index + 1 }));

        const updatedInterest = { ...interest, rules: updatedRules };

        // Update the interest document
        await updateDoc(doc(db, "interests", interest.id), updatedInterest);
        setInterest(updatedInterest);
        toast.success("Rule deleted successfully");
        setDeleting(false);
      } catch (error) {
        toast.error(error.message);
        setDeleting(false);
      }
    }
  };

  const [showEditRuleModal, setShowEditRuleModal] = useState(false);

  return (
    <div className="flex gap-4 items-start justify-between px-4 py-3">
      <div className="flex gap-3">
        <p className="text-black font-inter font-semibold text-base">
          {rule.sortNumber}.
        </p>
        <div className="flex flex-col gap-2 justify-start">
          <h4 className="text-black font-inter font-semibold text-base">
            {rule.title}
          </h4>
          <p className="text-gray-700 font-inter text-sm">{rule.description}</p>
        </div>
      </div>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        title="Actions"
        className="relative"
        ref={dropdownRef}
      >
        <FontAwesomeIcon
          icon={faEllipsis}
          className="text-black h-5 w-5 p-2 rounded-full transition duration-300 ease-in-out hover:bg-gray-50"
        />
        {showDropdown && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-10 right-0 bg-white shadow-xl rounded-md z-10 p-2 w-44 flex flex-col gap-1.5"
          >
            <button
              className="w-full flex items-center rounded-sm gap-2 p-2 hover:bg-gray-100"
              onClick={() => {
                setShowEditRuleModal(true), setShowDropdown(false);
              }}
            >
              <FontAwesomeIcon icon={faPen} className="text-black h-4 w-4" />
              <p className="text-black font-inter font-medium text-sm">
                Edit Rule
              </p>
            </button>
            <button
              className="w-full flex items-center rounded-sm gap-2 p-2 hover:bg-gray-100"
              onClick={handleDeleteRule}
              disabled={deleting}
            >
              <FontAwesomeIcon
                icon={faTrashCan}
                className="text-black h-4 w-4"
              />
              <p className="text-black font-inter font-medium text-sm">
                {deleting ? "Deleting..." : "Delete Rule"}
              </p>
            </button>
          </div>
        )}
      </button>
      <EditRuleModal
        interest={interest}
        rule={rule}
        open={showEditRuleModal}
        setOpen={setShowEditRuleModal}
        setInterest={setInterest}
      />
    </div>
  );
};
