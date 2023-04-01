const account_schema = require('../database/schema/account.schema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/* Possible Note for FrontEnd-Development!
- the frontEnd fetch() functions requires the "credentials: 'include' Option!"
*/

const handleAuthentication = async (req, res) => {
    const { username, password } = req.body

    if (!username) {
        return res.status(400).json({ message: 'username is a required field!' })
    } else if (!password) {
        return res.status(400).json({ message: 'password is a required field!' })
    } else {
        const getUserFromDB = await account_schema.findOne({ username: username }).exec()
        if (!getUserFromDB) {
            return res.status(401).json({ message: `no user with name ${username} found!` })
        } else {
            //evaluate password
            const match = await bcrypt.compare(password, getUserFromDB.password)
            if (match) {
                //create JWT
                const accessToken = jwt.sign({ "username": getUserFromDB.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXP })
                const refreshToken = jwt.sign({ "username": getUserFromDB.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXP })

                //update RefreshToken @ Database
                await account_schema.findByIdAndUpdate(getUserFromDB._id, { refreshToken: refreshToken });

                //send refreshToken grab secure
                res.cookie('refreshToken', refreshToken, process.env.COOKIE_SETTING_PRODUCTION, { maxAge: 24 * 60 * 60 * 1000 });

                //send accessToken public for frontEndDev <3
                res.json({ accessToken })
            } else {
                res.status(401).json({ message: "wrong password" })
            }
        }
    }
}

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.refreshToken) return res.sendStatus(401);

    const refreshToken = cookies.refreshToken;
    const result = await account_schema.findOne({ refreshToken: refreshToken })

    if (!result) return res.sendStatus(403); //forbidden
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
        if (err || result.username !== decode.username) {

            console.log(err)
            return res.sendStatus(403) //forbidden
        } else {
            const accessToken = jwt.sign({ "username": decode.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXP })
            res.json({ accessToken })
        }

    }
    )
}

const handleLogout = async (req, res) => {
    //on frontEnd, also delete the accessToken!
    const cookies = req.cookies
    if (!cookies?.refreshToken) return res.sendStatus(204);  //succesfull but no Content
    const refreshToken = cookies.refreshToken;

    //is refreshToken in DB?
    const findOne = await account_schema.findOne({ refreshToken: refreshToken })
    if (!findOne) {
        res.clearCookie('refreshToken', { httpOnly: true });
        return res.sendStatus(204) //succesfull but no Content
    } else {
        const editOne = await account_schema.findOneAndUpdate(refreshToken, { refreshToken: ' ' })
        if (editOne) {
            res.clearCookie('refreshToken', process.env.COOKIE_SETTING_PRODUCTION); //secure: true - only serves on https
            res.sendStatus(204);
        } else {
            res.sendStatus(500)
        }
    }
    //delete refreshKey of User in DB


}

module.exports = { handleAuthentication, handleRefreshToken, handleLogout }