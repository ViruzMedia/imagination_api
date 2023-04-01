//***************PACKAGE-IMPORTS***************
const express = require('express')

//****************FILE-IMPORTS*****************
const permissionController = require('../controller/permission.controller');

//******************SCRIPT*********************
const router = express.Router();

router.route('/role')
    .post(permissionController.handleNewRole)

router.route('/route')
    .post(permissionController.handleNewRoute)

module.exports = router