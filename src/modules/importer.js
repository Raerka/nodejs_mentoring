export class Importer {
  
  constructor() {
    console.log('Importer module'); // eslint-disable-line no-console
  }
  
  
  /**
   * Importing CSV files on ‘dirwatcher:changed’ event,
   * convert the data to JavaScript objects,
   * work asynchronous
   *
   * @param path    file path for importing
   *
   * @return    return a promise with imported data from file at path.
   */
  
  import(path) {
  
  }

  /**
   * Importing CSV files on ‘dirwatcher:changed’ event,
   * convert the data to JavaScript objects,
   * work synchronous
   *
   * @param path
   *
   * @return    return all imported data from file at path
   */
  importSync(path) {
  
  }
}
