require("dotenv").config();
//DOUBLE SAVE TO STAY AT SAMEPORT OTHEN NEED TO CHANGE PORT EVRY AFETR SAVING 
const express = require("express");
const config = require("./config.json");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// const multer = require("multer");
//for storing images required libraries
const upload = require("./multer");
const fs = require("fs");
const path = require("path");

const {authenticateToken} = require("./utilies"); 

const App = express();  
App.use(express.json()); 
App.use(cors({origin : "*" })); 

// user created here  
const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");

//mongodb connect
mongoose.connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

  
//created Account here 
App.post("/create-Account", async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Ensure all fields are provided
      if (!username || !email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required" });
      }
  
      // Check if the user already exists
      const isUser = await User.findOne({ email });
      if (isUser) {
        return res.status(400).json({ error: true, message: "User already exists" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create and save the new user
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
  
      // Generate an access token
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET || "default_secret_key",
        { expiresIn: "72h" }
      );
  
      return res.status(201).json({
        error: false,
        user: { username: user.username, email: user.email },
        accessToken,
        message: "Registration successful",
      });
    } catch (error) {
      console.error("Error in /create-Account:", error.message);
      return res.status(500).json({ error: true, message: "Server error" });
    }
  });

//Login code here
App.post("/login" , async(req , res) => {

    const {email , password} = req.body;
    if(!email || !password){
        return res.status(400).json({message : "email and password required"});
    }

    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({message : " user not found"});
    }
    // checking password correctness 
    const isValidpassword = await bcrypt.compare(password , user.password);
    if(!isValidpassword){
        return res.status(400).json({message : " invalid credentials"});
    }

    const accessToken = jwt.sign(
        {userId : user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "72h"}
    );
    return res.json({
        error: false,
        message : " login succesfully",
        user : {username : user.username , email : user.email},
        accessToken, 
    });
});
// postman - authorizaiton - Bearer token token (put wanted token id)
//GET USER 
App.get("/get_user", authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user; // Ensure `req.user` contains the `userId`
        
        // Find the user in the database
        const isUser = await User.findOne({ _id: userId });

        // If user does not exist, send a 401 Unauthorized status
        if (!isUser) {
            return res.status(401).json({ message: "User not found or unauthorized." });
        }

        // Send user data in response
        return res.status(200).json({
            user: isUser,
            message: "User retrieved successfully.",
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        
        // Handle server-side errors
        return res.status(500).json({ message: "Internal server error." });
    }
});

//GET TRAVEL STORY APP 
App.post("/Add-travel-story" , authenticateToken , async(req , res) => {
    const {title , story , visitedLocation , imageUrl , visitedDate} = req.body;

    const { userId } = req.user // provide accesstoken id in authorization 

    //validate required fields 
    if(!title || ! story || !visitedLocation || !imageUrl || !visitedDate){
        return res.status(400).json({error : true , message : " All fields are required"});
    }
    //convert visitedDate from milliseconds to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try{
        const travelStory = new TravelStory({ 
            title,
            story, visitedLocation , userId , 
            imageUrl , 
            visitedDate : parsedVisitedDate, // current millis to fill milsec
        });
        await travelStory.save();
        res.status(201).json({story : travelStory ,  message : "Added Successfully"});
    }catch(error){
        res.status(400).json({error : true , message :error.message});

    };
});

//Get All Travel Stories
App.get("/get-all-stories" , authenticateToken , async(req , res) => {
    const {userId} = req.user;
    try{
        const travelStories = await TravelStory.find({userId : userId}).sort({isFavourite : -1});
        res.status(200).json({stories : travelStories});
    }catch(error){
        res.status(500).json({error : true , message : error.message});
    }
    
});

//Route to handle image upload using multer installed here in backend 
App.post("/image-upload" , upload.single("image") ,async(req , res) => {
    try{
        if(!req.file){
            return res.status(400).json({error : true , message : "No image uploaded"})
        }
        const imageUrl = `http://localhost:9000/uploads/${req.file.filename}`;
        res.status(201).json({imageUrl});
    }catch(error){
        res.status(500).json({error:true , message : error.message});
    }
});


// deleting image from uploads- body- form-data put {key :values} use delete 
App.delete("/delete-image" , async(req , res) => {
    const {imageUrl} = req.query;

    if(!imageUrl){
        return res.status(400).json({error : true , message : "imageUrl parameter is required"});
    }
    try{
        //Extract the filename from the imageUrl
        const filename = path.basename(imageUrl);

        const filePath = path.join(__dirname , 'uploads' , filename);

        //check if the file exists
        if(fs.existsSync(filePath)){
            //delete the file from the uploads folder
            fs.unlinkSync(filePath);
            res.status(200).json({message : "image deleted successfully"});
        }
        else{
            res.status(200).json({error : true , message: "image not found"});
        }
    }catch(error){
        res.status(500).json({error : true , message : error.message});
    }

});
//server static files from the uploads and assests directory
App.use("/uploads" , express.static(path.join(__dirname , "uploads")));
App.use("/assets" , express.static(path.join(__dirname , "assets")));

//edit travel story
App.put("/edit-story/:id", authenticateToken, async (req, res) => {

    //first Add-travel-story by get user accesstoken , Add-story (take accesstoken )->
    // get-all-story(put accesstoken on authorization -> bearer token) , edit-story(update data on body ,raw) -> put get-all-story accesstoken - > update data successfully
    const { id } = req.params;
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user; // Provide access token ID in authorization

    // Validate required fields
    if (!title|| !story || !visitedLocation|| !visitedDate || !imageUrl) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    // Convert visitedDate from milliseconds to Date object and validate
    const parsedVisitedDate = new Date(parseInt(visitedDate));
   

    try { 
        //find the travel story by ID and ensure it belongs to the authenticated user
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if (!travelStory) { // if travel story not available then 
            return res.status(404).json({ error: true, message: "Travel story not found" });
        }

        const placeholderImgUrl = "https://capturemoments-backend.onrender.com/assets/placeholder.png";

        // Update fields
        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocation = visitedLocation;
        travelStory.imageUrl = imageUrl || placeholderImgUrl;
        travelStory.visitedDate = parsedVisitedDate;

        await travelStory.save();
        res.status(200).json({ story: travelStory, message: "Update successful" });

    } catch (error) {
        console.error("Error updating travel story:", error);
        res.status(500).json({ error: true, message: "Internal server error" });
    }
});

//delete travel story:- edit story data put accesstoken in authorization story delete from upload folder and database itself
App.delete("/delete-story/:id" , authenticateToken , async(req , res) =>{
    const {id} = req.params;
    const {userId} = req.user;

    try{
        //find the travel story by Id and ensure it belongs to the authenticated user
        const travelStory = await TravelStory.findOne({_id : id , userId : userId});

        if(!travelStory){
            return res.status(404).json({error : true , maessage : "travel story not found"});
        }

        //delete the travel story from database
        await travelStory.deleteOne({_id : id , userId : userId});

        // extract the filename from the ImageUrl 
        const imageUrl = travelStory.imageUrl;
        const filename = path.basename(imageUrl);

        //define the file path 
        const filePath = path.join(__dirname , 'uploads' , filename);

        //delete the image file form the uploads folder
        fs.unlink(filePath , (err) => {
            if(err){
                console.error("falied to delted image file :" , err);
                //optionally , you counld  still respond with success status here
                // if you don't want to treat as a crotical error 

            }
        });
        res.status(200).json({message:"travel story deleted successfully"});
    }
    catch(error){
        res.status(500).json({error:true , message: " internal error"});
    }
}); 

//update-is-Favourite- edit story ,  only edit isFavourite from false to true user's accesstoken, same story's same image same id needed 
App.put("/update-isFavourite/:id" , authenticateToken ,async(req , res) => {
    const {id} = req.params;
    const {isFavourite} = req.body;
    const{userId} = req.user;

    try{
        const travelStory =await TravelStory.findOne({_id : id , userId : userId});

        if(!travelStory){
            return res.status(404).json({error :true ,message : "Travel stroy not found"});
        }

        travelStory.isFavourite = isFavourite;
        await travelStory.save();
        res.status(200).json({story:travelStory , message : 'update successfully'});
    }
    catch(error){
        res.status(500).json({error:true , message : "internal error"})
    }
});
//for authentication one user's acccesstoken is needed to perform any task on app stories every task is needed  accesstoken if not provide it shows error unauthorizised task 

//Search travel stories- authorization token is required  , not any single space should be present between words
App.get("/search", authenticateToken, async (req, res) => {
    const { query } = req.query;
    const { userId } = req.user;

    if (!query) {
        return res.status(400).json({ error: true, message: "Query is required" });
    }

    try {
        const searchResults = await TravelStory.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { story: { $regex: query, $options: "i" } }, // Fixed typo: "$options"
                { visitedLocation: { $regex: query, $options: "i" } }
            ],
        }).sort({ isFavourite: -1 });

        return res.status(200).json({ stories: searchResults }); // Added return for clarity
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
});

//Filter travel stories by date range - authorization accesstoken is needed and startDate and endDate as param required take form visitedDate from story  
App.get("/travel-stories/filter" , authenticateToken , async(req ,res) =>{
    const {startDate , endDate} = req.query;
    const {userId} = req.user;

    try{
        //converts startDate and endDate from milliseconds to date objects
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        //find travel stories that belong to the authenticate user and fall within the date range
        const filteredStories = await TravelStory.find({
            userId : userId,
            visitedDate : {$gte :start , $lte :end},
        }).sort({isFavourite : -1});
        res.status(200).json({stories : filteredStories});
    }catch(error){
        res.status(500).json({error : true , message : error.message});
    }
});
//get to see data on postman 
//post to send data on database 


App.listen(9000);
module.exports = App; 
