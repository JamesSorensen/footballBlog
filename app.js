const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const staticAsset = require('static-asset');
const mongoose = require('mongoose');
const session = require('express-session');

const MongoStore = require('connect-mongo')(session);
const Post = require('./models/post') // connect posts

const config = require('./config');
const routes = require('./routes');


// database
mongoose.Promise = global.Promise;
  mongoose.set('debug', config.IS_PRODUCTION);
  mongoose.connection
  .on('error', error => console.log(error))
  .on('close', () => console.log('Database connection closed.'))
  .on('open', () => {
  	const info = mongoose.connections[0];
  	console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    // Fill database
    // const mocks = require('./mocks')();
  })
mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });  

// sets and users
const app = express()
const port = 3000

// sessions 
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    expires: new Date(Date.now() + 60 * 60 * 24 * 30)
  })
);


// EJS connection
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded( {extended: true }));
app.use(bodyParser.json());
// Styles static-asset
app.use(staticAsset(path.join(__dirname, 'public')));
// Script and style connection
app.use(express.static(path.join(__dirname, 'public')));
// jQuerry connection
app.use(
	'/javascripts',
	express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);

// routers
app.use('/', routes.archive);
app.use('/api/auth', routes.auth);
app.use('/post', routes.post);
app.use('/comment', routes.comment);
app.use('/upload', routes.upload);
app.use('/about', routes.about);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render('error', {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {}
  });
});

app.listen(config.PORT, () => {
  console.log(`Example app listening at http://localhost:${config.PORT}`)
});
