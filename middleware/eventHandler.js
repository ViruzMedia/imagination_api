const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'log'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'log'));
        }

        await fsPromises.appendFile(path.join(__dirname, '..', 'log', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}
const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'corsError.log');
    console.error(err.stack)
    res.status(500).send(err.message);
}

const logHandler = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'access.log');
    next();
}
module.exports = { logHandler, errorHandler };