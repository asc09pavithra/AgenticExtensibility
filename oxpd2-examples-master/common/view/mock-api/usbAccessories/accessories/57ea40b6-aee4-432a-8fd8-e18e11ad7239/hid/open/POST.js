const path = require('path');

module.exports = function (request, response) {

    // TODO - Parse the request to look for Content part,
    // and return the right response based on that...

    let responseFile = path.join(__dirname, 'usbAccessories_hid_open_response.json');
    response.status(201).sendFile(responseFile);
}
