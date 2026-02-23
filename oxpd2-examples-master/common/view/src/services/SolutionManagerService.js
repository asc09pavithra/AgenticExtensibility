import BaseService from './BaseService';
import { SolutionInstallPullMultipart, SolutionInstallPushMultipart, CertificateAuthorityImportMultipart, ConfigurationCreateMultipart } from '../common/Multipart';

// TODO -  Make better!!

class SolutionManagerService extends BaseService {
    constructor(apiRoot) {
        super(apiRoot);
        this.serviceRoot = '/solutionManager';
    }

    async getCapabilities() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/capabilities');
    }

    async enumerateSolutions(queryParams) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/solutions?' + queryParams);
    }

    async getSolution(solutionId) {
        const uri = `${this.apiRoot}${this.serviceRoot}/solutions/${solutionId}`;
        console.log(uri);
        return this.getResource(uri);
    }

    async postReissueInstallCode(solutionId) {
        const uri = `${this.apiRoot}${this.serviceRoot}/solutions/${solutionId}/reissueInstallCode`;
        console.log(uri);
        return this.postResource(uri);
    }

    async getSolutionContext(solutionId) {
        const uri = `${this.apiRoot}${this.serviceRoot}/solutions/${solutionId}/context`;
        console.log(uri);
        return this.getResource(uri);
    }

    async modifySolutionContext(solutionId, context) {
        const uri = `${this.apiRoot}${this.serviceRoot}/solutions/${solutionId}/context`;
        return this.patchResource(uri, context);
    }

    async replaceSolutionContext(solutionId, context) {
        const uri = `${this.apiRoot}${this.serviceRoot}/solutions/${solutionId}/context`;
        return this.putResource(uri, context);
    }

    async getInstaller() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/installer');
    }


    readFileText(file) {
        // Always return a Promise
        return new Promise((resolve, reject) => {
            let content = '';

            const reader = new FileReader();
            // Wait till complete
            reader.onloadend = function (e) {
                content = e.target.result;
                resolve(content);
            };

            // Make sure to handle error states
            reader.onerror = function (e) {
                reject(e);
            };

            reader.readAsText(file);
        });
    }

    async installPushSolution(solutionFile, contextFile) {

        // Get the context as string
        var context = null;
        if (contextFile) {
            context = await this.readFileText(contextFile);
        }

        let installMultipart = new SolutionInstallPushMultipart({}, solutionFile, solutionFile.name, context);

        let response = await fetch(this._apiRoot + this.serviceRoot + '/installer/installSolution', {
            mode: 'cors',
            method: 'post',
            headers: {
                'Content-Type': installMultipart.contentTypeHeaderValue
            },
            body: installMultipart.createBlob()
        });

        if (response.status === 204) {
            return;
        }

        if (response.status === 200 || response.status === 201) {
            let json = await response.json();
            return json;
        }

        throw new Error(response.status);
    }

    async installPullSolution(solutionHostAddress, archivePath, contextPath) {
        let installMultipart = new SolutionInstallPullMultipart(solutionHostAddress, archivePath, contextPath);
        
        let response = await fetch(this._apiRoot + this.serviceRoot + '/installer/installRemote', {
            mode: 'cors',
            method: 'post',
            headers: {
                'Content-Type': installMultipart.contentTypeHeaderValue
            },
            body: installMultipart.createBlob()
        });

        if (response.status === 204) {
            return;
        }

        if (response.status === 200 || response.status === 201) {
            let json = await response.json();
            return json;
        }

        throw new Error(response.status);
    }

    async uninstallSolution(solutionId) {
        return this.postResource(this._apiRoot + this.serviceRoot + '/installer/uninstallSolution', { solutionId: solutionId });
    }

    async enumerateInstallerOperations(queryParams) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/installer/installerOperations?' + queryParams);
    }

    async getInstallerOperation(operationId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/installer/installerOperations/' + operationId);
    }

    async enumerateCertificateAuthorities(solutionId, queryParams) {
        const uri = `${this._apiRoot}${this.serviceRoot}/solutions/${solutionId}/certificateAuthorities?` + queryParams;
        return this.getResource(uri);
    }

    async enumerateRuntimeRegistrations(solutionId, queryParams) {
        const uri = `${this._apiRoot}${this.serviceRoot}/solutions/${solutionId}/runtimeRegistrations?` + queryParams;
        return this.getResource(uri);
    }

    async createRuntimeRegistration(solutionId, createRequest, queryParams) {
        console.log("inside of service createRuntimeRegistration");
        const uri = `${this._apiRoot}${this.serviceRoot}/solutions/${solutionId}/runtimeRegistrations?` + queryParams;
        return this.postResource(uri, createRequest);
    }

    async getRuntimeRegistration(solutionId, resourceId) {
        const uri = `${this._apiRoot}${this.serviceRoot}/solutions/${solutionId}/runtimeRegistrations/${resourceId}`;
        return this.getResource(uri);
    }

    async deleteRuntimeRegistration(solutionId, resourceId) {
        const uri = `${this._apiRoot}${this.serviceRoot}/solutions/${solutionId}/runtimeRegistrations/${resourceId}`;
        return this.deleteResource(uri);
    }

    async exportCertificateAuthorities(solutionId) {
        const uri = `${this._apiRoot}${this.serviceRoot}/solutions/${solutionId}/certificateAuthorities/export`;
        return await this.postResource(uri);
    }

    async getCertificateAuthority(solutionId, certificateId) {
        const uri = `${this._apiRoot}${this.serviceRoot}/solutions/${solutionId}/certificateAuthorities/${certificateId}`;
        return this.getResource(uri);
    }

    async importCertificateAuthority(solutionId, importRequest, certificateAuthorityFile) {
        const uri = `${this._apiRoot}${this.serviceRoot}/solutions/${solutionId}/certificateAuthorities/import`;
        
        let importMultipart = new CertificateAuthorityImportMultipart(importRequest, certificateAuthorityFile, certificateAuthorityFile.name);

        let response = await fetch(uri, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Content-Type': importMultipart.contentTypeHeaderValue
            },
            body: importMultipart.createBlob()
        });

        if (response.status === 204) {
            return;
        }

        if (response.status === 200 || response.status === 201) {
            let json = await response.json();
            return json;
        }

        let error = await this.generateErrorData(response, uri);
        throw new Error(response.status, { cause: error });
    }

    async deleteCertificateAuthority(solutionId, certificateId) {
        const uri = `${this._apiRoot}${this.serviceRoot}/solutions/${solutionId}/certificateAuthorities/${certificateId}`;
        return this.deleteResource(uri);
    }

    async exportCertificateAuthority(solutionId, certificateId) {
        const uri = `${this._apiRoot}${this.serviceRoot}/solutions/${solutionId}/certificateAuthorities/${certificateId}/export`;
        return this.postResource(uri);
    }

    async modifyConfiguration(solutionId, modifyRequest) {
        const uri = `${this._apiRoot}${this.serviceRoot}/solutions/${solutionId}/configuration`;
        return this.patchResource(uri, modifyRequest);
    }

    async getConfiguration(solutionId) {
        const uri = `${this._apiRoot}${this.serviceRoot}/solutions/${solutionId}/configuration`;
        return this.getResource(uri);
    }

    async getConfigurationData(solutionId) {
        const uri = `${this._apiRoot}${this.serviceRoot}/solutions/${solutionId}/configuration/data`;
        return this.getResource(uri);
    }

    async replaceConfigurationData(solutionId, configurationFile, contentType) {
        const uri = `${this._apiRoot}${this.serviceRoot}/solutions/${solutionId}/configuration/data`;
        let createRequest = ""; // Replace has an empty 'content'
        contentType = contentType ? contentType : "application/octet-stream";
        let importMultipart = new ConfigurationCreateMultipart(createRequest, configurationFile, contentType, configurationFile.name);

        let response = await fetch(uri, {
            mode: 'cors',
            method: 'put',
            headers: {
                'Content-Type': importMultipart.contentTypeHeaderValue
            },
            body: importMultipart.createBlob()
        });

        if (response.status === 204) {
            return;
        }

        if (response.status === 200 || response.status === 201) {
            let json = await response.json();
            return json;
        }

        let error = await this.generateErrorData(response, uri);
        throw new Error(response.status, { cause: error });
    }
}

export default SolutionManagerService
