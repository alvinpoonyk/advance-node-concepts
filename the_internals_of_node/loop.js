/**
 * Everything in this file is Pseduocode and is meant to represent the event loop in node.js
 * Topic: Advance node concepts
 * Summary - What happens when we run node index.js file
 * 1. Process and exeode in index.js file. This is also where all the require statements are executed
 * 2. Enter event loop
 * 3. Are there any pending timers callbacks (tasks) to exceute?
 * 4. If yes, run setTimeouts, setIntervals, etcs
 * 5. Are there any OS tasks callbacks (tasks) to execute?
 * 6. If yes, run them such as http servers, network requests, etc
 * 7. Are there any tasks in the threadpool? 
 * 8. If yes, run them
 * 9. Pause and wait for stuffs to happen
 * 10. Run any 'setImmediate' functions
 * 11. Handle close events
 * 12. Repeat check for timers, OS tasks, threadpools
 * 13. If yes, continue another tick (steps 3 -11), if not exit the program
 */


// node myFile.js
//
// New timers, tasks, operations are recorded from myFile running.
// myFile.runContents();
//

const pendingTimers = [];
const pendingOSTasks = [];
const pendngOperations = []; // tasks that are being executed in the thread pool

function shouldContiune() {

	// Check one: Any pending setTimeout, setInterval, setImmediate?
	
	// Check two: Any pending Operating System tasks?  e.g. a server listening to a given port 

	// Check three: Any pending long running operations? e.g. fs module (file system)

    // If there are anything in the imaginary arrays, it will return true causing the event to go for 1 additional tick
    return pendingTimers.length || pendingOSTasks.length || pendngOperations.length
};
//
// This represents the event loop in Node
// Entire body executes in one 'tick'
while(shouldContinue()) {	// 1 loop cycle in here is refered to as a 'tick'

    // 1) Node looks at pendingTimers and see if any functions are ready to be called e.g. the callbacks that were passed in any of the timers
    //  - setTimeout, setInterval

    // 2) Node looks at pendingOSTasks and calls relvant callbacks e.g. handling of incoming http requests 
    //    Node looks at pendingOperations and calls relvant callbacks e.g. whatever that is inside the threadpool e.g. FS module, crypto module

    // 3) Pause execution. Continue when... (unlike a while loop, it actually waits for tasks)
    //  - a new pendingOSTask is done
    //  - a new pendingOperation is done
    //  - a timer is about to complete

    // 4) Look at pendingTimers. Call any setImmediate

    // 5) Handles any 'close' events e.g. terminte any servers, closing connections, logging, etc
}
//
// exit back to terminal
