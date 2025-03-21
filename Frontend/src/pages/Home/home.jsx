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


// Set Modal app element
Modal.setAppElement("#root");

const Home = () => {
  //these are initial conditions for functions
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery , setSearchQuery] = useState('');
  const [filterType ,setFilterType] = useState('');
  const [dateRange , setdateRange] = useState({from: null , to: null});
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
      if(filterType === "search " && searchQuery){
        onSearchStory(searchQuery);

      }
      else if(filterType === "date"){
        filterStoriesByDate(dateRange);
      }else{
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
    setOpenAddEditModel({ isShown: true, data:data , type : "edit"});
  }

  //delete story 
  const deleteTravelStory = async(data) => {
    const storyId = data._id;
    try{
      const response = await axiosInstance.delete("/delete-story/" + storyId);
      toast.error("story deleted successfully");
      setOpenViewModel((prevState) => ({...prevState , isShown :false}));
      getAllTravelStories();
    }
    catch(error){
      setError("error occured here");
    }
  }

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
  //handling clearing of story or queries 
  const handleClearSearch =async() =>{
    setFilterType("");
    getAllTravelStories();
  }
  //filtering out stories by date Range 
  const filterStoriesByDate = async (day) => {
    // if (!day || !day.from || !day.to) return;

    try {
      const startDate = day.from ? moment(day.from).valueOf():null;
      const endDate = dateRange.to ? moment(day.to).valueOf():null;
      if(startDate && endDate){
        const response = await axiosInstance.get("travel-stories/filter" , {
          params:{ startDate ,endDate},
        });
      if (response.data && response.data.stories){
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
  const handleDayPicker = (day) =>{
    setdateRange(day);
    filterStoriesByDate(day);
  }
  //reseting filtered stories by date rannge
  const resetFilter = () =>{
    setdateRange({from:null , to:null});
    setFilterType("");
    getAllTravelStories();
  }

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} searchQuery ={searchQuery} setSearchQuery ={setSearchQuery} 
      onSearchNote ={onSearchStory} handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto py-10">
        <FilterInfoTitle 
        filterType ={filterType}
        filterDates = {dateRange}
        onClear ={() =>{
          resetFilter();
        }}
/>
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
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
              <EmptyCard imgSrc={getEmptyCardImg(filterType)} message={getEmptyCardMessage(filterType)} />


              // <p className="text-center">No stories found. Click "+" to add a new story!</p>
            )}
          </div>
          <div className="w-[320px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lgj">
            <div className="p-3">
              <DayPicker 
              captionLayout="dropdown-buttons"
              mode ="range"
              selected ={dateRange}
              onSelect ={handleDayPicker}
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
        onRequestClose={() =>
          setOpenViewModel({ isShown: false, data: null })
        }
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)", zIndex: 999 } }}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModel.data || null} // Correct data passing here
          onClose={() => {setOpenViewModel((prevState) =>({ ... prevState , isShown:false })) ;
        }}
          onEditClick={() => {
            setOpenViewModel((prevState) =>({ ... prevState , isShown:false }));
            handleEdit(openViewModel.data || null);

          }}
          onDeleteClick={() => {
           deleteTravelStory(openViewModel.data ||null);

          }}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() =>
          setOpenAddEditModel({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </>
  );
};

export default Home;
