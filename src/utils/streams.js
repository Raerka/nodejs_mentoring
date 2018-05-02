console.log(process.env);

// inside streams.js

function inputOutput(filePath) { /* ... */ }

function transformFile(filePath) { /* ... */ }

function transform() { /* ... */ }

function httpClient() { /* ... */ }

function httpServer() { /* ... */ }

function printHelpMessage() { /* ... */ }

/*
* **** CODE TO READ COMMAND LINE GOES HERE ****
* */

/*
in terminal

./streams.js --action=io --file=users.csv

./streams.js --action=transform-file --file=users.csv

./streams.js --action=transform

./streams.js -a io -f users.csv

./streams.js --help

./streams.js -h
 */


/*
    If module is called without arguments
    ./streams.js
    => notify user about wrong input and print a usage message
    
    
    ....And others
    
 */



/*
Example

./streams.js --action=bundle-css --path=./assets/css

Transform flow hint:
A transform stream takes input data and applies an operation to the data to produce the output data.
 */

// Create a through stream with a 'write' and 'end' function:

import through from 'through2';


const stream = through(write, end);

// The 'write' function is called for every buffer of available input:

function write(buffer, encoding, next) {
  /*
  
   */
  
  
  
}

// The 'end' function is called when there is no more data:

function end() {

}
































