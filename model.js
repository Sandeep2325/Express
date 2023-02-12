// const schema = require("./schema.js")
const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/Firstdb');

const authorschema=new mongoose.Schema({
    name:String,
    posted:Date

})
const blogpostsSchema = new mongoose.Schema({
    blogname: String,
    description: String,
    author :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'author'
    }
})
const contactSchema= new mongoose.Schema({
fullname:{
    type:String,
    required: [true,"Please Enter First Name"]
},
phone:{
    type:String,
    min:10,
    max:20,
},
email:{
    type:String,
    min:3,
    max:256,
},
message:{
    type:String,
    required:[true,"Please Say Something"]
}

})


const author=mongoose.model("author",authorschema)
const contactus=mongoose.model("contactus",contactSchema)
const blogs = mongoose.model("blogs", blogpostsSchema)

module.exports = {
    blogs,
    contactus,
    author,
    mongoose,
};
