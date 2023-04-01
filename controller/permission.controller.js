//*****************IMPORTS*********************
const roleSchema = require("../database/schema/role.schema");
const routeSchema = require('../database/schema/route.schema')
const accountSchema = require('../database/schema/account.schema')

//******************SCRIPT*********************
const updateAccountPermission = async (req, res) => {
    const { username, role } = req.body
    if (!username || !role) return res.status(400).json({ "message": "There is a RoleID and AccountID required!" })
    try {
        const resultName = await roleSchema.findOne({ name: role })
        if (!resultName || resultName == null) return res.status(400).json({ "message": `The Role <${role}> dont exist!` })
        await accountSchema.findOneAndUpdate({ username: username, role: resultName._id })
        res.status(201).json({ message: `Changed ${username}s Role to ${role}` })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

}

const handlePostRole = async (req, res) => {
    const { name, priority, color } = req.body
    if (!name) return res.status(400).json({ "message": "There is a Role name required!" })

    //check for duplicate
    const duplicate_name = await roleSchema.findOne({ name: name }).exec()
    if (duplicate_name) {
        return res.status(400).json({ message: 'this role already exists - use a other name please!' })
    } else {
        try {
            const result = await roleSchema.create({
                "name": name,
                "color": color,
                "priority": priority
            })
            console.log(result)
            res.status(201).json({ message: `New Role < ${name} > created!` })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
}

const handlePostRoute = async (req, res) => {
    const { type, path, method, priority } = req.body
    if (!type || !path || !method) return res.status(400).json({ "message": "There is a Type, path & Method required" })

    //check for duplicate
    const duplicate_path = await routeSchema.findOne({ path: path, method: method })
    console.log(duplicate_path)
    // console.log(duplicate_path.path)
    console.log(path)
    //console.log(duplicate_path.method.toUpperCase())
    console.log(req.body.method.toUpperCase())
    if (duplicate_path) {
        if (duplicate_path.path == path && duplicate_path.method.toUpperCase() == req.body.method.toUpperCase()) {
            return res.status(400).json({ message: 'this route already exists!' })
        }
    } else {
        try {
            const result = await routeSchema.create({
                "type": type,
                "path": path,
                "method": method,
                "priority": priority
            })
            console.log(result)
            res.status(201).json({ message: `New Route < ${path} > with method < ${method} > created!` })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }

}

const handleGetRole = async (req, res) => {
    const search_id = req.body.id
    if (search_id) {
        const result = await roleSchema.findById(search_id).exec()
        return res.status(400).json(result)
    } else {
        const result = await roleSchema.find().exec()
        return res.status(400).json(result)
    }
}

const handleGetRoute = async (req, res) => {
    const search_id = req.body.id
    if (search_id) {
        const result = await routeSchema.findById(search_id).exec()
        return res.status(400).json(result)
    } else {
        const result = await routeSchema.find().exec()
        return res.status(400).json(result)
    }
}

const handlePutRole = async (req, res) => {
    const search_id = req.body.id;
    if (!search_id) return res.status(400).json({ "message": "There is a id required!" })
    try {
        const update = {};
        for (const key of Object.keys(req.body)) {
            if (req.body[key] !== '') {
                update[key] = req.body[key];
            }
        }
        await roleSchema.findByIdAndUpdate(search_id, update)
        res.status(201).json({ message: `Updated < ${search_id}` })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const handlePutRoute = async (req, res) => {
    const search_id = req.body.id;
    if (!search_id) return res.status(400).json({ "message": "There is a id required!" })
    try {
        const update = {};
        for (const key of Object.keys(req.body)) {
            if (req.body[key] !== '') {
                update[key] = req.body[key];
            }
        }
        await routeSchema.findByIdAndUpdate(search_id, update)
        res.status(201).json({ message: `Updated < ${search_id}` })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const handleDeleteRole = async (req, res) => {
    const search_id = req.body.id;
    if (!search_id) return res.status(400).json({ "message": "There is a id required to Delete something!" })
    try {
        await roleSchema.findByIdAndDelete(search_id)
        res.status(201).json({ message: `Deleted < ${search_id}` })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const handleDeleteRoute = async (req, res) => {
    const search_id = req.body.id;
    if (!search_id) return res.status(400).json({ "message": "There is a id required to Delete something!" })
    try {
        await routeSchema.findByIdAndDelete(search_id)
        res.status(201).json({ message: `Deleted < ${search_id}` })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    updateAccountPermission,
    handlePostRole,
    handlePostRoute,
    handleGetRole,
    handleGetRoute,
    handlePutRole,
    handlePutRoute,
    handleDeleteRole,
    handleDeleteRoute
}