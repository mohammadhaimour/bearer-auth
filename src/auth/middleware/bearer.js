'use strict';

const Users = require('../models/users');

function bearer(req, res, next) {
    if (req.headers.authorization) {
        const bearerToken = req.headers.authorization.split(' ')[1];
        Users.authenticateBearer(bearerToken)
            .then((userData) => {
                req.user = userData;
                next();
            }
            ).catch(() => {
                next('Invalid Token');
            }
            );
    }
}

module.exports = bearer;