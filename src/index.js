import mongoose from 'mongoose';
import { app } from './app' ;

const port = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost/mentoringdb')
  .then(() => console.log('MongoDB has started!!!'))  // eslint-disable-line no-console
  .catch(e => console.log(e));                        // eslint-disable-line no-console

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);  // eslint-disable-line no-console
});
