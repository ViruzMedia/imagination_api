//****************FILE-IMPORTS*****************
const path = require("path");
const crypto = require("crypto");
const jwt = require("jsonwebtoken")

const imageSchema = require("../database/schema/image.schema");
const { format } = require('date-fns');

const handleUpload = async (req, res) => {
    const files = req.files
    const random_name = crypto.randomBytes(4).toString('hex');
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const timeStamp = new Date().getTime();

    //create IMAGE runout JWT
    const accessImageToken = jwt.sign(
        { "image_name": timeStamp + '_' + random_name + '_' + files.file.name, },
        process.env.IMAGE_TOKEN_SECRET,
        { expiresIn: process.env.IMAGE_TOKEN_EXP }
    )
    //send to Database
    const result = await imageSchema.create({
        date: dateTime,
        contentType: files.file.mimetype,
        image: timeStamp + '_' + random_name + '_' + files.file.name,
        pwd: accessImageToken
    })
    //safe File to FS
    Object.keys(files).forEach(key => {
        const filepath = path.join(__dirname, '..', 'upload', timeStamp + '_' + random_name + '_' + files[key].name)
        files[key].mv(filepath, (err) => {
            if (err) {
                return res.status(500).json({ status: "error", message: err })
            }
        })
    })
    if (result) {
        return res.json({ status: 'success', link: 'http://' + process.env.API_WEB_DOMAIN + ':' + process.env.API_PORT + '/file/' + result._id, duration: "Image Expires in " + process.env.IMAGE_TOKEN_EXP })

    }
}

const handleDisplay = async (req, res) => {
    console.log(req.params.id)
    const result = await imageSchema.findById(req.params.id).exec()

    //check token timer
    if (result) {
        jwt.verify(result.pwd, process.env.IMAGE_TOKEN_SECRET, (err, decode) => {
            if (err) return res.status(403).json({ type: "error", message: 'the access-timer is expired! ask the image-owner for refresh!' });
            return res.sendFile(path.join(__dirname, '..', 'upload/' + result.image));
        })
    } else {
        return res.status(404).json({ type: "error", message: 'there is no image with this id found!' });
    }
}
module.exports = { handleUpload, handleDisplay }



