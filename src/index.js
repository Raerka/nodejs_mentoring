import mongoose from 'mongoose';
import { app } from './app' ;
import { config } from './config/config';

const port = process.env.PORT || config.port;

mongoose.connect(config.db)
  .then(() => console.log('MongoDB has started!!!'))  // eslint-disable-line no-console
  .catch(e => console.error(e));                        // eslint-disable-line no-console

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);  // eslint-disable-line no-console
});
