const mongoose=require("mongoose");
const connectDB=async()=>{
    await mongoose.connect(
        "mongodb+srv://vineetpadhalni09:qMQRJkmi8EG0nlP4@cluster0.4yfio6p.mongodb.net/devTinder"
    )
}
module.exports=connectDB;

