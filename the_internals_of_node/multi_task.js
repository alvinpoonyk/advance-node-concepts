#!/usr/bin/env node

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

// Function that makes a network request
function doRequest(start) {

    const url = 'https://www.google.com';

    https.request(url, res => {
        res.on('data', (bytes) => {
            // console.log(bytes);
        });
        res.on('end', () => {
            console.log('doRequest: ', Date.now() - start, 'ms')
        });
    }).end();
    // You need to put that .end() if not the request won't get executed
}

// Function that makes a hash
function generate_pbkdf2(start) {

    const secret = 'secret'
    const salt = 'salt'
    const iterations = 100000
    const keylength = 512
    const digest = 'sha512'

    crypto.pbkdf2(secret, salt, iterations, keylength, digest, () => {
        console.log(`generate_pbkdf2: `, Date.now() - start, 'ms')
    });
};

// Function that reads from disk
function readFile(start) {
    fs.readFile(__filename, 'utf-8', () => {
        console.log('readFile: ', Date.now() - start, 'ms')
    });
}

// Make Calls

// Not in thread pool - OS
doRequest(start)
readFile(start);
generate_pbkdf2(start);
generate_pbkdf2(start);
generate_pbkdf2(start);
generate_pbkdf2(start);

// Interview Question
// call stack, LIFO - doRequest, readFile, generate, generate, generate, generate
// message queue, FIFO - generate, generate, generate, generate, readFile, doRequest


// Expected: event loop - doRequest, readFile, generate, generate, generate, generate
// Actual: event loop - doRequest, generate, readFile, generate, generate, generate

/*
 * Why do we always see exactly 1 hash first?
 * Why is the readFile always finish after the first hash? This is an async call
 * Note: You can ignore HTTPS as it is doesn't use the threadpool, this is non-blocking, its just here to confuse you.
 */

/**
 * Answer:
 * Node make use of the threadpool for some very specific calls. 
 * Crypto module - Threadpool
 * FS Module - Threadpool
 * HTTPS (netowrking) - OS
 * 
 * In the call stack it will be 
 * doRequest, readFile, generate, generate, generate, generate
 * 
 * In the message queue it will be 
 * generate, generate, generate, generate, readFile, doRequest
 * 
 * Because of the event loop rules, Timers first, OS task 2nd, Threadpool task 3rd
 * OS - doRequest - because it is a HTTPS call which uses the OS
 * Thread 1 to 4 - FS, generate, generate, generate 
 * Message Queue - generate (there is still 1 message because we only have 4 threads by default and all are used)
 * 
 * However because of the way FS works (FS works by 1st getting file, get its stats, report back to Node, then go back to file and read)
 * While waiting for FS to return with its stats, the thread is free up and the generate task in the message queue is picked up
 * Hence,
 * Thread 1 to 4 - generate, generate, generate, generate
 * Message Queue - FS (coming back with stats result)
 * 
 * However the since all threads are utlized, FS is still sitting at the message queue waiting for at least 1 threads to be free up
 * Hence when 1 generate hash is done, 1 thread is free up then the FS can get in to the threadpool and do its thing (e.g. proceed to read etc)
 * Thats why you will always observe 1 or more generate_pbkdf2 is printed before FS
 * The timing of FS will always be more than 1 generate_pbkdf2 as it has to wait for at least 1 generate_pbkdf2 to complete so that
 * it can be in the threadpool.
 * 
 * Note: doRequest, basically OS can appear anywhere in the sequence depends on your network speed and OS as it is 
 * does not use the threadpool.
 * 
 * Important take away: Note that the default threadpool size is 4 threads. This exercise uses the default size.
 * If you change the threadpool size. You will confirm see readFile first as readFile is possibly the fastest function since it
 * is just read from disk. Try be adding process.env.UV_THREADPOOL_SIZE = 5; at the top of the file
 */