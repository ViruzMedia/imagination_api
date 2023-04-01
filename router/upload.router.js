//***************PACKAGE-IMPORTS***************
const express = require('express')


const filesPayloadExists = require('../middleware/filesPayloadExists')
const fileExtLimiter = require('../middleware/fileExtLimiter')
const fileSizeLimiter = require('../middleware/fileSizeLimiter')

const handleUpload = require('../controller/upload.controller')

//******************SCRIPT*********************
const router = express.Router();

router.post('/', filesPayloadExists, fileExtLimiter(process.env.FILE_EXT_LIMIT), fileSizeLimiter, handleUpload.handleUpload)

module.exports = router