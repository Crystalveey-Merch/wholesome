import { toast } from "react-toastify";
import { storage, updateProfile } from "./auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadImage = async (file, currentUser) => {
  const fileRef = ref(storage, currentUser.uid + ".jpg");

  //const setLoading = true;
  const snapShot = await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);

  updateProfile(currentUser, { photoURL });

  //setLoading(false);
  toast.success("Image uploaded successfully");
  console.log(snapShot.metadata.fullPath);
};
