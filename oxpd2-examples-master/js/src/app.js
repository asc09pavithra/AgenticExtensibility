/**
 * (C) Copyright 2022 HP Development Company, L.P.
 * All rights reserved.
 */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// import fs from "fs";
import path from 'path';
import errors from './services/errors.js';
import {fileURLToPath} from 'url';
import express from 'express';
import http from 'http';
import router from './routes/index.js';

const http_port = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webContentPath = path.resolve(__dirname, 'webcontent');

const app = express()

// Use the "json" middleware for any application/json requests
app.use(express.json({
    limit: "100mb",
    extended: true
}));

// Use the express "raw" middleware for requests that come in as "multipart/*"
app.use(express.raw({
    type: 'multipart/*',
    limit: '100mb'
}));

// Middleware to log the request method/url as well as the headers
app.use((req, res, next) => {
    const sanitizedMethod = String(req.method).replace(/[\r\n]+/g, ' ');
    const sanitizedUrl = String(req.originalUrl).replace(/[\r\n]+/g, ' ');
    console.log('==> ' + sanitizedMethod + ' ' + sanitizedUrl);
    console.log(JSON.stringify(req.headers,null,2));
    next();
});

// Serve webcontent for example apps
app.use('/oxpd2-examples',express.static(webContentPath));

// Serve view

app.use('/oxpd2-examples', express.static(path.join(__dirname, '..', '..', 'common', 'view', 'dist' )));

app.use('/oxpd2-examples', router);

app.use((err, req, res, next) => {
    var errorResponse = {};
    console.log(err.message);
    switch(err.message) {
        case errors.NO_BOUND_DEVICE:
        case errors.DISCOVERY_SERVICE: 
            errorResponse.status = 400;
            errorResponse.message = err.message;
            break;
        default:
            errorResponse.status = 500;
            errorResponse.message = err.message;
    }
    errorResponse.cause = err.cause;
    res.status(errorResponse.status).send(errorResponse);
})

const httpServer = http.createServer(app);
httpServer.listen(http_port);
console.log(`OXPd2 example listening on http port ${http_port}`); 
