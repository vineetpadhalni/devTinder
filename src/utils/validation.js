const validator=require("validator");
//sanitizing the data
const validateSignupData=(req)=>{
 const{firstname,lastname,emailId,password}= req.body;
 if(!firstname ){
    throw new Error("Firstname is Required");
 }
 if(!validator.isEmail(emailId)){
    throw new Error("Email id is not vaild");
 }
 if(!validator.isStrongPassword(password)){
    throw new Error("Enter Strong Password");
 }
}
module.exports=validateSignupData;