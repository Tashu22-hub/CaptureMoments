import React from "react";
import logo from "../../assets/travel.png"; // Ensure the path is correct and the image exists
import ProfileInfo from "./cards/profileInfo"; // Adjusted to PascalCase for convention
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

const Navbar = ({ userInfo ,
  searchQuery, setSearchQuery , onSearchNote , handleClearSearch
}) => {
  const isToken = localStorage.getItem("token"); // Check for token in local storage
  const navigate = useNavigate(); // Initialize navigation hook

  // Logout handler
  const onLogout = () => {
    localStorage.clear(); // Clear all data from local storage
    navigate("/login"); // Redirect to the login page
  };

  //handle searching values  or queries to fetch the story 
  const handleSearch =() =>{ 
    if(searchQuery){
      onSearchNote(searchQuery);
    }
  }
  const onClearSearch =() =>{
    handleClearSearch();
    setSearchQuery("");
  }
  return (
    <div className=" flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10 bg-primary  border-slate-200 shadow-lg shadow-slate-700 ">
      {/* Logo */}
      <p className="font-bold text-2xl text-slate-700">MemoTrail</p>

      {/* Profile Information or Login Button */}
      {isToken &&  (
        <>
        <SearchBar value={searchQuery}
        onChange = {({target}) =>{
          setSearchQuery(target.value);
        }}
        handleSearch = {handleSearch}
        onClearSearch ={onClearSearch}
        /> 
        <ProfileInfo userInfo={userInfo || {}} onLogout={onLogout} />
        {" "}
     </>
      )}

    </div>
  );
};

export default Navbar;
