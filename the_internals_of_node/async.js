#!/usr/bin/env node

/**
 * Topic: Libuv OS Delegation
 * -----------------------------------------------------------
 * This file demonstrates that the OS function calls such as HTTPS or networking requests DO NOT USE THE THREADPOOL
 * but rather it is done by the OS itself hence the threadpool e.g. libuv defualt threadpool of 4 threads is untouched.
 */

const https = require('https');

function doRequest(url, start) {
    https.request(url, res => {
        res.on('data', (bytes) => {
            // console.log(bytes);
        });
        res.on('end', () => {
            console.log(Date.now() - start, 'ms')
        });
    }).end();
    // You need to put that .end() if not the request won't get executed
}

const start = Date.now();
const url = 'https://www.google.com';

doRequest(url, start);
doRequest(url, start);
doRequest(url, start);
doRequest(url, start);

/**
 * Question 1: What functions in node std library uses the OS's async features?
 * Answer: Almost everything around networking for all OS's. Some other stuff is OS specific
 * ^ Don't bother trying to work around it
 * 
 * Question 2: How does this os async stuff fit into the event loop?
 * Answer: Tasks using the underlying OS are reflected in our pendingOSTasks array
 * 
 * This answers the big question, 'Why is the event loop always spinning when we do something like app.listen on port 3000'
 * Because when we listen on a port, it is a OS operation hence the pendingOSTasks array will never be empty, causing the event
 * to tick and tick again hence you don't see the server stop and exit to temrinal when you start a http server node js file.
 */