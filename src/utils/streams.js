//TODO How to export program module in the app.js???

import program from 'commander';
import through from 'through2';

program
  .version('0.0.1')
  .command('*')
  .description('Catch all wrong input or command')
  .action(() => {
    console.log('Wrong input! Try again or use help (-h or --help)'); // eslint-disable-line no-console
    process.exit();
  });
  
program
  .option('-a, --act <act>', 'Action name for running, first argument (io|transform|transform-file)')
  .option('-f, --file [path]', 'Name of file, optional second argument')
  .option('-p, --path [path]', 'Path to directory with css files for making bundle.css')
  .on('--help', function () {
    console.log('---Usage message for user---'); // eslint-disable-line no-console
  })
  .parse(process.argv);

function hello() {
  console.log('-----action-----', program.act);
  console.log('-----file----', program.file);
  console.log('-----path-----', program.path);
}

hello();

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



const stream = through(write, end);

// The 'write' function is called for every buffer of available input:

function write(buffer, encoding, next) {
  /*
  
   */
  
  
  
}

// The 'end' function is called when there is no more data:

function end() {

}
































