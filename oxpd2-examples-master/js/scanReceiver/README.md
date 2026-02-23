# OXPd2 Basic Scan Receiver Test Application

This tool is a simple test application that implements an OXPd2 Scan Job HttpDestination target and can be used to receive OXPd2 scan jobs from the device.

## Available Scripts

In the project directory, you can run:

### `yarn install`

Install required packages before building/running.

### `yarn dev`

This will run the OXPd Scan Receiver in "developer" mode. Use it when coding the tool as it will auto-relaunch as project source files are edited/changed.
### `yarn serve`

This will run the OXPd Scan Receiver in "production" mode.

## Functionality Description

This simple receiver hosts 3 different endpoints that can be used to test the three different "flavors" of an OXPd ScanJob destination (described below). For each of the targets, the OXPd2 Scan Job data will be persisted into a local "data store" on the filesystem which can be inspected. Over time it is expected that this tool will improve and provide a web-client which can be used to inspect/interact with the received jobs. For the time being, one must use the console output and manual file-system inspection to review the incoming scan data.

### Target Endpoint with No Authorization

Use `scanTarget` as the path when testing a scan-destination that requires no authorization. For example:

`http://[thiserver]/scanTarget`

### Target Endpoint with Basic Authorization
Use `scanTargetBasicAuth` as the path when testing a scan-destination that requires HTTP Basic Authorization. For example:

`http://[thiserver]/scanTargetBasicAuth`

Any requests to this endpoint will only be processed if an "Authorization" header is included in the request with the "Basic" scheme and proper user-credentials. See Configuration section for how to configure the user-credentials.

### Target Endpoint with Bearer Authorization
Use `scanTargetBearerAuth` as the path when testing a scan-destination that requires HTTP Bearer Authorization. For example:

`http://[thiserver]/scanTargetBearerAuth`

Any requests to this endpoint will only be processed if an "Authorization" header is included in the request with the "Bearer" scheme and proper token. See Configuration section for how to configure the Bearer auth token.

## Example OXPd2 Scan Target Payloads
This project includes some canned HTTP requests that represent simple OXPd2 Scan Target requests. The files are found in the `examples` folder. These can be loaded into Postman as "binary" data (be sure to manually add the Content-Type header as `multipart/mixed; boundary=CW9bX4KnMOrncdjw`).

The current canned requests are:

* 2image.dat - a payload that contains two scan images with no job metadata.
* 1image+metadata.dat - a payload that contains one scan image as well as a job metadata attachment.
## Configuration
The OXPd Scan Receiver tool is currently setup to use configuration-data loaded from the environment. The easiest way to modify your values from the defaults (as found in the `config.js` file) is to create a `.env` file in the project root folder to contain the values you want to use. For example:

```
DATA_DIR=[some absolution path]
BASIC_AUTH_USERNAME=admin
```

The following configuration items are currently defined:
* DATA_DIR - Used to specify a root location for the data store. This will be the location where a "jobs" folder will be created, and under which all received jobs will be archived. The default value is the current executing directory.
* BASIC_AUTH_USERNAME - Used to set the username portion of the Basic auth credential. The default value is "username".
* BASIC_AUTH_PASSWORD - Used to set the password portino of the Basic auth credential. The default value is "secret".
* BEARER_AUTH_TOKEN - Used to set the token portion of the Bearer authentication. The default value is 'access_token'.

## HTTPS Configuration

The OXPd Scan Receiver supports the use of HTTPS connections. The example will attempt to read in a .pfx certificate from the `./keys` directory. The default name for the certificate is `server.pfx`. This can be adjusted in the config.js file or by setting the corresponding environment variable. If no server certificate is found the example will attempt to create a new server certificate. As a part of this functionality it will also check for a root certificate authority(CA) certificate. If one is not found it will generate a new one with the corresponding key. The `config.js` file will need to be updated with the server's fully qualified domain name (foo.bar.acme.com) and the ipV4 address. These values are used to configure the certificate. The default server password is `password`. While this is likely sufficient for a development environment, it can be changed in the `config.js` file.

Additionally, the root CA must be installed in a client that will use HTTPs to communicate to the server. By default the root CA certificate is named `oxpd2_sdk_test_root.cer`.

### Requirements

* The current version of OpenSSL
 *OR*
* A pre-generated .pfx certificate
* A pre-generated rootCA

*NOTE* It may be necessary to add the server ports, 3000 and 3443, to the host PC's firewall.

