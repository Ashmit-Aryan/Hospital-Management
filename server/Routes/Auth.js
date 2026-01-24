const router = require('express').Router();
const {handleCreateUser} = require('../controller/UserController')
const {login} = require('../controller/AuthController');
const {setAuth,verifyAuthToken} = require('../middleware/auth')

router.post("/create-user",verifyAuthToken,setAuth,handleCreateUser)

router.post("/login",login);

module.exports = router;