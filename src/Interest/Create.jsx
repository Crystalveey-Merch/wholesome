/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  faGlobe,
  faLockOpen,
  faLock,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { selectUser } from "../Features/userSlice";
import { wholesquareEmployees } from "../Employees";
import { addDoc, db, collection } from "../firebase/auth";

export const Create = ({ interests }) => {
  const loggedInUser = useSelector(selectUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [privacy, setPrivacy] = useState("General"); // ["General", "Public", "Private", "Secret"

  const [isAccepted, setIsAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const otherInterestsName = interests.filter((interest) => interest !== name);

  useEffect(() => {
    if (name.length > 0 && !isInputFocused) {
      if (otherInterestsName.includes(name)) {
        setIsAccepted(false);
        setMessage("Interest group name already exists");
      } else if (name.length < 3) {
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
  }, [name, interests, isInputFocused, otherInterestsName]);

  const interestsPrivacyTypes = [
    {
      name: "General",
      description:
        "Anyone can join the interest group and see the posts and members of the interest group.(it can only be created by Wholesquare employees)",
      icon: faGlobe,
    },
    {
      name: "Public",
      description:
        "Anyone can join the interest group and see the posts and members of the interest group.",
      icon: faLockOpen,
    },
    {
      name: "Private",
      description:
        "Only members can see the interest group and its posts. People can request to join the interest group.",
      icon: faLock,
    },
    {
      name: "Secret",
      description:
        "Only members can see the interest group and its posts. People can join by invitation only.",
      icon: faEyeSlash,
    },
  ];

  //   console.log(wholesquareEmployees);

  const handleCancel = () => {
    navigate("/i/interest");
  };

  //   first if the group selected is not "General" and the user is a wholesquare employee, then return a toast message that the user is not allowed to select the group

  const handleCreateInterestGroup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const interestsRef = collection(db, "interests");

    //   name validation
    if (name.length < 3) {
      toast.error("Interest group name must be at least 3 characters long");
      setLoading(false);
      return;
    }

    if (otherInterestsName.includes(name)) {
      toast.error("Interest group name already exists");
      setLoading(false);
      return;
    }

    if (
      privacy === "General" &&
      !wholesquareEmployees.includes(loggedInUser.email.toLowerCase())
    ) {
      toast.error(
        "You are not allowed to create a group with this privacy setting"
      );
      setLoading(false);
      return;
    }

    try {
      await addDoc(interestsRef, {
        name,
        privacyType: privacy,
        members: [
          {
            userId: loggedInUser.id,
            joinedAt: new Date(),
          },
        ],
        moderators: [
          {
            userId: loggedInUser.id,
            email: loggedInUser.email,
            role: "admin",
          },
        ],
        chatBox: [],
        description: "",
        rules: [],
        createdBy: loggedInUser.id,
        wallPaper: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      toast.success("Interest group created successfully");
      setName("");
      setPrivacy("General");
      navigate("/i/interest");
      setLoading(false);
    } catch (error) {
      toast.error("Failed to create interest group");
      setLoading(false);
    }
  };

  return (
    <div className="w-full  min-h-screen h-max max-w-3xl py-16 pb-16 px-10 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-3xl font-inter font-semibold text-black">
          Create Interest Group
        </h3>
        <p className="text-gray-500 font-inter text-sm">
          Create a new interest group to connect with people who share your
          interests.
        </p>
      </div>
      <form
        onSubmit={(e) => handleCreateInterestGroup(e)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <p className="text-black font-inter text-base font-semibold">
              Interest Group Name
            </p>
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Enter the name of the interest group"
                className={`w-full h[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300 focus:ring-transparent transition duration-300 ease-in-out ${
                  name.length > 0 && isAccepted
                    ? "border-green500 border-green-300 bg-gray100"
                    : name.length > 0 && !isAccepted
                    ? "border-red-300 bg-white"
                    : isInputFocused
                    ? "border-gray-200"
                    : "border-gray-200"
                }`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
              {name.length > 0 && (
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
          <div className="flex flex-col gap-2">
            <p className="text-black font-inter text-base font-semibold">
              Interest Privacy Settings
            </p>
            {/* radio */}
            <div className="flex flex-col gap-4">
              {interestsPrivacyTypes.map((interestPrivacyType) => (
                // disable if interestPrivacyType.name !== "General"
                <label
                  key={interestPrivacyType.name}
                  className={`flex items-center gap-4 py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-gray-100 ${
                    privacy === interestPrivacyType.name
                      ? "bg-gray-100 cursor-pointer"
                      : interestPrivacyType.name !== "General"
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={interestPrivacyType.icon}
                    className="h-6 w-6 text-black"
                  />
                  <div className="flex gap-1 items-center">
                    <div className="flex flex-col gap-1">
                      <p className="text-black font-inter text-base font-medium">
                        {interestPrivacyType.name}
                      </p>
                      <p className="text-gray-500 font-inter text-sm">
                        {interestPrivacyType.description}
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="privacy"
                      value={interestPrivacyType.name}
                      className="w-4 h-4 rounded-full border border-gray-300 focus:ring-0 focus:outline-none"
                      checked={privacy === interestPrivacyType.name}
                      onChange={() => setPrivacy(interestPrivacyType.name)}
                      disabled={interestPrivacyType.name !== "General"}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-end">
          <button
            type="submit"
            className={`h-11 px-3 py-2 bg-red-500 text-white font-inter font-semibold text-sm rounded-md focus:outline-none focus:ring-0 transition duration-300 ease-in-out ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Interest Group"}
          </button>
          <button
            type="reset"
            onClick={handleCancel}
            className="h-11 px-3 py-2 bg-gray-100 text-black font-inter font-semibold text-sm rounded-md focus:outline-none focus:ring-0 transition duration-300 ease-in-out hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
