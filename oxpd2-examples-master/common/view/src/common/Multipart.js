class MultipartPart {
    constructor(headers, body) {
        this.headers = headers;
        this.body = body;
    }
}

class Multipart {
    constructor(parts, boundary) {
        this.parts = parts;
        this.boundary = (typeof boundary === 'undefined' || boundary === null) ? Multipart.generateBoundary() : boundary;
    }

    get contentTypeHeaderValue() {
        return 'multipart/mixed; boundary=' + this.boundary;
    }

    static generateBoundary() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    createBlob() {
        const dashes = '--';
        const newline = '\r\n';
        const startPartBlob = new Blob([dashes + this.boundary + newline]);
        const multipartEndBlob = new Blob([dashes + this.boundary + dashes]);
        let partBlobsArray = [];

        if (Array.isArray(this.parts)) {
            this.parts.forEach((part) => {
                // For each part, we first want to build an array of "header-blobs"
                let thisPartBlobHeadersArray = [];

                if (Array.isArray(part.headers)) {
                    part.headers.forEach((header) => {
                        // For each header in the headers array, create the corresponding header-blob and add to array
                        // e.g. 'Content-Type: application/json\r\n'
                        thisPartBlobHeadersArray.push(new Blob([header + newline]));
                    });
                }

                // Now create the "full" part blob as a combination of the boundary, headers and body and add to array
                // e.g. '--batch_boundary\r\nContent-Type: application/json\r\nContent-Disposition: form-data; name="content"\r\n\r\n{ "archiveType": "atSolution" }\r\n'
                partBlobsArray.push(new Blob([startPartBlob, new Blob(thisPartBlobHeadersArray), newline, part.body, newline]));
            });
        }

        return new Blob([new Blob(partBlobsArray), multipartEndBlob]);
    }
}

class SolutionInstallPushMultipart extends Multipart {
    constructor(content, solutionBundle, solutionBundleFilename, context) {
        let parts = [];

        // First the content-part
        parts.push(SolutionInstallPushMultipart.createContentMultipartPart(content));

        // Next the context-part if provided
        if (typeof context !== 'undefined' && context !== null) {
            parts.push(SolutionInstallPushMultipart.createContextMultipartPart(context));
        }

        // Next the solution-part if provided
        if (typeof solutionBundle !== 'undefined' && solutionBundle !== null) {
            const filename = (typeof solutionBundleFilename === 'undefined' || solutionBundleFilename === null) ? "unknown" : solutionBundleFilename;
            parts.push(SolutionInstallPushMultipart.createSolutionMultipartPart(solutionBundle, filename));
        }

        super(parts);
    }

    static createContentMultipartPart(content) {
        const headers = [
            'Content-Type: application/json',
            'Content-Disposition: form-data; name="content"'
        ]
        return new MultipartPart(headers, JSON.stringify(content));
    }

    static createSolutionMultipartPart(solutionBundle, solutionBundleFilename) {
        const headers = [
            'Content-Type: application/vnd.hp.solution-bundle',
            'Content-Disposition: form-data; name="solution"; filename="' + solutionBundleFilename + '"'
        ]
        return new MultipartPart(headers, solutionBundle);
    }

    static createContextMultipartPart(context) {
        const headers = [
            'Content-Type: application/json',
            'Content-Disposition: form-data; name="context"'
        ]
        return new MultipartPart(headers, context);
    }
}

class SolutionInstallPullMultipart extends Multipart {
    constructor(solutionHostAddress, archivePath, contextPath) {
        let parts = [];

        // First the content-part
        parts.push(SolutionInstallPullMultipart.createContentMultipartPart({}));

        // Next the remote-part
        parts.push(SolutionInstallPullMultipart.createRemoteMultipartPart(solutionHostAddress, archivePath, contextPath));

        super(parts);
    }

    static createContentMultipartPart(content) {
        const headers = [
            'Content-Type: application/json',
            'Content-Disposition: form-data; name="content"'
        ]
        return new MultipartPart(headers, JSON.stringify(content));
    }

    static createRemoteMultipartPart(solutionHostAddress, archivePath, contextPath) {
        const headers = [
            'Content-Type: application/json',
            'Content-Disposition: form-data; name="remote"'
        ]

        let remoteArchivePayload =
        {
            archiveTarget: {
                host: {
                    explicit: {
                        explicitValue: solutionHostAddress
                    }
                },
                path: {
                    explicit: {
                        explicitValue: archivePath
                    }
                },
                scheme: "http"
            },
            archiveType: "atSolutionArchive"
        }

        if (contextPath !== '') {
            remoteArchivePayload.contextTarget = {
                host: {
                    explicit: {
                        explicitValue: solutionHostAddress
                    }
                },
                path: {
                    explicit: {
                        explicitValue: contextPath
                    }
                },
                scheme: "http"
            }
        }

        return new MultipartPart(headers, JSON.stringify(remoteArchivePayload));
    }
}

class CertificateAuthorityImportMultipart extends Multipart {
    constructor(content, certificateAuthority, certificateAuthorityFileName) {
        let parts = [];

        // First the content-part
        parts.push(CertificateAuthorityImportMultipart.createContentMultipartPart(content));

        // Next the certificate-part if provided
        if (typeof certificateAuthority !== 'undefined' && certificateAuthority !== null) {
            const filename = (typeof certificateAuthorityFileName === 'undefined' || certificateAuthorityFileName === null) ? "unknown" : certificateAuthorityFileName;
            parts.push(CertificateAuthorityImportMultipart.createCertificateMultipartPart(certificateAuthority, filename));
        }

        super(parts);
    }

    static createContentMultipartPart(content) {
        const headers = [
            'Content-Type: application/json',
            'Content-Disposition: form-data; name="content"'
        ]
        return new MultipartPart(headers, JSON.stringify(content));
    }

    static createCertificateMultipartPart(certificateAuthority, filename) {
        const headers = [
            'Content-Type: application/x-pem-file',
            'Content-Disposition: form-data; name="certificate"; filename="' + filename + '"'
        ]
        return new MultipartPart(headers, certificateAuthority);
    }
}

class ConfigurationCreateMultipart extends Multipart {
    constructor(content, configurationData, contentType, dataFileName) {
        let parts = [];

        // First the content-part
        parts.push(ConfigurationCreateMultipart.createContentMultipartPart(content));

        // Next the configurationData
        if (typeof configurationData !== 'undefined' && configurationData !== null) {
            const filename = (typeof dataFileName === 'undefined' || dataFileName === null) ? "unknown" : dataFileName;
            parts.push(ConfigurationCreateMultipart.createConfigurationDataMultiPart(configurationData, contentType, filename));
        }

        super(parts);
    }

    static createContentMultipartPart(content) {
        const headers = [
            'Content-Type: application/json',
            'Content-Disposition: form-data; name="content"'
        ]
        return new MultipartPart(headers, JSON.stringify(content));
    }

    static createConfigurationDataMultiPart(data, contentType, filename) {
        const headers = [
            'Content-Type: ' + contentType,
            'Content-Disposition: form-data; name="data" ; filename="' + filename + '"'
        ]
        return new MultipartPart(headers, data);
    }
}

export {
    MultipartPart,
    Multipart,
    SolutionInstallPullMultipart,
    SolutionInstallPushMultipart,
    CertificateAuthorityImportMultipart,
    ConfigurationCreateMultipart
}
