import EventEmitter from 'events';
import fs from 'fs';

import { WrongPathError } from '../errors/wrong-path-error';

export class DirWatcher extends EventEmitter{
  
  constructor() {
    super();
    this.filesPathsInDirectory = new Map();
  }
  
  /**
   * @description Watch a given path with a given delay and
   *              emit a ‘changed‘ event if directory contents have been changed
   *              When the path is checked for the first time all files treated as new
   * @this {DirWatcher}
   * @param {string} path    directory path for watching
   * @param {number} delay   delay in ms at which method works
   * @throws {WrongPathError}
   * @return void
   */
  watch(path, delay) {
    fs.stat(path, (error, stats) => {
      if (!stats.isDirectory()) {
        throw new WrongPathError(`Given path ${path} is not a directory`);
      }
      if (error) {
        throw new WrongPathError(`Can not read given path ${path}`);
      }
      this.interval = setInterval(() => {
        fs.readdir(path, (error, files) => {
          if (error) {
            throw new WrongPathError(`Can not read current path ${path}`);
          }
          
          files.forEach((fileName) => {
            const filePath = `${path}\\${fileName}`;
            
            fs.stat(filePath, (error, stats) => {
              if (error || !stats.isFile()) {
                throw new WrongPathError(`Given path ${filePath} is not a file`);
              }
              
              this.checkWasFileAdded(filePath, stats);
              this.checkWasFileChanged(filePath, stats);
              this.checkWasFileDeleted(path, files);
            });
          });
        });
      }, delay);
    });
  }
  
  /**
   * @description Check if file new (first reading or was added).
   *              Add all new files in the collection and emit event 'changed'
   * @this {DirWatcher}
   * @param {string}  filePath
   * @param {object}  stats
   * @return void
   */
  checkWasFileAdded(filePath, stats) {
    if (!this.filesPathsInDirectory.has(filePath)) {
      this.filesPathsInDirectory.set(filePath, stats.size);
      this.emit('changed', filePath);
    }
  }
  
  /**
   * @description Check if file was changed.
   *              Add all changed files in the collection and emit event 'changed'
   * @this {DirWatcher}
   * @param {string}  filePath
   * @param {object}  stats
   * @return void
   */
  checkWasFileChanged(filePath, stats) {
    if (this.filesPathsInDirectory.has(filePath) && this.filesPathsInDirectory.get(filePath) !== stats.size) {
      this.filesPathsInDirectory.set(filePath, stats.size);
      this.emit('changed', filePath);
    }
  }
  
  /**
   * @description Check if file was Deleted.
   *              Delete all deleted files from the collection.
   * @this {DirWatcher}
   * @param {string}  path
   * @param {array}  files
   * @return void
   */
  checkWasFileDeleted(path, files) {
    if (this.filesPathsInDirectory.size !== files.length) {
      for(let filePath of this.filesPathsInDirectory.keys()) {
        const fileName = filePath.substring(path.length + 1);
        if (!~files.indexOf(fileName)) {
          this.filesPathsInDirectory.delete(filePath);
        }
      }
    }
  }
  
  /**
   * @description Clear Interval which was set in watch() method
   * @this {DirWatcher}
   * @return void
   */
  unWatch() {
    clearInterval(this.interval);
  }
}
