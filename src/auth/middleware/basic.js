'use strict';

const base64 = require('base-64');
const Users = require('../models/users.js');

function basic(req, res, next) {
    if (req.headers.authorization) {
        let basicHeaderParts = req.headers.authorization.split(' ');
        let encodedValue = basicHeaderParts.pop();
        let decodedValue = base64.decode(encodedValue);
        let [username, password] = decodedValue.split(':');
        Users.authenticateBasic(username, password)
            .then((validUser) => {
                req.user = validUser;
                console.log('/////////////////////////', req.user);
                next();
            }
            ).catch(() => {
                next('Invalid User');
            }
            );
    }
}

module.exports = basic;