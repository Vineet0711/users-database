const express = require("express");
const router = new express.Router();
const upload = require("../multerConfig/storageConfig")
const controllers = require("../Controllers/usersControllers");

router.post("/user/register",upload.single("user_profile"),controllers.userpost);
router.get('/user/detail',controllers.userget);
router.get('/user/:id',controllers.singleUserGet);
router.put("/user/edit/:id",upload.single("user_profile"),controllers.useredit);
router.delete("/user/delete/:id",controllers.userdelete);
router.put("/user/status/:id",controllers.userstatus);
router.get("/userexport",controllers.userExport);

module.exports = router