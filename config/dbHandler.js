//***************PACKAGE-IMPORTS***************
const mongoose = require('mongoose')

//*******************SCRIPT********************


const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(process.env.DB_STRING)
        console.log('Mongo connected')
    } catch (err) {
        console.log(err)
        process.exit()
    }
}

module.exports = connectDB

