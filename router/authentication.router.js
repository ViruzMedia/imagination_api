//***************PACKAGE-IMPORTS***************
const express = require('express')

//****************FILE-IMPORTS*****************
const authenticationController = require('../controller/authentication.controller');


//******************SCRIPT*********************
const router = express.Router();

router.post('/login', authenticationController.handleAuthentication)
router.get('/refresh', authenticationController.handleRefreshToken)
router.get('/logout', authenticationController.handleLogout)

module.exports = router