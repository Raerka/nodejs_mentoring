import config from './config';
import { models } from './models';

import { DirWatcher } from './modules/dirwatcher';
import { Importer } from './modules/importer';

console.log(config.name); // eslint-disable-line no-console

new models.User();
new models.Product();

new DirWatcher();
new Importer();
