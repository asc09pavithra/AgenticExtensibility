const express = require('express');
const apiMocker = require('connect-api-mocker');
const port = process.env.PORT || 5000;
const cors = require('cors');

const app = express();

app.use(cors());

app.use('/oxpd2-examples/api', apiMocker('mock-api'));

console.log(`Mock API Server is up and running at: http://localhost:${port}`);
app.listen(port);
