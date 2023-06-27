/**
 * Topic: Web Worker in Action
 * Web Worker is basically a event message queue just like rabbit.
 * The Worker class represents a subscriber and is a thread itself.
 * Note that this function may not be very useful as most lib in Node make use of libuv thread pool already.
 */

const app = require('express');
const worker = require('webworker-threads').Worker;

app.get('/', (req, res) => {
    const worker = new Worker(function() {
        // The function you provide here will get invoke everytime the Worker receives a message (by calling the postMessage() in your application)
        // this keyword represents the Thread object itself
        this.onmessage = function() {
            // some mock code to demostrate sopme heavy work is done
            let counter = 0;
            while (counter < 1e9) {
                counter++;
            }
            // Sends the work done (basically counter in our case) back to the application 
            postMessage(counter);
        }
    });

    // When our app receives the message from the worker console log the result
    worker.onmessage = function (message) {
        // message is an object, {'data': 10000000}
        console.log(message.data);

        // Send the response back as string - doing a '' + message.data here to string cast it
        // if you put a int into res.send() express assume you are sending a http status code
        res.send('' + message.data);
    }

    worker.postMessage();
})


app.listen(3000);