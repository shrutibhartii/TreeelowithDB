const mongoose=require("mongoose");
mongoose.connect(
    "mongodb+srv://shruti23cse_db_user:Shruti%401234@100xapps.rugvzma.mongodb.net/Trello"
);
const userSchema=mongoose.Schema({
    username:String,
    password:String
})
const organizationSchema=mongoose.Schema({
    title:String,
    description:String,
    admin:mongoose.Types.ObjectId,
    members:[mongoose.Types.ObjectId]

})
const organizationModel=mongoose.model("organization",organizationSchema);
const userModel=mongoose.model("users",userSchema);
module.exports={
    userModel,
    organizationModel
}