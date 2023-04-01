//***************PACKAGE-IMPORTS***************
const express = require('express')

//****************FILE-IMPORTS*****************
const registerController = require('../controller/register.controller');
//******************SCRIPT*********************
const router = express.Router();

router.post('/', registerController.handleNewAccount)

module.exports = router