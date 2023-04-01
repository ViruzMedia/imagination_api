const express = require('express')
const filesPayloadExists = require('../middleware/filesPayloadExists')
const fileExtLimiter = require('../middleware/fileExtLimiter')
const fileSizeLimiter = require('../middleware/fileSizeLimiter')

const fileController = require('../controller/file.controller')


//******************SCRIPT*********************
const router = express.Router();

router.get('/:id', fileController.handleDisplay)
router.post('/upload', filesPayloadExists, fileExtLimiter(process.env.FILE_EXT_LIMIT), fileSizeLimiter, fileController.handleUpload)



module.exports = router