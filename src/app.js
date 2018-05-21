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

switch (program.action) {
  case 'reverse' :
    reverse(program.args.join(' ')); //Point 6a
    break;
  case 'transform' :
    transform(program.args.join(' ')); //Point 6b
    break;
  case 'outputFile' :
    checkPath(program.file);
    outputFile(program.file); //Point 6c
    break;
  case 'convertFromFile' :
    checkPath(program.file);
    convertFromFile(program.file); //Point 6d
    break;
  case 'convertToFile' :
    checkPath(program.file);
    convertToFile(program.file); //Point 6e
    break;
  case 'bundle-css' :
    checkPath(program.path);
    makeCssBundle(program.path); //Point 7
    break;
  default :
    console.log('You have not passed any actions'); // eslint-disable-line no-console
    program.help();
}

