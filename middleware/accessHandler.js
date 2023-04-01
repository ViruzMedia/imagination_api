const jwt = require('jsonwebtoken');

const roleSchema = require("../database/schema/role.schema");
const routeSchema = require('../database/schema/route.schema')
const account_schema = require('../database/schema/account.schema')

const handleAccess = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const resultRoute = await routeSchema.findOne({ path: req.path }).exec()

    if (!resultRoute || !req.path) return res.sendStatus(401);
    if (resultRoute.path == req.path && resultRoute.priority == 0) {
        next() //passed ! NO PERMISSION REQUIRED!
    } else {
        if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
        //console.log(authHeader);
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) return res.sendStatus(403);//vorbidden invalid token

            const resultAccount = await account_schema.findOne({ username: decoded.UserInfo.username })
            if (!resultAccount) return res.sendStatus(403); //found no account

            req.user = resultAccount.username;
            req.role = resultAccount.role

            const resultRoles = await roleSchema.findById(req.role).exec()
            if (resultRoles._id == req.role && resultRoles.priority >= resultRoute.priority) {
                next()
            } else {
                return res.sendStatus(403)
            }
        })
    }

}


module.exports = handleAccess