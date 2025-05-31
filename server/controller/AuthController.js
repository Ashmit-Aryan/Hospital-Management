const User = require('../models/user')
const bcryptjs = require('bcryptjs');
async function handleCreateUser(req,res){
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).json({message:'Email already exist'});

    const hash = await bcryptjs.hashSync(req.body.password,10);

    req.body.password = hash;

}