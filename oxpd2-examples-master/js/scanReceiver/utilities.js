const Utilities = {}

Utilities.sendJSONResponse = (res, payload, status) => {
    res.statusCode = status
    res.type('application/json');
    res.send(JSON.stringify(payload));
}

module.exports = Utilities;