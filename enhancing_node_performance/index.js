#!/usr/bin/env node

/**
 * Topic: Clustering
 * Use case for clustering:
 * Before this, npm install -g npm2
 * Run this command: pm2 start ./index.js -i 0
 * Run this 'pm2 list' to see how many worker process you can have (with -i 0, pm2 will decide for you)
 * Run this command 'pm2 monit' to see how many processes, logs, cpu and memory in each worker process (instance)
 * To exist 'pm2 delete ./index.js'
 */


console.log('Operating as child mode');
// I am a child, I am going to act like a server
const express = require('express');
const crypto = require('crypto');

const app = express();

const PORT = 3000;
const HOST = '0.0.0.0'; // or localhost

// Function that simulates alot of work is done, takes in duration in ms
// We are purposely blocking the event loop here - this function does not get send into the threadpool (not using C++)
function doWork(callback) {

    const secret = 'secret'
    const salt = 'salt'
    const iterations = 100000
    const keylength = 512
    const digest = 'sha512'

    crypto.pbkdf2(secret, salt, iterations, keylength, digest, callback);
};

app.get('/', (req, res) => {
    // console.log('Method: ', req.headers);
    // console.log('IP Address: ', req.socket.remoteAddress)

    doWork(() => res.send('Hi there!'));
})

app.get('/fast', (req, res) => {
    res.send('This was fast');
});

app.listen(PORT, HOST, () => {
    console.log('App listening on port 3000...');
});




/** Fun Fact: Nodemon does not work very well with Node in Cluster Mode */