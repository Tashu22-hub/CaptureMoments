import React from 'react';
import { GrMapLocation } from 'react-icons/gr';
import { MdUpdate, MdDeleteOutline, MdClose } from "react-icons/md";
import moment from 'moment';

const ViewTravelStory = ({ storyInfo, onClose, onDeleteClick, onEditClick }) => {
  if (!storyInfo) {
    return null; // Avoid rendering if no storyInfo is provided
  }

  const { title, visitedDate, visitedLocation = [] } = storyInfo;

  return (
    <div className="relative">
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        <div className="flex items-center gap-1 bg-cyan-50/50 p-2 rounded-lg">
          <button className="btn-small" onClick={onEditClick}>
            <MdUpdate className="text-lg" /> UPDATE STORY
          </button>
          <button className="btn-small btn-delete" onClick={onDeleteClick}>
            <MdDeleteOutline className="text-lg" /> DELETE
          </button>
          <button
            className="p-2 flex items-center justify-center hover:bg-sky-200 transition-all ease-in-out 200 rounded-full"
            onClick={onClose}
          >
            <MdClose className="text-xl text-slate-400" />
          </button>
        </div>
      </div>

      {/* Story Information */}
      <div>
        <div className="flex-1 flex flex-col gap-2 py-4">
          <h1 className="text-2xl text-slate-950">
            {title || "Untitled Story"}
          </h1>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {visitedDate
                ? moment(visitedDate).format("Do MMM YYYY")
                : "Date not provided"}
            </span>

            <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1">
              <GrMapLocation className="text-sm" />
              {visitedLocation.length > 0 ? (
                visitedLocation.map((item, index) =>
                  index === visitedLocation.length - 1 ? `${item}` : `${item}, `
                )
              ) : (
                <span>No locations provided</span>
              )}
            </div>
          </div>
        </div>
        <img src={storyInfo && storyInfo.imageUrl} 
          alt="selected"
          className='w-full h-[300px] object-cover rounded-lg' 
          />

          <div className='mt-4' >
            <p className='text-sm text-slate-950 leading-6 text-justify whitespace-pre-line'>
              {storyInfo.story}
            </p>
          
          </div>
      </div>
    </div>
  );
};

export default ViewTravelStory;
