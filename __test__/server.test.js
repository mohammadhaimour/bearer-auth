'use strict';

process.env.SECRET = "TEST_SECRET";

const { sequelize } = require('../src/auth/models/index');
const supertest = require('supertest');
const { app } = require('../src/server.js');

const fackeApp = supertest(app);

let newUser = {
    user: { username: 'ali', password: '123' },
};
let accessToken = null;

beforeAll(async () => {
    await sequelize.sync();
});


describe(' router', () => {

    it(' create a new user ', async () => {

        const res = await fackeApp.post('/signup').send(newUser.user);
        const userR = res.body;

        expect(res.status).toBe(201);
        expect(userR.username).toEqual(newUser.user.username);
    });



    it(' signin with authenticateBasic ', async () => {
        let { username, password } = newUser.user;

        const res = await fackeApp.post('/signin')
            .auth(username, password);

        const userR = res.body;
        expect(res.status).toBe(200);
        expect(userR.token).toBeDefined();
        expect(userR.username).toEqual(username);
    });




    it(' signin with bearer auth token', async () => {
        let { username, password } = newUser.user;
        const response = await fackeApp.post('/signin')
            .auth(username, password);
        accessToken = response.body.token;
        const bearerResponse = await fackeApp
            .get('/users')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(bearerResponse.status).toBe(200);
    });



    it('basic fails with known user and wrong password ', async () => {

        const response = await fackeApp.post('/signin')
            .auth('Rami', '123')
        const { user, token } = response.body;

        expect(response.status).toBe(500);
        expect(user).not.toBeDefined();
        expect(token).not.toBeDefined();
    });

    it('basic fails with unknown user', async () => {

        const response = await fackeApp.post('/signin')
            .auth('hiam', '123')
        const { user, token } = response.body;

        expect(response.status).toBe(500);
        expect(user).not.toBeDefined();
        expect(token).not.toBeDefined();
    });



});

afterAll(async () => {
    await sequelize.drop();
});

