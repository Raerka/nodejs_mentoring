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

const NO_COMMAND_SPECIFIED = process.argv.length === 2;
if (NO_COMMAND_SPECIFIED) {
  console.log('You have not passed any arguments'); // eslint-disable-line no-console
  program.help();
}

if (process.argv[2] === '-h' || process.argv[2] === '--help') {
  program.help();
}

const checkPath = (filePath) => {
  if (!filePath) {
    console.log('You have not passed additional arguments'); // eslint-disable-line no-console
    program.help();
  }
};

switch (program.action) {
  case 'reverse' :
    reverse(program.args.join(' '));
    break;
  case 'transform' :
    transform(program.args.join(' '));
    break;
  case 'outputFile' :
    checkPath(program.file);
    outputFile(program.file);
    break;
  case 'convertFromFile' :
    checkPath(program.file);
    convertFromFile(program.file);
    break;
  case 'convertToFile' :
    checkPath(program.file);
    convertToFile(program.file);
    break;
  case 'bundle-css' :
    checkPath(program.path);
    makeCssBundle(program.path);
    break;
  default :
    console.log('You have not passed any actions'); // eslint-disable-line no-console
    program.help();
}
