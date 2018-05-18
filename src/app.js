/* eslint-disable indent */

import program from 'commander';
import {
  reverse,
  streamsProgram,
  outputFile,
  transform,
  convertFromFile,
  convertToFile,
  makeCssBundle
} from './utils/streams';

streamsProgram(program);

program.parse(process.argv);

const checkPath = (filePath) => {
  if (!filePath) {
    console.log('You have not passed additional arguments'); // eslint-disable-line no-console
    program.help();
  }
};

//Point 3
const NO_COMMAND_SPECIFIED = process.argv.length === 2;
if (NO_COMMAND_SPECIFIED) {
  console.log('You have not passed any arguments'); // eslint-disable-line no-console
  program.help();
}

switch (program.act) {
  case 'reverse' :
    reverse();
    break;
  case 'transform' :
    transform(); //Point 5
    break;
  case 'outputFile' :
    checkPath(program.file);
    outputFile(program.file); //Point 4
    break;
  case 'convertFromFile' :
    checkPath(program.file);
    convertFromFile(program.file); //Point 6
    break;
  case 'convertToFile' :
    checkPath(program.file);
    convertToFile(program.file); //Point 7
    break;
  case 'bundle-css' :
    checkPath(program.path);
    makeCssBundle(program.path); //Point 8
    break;
  default :
    console.log('You have not passed any actions'); // eslint-disable-line no-console
    program.help();
}

