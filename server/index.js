//Maining starting point of our server

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// App setup - express setup
const app = express();
const router = require('./router');

//express middlewares

//morgan is a logging framework, use it for debugging
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));

router(app);

// Server setup

const port = process.env.PORT || 3090;

//http is a native node library
//sets up some low-level handling of http requests
//forwards any incoming requests onto app, our express instance.
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);
