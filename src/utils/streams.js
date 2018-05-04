import fs from 'fs';
import through from 'through2';
import split from 'split';
import replaceExt from 'replace-ext';

export const streamsProgram = (program) => {
  program
    .version('0.0.1')
    .command('*')
    .description('Catch all wrong input or command')
    .action(() => {
      console.log('Unknown Command: ' + program.args.join(' ')); // eslint-disable-line no-console
      program.help();
    });
  
  program
    .option('-a, --act <act>', 'Action name for running, first argument (io|transform|transform-file|transform-file-write-to-json|bundle-css)')
    .option('-f, --file [path]', 'Name of file, optional second argument')
    .option('-p, --path [path]', 'Path to directory with css files for making bundle.css')
    .on('--help', () => {
      console.log('---Read help documentation and try again please---'); // eslint-disable-line no-console
    });
};

/**
 * @description
 * This function use fs.createReadStream() to pipe the given file to process.stdout
 *
 * @param {string} filePath
 * @return void
 */
export const directFileToLog = (filePath) => {
  fs.createReadStream(filePath).pipe(process.stdout);
};

/**
 * @description
 * This function convert data from process.stdin
 * to upper-case data on process.stdout using the through2 module.
 *
 * @return void
 */
export const transformData = () => {
  const toUpperCase = through((data, encoding, cb) => {
    cb(null, new Buffer(data.toString().toUpperCase()));
  });
  process.stdin
    .pipe(toUpperCase)
    .pipe(process.stdout);
};

/**
 * @description
 * This function convert file from csv to json and
 * output data to process.stdout using the through2 module
 *
 * @param {string} filePath
 * @return void
 */
export const transformCsvFileToJson = (filePath) => {
  fs.createReadStream(filePath)
    .pipe(split())
    .pipe(parseCSV())
    .pipe(toJSON())
    .pipe(process.stdout);
};

/**
 * @description
 * This function convert file from csv to json
 * and output data to a result file with the same name but .json extension,
 * using the through2 module and fs.createWriteStream
 *
 * @param {string} filePath
 * @return void
 */
export const transformCsvToJsonAndWriteToFile = (filePath) => {
  fs.createReadStream(filePath)
    .pipe(split())
    .pipe(parseCSV())
    .pipe(toJSON())
    .pipe(fs.createWriteStream(replaceExt(filePath, '.json')));
  
};

/**
 * @description
 * Implement cssBundler function and introduce an extra parameter --path. It should do the following:
 *  a. Grab all css files in given path
 *  b. Contact them into one big css file
 *  c. Add contents of
 *  https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css
 *  at the bottom of this big css
 *  d. Output should be saved in the same path and called bundle.css
 *
 *
 */
export const makeCssBundler = (filePath) => {

};

//TODO Write description from article
/**
 * @description
 * @return {*}
 */
const parseCSV = () => {
  let templateKeys = [];
  let parseHeadline = true;
  return through.obj((data, encoding, cb) => {
    if (parseHeadline) {
      templateKeys = data.toString().split(',');
      parseHeadline = false;
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
 * @description
 * @return {*}
 */
const toJSON = () => {
  let objs = [];
  return through.obj((data, enc, cb) => {
    objs.push(data);
    cb(null, null);
  }, function(cb) {
    this.push(JSON.stringify(objs));
    cb();
  });
};
