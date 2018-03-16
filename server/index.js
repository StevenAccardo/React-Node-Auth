//Maining starting point of our server

const express = require('express');
//http is a native node library
//sets up some low-level handling of http requests
//forwards any incoming requests onto app, our express instance.
//In order to support the full spectrum of possible HTTP applications, Node.js's HTTP API is very low-level. It deals with stream handling and message parsing only. It parses a message into headers and body but it does not parse the actual headers or the body.
const http = require('http');
const bodyParser = require('body-parser');
//HTTP request logger middleware for node.js
const morgan = require('morgan');

// App setup - express setup
//instance of express now referenced by the app constant
const app = express();
//imports our router file that routes the incoming requests to their proper controllers
const router = require('./router');
const mongoose = require('mongoose');

// DB Setup
//connects mongoose to our instance of mongoDB, which right now is on our local machine.
//The /auth portion of this string is what creates a new Database inside of mongoDB named auth, if you wanted to change the name of it, you can do that there.
//This is the minimum needed to connect the auth database running locally on the default port (27017)
mongoose.connect('mongodb://localhost/auth');

//express middlewares
//morgan is a logging framework, use it for debugging
//The predefined combined string creates standard Apache combined log output that will show up in the console for debugging.
app.use(morgan('combined'));
//Parse incoming request bodies in a middleware before your handlers, available under the req.body property. In this case we are parsing json.
//The type option is passed in with two wild cards for the type/subtype, allowing for any mime type to be parsed, but if it is not json, then an error will be thrown.
app.use(bodyParser.json({ type: '*/*' }));

//calls our router function, and passes the express instance as an arg.
router(app);

// Server setup

//listens on either the hosting platforms predesignated port, or 3090 if no other port is provided
const port = process.env.PORT || 3090;

//http.createServer returns a new instance of http.Server
//this creates the server
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);
