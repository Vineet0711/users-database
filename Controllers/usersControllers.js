const details=require("../models/userSchema");
const moment =require('moment');
const csv=require('fast-csv');
const fs = require('fs');
const BASE_URL = process.env.BASE_URL;


exports.userpost = async (req, res) => {
    const file = req.file.filename;
    const { fName, lName, email, mobile, gender, location, status } = req.body;

    if (!fName || !lName || !email || !mobile || !gender || !location || !status || !file) {
        res.status(401).json("All Inputs is required")
    }
    else{

    try {
        const preuser = await details.findOne({ email: email });

        if (preuser) {
            res.status(401).json("This user already exist in our databse")
        } else {

            const dateCreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

            const userData = new details({
                fName, lName, email, mobile, gender, status, profile: file, location, dateCreated
            });
            await userData.save();
            res.status(200).json(userData);
        }
    } catch (error) {
        res.status(401).json(error);
        console.log("catch block error")
    }
}
};
exports.userget=async (req,res)=>{
    const search =req.query.search|| "";
    const gender=req.query.gender|| "All";
    const status=req.query.status || "All";
    const sort=req.query.sort || "new";
    const page=req.query.page || 1;
    const itemPerPage=5;

    const query ={
        fName:{$regex:search,$options:"i"}
    }
    if(gender!=='All'){
        query.gender=gender;
    }
    if(status!=='All'){
        query.status=status;
    }
    try {
        const skip=(page-1)*itemPerPage;

        const count = await details.countDocuments(query);
        
        const usersData=await details.find(query)
        .sort({dateCreated:sort=='new'?-1:1})
        .limit(itemPerPage)
        .skip(skip);


        const pageCount=Math.ceil(count/itemPerPage)
        
        res.status(200).json({
            Pagination:{
                count,pageCount
            },
            usersData
        });
    } catch (error) {
        res.status(401).json(error);
    }
}

exports.singleUserGet=async (req,res)=>{
    const {id}=req.params;
    try {
        const userData= await details.findOne({_id:id});
        res.status(200).json(userData)
    } catch (error) {
        res.status(401).json(error);
    }
}

exports.useredit = async (req,res)=>{
    const {id}=req.params;
    const { fName, lName, email, mobile, gender, location, status ,user_profile} = req.body;
    const file=req.file?req.file.filename:user_profile;

    const dateUpdated=moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    try {
        const updateUser=await details.findByIdAndUpdate({_id:id},{
            fName, lName, email, mobile, gender, status, profile: file, location, dateUpdated
        },{
            new:true
        })

        await updateUser.save();
        res.status(200).json(updateUser)
    } catch (error) {
        res.status(401).json(error)
    }
}

exports.userdelete =async (req,res)=>{
    const {id}=req.params;

    try {
        const deleteUser=await details.findByIdAndDelete({_id:id});
        res.status(200).json(deleteUser);
    } catch (error) {
        res.status(401).json(error)
    }
}

exports.userstatus= async (req,res)=>{
    const {id}=req.params;
    const {data}=req.body;

    try {
        const userStatusUpdate =await details.findByIdAndUpdate({_id:id},{status:data},{new:true});
        res.status(200).json(userStatusUpdate);
    } catch (error) {
        res.status(401).json(error)
    }
}

exports.userExport = async (req,res)=>{
    try {
        const usersData=await details.find();
        const csvStream =csv.format({headers:true});
        
      if(!fs.existsSync("public/files/export")){
        if(!fs.existsSync("public/files")){
            fs.mkdirSync("public/files/")
        }
        
        if(!fs.existsSync("public/files/export")){
            fs.mkdirSync("./public/files/export")
        }
      }  console
      
      const writableStream =fs.createWriteStream(
        "public/files/export/users.csv"
      )
      
      csvStream.pipe(writableStream);
      writableStream.on("finish",function(){
        res.json({
            downloadUrl:`${BASE_URL}/files/export/users.csv`
        })
      });

      if(usersData.length>0){
        usersData.map((user)=>{
            csvStream.write({
                FirstName:user.fName?user.fName:".",
                LastName:user.lName?user.lName:".",
                Email:user.email?user.email:".",
                Phone:user.mobile?user.mobile:".",
                Gender:user.gender?user.gender:".",
                Status:user.status?user.status:".",
                Profile:user.profile?user.profile:".",
                Location:user.location?user.location:".",
                DateCreated:user.dateCreated?user.dateCreated:".",
                DateUpdated:user.dateUpdated?user.dateUpdated:".",
            })
        })
      }
      csvStream.end();
      writableStream.end();
    } catch (error) {
        console.log("Error is here")
        res.status(401).json(error)
    }
}