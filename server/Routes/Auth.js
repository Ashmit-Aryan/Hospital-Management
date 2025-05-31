const router = require('express').Router();
const {handleCreateUser} = require('../controller/UserController')
const {login} = require('../controller/AuthController');

router.post("/create-user", handleCreateUser)

router.post("/login",login);

module.exports = router;