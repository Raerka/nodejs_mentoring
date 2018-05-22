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
    .allowUnknownOption();
  
  program
    .option('-a, --action <action> [textToTransform...]', 'Action name for running, first argument ' +
      '(reverse|transform|outputFile|convertFromFile|convertToFile|bundle-css)')
    .option('-f, --file [path]', 'Name of file, optional second argument')
    .option('-p, --path [path]', 'Path to directory with css files for making bundle.css')
    .on('--help', () => {
      customHelp();
    })
    .on('-h', () => {
      customHelp();
    });
};

const customHelp = () => {
  console.log('---Read help documentation and try again please---'); // eslint-disable-line no-console
};

//Main functions
/**
 * @description Reverse string data from process.stdin to process.stdout
 * @param {string} str (first data for reversing)
 * @return void
 */
export const reverse = (str = '') => {
  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      process.stdout.write(chunk.toString().split('').reverse().join(''));
    }
  });
  process.stdin.on('end', () => {
    process.stdout.write('end');
  });
  process.stdin.push(str);
};

/**
 * @description Convert data to upper-case from process.stdin to process.stdout.
 * @param {string} str  (first data for transforming)
 * @return void
 */
export const transform = (str) => {
  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      process.stdout.write(chunk.toString().toUpperCase());
    }
  });
  process.stdin.on('end', () => {
    process.stdout.write('end');
  });
  process.stdin.push(str);
};

/**
 * @description Read given file provided by --file option and pipe it to process.stdout.
 * @param {string} filePath
 * @return void
 */
export const outputFile = (filePath) => {
  if (isFile(filePath)) {
    fs.createReadStream(filePath)
      .pipe(process.stdout);
  }
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
 *  https://drive.google.com/uc?export=download&id=1tCm9Xb4mok4Egy2WjGqdYYkrGia0eh7X
 *  at the bottom of this big css
 *  4. Output will be saved in the same path and called bundle.css
 * @param {string} directoryPath (extra parameter --path in CL)
 * @throws {WrongPathError}
 * @return void
 */
export const makeCssBundle = (directoryPath) => {
  if (isDirectory(directoryPath)) {
    const URL = 'https://drive.google.com/uc?export=download&id=1tCm9Xb4mok4Egy2WjGqdYYkrGia0eh7X';
    const bundleName = 'bundle.css';
    const rs = new Readable();
    rs.push(null);

    rs
      .pipe(readDirectory(directoryPath))
      .pipe(addDataFromUrl(URL))
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
      cb(null, data);
    },
    (cb) => {
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
    }
  );
};

/**
 * @description Create Transform Stream for reading given URL, collecting all data and joining it
 * to the data from the stream which invoke this transformer
 * @param {string} URL  (resource from which need add data)
 * @return {Stream}
 */
const addDataFromUrl = (URL) => {
  return through(
    (data, enc, cb) => {
      request(URL, (error, response, body) => {
        data += body;
        cb(null, data);
      });
    }
  );
};
