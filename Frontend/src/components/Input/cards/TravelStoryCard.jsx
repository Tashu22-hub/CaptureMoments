import React from "react";
import moment from "moment/moment";
import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";

const TravelStoryCard = ({
  imgUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavourite,
  onFavouriteClick,
  onClick,
}) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all ease-in-out relative cursor-pointer ">
      {/* Image Section */}
      <img
        src={imgUrl}
        alt={title}
        className="w-full h-45 object-cover rounded-t-lg"
        onClick={onClick}
      />
      <button className="w-10 h-10 flex items-center justify-center bg-white/40 rounded-lg border-white/30 absolute top-4 right-4" onClick={onFavouriteClick}>
      <FaHeart className= {`icon-btn ${isFavourite ? "text-red-500" : "text-white" }`} 
      />
      </button>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            {/* Title */}
            <h6 className="text-sm font-medium">{title}</h6>

            {/* Date */}
            <span className="text-xs text-slate-500">
              {date ? moment(date).format("Do MMM YYYY") : "-"}
            </span>
          </div>

          {/* Favorite Icon */}
          <FaHeart
            className={`text-lg cursor-pointer ${
              isFavourite ? "text-red-500" : "text-gray-400"
            }`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card's onClick
              if (onFavouriteClick) onFavouriteClick();
            }}
          />
        </div>
        <p className="text-xs text-slate-600 mt-2 rounded-lg">{story?.slice(0, 60)}</p>
        {/* Location */}
        <div className="inline-flex items-center gap-2 text-{13px} text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
          <GrMapLocation className="text-xs" />
          
          {visitedLocation.map((item , index) => 
            visitedLocation.length == index + 1 ? `${item }` : `${item},`)}
        </div>

        {/* Story */}
        {/* <p className="mt-3 text-sm text-slate-700 line-clamp-3">{story}</p> */}
      </div>
    </div>
  );
};

export default TravelStoryCard;
