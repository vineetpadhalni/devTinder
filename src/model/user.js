const mongoose=require("mongoose");
const validator = require("validator");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const userSchmea=mongoose.Schema(
    {
        firstname:{
            type:String,
            required:true,
            minLength:4,
            maxLength:40
        },
        lastname:{
            type:String
        },
        password:{
            type:String,
            required:true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Enter a Strong Password: "+value)
                }
            }
        },
        age:{
            type:Number,
            min:18,
            max:100
        },
        gender:{
            type:String,
            //this validate function only work for new user and not for patch and update data
            //to make it work for update also then you have to make runValidators:true in patch 
            validate(value){
             if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not vaild");
             }
            }
        },
        emailId:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Email is not valid");
                }
            }
        },
        photoUrl:{
            type:String,
            validate(value){
                if(!validator.isURL(value)){
                    throw new Error("Photo url is not valid");
                }
            }    
        },
        about:{
            type:String,
            default:"This is a default about of the user",

        },
        skills:{
            type:[String],
        },
       
    },{
        timestamps:true,
    }
);
userSchmea.methods.getJWT= function () {
    const user=this;
    const token=  jwt.sign({ _id: user._id }, "DEv@tinder!!@#", {
            expiresIn: "7d",
          });
    return token;
}
userSchmea.methods.validatePassword= async function (passwordbyuser) {
    const user=this;
    const passwordHash=user.password;
    const isVaildPassword = await bcrypt.compare(passwordbyuser, passwordHash);
   return isVaildPassword; 
}

const Usermodel=mongoose.model("User",userSchmea);
module.exports=Usermodel;
