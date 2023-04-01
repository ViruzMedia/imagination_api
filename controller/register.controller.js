const account_schema = require('../database/schema/account.schema')
const bcrypt = require('bcrypt')

const handleNewAccount = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username) {
        return res.status(400).json({ message: 'username is a required field!' })
    } else if (!email) {
        return res.status(400).json({ message: 'e-mail is a required field!' })
    } else if (!password) {
        return res.status(400).json({ message: 'password is a required field!' })
    } else {
        //check for duplicate username
        const duplicate_username = await account_schema.findOne({ username: username }).exec();
        //check for duplicate email
        const duplicate_email = await account_schema.findOne({ email: email }).exec();
        if (duplicate_username) {
            return res.status(400).json({ message: 'this username already exists' })
        } else if (duplicate_email) {
            return res.status(400).json({ message: 'this email already exists' })
        } else {
            const password_hash = await bcrypt.hash(password, 10)
            if (password_hash) {
                try {
                    const result = await account_schema.create({
                        "username": username,
                        "email": email,
                        "password": password_hash
                    })

                    console.log(result)
                    res.status(201).json({ message: `New Account for ${username} created!` })
                } catch (err) {
                    res.status(500).json({ message: err.message })
                }
                //create & store Account
            }
        }
    }
}

module.exports = { handleNewAccount }