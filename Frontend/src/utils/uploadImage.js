// utils/uploadImage.js
import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(
      "/image-upload", // ✅ this hits your backend index.js
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("Upload Success:", response.data);
    return response.data.imageUrl; // ✅ Ensure backend returns this
  } catch (error) {
    toast.error("Image upload failed!");
    console.error("Image upload failed:", error);
    throw error;
  }
};

export default uploadImage;
