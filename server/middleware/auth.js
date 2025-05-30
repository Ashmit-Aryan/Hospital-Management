const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY

function setUser(id,user){
    const payload =  {...user};
    return jwt.sign(payload, secret_key);
}

function getUser(token){
    if(!token) return null;
    return jwt.verify(token,secret_key);
}