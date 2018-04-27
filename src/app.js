import config from './config';
import { models } from './models';

import { DirWatcher } from './modules/dirwatcher';
import { Importer } from './modules/importer';
import { WrongPathError } from './errors/wrong-path-error';
import { ConversionError } from './errors/conversion-error';

console.log(config.name); // eslint-disable-line no-console

new models.User();
new models.Product();

const dirWatcher = new DirWatcher();
const importer = new Importer();

const directoryPath = `${__dirname.slice(0, -4)}src\\data`;
const delay = 3000;

//Log only first member of csv file for short
try {
  //async loading
  dirWatcher.on('changed', (filePath) => {
    importer
      .import(filePath)
      .then((data) => {
        console.log(data[0]); // eslint-disable-line no-console
      });
  });
  
  //sync loading
  dirWatcher.on('changed', (filePath) => {
    console.log(importer            // eslint-disable-line no-console
      .importSync(filePath)[0]);
  });
  
  dirWatcher.watch(directoryPath, delay);

} catch (error) {
  if (error instanceof WrongPathError) {
    console.log('Reading path failed', error); // eslint-disable-line no-console
  } else if (error instanceof ConversionError) {
    console.log('Conversion of csv file was failed', error); // eslint-disable-line no-console
  } else {
    console.log('Unknown error', error); // eslint-disable-line no-console
    throw error;
  }
}



