const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const {setUser} = require('../middleware/auth');

async function login(req,res){
    const userExist = await User.findOne({email: req.body.email});
    if(!userExist) {return res.status(503).send({message: "User Dont Exist, Please contact admin"});}

    //Validate Password
    const validPass = await bcryptjs.compare(req.body.password , userExist.password);
    if(!validPass) {return res.status(403).send({message: "Password or Email is Worng"});}

    const token = setUser(userExist);
    res.status(200).send({message:"Logged In",sessionToken:token});
}

module.exports = {login};