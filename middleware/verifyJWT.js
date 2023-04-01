const jwt = require('jsonwebtoken');

const handleJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.sendStatus(401);

    console.log(authHeader);

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) return res.sendStatus(403);//vorbidden invalid token
        req.user = decode.username;
        next();
    })
}

module.exports = handleJWT