const os = require('node:os');
const dns = require('node:dns');
const util = require('node:util');
const process = require('node:process');
const exec = require('node:child_process').execSync;
const readFile= require('node:fs').readFileSync;

const Config = require('./config')

const Certificates = {};

var openssl = null;

Certificates.get = function() {
    return getServerCertificate();
}

function getServerCertificate() {
    var certificate = null;
    try {
        certificate = readFile(`./keys/${Config.serverCertificate}`);
    }
    catch(err) {
      // Any err means we can't get a certificate we'll just make a new one.
      generateServerCertificate();
      // TLS handshakes fail on cypher exchange without this.
      console.log('New server certificate created. Stopping server. Please restart.')
      process.exit();
    }
    return certificate;

}

function generateServerCertificate() {
    let ipAddress = Config.serverIPAddress;
    let hostname = Config.serverHostname;

    var options = {
        cwd: './keys',
        env:{ 
            commonname: hostname,
            ipaddress: ipAddress,
            OPENSSL_CONF: 'example.conf' 
        }
    }

    // verify that the root CA cer and rootCA key exist else generate them.
    try{
        readFile(`./keys/${Config.serverRootCA}`);
        readFile(`./keys/${Config.serverRootCAKey}`);
    } catch(ex){
        generateRootCertificateAuthority(options);
    }
    // generate the server certificate and associated artifacts.
    try {
        generateCertificateKey('server.key', options);
        generateCSR(hostname, ipAddress, options);
        verifyCSR(options);
        generateCRT(hostname, ipAddress, options);
        generatePFX(options);
    } catch(ex) {
        console.error(ex);
    }
}

function generateCertificateKey(path, options) {
    let openssl = getOpenSsl();
    exec(`"${openssl}" genrsa -out ${path} 4096`, options) 
}

function generateCSR(hostname, ipAddress, options) {
    let openssl = getOpenSsl();
    exec(`"${openssl}" req -new -key server.key -subj "/C=US/ST=ID/O=HP Inc./CN=${hostname}" -reqexts v3_req -extensions v3_req -out server.csr`, options);
}

function verifyCSR(options) {
    let openssl = getOpenSsl();
    exec(`"${openssl}" req -in server.csr -noout -text -verify`, options)
}

function generateCRT(hostname, ipAddress, options) {
    let openssl = getOpenSsl();
    exec(`"${openssl}" x509 -req -in server.csr -CA ${Config.serverRootCA} -CAkey ${Config.serverRootCAKey} -passin pass:${Config.serverPassphrase} -CAcreateserial -extfile example.conf -out server.crt -days 365 -sha256 -extensions 'v3_req'`, options );
}

function generatePFX(options) {
    let openssl = getOpenSsl();
    exec(`"${openssl}" pkcs12 -export -out ${Config.serverCertificate} -inkey server.key -in server.crt -passout pass:${Config.serverPassphrase}`, options);
}

function generateRootCertificateAuthority(options) {
    let openssl = getOpenSsl();
    generateCertificateKey(Config.serverRootCAKey);
    let ca_options = {
        cwd: options.cwd,
        env: {
            commonname: options.env.commonname,
            ipaddress: options.env.ipaddress,
            OPENSSL_CONF: 'example_ca.conf'
        }
    }
    
    exec(`"${openssl}" req -x509 -new -nodes -key ${Config.serverRootCAKey} -subj "/C=US/ST=ID/O=HP Inc./CN=oxpd2_sdk_test" -sha256 -days 6000 -out ${Config.serverRootCA}`, ca_options); 
}

function getOpenSsl() {
    if (openssl === null) {
        let command = (os.platform != 'win32')?'"/usr/bin/which" openssl' : '"C:\\Windows\\System32\\where.exe" openssl'      
        openssl = exec(command).toString().trim(); 
    }
    return openssl;
}

module.exports = Certificates;

