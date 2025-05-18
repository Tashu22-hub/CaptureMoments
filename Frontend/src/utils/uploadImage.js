import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(
      "https://capturemoments-backend.onrender.com/image-upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("Response from server:", response.data);
    return response.data.imageUrl; // return just the URL string
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};


export default uploadImage;
