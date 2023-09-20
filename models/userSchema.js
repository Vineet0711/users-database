const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    fName:{
        type:String,
        required:true,
        trime:true
    },
    lName:{
        type:String,
        required:true,
        trime:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true,
        minlength:10,
        maxlength:10
    },
    gender:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    profile:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    dateCreated:Date,
    dateUpdated:Date
});

const details=new mongoose.model('details',userSchema);

module.exports=details;