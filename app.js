require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const logger       = require('morgan');
const path         = require('path');


/* mongoose
  .connect('mongodb://localhost/challengeApp', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  }); */

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
const app = express();


require('./configs/db.config');
require('./configs/session.config')(app);


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.locals.title = 'Challenge App';

function authNeeded (req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.render('auth/login', {errorMessage: 'Please login first.'});
  }
}

const index = require('./routes/index');
app.use('/', index);

const challenge = require('./routes/challenge.routes');
app.use('/challenges', authNeeded, challenge);

const auth = require('./routes/auth.routes');
app.use('/', auth);

module.exports = app;
