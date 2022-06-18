'use strict';

const express = require('express');
const bcrypt = require('bcrypt');



const app = express();
app.use(express.json());


const errorHandler = require('./error/500.js');
const notFound = require('./error/404.js');
const basic = require('./auth/middleware/basic.js');
const bearer = require('./auth/middleware/bearer.js');
const users = require('./auth/models/users.js');



app.post('/signup', async (req, res) => {
    try {
        let username = req.body.username;
        let password = await bcrypt.hash(req.body.password, 10);

        const record = await users.create({
            username: username,
            password: password,
        });
        res.status(201).json(record);
    } catch (e) {

        throw new Error("signup error");
    }
});

app.post('/signin', basic, async (req, res) => {
    res.status(200).json(req.user);
});

app.get('/users', bearer, async (req, res) => {
    try {
        const records = await users.findAll();
        res.status(200).json(records);
    }
    catch (e) {
        console.log(e);
    }
});

app.get('/secret', bearer, async (req, res) => {
    res.json({
        'message': 'You are authorized to view the user ',
        'user': req.user
    })
});


app.use(notFound);
app.use(errorHandler);

module.exports = {
    app: app,
    startup: (port) => {
        app.listen(port, () => {
            console.log(`Server Up on ${port}`);
        });
    },
};

















