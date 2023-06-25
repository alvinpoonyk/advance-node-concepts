#!/usr/bin/env node

/**
 * Topic: Threadpools with Multithreading 
 * --------------------------------------------------------------
 * This file demostrates that some aspect of node is multi-threaded.
 * For functions or libaries such as the standard library crypto module, the C++
 * implementation which uses libuv has a default threadpool size of 4 hence there is
 * some multi threading involved. Only the event loop single threaded.
 */

// Libuv has a default thread pool size of 4
process.env.UV_THREADPOOL_SIZE = 4;

const crypto = require('crypto');

const start = Date.now();

const secret = 'secret'
const salt = 'salt'
const iterations = 100000
const keylength = 512
const digest = 'sha512'

function generate_pbkdf2(fn_num, start) {
    crypto.pbkdf2(secret, salt, iterations, keylength, digest, () => {
        console.log(`${fn_num}: `, Date.now() - start, 'ms')
    });    
};

// When this file is run, the 2 functions below run at almost or exactly the same time

generate_pbkdf2('1', start);
generate_pbkdf2('2', start);
generate_pbkdf2('3', start);
generate_pbkdf2('4', start);

// Node js uses the libuv library C++ which manages a thread pool, 4 threads (default)
// this helps node to offload very expensive tasks such as pbkdf2 to other threads

generate_pbkdf2('5', start);
generate_pbkdf2('6', start);
generate_pbkdf2('7', start);
generate_pbkdf2('8', start);

// Right now you see pbkdf2 #1, #2, #3, #4 get processed together first, then #5, #6, #7, #8, then #9 and #10

generate_pbkdf2('9', start);
generate_pbkdf2('10', start);

// A solution is to increase the thread pool size so that more pbkdf2 calls can be processed at the same time