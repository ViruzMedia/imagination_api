const path = require("path");
const jwt = require('jsonwebtoken')


const imageSchema = require("../database/schema/image.schema");

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
module.exports = { handleDisplay }