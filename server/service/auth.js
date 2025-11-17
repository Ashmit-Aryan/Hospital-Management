const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY

function setUser(user){
    const payload =  {...user};
    return jwt.sign(payload, secret_key);
}

function getUser(token){
    if(!token) return null;
     try {
        return jwt.verify(token, process.env.SECRET_KEY)
    } catch (error) {
        return null;
    }
}

function setAuthorization(users,role=[]){
    if(!users) return null;
    if(!role.includes(users.roles)) return 401;
    return 0;
}

module.exports = {
    setUser,
    getUser,
    setAuthorization
}