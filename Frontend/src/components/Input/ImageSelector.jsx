import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaRegFileImage } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";


const ImageSelector = ({ image, setImage, handleDeleteImg }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // Set preview URL if an image URL is provided (e.g., from existing data)
    if (typeof image === "string") {
      setPreviewUrl(image);
    }
  }, [image]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
        setImage(file); // Update the selected image file
      };
      reader.readAsDataURL(file);
    }
  };

  const onChooseFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onRemoveImage = () => {
    setPreviewUrl(null);
    setImage(null);
    if (typeof handleDeleteImg === "function") {
      handleDeleteImg(); // Call the delete function if provided
    }
  };

  return (
    <div className="image-selector">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Display logic */}
      {!previewUrl ? ( 
        <button
          type="button"
          className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50"
          onClick={onChooseFile}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border-cyan-100">
            <FaRegFileImage className="text-2xl text-cyan-500" />
          </div>
          <p className="text-sm text-slate-500">Browse image files to upload</p>
        </button>
      ) : (
        <div className="relative w-full h-[220px]">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded"
          />
          <button
            type="button"
            className="absolute top-2 right-2 p-2 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white rounded-lg shadow-red-200"
            onClick={onRemoveImage}
          >
            <MdDeleteOutline className="text-xl" />
          </button>
        </div>
      )}
    </div>
  );
};

// PropTypes for type safety
ImageSelector.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]), // Can be a file object or a URL string
  setImage: PropTypes.func.isRequired, // Function to update the selected image
  handleDeleteImg: PropTypes.func, // Optional: Function to handle server-side image deletion
};

ImageSelector.defaultProps = {
  image: null,
  handleDeleteImg: null,
};

export default ImageSelector;
