//***************PACKAGE-IMPORTS***************
const express = require('express')

//****************FILE-IMPORTS*****************
const permissionController = require('../controller/permission.controller');

//******************SCRIPT*********************
const router = express.Router();

router.route('/role')
    .get(permissionController.handleGetRole)
    .post(permissionController.handlePostRole)
    .put(permissionController.handlePutRole)
    .delete(permissionController.handleDeleteRole)

router.route('/route')
    .get(permissionController.handleGetRoute)
    .post(permissionController.handlePostRoute)
    .put(permissionController.handlePutRoute)
    .delete(permissionController.handleDeleteRoute)

router.route('/account')
    .put(permissionController.updateAccountPermission)

module.exports = router