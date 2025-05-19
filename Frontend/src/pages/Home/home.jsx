import React, { useEffect, useState } from "react";
import Navbar from "../../components/Input/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Input/cards/TravelStoryCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/Input/cards/EmptyCard";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../../components/Input/cards/FilterInfoTitle";
import { getEmptyCardImg, getEmptyCardMessage } from "../../utils/helper";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";
import { FaGithubAlt } from "react-icons/fa";
import { BiSolidRocket } from "react-icons/bi";
import { BsSendFill } from "react-icons/bs";
import axios from "axios";


// Set Modal app element
Modal.setAppElement("#root");

const Home = () => {
  //these are initial conditions for functions
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateRange, setdateRange] = useState({ from: null, to: null });

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/emails", {
        email,
      });
      console.log("Email saved:", response.data);
      toast.success("email sent successfully!!);
      setEmail("");
    } catch (err) {
      console.error("Error saving email:", err);
    }
  };
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [openViewModel, setOpenViewModel] = useState({
    isShown: false,
    data: null,
  });

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get_user");
      setUserInfo(response.data?.user || null);
    } catch (error) {
      toast.error("Failed to fetch user info");
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      setAllStories(response.data?.stories || []);
    } catch (error) {
      toast.error("Failed to fetch travel stories");
    }
  };

  const updateIsFavourite = async (storyData) => {
    try {
      await axiosInstance.put(`/update-isFavourite/${storyData._id}`, {
        isFavourite: !storyData.isFavourite,
      });
      toast.success("Story updated successfully");
      if (filterType === "search " && searchQuery) {
        onSearchStory(searchQuery);
      } else if (filterType === "date") {
        filterStoriesByDate(dateRange);
      } else {
        getAllTravelStories();
      }
    } catch (error) {
      toast.error("Failed to update favorite");
    }
  };

  //handle view story to update and delete story
  const handleViewStory = (data) => {
    setOpenViewModel({ isShown: true, data });
  };
  //handle edit function for travel story
  const handleEdit = (data) => {
    setOpenAddEditModel({ isShown: true, data: data, type: "edit" });
  };

  //delete story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId);
      toast.error("story deleted successfully");
      setOpenViewModel((prevState) => ({ ...prevState, isShown: false }));
      getAllTravelStories();
    } catch (error) {
      setError("error occured here");
    }
  };

  // Search story
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query, // Send the search query to the backend
        },
      });

      if (response.data && response.data.stories) {
        setFilterType("search"); // Mark the filter type for reference
        setAllStories(response.data.stories); // Update the stories with the search results
      } else {
        setAllStories([]); // Clear stories if no results found
        toast.info("No stories match your search!");
      }
    } catch (error) {
      toast.error("An error occurred while searching for stories");
      console.error(error); // Log the error for debugging
    }
  };
 //handling searches 
  const handleClearSearch = async () => {
    setFilterType("");
    getAllTravelStories();
  };
  //filtering out stories by date Range
  const filterStoriesByDate = async (day) => {
    // if (!day || !day.from || !day.to) return;

    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = dateRange.to ? moment(day.to).valueOf() : null;
      if (startDate && endDate) {
        const response = await axiosInstance.get("travel-stories/filter", {
          params: { startDate, endDate },
        });
        if (response.data && response.data.stories) {
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    } catch (error) {
      toast.error("An error occurred while filtering stories by date");
      console.error(error);
    }
  };
  // selecting sories between dateRange
  const handleDayPicker = (day) => {
    setdateRange(day);
    filterStoriesByDate(day);
  };
  //reseting filtered stories by date rannge
  const resetFilter = () => {
    setdateRange({ from: null, to: null });
    setFilterType("");
    getAllTravelStories();
  };

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto py-10 ">
        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={() => {
            resetFilter();
          }}
        />
        <div className="flex gap-7">
          {/* //cards area */}
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-7 ">
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imgUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={item.isFavourite}
                    onClick={() => handleViewStory(item)} // Pass the item directly here
                    onFavouriteClick={() => updateIsFavourite(item)}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard
                imgSrc={getEmptyCardImg(filterType)}
                message={getEmptyCardMessage(filterType)}
              />

              //  <p className="text-center">No stories found. Click "+" to add a new story!</p>
            )}
          </div>
          {/* //calender on right side  */}
          <div className="w-[350px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-5">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayPicker}
                  pageNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() =>
          setOpenAddEditModel({ isShown: false, type: "add", data: null })
        }
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)", zIndex: 999 } }}
        className="model-box"
      >
        <AddEditTravelStory
          type={openAddEditModel.type}
          storyInfo={openAddEditModel.data}
          onClose={() =>
            setOpenAddEditModel({ isShown: false, type: "add", data: null })
          }
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      <Modal
        isOpen={openViewModel.isShown}
        onRequestClose={() => setOpenViewModel({ isShown: false, data: null })}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)", zIndex: 999 } }}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModel.data || null} // Correct data passing here
          onClose={() => {
            setOpenViewModel((prevState) => ({ ...prevState, isShown: false }));
          }}
          onEditClick={() => {
            setOpenViewModel((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModel.data || null);
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModel.data || null);
          }}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-20 mb-5 "
        onClick={() =>
          setOpenAddEditModel({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />

      <footer className="bg-primary h-20 border-t-slate-100 flex-wrap flex justify-between pl-5 pr-5 items-center fixed bottom-1 right-1 left-1">
        <div className="text-slate-700 font-semibold text-2xl">
          <a href="/dashboard">MenoTrail</a>
        </div>
        <div className="flex justify-evenly">
         
          <form
            className="flex justify-center items-center  ml-3"
           
          >
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email..."
              className="bg-slate-300 pt-2 pb-2 rounded-l pl-3 w-80 max-[445px]:w-64 pr-3 outline-none placeholder:text-slate-800 font-semibold"
              required
            />
            <button
              type="submit"
              className="pt-3 pb-3 pl-2 pr-2 rounded-r border-l-2 border-l-slate-800 bg-slate-300 text-slate-800 font-semibold"
               onSubmit={handleSubmit}
            >
              <BsSendFill className="object-cover" />
            </button>
          </form>
        </div>
      </footer>
    </>
  );
};

export default Home;
