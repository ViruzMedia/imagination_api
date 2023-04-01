//*****************IMPORTS*********************
const roleSchema = require("../database/schema/role.schema");
const routeSchema = require('../database/schema/route.schema')
const account_schema = require('../database/schema/account.schema')

//******************SCRIPT*********************

const handleNewRole = async (req, res) => {
    const { name, priority, color } = req.body
    console.log(name)
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

const handleNewRoute = async (req, res) => {
    const { type, path, method, priority } = req.body
    if (!type || !path || !method) return res.status(400).json({ "message": "There is a Type, path & Method required" })

    //check for duplicate
    const duplicate_path = await routeSchema.findOne({ path: path }).exec()
    if (duplicate_path) {
        return res.status(400).json({ message: 'this route already exists!' })
    } else {
        try {
            const result = await routeSchema.create({
                "type": type,
                "path": path,
                "method": method,
                "priority": priority
            })
            console.log(result)
            res.status(201).json({ message: `New Route < ${path} > created!` })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
}

module.exports = { handleNewRole, handleNewRoute }