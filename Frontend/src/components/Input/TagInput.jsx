import React, { useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import { GrMapLocation } from 'react-icons/gr';

const TagInput = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState('');

    // Add a new tag to the list
    const addNewTag = () => {
        if (inputValue.trim() !== '') {
            setTags([...tags, inputValue.trim()]); // Add new tag
            setInputValue(''); // Clear input field
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // Handle "Enter" key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            addNewTag();
        }
    };

    // Handle removing a tag
    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div>
            {/* Display the tags */}
            {tags.length > 0 && (
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="flex items-center gap-2 text-sm text-cyan-600 bg-cyan-200/40 px-3 py-1 rounded"
                        >
                            <GrMapLocation className="text-sm" />
                            {tag}
                            <button
                                onClick={() => handleRemoveTag(tag)} // Pass the tag to be removed
                                className="text-cyan-600 hover:text-red-500"
                            >
                                <MdClose />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-4 mt-3">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange} // Handle input change
                    onKeyDown={handleKeyDown} // Add tag on "Enter" key press
                    className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
                    placeholder="Add Location"
                />
                <button
                    className="border border-cyan-500 bg-white hover:bg-cyan-500 rounded-sm w-8 h-8 flex items-center justify-center"
                    onClick={addNewTag} // Add tag on button click
                >
                    <MdAdd className="text-2xl text-cyan-500 hover:text-white" />
                </button>
            </div>
        </div>
    );
};

export default TagInput;
