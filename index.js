//***************PACKAGE-IMPORTS***************
require('dotenv').config()

const express = require('express');
const fs = require('file-system')
const morgan = require('morgan');
const accessLogStream = fs.createWriteStream('./log/devAccess.log', { flags: 'a' });

const credentials = require('./middleware/credentials')
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const fileUpload = require("express-fileupload");
const fileUploadOptions = require("./config/uploadOptions")

const cookieParser = require('cookie-parser');

const { errorHandler } = require('./log/eventHandler')
const { logHandler } = require('./log/eventHandler')

const database = require('./config/dbHandler');

//***************STARTUP***************
const app = express();

//setup database connection (mongoDB) - userdata in .env
database();

//setup middelware for loggingfile
app.use(logHandler);

//logger (development) - logging everything to console
//delete AccessLogStream if production env

app.use(morgan('dev'));

//handle options credentials check - BEFORE CORS!
//and fetch cookies credentials req
app.use(credentials)

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Upload Middleware
app.use(fileUpload(fileUploadOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: process.env.API_URLENCODED }));

//build-in mw json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//setup error handler
app.use(errorHandler);



//*******************ROUTER*******************
app.use('/register', require('./router/register.router'))
app.use('/authentication', require('./router/authentication.router'))
app.use('/file', require('./router/file.router'))

//*******************STARTUP*******************
app.listen(process.env.API_PORT, process.env.API_DOMAIN, () => {
    console.log(Date.now() + " " + process.env.API_STARTED + process.env.API_DOMAIN + ':' + process.env.API_PORT)
});
app.get('/', function (req, res) {
    res.status(200).send({
        timestamp: Date.now(),
        message: process.env.API_STARTED + process.env.API_DOMAIN + ':' + process.env.API_PORT
    })
});
