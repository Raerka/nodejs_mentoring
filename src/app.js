import config from './config';
import { models } from './models';

console.log(config.name); // eslint-disable-line no-console

new models.User();
new models.Product();
