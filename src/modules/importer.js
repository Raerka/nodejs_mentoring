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
   * @throws {ConversionError}
   * @return {Promise} return a promise with imported data from file at path.
   */
  import(path) {
    return new Promise( (res, rej) => {
      const converter = new Converter({});
      converter.on('end_parsed', (jsonData) => {
        if(!jsonData){
          rej(new ConversionError('CSV to JSON conversion failed!'));
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
   * @return {Array} Array of json objects
   */
  importSync(path) {
    const csvString = fs.readFileSync(path).toString();
    return Importer.csvToJsonConverter(csvString);
  }
  
  /**
   * @description Convert csv to json
   * @static
   * @param {string} csvString
   * @return {Array} Array of json objects
   */
  static csvToJsonConverter(csvString) {
    const result = [];
    const lines = csvString.split('\n');
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
      let obj = {};
      let currentLine = lines[i].split(',');
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j];
      }
      result.push(obj);
    }
    return result;
  }
}
