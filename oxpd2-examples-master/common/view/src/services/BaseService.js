class BaseService {
    constructor(apiRoot) {
        if (undefined !== apiRoot && null !== apiRoot) {
            this._apiRoot = apiRoot;
        }
        else {
            this._apiRoot = '';
        }
    }

    get apiRoot() {
        return this._apiRoot;
    }

    set apiRoot(apiRoot) {
        this._apiRoot = apiRoot;
    }

    async generateErrorData(response, endpoint) {
        let message = response.statusText;
        if (response.status === 401) {
            message = "The request did not contain authentication information.";
        }
        if (response.status === 403) {
            message = "The request contained authentication information, but the represented principal(s) do not have rights to perform the requested operation.";
        }
        if (response.status === 404) {
            message = "Indicates the requested resource does not exist.";
        }
        let errorDetails = null;
        try {
            let json = await response.json();
            message = json.message ? json.message : message;
            if (json.errors) {
                if (json.errors[0].message) {
                    message = json.errors[0].message;
                }
                if (json.errors[0].errorDetails) {
                    errorDetails = json.errors[0].errorDetails;
                }
            }
        }
        catch (error) {
            const sanitizedEndpoint = String(endpoint).replace(/[\r\n]+/g, ' ');
            const sanitizedError = JSON.stringify(error).replace(/[\r\n]+/g, ' ');
            console.log('gathering error data for ' + sanitizedEndpoint + ' caught error ' + sanitizedError);
        }

        const responseError = {
            type: 'Error',
            message: message,
            status: response.status,
            errorDescription: errorDetails
        };
        return responseError;
    }

    async getResource(endpoint) {
        const sanitizedEndpoint = String(endpoint).replace(/[\r\n]+/g, ' ');
        console.log('Fetching: ' + sanitizedEndpoint);

        let response = await fetch(endpoint, {
            mode: 'cors',
        });

        let json = null;
        if (response.status === 200) {
            try {
                json = await response.json();
            }
            catch (error) {
                console.log('getResource ' + sanitizedEndpoint + ' caught error ' + JSON.stringify(error));
            }
            return json;
        }

        let error = await this.generateErrorData(response, endpoint);
        throw new Error(response.status, { cause: error });
    }

    async postResource(endpoint, payload) {
        let payloadString = payload ? JSON.stringify(payload) : null;
        console.log('Posting: ' + endpoint + ' Payload: ' + payloadString)
        let response = await fetch(endpoint, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: payloadString
        });

        if (response.status === 204) {
            return;
        }

        if (response.status === 200 || response.status === 201) {
            let json = await response.json();
            return json;
        }

        let error = await this.generateErrorData(response, endpoint);
        throw new Error(response.status, { cause: error });
    }

    async putResource(endpoint, payload) {
        let response = await fetch(endpoint, {
            mode: 'cors',
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: (payload ? JSON.stringify(payload) : null)
        });

        if (response.status === 204) {
            return;
        }

        if (response.status === 200) {
            let json = await response.json();
            return json;
        }

        let error = await this.generateErrorData(response, endpoint);
        throw new Error(response.status, { cause: error });
    }

    async patchResource(endpoint, payload) {

        let response = await fetch(endpoint, {
            mode: 'cors',
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: (payload ? JSON.stringify(payload) : null)
        });

        if (response.status === 204) {
            return;
        }

        if (response.status === 200) {
            let json = await response.json();
            return json;
        }

        let error = await this.generateErrorData(response, endpoint);
        throw new Error(response.status, { cause: error });
    }

    async deleteResource(endpoint, payload) {

        let response = await fetch(endpoint, {
            mode: 'cors',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: (payload ? JSON.stringify(payload) : null)
        });

        if (response.status === 204) {
            return;
        }

        if (response.status === 200) {
            let json = await response.json();
            return json;
        }

        let error = await this.generateErrorData(response, endpoint);
        throw new Error(response.status, { cause: error });
    }
}

export default BaseService;
