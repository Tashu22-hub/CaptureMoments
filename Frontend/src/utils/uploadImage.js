import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {


  const formData = new FormData();
  formData.append('image', imageFile); // Attach the image to form data
   // Check if file is appended correctly
   console.log("FormData contents:", formData.get('image'));

  try {
    const response = await axiosInstance.post('http://localhost:9000/image-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', },
    });
    
    // Make sure backend returns an image URL
    console.log("Response from server:", response.data);
    
      return response.data; // Return only the imageUrl
   
  } catch (error) {
    console.error("Image upload failed:", error);
    // toast.error("Image upload failed. Please try again.");
    throw error;
  }
};

export default uploadImage;
