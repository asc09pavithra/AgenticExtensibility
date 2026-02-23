const path = require('path');

const Config = {}

Config.rootDataDir = process.env.DATA_DIR || path.join(__dirname, 'data');
Config.jobsDir = path.join(Config.rootDataDir, 'jobs');
Config.defaultBasicAuthUsername = process.env.BASIC_AUTH_USERNAME || 'user';
Config.defaultBasicAuthPassword = process.env.BASIC_AUTH_PASSWORD || 'secret';
Config.defaultBearerAuthToken = process.env.BEARER_AUTH_TOKEN || 'access_token';
Config.serverCertificate = process.env.SERVER_CERTIFICATE || 'server.pfx';
Config.serverHostname = process.env.SERVER_HOSTNAME || 'z6g4devdune025.boi.rd.hpicorp.net'
Config.serverIPAddress = process.env.SERVER_IPADDRESS || '15.86.121.200'
Config.serverPassphrase = process.env.SERVER_PASSPHRASE || 'password';
Config.serverRootCA = process.env.SERVER_ROOTCA || 'oxpd2_sdk_test_root.cer';
Config.serverRootCAKey = process.env.SERVER_ROOTCA_KEY || '/work/git/e2-sdk/examples/js/scanReceiver/keys/oxpd2_sdk_test_root.key'

module.exports = Config;
