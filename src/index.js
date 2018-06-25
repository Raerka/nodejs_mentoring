import { app } from './app' ;

import db from './models';

const port = process.env.PORT || 8080;

app.listen(port, () => {
  db.sequelize.sync();
  console.log(`App listening on port ${port}!`);  // eslint-disable-line no-console
});
