//***************PACKAGE-IMPORTS***************
const express = require('express')

const handleDisplay = require('../controller/display.controller')
const verifyJWT = require('../middleware/verifyJWT')
//******************SCRIPT*********************
const router = express.Router();

router.get('/:id', verifyJWT, handleDisplay.handleDisplay)

module.exports = router