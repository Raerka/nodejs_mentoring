import fs from 'fs';
import csv from 'csvtojson';

import { ConversionError } from '../errors/conversion-error';

const Converter = csv.Converter;

export class Importer {
  constructor() {
    console.log('Importer module'); // eslint-disable-line no-console
  }
  
  /**
   * @description Importing CSV files, convert the data to JavaScript objects
   * @async
   * @param {string} path    file path for importing data
   * @return {Promise} return a promise with imported data from file at path.
   */
  import(path) {
    return new Promise( (res, rej) => {
      const converter = new Converter({});
      converter.on('end_parsed', (jsonData) => {
        if(!jsonData){
          rej('CSV to JSON conversion failed!');
        }
        res(jsonData);
      });
      fs.createReadStream(path).pipe(converter);
    });
  }
 
  /**
   * @description Importing CSV files, convert the data to JavaScript objects, log data to console
   * @param {string} path   file path for importing data
   * @throws {ConversionError}
   * @return void
   */
  importSync(path) {
    const csvString = fs.readFileSync(path).toString();
    const converter = new Converter({});
    converter
      .fromString(csvString)
      .on('end_parsed', (jsonData) => {
        if(!jsonData){
          throw new ConversionError('CSV to JSON conversion failed!');
        }
        console.log(jsonData[0]); // eslint-disable-line no-console
      });
  }
}
