/* eslint-disable indent */

import program from 'commander';
import {
  streamsProgram,
  directFileToLog,
  transformData,
  transformCsvFileToJson,
  transformCsvToJsonAndWriteToFile,
  makeCssBundle
} from './utils/streams';

streamsProgram(program);
program.parse(process.argv);

//Point 3
const NO_COMMAND_SPECIFIED = process.argv.length === 2;
if (NO_COMMAND_SPECIFIED) {
  console.log('You have not passed any arguments'); // eslint-disable-line no-console
  program.help();
}

switch (program.act) {
  case 'io' :
    directFileToLog(program.file); //Point 4
    break;
  case 'transform' :
    transformData(); //Point 5
    break;
  case 'transform-file' :
    transformCsvFileToJson(program.file); //Point 6
    break;
  case 'transform-file-write-to-json' :
    transformCsvToJsonAndWriteToFile(program.file); //Point 7
    break;
  case 'bundle-css' :
    makeCssBundle(program.path); //Point 8
    break;
  default :
    console.log('You have not passed any actions'); // eslint-disable-line no-console
    program.help();
}
