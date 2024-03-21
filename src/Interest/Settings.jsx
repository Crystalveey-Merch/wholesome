/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertToLowercase } from "../Hooks";
import { db, updateDoc, doc } from "../firebase/auth";
import { toast } from "react-toastify";

export const Settings = ({ interests }) => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [interest, setInterest] = useState([]);

  useEffect(() => {
    if (!name) return;
    const interest = interests.find(
      (interest) => convertToLowercase(interest.name) === name
    );
    setInterest(interest);
  }, [name, interests]);

  const [interestName, setInterestName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!interest) return;
    setInterestName(interest.name);
    setDescription(interest.description);
  }, [interest]);

  const [isAccepted, setIsAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const otherInterestsName = interests.filter(
    (interest) => interest.name !== interestName
  );

  useEffect(() => {
    if (interestName?.length > 0 && !isInputFocused) {
      if (otherInterestsName.includes(interestName)) {
        setIsAccepted(false);
        setMessage("Interest group name already exists");
      } else if (interestName.length < 3) {
        setIsAccepted(false);
        setMessage("Interest group name must be at least 3 characters long");
      } else {
        setIsAccepted(true);
        // setMessage("this name is available");
        setMessage("");
      }
    } else {
      setIsAccepted(false);
      setMessage("");
    }
  }, [interestName, interests, isInputFocused, otherInterestsName]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const interestRef = doc(db, "interests", interest.id);

    if (
      interestName === interest.name &&
      description === interest.description
    ) {
      toast.error("No changes made");
      setLoading(false);
      return;
    }

    // max length of interest name is 200 words
    if (interestName.length > 200) {
      toast.error("Interest group name must be at most 150 characters long");
      setLoading(false);
      return;
    }

    try {
      await updateDoc(interestRef, {
        name: interestName,
        description,
        updatedAt: new Date(),
      });
      toast.success("Interest group updated successfully");
      navigate(`/i/${name}`);
    } catch (error) {
      console.error("Error updating interest group", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-12 py-8 px-8 justify-center items-center sm:px-6">
      <div className="w-full max-w-2xl flex flex-col gap-12">
        <div className="flex gap-4 flex-col">
          <button
            onClick={() => navigate(-1)}
            className="flex gap-1 items-center text-black font-inter font-semibold text-sm"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="h-3.5 w-3.5" />
            <p className="font-inter text-black text-base">Back</p>
          </button>
          {/* <h3 className="text-black font-inter font-semibold text-lg">
          Settings
        </h3> */}
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-black font-inter font-semibold text-lg">
            Basic Settings
          </h4>
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <p className="text-black font-inter text-base font-semibold">
                Interest Group Name
              </p>
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Enter the name of the interest group"
                  className={`w-full h[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300 focus:ring-transparent transition duration-300 ease-in-out ${
                    interestName?.length > 0 && isAccepted
                      ? "border-green500 border-green-300 bg-gray100"
                      : interestName?.length > 0 && !isAccepted
                      ? "border-red-300 bg-white"
                      : isInputFocused
                      ? "border-gray-200"
                      : "border-gray-200"
                  }`}
                  value={interestName}
                  onChange={(e) => setInterestName(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                />
                {interestName?.length > 0 && (
                  <p
                    className={`text-xs font-inter ${
                      isAccepted ? "text-green-500" : "text-red-600"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </div>
            </label>
            <label className="flex flex-col gap-2">
              <p className="text-black font-inter text-base font-semibold">
                Description
              </p>
              <textarea
                placeholder="Enter a brief description of the interest group"
                className="w-full h-[140px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md border-gray-200 resize-none focus:outline-none focus:ring-0 focus:border-green-300 focus:ring-transparent transition duration-300 ease-in-out"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <button
              type="submit"
              className={`h-11 w-max justify-self-end place-self-end px-3 py-2 bg-red-500 text-white font-inter font-semibold text-sm rounded-md focus:outline-none focus:ring-0 transition duration-300 ease-in-out ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
