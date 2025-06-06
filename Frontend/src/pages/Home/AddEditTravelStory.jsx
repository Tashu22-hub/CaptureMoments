import React, { useState, useEffect } from "react";
import { MdAdd, MdUpdate, MdDeleteOutline, MdClose } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import { toast } from "react-toastify";
import uploadImage from "../../utils/uploadImage";

const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStories }) => {
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [story, setStory] = useState(storyInfo?.story || "");
  const [storyImg, setStoryImg] = useState(null);
  const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
  const [error, setError] = useState("");

  const handleAddOrUpdateClick = () => {
    if (!title) return setError("Please enter the title");
    if (!story) return setError("Please enter the story");
    setError("");

    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  };
const addNewTravelStory = async () => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("story", story);
    formData.append("visitedLocation", JSON.stringify(visitedLocation));
    formData.append("visitedDate", visitedDate ? moment(visitedDate).valueOf() : moment().valueOf());

    if (storyImg && typeof storyImg === "object") {
      formData.append("image", storyImg); // ✅ key name must match multer field
    }else{
      toast.error("please select a valid image");
      return;
    }

    const response = await axiosInstance.post("/Add-travel-story", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout:60000,
    });

    if (response.data.story) {
      toast.success("Story added successfully!");
      getAllTravelStories();
      onClose();
    } else {
      throw new Error("Failed to add story.");
    }
  } catch (error) {
    console.error("Add story error:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "An error occurred while adding the story.");
  }
};

  const updateTravelStory = async () => {
    const storyId = storyInfo._id;
    try {
      let imageUrl = storyInfo?.imageUrl || ""; // Use the existing image URL by default

      // Check if a new image is selected
      if (storyImg && typeof storyImg === "object") {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || ""; // Update the image URL with the new one
      }

      const postData = {
        title,
        story,
        imageUrl, // Updated or existing image URL
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
        visitedLocation,
      };

      const response = await axiosInstance.put(`/edit-story/${storyId}`, postData);

      if (response.data && response.data.story) {
        toast.success("Story updated successfully!");
        getAllTravelStories();
        onClose();
      }
    } catch (error) {
      console.error("Update story error:", error.response?.data || error.message);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
 const handleDeleteStoryImg = async () => {
  try {
    // Check if image exists and was uploaded (URL starts with "http")
    if (!storyImg || !storyImg.startsWith("http")) {
      setStoryImg(null); // Just clear it from state if it's local
      return;
    }

    // Extract Cloudinary public ID from URL
    const imageUrlParts = storyImg.split("/");
    const publicIdWithExtension = imageUrlParts[imageUrlParts.length - 1]; // e.g., abc123.jpg
    const publicId = publicIdWithExtension.split(".")[0]; // Remove extension

    // Send request to backend to delete image
    const deleteImgRes = await axiosInstance.delete("/delete-image", {
      params: {
        publicId, // Your backend must delete by Cloudinary public_id
      },
    });

    if (deleteImgRes.data.success) {
      // After successful deletion, update the story to remove image reference
      const storyId = storyInfo._id;
      const postData = {
        title,
        story,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl: "", // Clear image from DB
      };

      const response = await axiosInstance.put("/edit-story/" + storyId, postData);

      if (response.data && response.data.story) {
        setStoryImg(null);
        toast.success("Image deleted successfully!");
      } else {
        throw new Error("Failed to update story without image.");
      }
    } else {
      throw new Error("Failed to delete image on the server.");
    }
  } catch (error) {
    console.log(error);

    if (error.response?.data?.message) {
      setError(error.response.data.message);
    } else {
      setError("An unexpected error occurred.");
    }
  }
};


  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleStoryChange = (e) => setStory(e.target.value);
  const handleVisitedLocationChange = (tags) => setVisitedLocation(tags);

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-4">
        <h5 className="text-2xl font-semibold text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>
        <div className="flex items-center gap-1 bg-cyan-50/50 p-2 rounded-lg">
          <button className="btn-small" onClick={handleAddOrUpdateClick}>
            {type === "add" ? (
              <>
                <MdAdd className="text-lg" /> ADD STORY
              </>
            ) : (
              <>
                <MdUpdate className="text-lg" /> UPDATE STORY
              </>
            )}
          </button>
          <button
            className="p-2 flex items-center justify-center hover:bg-sky-200 transition-all ease-in-out 200 rounded-full"
            onClick={onClose}
          >
            <MdClose className="text-xl text-slate-400" />
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs pt-2 text-right">{error}</p>}

      <div className="flex flex-col gap-4 pt-4">
        <div>
          <label className="input-label">TITLE</label>
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none w-full bg-slate-50 p-2 rounded"
            placeholder="A Day at the Great Wall"
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        <div className="mt-3">
          <DateSelector date={visitedDate} setDate={setVisitedDate} />
        </div>

        <div>
        <ImageSelector
           image={storyImg}
           setImage={setStoryImg}
            handleDeleteImg={handleDeleteStoryImg}
          />

        </div>

        <div>
          <label className="input-label">STORY</label>
          <textarea
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded w-full"
            placeholder="Your Story"
            rows="10"
            value={story}
            onChange={handleStoryChange}
          />
        </div>

        <div className="pt-3">
          <label className="input-label">VISITED LOCATIONS</label>
          <TagInput tags={visitedLocation} setTags={handleVisitedLocationChange} />
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
