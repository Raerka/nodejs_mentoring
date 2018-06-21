import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import passport from 'passport';

import { cookieParser } from './middlewares/cookie-parser';
import { queryParser } from './middlewares/query-parser';

import { configurePassport } from './config/passport';
import { configureRoutes } from './routes';

export const app = express();

configurePassport(passport);

app.use(cookieParser);
app.use(queryParser);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'SECRET',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

configureRoutes(app, passport);
