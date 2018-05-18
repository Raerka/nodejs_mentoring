import fs from 'fs';
import { Readable } from 'stream';
import path from 'path';

import program from 'commander';
import through from 'through2';
import split from 'split';
import replaceExt from 'replace-ext';
import request from 'request';

import { WrongPathError } from '../errors/wrong-path-error';

export const streamsProgram = (program) => {
  program
    .version('0.0.1')
    .command('*')
    .description('Catch all wrong input or command')
    .action(() => {
      console.log(`Unknown Command: ${program.args.join(' ')}`); // eslint-disable-line no-console
      program.help();
    });
  
  program
    .option('-a, --act <act>', 'Action name for running, first argument ' +
      '(reverse|transform|outputFile|convertFromFile|convertToFile|bundle-css)')
    .option('-f, --file [path]', 'Name of file, optional second argument')
    .option('-p, --path [path]', 'Path to directory with css files for making bundle.css')
    .on('--help', () => {
      console.log('---Read help documentation and try again please---'); // eslint-disable-line no-console
    });
};

//Main functions

/**
 * @description Reverse string data from process.stdin to process.stdout
 * @param {string} str (data for reversing)    ?????????????????
 * @return void
 */
export const reverse = () => {
  const reverse = through((data, encoding, cb) => {
    cb(null, new Buffer(data.toString().split('').reverse().join('')));
  });
  process.stdin
    .pipe(reverse)
    .pipe(process.stdout);
};

/**
 * @description Convert data from process.stdin to upper-case data, using the through2 module, and pipe it to process.stdout.
 * @param {string} str  ?????????????????????????????????
 * @return void
 */
export const transform = () => {
  const toUpperCase = through((data, encoding, cb) => {
    cb(null, new Buffer(data.toString().toUpperCase()));
  });
  process.stdin
    .pipe(toUpperCase)
    .pipe(process.stdout);
};

/**
 * @description Read given file provided by --file option and pipe it to process.stdout.
 * @param {string} filePath
 * @return void
 */
export const outputFile = (filePath) => {
  //todo Add checking filePath with stats
  fs.createReadStream(filePath)
    .pipe(process.stdout);
};

/**
 * @description Convert file provided by --file option from csv to json,
 * using the through2 module, and output data to process.stdout.
 * Function check that the passed file name is valid.
 * @param {string} filePath
 * @return void
 */
export const convertFromFile = (filePath) => {
  if (isFile(filePath)) {
    fs.createReadStream(filePath)
      .pipe(split())
      .pipe(parseCSV())
      .pipe(toJSON())
      .pipe(process.stdout);
  }
};

/**
 * @description Convert file provided by --file option from csv to json,
 * using the through2 module, and output data to a result file
 * with the same name but .json extension.
 * Function check that the passed file name is valid.
 * @param {string} filePath
 * @return void
 */
export const convertToFile = (filePath) => {
  if (isFile(filePath)) {
    fs.createReadStream(filePath)
      .pipe(split())
      .pipe(parseCSV())
      .pipe(toJSON())
      .pipe(fs.createWriteStream(replaceExt(filePath, '.json')));
  }
};

/**
 * @description Do the following:
 *  1. Grab all css files in given path
 *  2. Contact them into one big css file
 *  3. Add contents of
 *  https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css
 *  at the bottom of this big css
 *  4. Output will be saved in the same path and called bundle.css
 * @param {string} directoryPath (extra parameter --path in CL)
 * @throws {WrongPathError}
 * @return void
 */
export const makeCssBundle = (directoryPath) => {
  //todo Add cheking directoryPath with stats
  if (isDirectory(directoryPath)) {
    const URL = 'https://epa.ms/nodejs18-hw3-css';
    const bundleName = 'bundle.css';
    
    console.log(request(URL));
    
    const rs = new Readable();
    rs.push(null);
    rs
      .pipe(readDirectory(directoryPath))
      // .pipe(request(URL))
      .pipe(fs.createWriteStream(`${directoryPath}${path.sep}${bundleName}`));
  }
};

//Additional functions

/**
 * @description Return true if given filePath is File
 * @param {string} filePath
 * @return {boolean}
 */
const isFile = (filePath) => {
  if (fs.statSync(filePath).isFile()) {
    return true;
  }
  console.log(`Wrong filePath: ${filePath}`); // eslint-disable-line no-console
  program.help();
};

/**
 * @description Return true if given directoryPath is Directory
 * @param {string} directoryPath
 * @return {boolean}
 */
const isDirectory = (directoryPath) => {
  if (fs.statSync(directoryPath).isDirectory()) {
    return true;
  }
  console.log(`Wrong directoryPath: ${directoryPath}`); // eslint-disable-line no-console
  program.help();
};


/**
 * @description Create Transform Stream for parsing csv file and getting json objects
 * Transform stream works in object mode.
 * @return {Stream}
 */
const parseCSV = () => {
  let templateKeys = [];
  let parseHeadLine = true;
  return through.obj((data, encoding, cb) => {
    if (parseHeadLine) {
      templateKeys = data.toString().split(',');
      parseHeadLine = false;
      return cb(null, null);
    }
    const entries = data.toString().split(',');
    const obj = {};
    templateKeys.forEach((el, index) => {
      obj[el] = entries[index];
    });
    return cb(null, obj);
  });
};

/**
 * @description Create Transform Stream for collecting all data in array and convert it from json to string
 * @return {Stream}
 */
const toJSON = () => {
  let objs = [];
  return through.obj(
    (data, enc, cb) => {  //transformFunction - it's equivalent transformStream._transform
      objs.push(data);
      cb(null, null);
    }, (cb) => {          //flushFunction  - it's equivalent transformStream._flush
      cb(null, JSON.stringify(objs));
    });
};

/**
 * @description Create Transform Stream for reading given directory path, collecting all data from css files
 * and joining it to the data from the stream which invoke this transformer
 * @param {string} directoryPath (extra parameter --path in CL)
 * @throws {WrongPathError}
 * @return {Stream}
 */
const readDirectory = (directoryPath) => {
  let bundleData = '';
  return through(
    (data, enc, cb) => {
      cb(null, null);
    }, (cb) => {
      fs.stat(directoryPath, (error, stats) => {
        if (!stats.isDirectory()) {
          throw new WrongPathError(`Given path ${directoryPath} is not a directory`);
        }
        if (error) {
          throw new WrongPathError(`Can not read given path ${directoryPath}`);
        }
        const extension = '.css';
        fs.readdir(directoryPath, (error, files) => {
          if (error) {
            throw new WrongPathError(`Can not read current path ${directoryPath}`);
          }
          files.forEach((fileName) => {
            if (fileName.endsWith(extension)) {
              const filePath = `${directoryPath}${path.sep}${fileName}`;
              bundleData += fs.readFileSync(filePath);
            }
          });
          cb(null, bundleData);
        });
      });
    }
  );
};
