const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express')
const app = express()
require('dotenv').config();
const Certificate = require('./certificate');
const Config = require('./config');
const Utilities = require('./utilities');
const TransmittingState = require('./transmittingState');
const HttpDestinationContentFactory = require('./httpDestinationContent');
const JobService = require('./jobService');
const MultipartParser = require('./multipartParser');
const { jobsDir } = require('./config');
const port = process.env.PORT || 3000;
const securePort = process.env.SECURE_PORT || 3443;
const httpsOptions = {
    pfx: Certificate.get(),
    passphrase: Config.serverPassphrase
}
const targetAuthorization = {
    basic: {
        username: Config.defaultBasicAuthUsername,
        password: Config.defaultBasicAuthPassword
    },
    bearer: {
        token: Config.defaultBearerAuthToken
    }
};

// Use the express "raw" middleware for requests that come in as "multipart/*"
app.use(express.raw({
    type: 'multipart/*'
}));

// Use the "json" middleware for any application/json requests
app.use(express.json())

// Middleware to log the request method/url as well as the headers
app.use((req, res, next) => {
    console.log('==> ' + req.method + ' ' + req.originalUrl);
    console.log(JSON.stringify(req.headers,null,2));
    next();
});

// Middleware to add global CORS support
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });

let initialize = () => {

    // Setup the jobs dir
    if (!fs.existsSync(Config.jobsDir)){
        fs.mkdirSync(Config.jobsDir, { recursive: true });
    }
};

const processScan = (req, res) => {
    console.log("Received scan data!");

    // First lets parse the contents. We should end up with at least 1!
    let boundary = MultipartParser.getContentBoundary(req.headers['content-type']);
    let parts = MultipartParser.parseContent(boundary, req.body);

    if (0 === parts.length) {
        throw new Error("OXPd scan target must have at least one part!")
    }

    // Find the "content" part 
    let  contentPart = parts.find((part) => {
        let cdHeader = part.headers.find((header) => {
            if (header.name === "content-disposition") {
                return true;
            }
            return false;
        });
        if ("name" in cdHeader.directives && cdHeader.directives["name"] === "content") {
            return true;
        }
        return false
    });

    if (undefined === contentPart) {
        throw new Error("OXPd scan target must contain a part named 'content'");
    }

    // Let's deserialize the "content" data into an HttpDestinationContent object
    let content = HttpDestinationContentFactory.deserialize(contentPart.data.toString());

    console.log("content part ->");
    console.log(JSON.stringify(content,null,2));

    let job = null;

    // Get the job or create a new one
    if (content.transmittingState != TransmittingState.COMPLETED) {
        job = JobService.getJob(content.scanJobId);
    }
    else {
        job = JobService.createJob(content.scanJobId);
    }

    if (undefined === job) {
        throw new Error("Unable to create or find the job with id " + content.scanJobId);
    }

    // Update the job state
    job.state = content.transmittingState;

    // Add any included scan-files and metadata
    parts.forEach((part) => {
        let cdHeader = part.headers.find((header) => {
            if (header.name === "content-disposition") {
                return true;
            }
            return false;
        });
        let ctHeader = part.headers.find((header) => {
            if (header.name === "content-type") {
                return true;
            }
            return false;
        });

        if (cdHeader.directives["name"] === "scanFile") {
            job.addAttachment(cdHeader.directives["name"], cdHeader.directives["ordinal"], ctHeader.value, cdHeader.directives["filename"], part.data);
        }
        else if (cdHeader.directives["name"] === "metadata") {
            job.addMetadata(cdHeader.directives["filename"], ctHeader.value, part.data);
        }
    });

    // Save the job
    job.save();

    console.log("Successfully processed scan data...\r\nLocal job ->");
    console.log(JSON.stringify(job,null,2));

    res.status(204).send();
};

app.post('/scanTarget', (req, res) => {
    processScan(req, res);
});

app.post('/scanTargetBasicAuth', (req, res) => {
    // First handle Basic Auth
    let authorization = req.headers['authorization'];

    if (undefined !== authorization) {
        let authParts = authorization.split(' ');
        if (authParts[0].toLowerCase() === 'basic') {

            let buff = Buffer.from(authParts[1], 'base64');
            let credentials = buff.toString('ascii').split(':');
            if (credentials[0] === targetAuthorization.basic.username && credentials[1] === targetAuthorization.basic.password) {
                processScan(req, res);
                return;
            }
        }
    }

    res.status(401).send("Bad credentials");
});

app.post('/scanTargetBearerAuth', (req, res) => {
    //First handle Bearer Auth
    let authorization = req.headers['authorization'];

    if (undefined !== authorization) {
        let authParts = authorization.split(' ');
        if (authParts[0].toLowerCase() === 'bearer') {
            if (authParts[1] === targetAuthorization.bearer.token) {
                processScan(req, res);
                return;
            }
        }
    }

    res.status(401).send("Bad credentials");
});

app.get('/test', (req, res) => {
    Utilities.sendJSONResponse(res, null, 204);
});

app.use(express.static(path.join(__dirname, 'wwwroot')));
const httpServer = http.createServer(app)
const httpsServer = https.createServer(httpsOptions, app)

httpServer.listen(port, () => console.log(`OXPd2 scan-receiver listening on port ${port}`));
httpsServer.listen(securePort, () => {console.log(`OXPd2 scan-receiver listening on port ${securePort}`)})
initialize();
