const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY

function setUser(user){
    const payload =  {...user};
    return jwt.sign(payload, secret_key);
}

function getUser(req,res,next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send({message: "Access Denied"});
     try {
        req.user = jwt.verify(token, process.env.SECRET_KEY)
        next();
    } catch (error) {
        return res.status(400).send({message: "Invalid Token"});
    }
}

module.exports = {
    setUser,
    getUser
}