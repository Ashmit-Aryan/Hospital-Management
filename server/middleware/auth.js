const { setUser, getUser, setAuthorization } = require("../service/auth");

function genAuthToken(user) {
    const token = setUser(user);
    return token;
}

function verifyAuthToken(req, res, next) {
    const token = req.header('Auth');
    if(getUser(token) == null){ return res.status(401).json({error:"Null Token"}); }
    else {
      req.user = getUser(token);
      next(); // call the next middleware in the stack for setAuth
    }
}

function setAuth(req, res, next) {
  if(setAuthorization(req.user,['admin'])!= 401){
    next()
  }else{
    res.status(401).json({error:"Forbidden"});
  }

}
module.exports = {
  genAuthToken,
  verifyAuthToken,
  setAuth,
};
