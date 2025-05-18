import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile); // <-- this name must be "image"

  try {
    const response = await axiosInstance.post("/image-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.imageUrl; // ✅ This will now be the Cloudinary URL
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

export default uploadImage;
