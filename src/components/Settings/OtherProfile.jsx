/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, updateUser } from "../../Features/userSlice";
import { toast } from "react-toastify";
import { db, doc, updateDoc, auth } from "../../firebase/auth";

export const OtherProfile = ({ users, setUsers }) => {
  const currentUser = auth.currentUser;
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [shortBio, setShortBio] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [country, setCountry] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [occupation, setOccupation] = useState("");

  useEffect(() => {
    if (user) {
      setShortBio(user?.shortBio);
      setFacebookLink(user?.facebookLink);
      setTwitterLink(user?.twitterLink);
      setInstagramLink(user?.instagramLink);
      setLinkedinLink(user?.linkedinLink);
      setCountry(user?.country);
      setWebsiteUrl(user?.websiteUrl);
      setOccupation(user?.occupation);
    }
  }, [user]);

  const updateProfileDetails = async () => {
    if (user) {
      setLoading(true);
      try {
        const userRef = doc(db, "users", currentUser.uid);
        if (shortBio && shortBio.trim().length > 160) {
          toast.error("Bio cannot be more than 160 characters");
          setLoading(false);
          return;
        }

        const updateData = {
          shortBio: shortBio ? shortBio : "",
          facebookLink: facebookLink ? facebookLink : "",
          twitterLink: twitterLink ? twitterLink : "",
          instagramLink: instagramLink ? instagramLink : "",
          linkedinLink: linkedinLink ? linkedinLink : "",
          country: country ? country : "",
          websiteUrl: websiteUrl ? websiteUrl : "",
          occupation: occupation ? occupation : "",
        };

        await updateDoc(userRef, updateData);
        await dispatch(updateUser({ id: currentUser.uid, updateData }));
        // await setUsers(
        //   users.map((u) => {
        //     if (u.id === user.id) {
        //       return { ...u, ...updateData };
        //     }
        //     return u;
        //   })
        // );
        toast.success("Profile updated successfully");
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    }
  };

  const cancelUpdateProfle = () => {
    setShortBio(user?.shortBio);
    setFacebookLink(user?.facebookLink);
    setTwitterLink(user?.twitterLink);
    setInstagramLink(user?.instagramLink);
    setLinkedinLink(user?.linkedinLink);
    setCountry(user?.country);
    setWebsiteUrl(user?.websiteUrl);
    setOccupation(user?.occupation);
  };

  return (
    <div className="flex flex-col gap-8 pb-4">
      <div className="flex flex-col gap-0.5">
        <h5 className="text-lack font-medium text-sm font-inter">
          Public profile
        </h5>
        <p className="text-gray-600 font-normal text-sm">
          Update your public profile information.
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateProfileDetails();
        }}
        className="flex flex-col gap-4"
      >
        <label className="flex flex-col gap-2" htmlFor="shortBio">
          <p className="text-black font-medium text-sm font-inter">Bio</p>
          <textarea
            value={shortBio}
            onChange={(e) => setShortBio(e.target.value)}
            className="w-full h-[140px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md border-gray-200 resize-none focus:outline-none focus:ring-0 focus:border-green-300 focus:ring-transparent transition duration-300 ease-in-out"
            placeholder="Tell us about yourself"
          />
        </label>
        <label className="flex flex-col gap-2" htmlFor="occupation">
          <p className="text-black font-medium text-sm font-inter">Tagline</p>
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="w-full h-[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md border-gray-200 focus:outline-none focus:ring-0 focus:border-green-300 focus:ring-transparent transition duration-300 ease-in-out"
            placeholder="e.g. Software Developer"
          />
        </label>
        <label className="flex flex-col gap-2" htmlFor="country">
          <p className="text-black font-medium text-sm font-inter">Location</p>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full h-[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md border-gray-200 focus:outline-none focus:ring-0 focus:border-green-300 focus:ring-transparent transition duration-300 ease-in-out"
            placeholder="London, UK"
          />
        </label>
        <label className="flex flex-col gap-2" htmlFor="websiteUrl">
          <p className="text-black font-medium text-sm font-inter">Website</p>
          <input
            type="text"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="w-full h-[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md border-gray-200 focus:outline-none focus:ring-0 focus:border-green-300 focus:ring-transparent transition duration-300 ease-in-out"
            placeholder="https://example.com"
          />
        </label>
        <label className="flex flex-col gap-2" htmlFor="facebookLink">
          <p className="text-black font-medium text-sm font-inter">Facebook</p>
          <input
            type="text"
            value={facebookLink}
            onChange={(e) => setFacebookLink(e.target.value)}
            className="w-full h-[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md border-gray-200 focus:outline-none focus:ring-0 focus:border-green-300 focus:ring-transparent transition duration-300 ease-in-out"
            placeholder="https://facebook.com/username"
          />
        </label>
        <label className="flex flex-col gap-2" htmlFor="twitterLink">
          <p className="text-black font-medium text-sm font-inter">Twitter</p>
          <input
            type="text"
            value={twitterLink}
            onChange={(e) => setTwitterLink(e.target.value)}
            className="w-full h-[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md border-gray-200 focus:outline-none focus:ring-0 focus:border-green-300 focus:ring-transparent transition duration-300 ease-in-out"
            placeholder="https://twitter.com/username"
          />
        </label>
        <label className="flex flex-col gap-2" htmlFor="instagramLink">
          <p className="text-black font-medium text-sm font-inter">Instagram</p>
          <input
            type="text"
            value={instagramLink}
            onChange={(e) => setInstagramLink(e.target.value)}
            className="w-full h-[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md border-gray-200 focus:outline-none focus:ring-0 focus:border-green-300 focus:ring-transparent transition duration-300 ease-in-out"
            placeholder="https://instagram.com/username"
          />
        </label>
        <label className="flex flex-col gap-2" htmlFor="linkedinLink">
          <p className="text-black font-medium text-sm font-inter">LinkedIn</p>
          <input
            type="text"
            value={linkedinLink}
            onChange={(e) => setLinkedinLink(e.target.value)}
            className="w-full h-[40px] text-gray-900 text-sm font-inter font-medium px-3 py-2.5 rounded-md border-gray-200 focus:outline-none focus:ring-0 focus:border-green-300 focus:ring-transparent transition duration-300 ease-in-out"
            placeholder="https://www.linkedin.com/in/username"
          />
        </label>
        <div className="flex gap-3 py-4 justify-end">
          <button
            className="px-4 h-10 self-end bg-red-700 text-white rounded-lg text-base font-medium shadow hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-100 focus:ring-offset-violet-100   disabled:cursor-not-allowed transition duration-500 ease-in-out"
            onClick={() => cancelUpdateProfle()}
            type="button"
          >
            Cancel
          </button>
          <button
            className={`flex items-center gap-3 justify-center text-black bg-white px-4 h-11  rounded-lg border border-gray-300 text-base font-[600] shadow  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-100 focus:ring-offset-violet-100disabled:cursor-not-allowed transition duration-500 ease-in-out ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
            type="submit"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};
