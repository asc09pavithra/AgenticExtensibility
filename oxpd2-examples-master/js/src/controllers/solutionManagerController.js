/**
 * (C) Copyright 2022 HP Development Company, L.P.
 * All rights reserved.
 */

import solutionManagerService from "../services/solutionMangerService.js";
import oxpd2 from "oxpd2"
const solutionManagerTypes = oxpd2.solutionManagerTypes;
import MultipartParser from "../utils/multipartParser.js";

const solutionManagerController = {};

solutionManagerController.get_capabilities = async (req, res, next) => {
    try {
        let capabilities = await solutionManagerService.getCapabilities();
        res.status(200).send(capabilities);
    }
    catch (err) {
        next(err);
    }
}

solutionManagerController.enumerate_solutions = async (req, res, next) => {
    try {
        let solutions = await solutionManagerService.enumerateSolutions(req.query.includeMembers, req.query.contentFilter);
        res.status(200).send(solutions);
    }
    catch (err) {
        next(err);
    }
}

solutionManagerController.get_solution = async (req, res, next) => {
    try {
        let solution = await solutionManagerService.getSolution(req.params.solutionId);
        res.status(200).send(solution);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.solution_reissue_install_code = async (req, res, next) => {
    try {
        let solutionReissueInstallCode = await solutionManagerService.reissueInstallCode(req.params.solutionId);
        res.status(200).send(solutionReissueInstallCode);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.solution_get_context = async (req, res, next) => {
    try {
        let context = await solutionManagerService.getSolutionContext(req.params.solutionId);
        res.status(200).send(context);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.solution_modify_context = async (req, res, next) => {
    try {
        let context = await solutionManagerService.modifySolutionContext(req.params.solutionId, req.body);
        res.status(200).send(context);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.solution_replace_context = async (req, res, next) => {
    try {
        let context = await solutionManagerService.replaceSolutionContext(req.params.solutionId, req.body);
        res.status(200).send(context);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.get_configuration = async (req, res, next) => {
    try {
        let context = await solutionManagerService.getConfiguration(req.params.solutionId);
        res.status(200).send(context);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.modify_configuration = async (req, res, next) => {
    try {
        let configuration = await solutionManagerService.modifyConfiguration(req.params.solutionId, req.body);
        res.status(200).send(configuration);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.get_configuration_data = async (req, res, next) => {
    try {
        let data = await solutionManagerService.getConfigurationData(req.params.solutionId);
        res.status(200).send(data);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.replace_configuration_data = async (req, res, next) => {
    let data = null;
    let mimeType = "application/octet-stream";

    let boundary = MultipartParser.getContentBoundary(req.headers['content-type']);
    let parts = MultipartParser.parseContent(boundary, req.body);

    if (0 === parts.length) {
        throw new Error("Expected parts in request!")
    }

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

        if (cdHeader.directives["name"] === "content") {

        }
        else if (cdHeader.directives["name"] === "data") {
            data = new Blob([part.data]);
        }
    });
    
    try {
        let responseData = await solutionManagerService.replaceConfigurationData(req.params.solutionId, data, mimeType);
        res.status(200).send(responseData);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.solution_enumerate_certificate_authorities = async (req, res, next) => {
    let query = new URLSearchParams(req.query);

    try {
        let certificateAuthorities = await solutionManagerService.enumerateCertificateAuthorities(req.params.solutionId, query);
        res.status(200).send(certificateAuthorities);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.solution_export_certificate_authorities = async (req, res, next) => {
    try {
        let response = await solutionManagerService.exportCertificateAuthorities(req.params.solutionId);
        res.status(200).send(response);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.solution_get_certificate_authority = async (req, res, next) => {
    try {
        let certificateAuthority = await solutionManagerService.getCertificateAuthority(req.params.solutionId, req.params.certificateId);
        res.status(200).send(certificateAuthority);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.solution_delete_certificate_authority = async (req, res, next) => {
    try {
        let deleteContent = await solutionManagerService.deleteCertificateAuthority(req.params.solutionId, req.params.certificateId);
        res.status(200).send(deleteContent);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.solution_export_certificate_authority = async (req, res, next) => {
    try {
        let response = await solutionManagerService.exportCertificateAuthority(req.params.solutionId, req.params.certificateId);
        res.status(200).send(response);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.solution_import_certificate_authority = async (req, res, next) => {
    let importRequest = null;
    let certificateFile = null;
    let certificateFileName = "certificate.pem";

    let boundary = MultipartParser.getContentBoundary(req.headers['content-type']);
    let parts = MultipartParser.parseContent(boundary, req.body);

    if (0 === parts.length) {
        throw new Error("Expected parts in request!")
    }

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

        if (cdHeader.directives["name"] === "content") {
            importRequest = new oxpd2.SolutionManagerService.CertificateImportRequest(JSON.parse(part.data));
        }
        else if (cdHeader.directives["name"] === "certificate") {
            certificateFile = new Blob([part.data]);
            certificateFileName = cdHeader.directives["filename"];
        }
    });
    
    try {
        let certAuthImport = await solutionManagerService.importCertificateAuthority(req.params.solutionId, importRequest, certificateFile, certificateFileName);
        res.status(200).send(certAuthImport);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.get_installer = async (req, res, next) => {
    try {
        let installer = await solutionManagerService.getInstaller();
        res.status(200).send(installer);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.installer_install_solution = async (req, res, next) => {
    let installSolutionRequest = null;
    let solutionBundle = null;
    let solutionBundleFilename = "solution.bdl";
    let context = null;

    let boundary = MultipartParser.getContentBoundary(req.headers['content-type']);
    let parts = MultipartParser.parseContent(boundary, req.body);

    if (0 === parts.length) {
        throw new Error("OXPd scan target must have at least one part!")
    }

    parts.forEach((part) => {
        let cdHeader = part.headers.find((header) => {
            if (header.name === "content-disposition") {
                return true;
            }
            return false;
        });

        if (cdHeader.directives["name"] === "content") {
            installSolutionRequest = new oxpd2.SolutionManagerService.InstallSolutionRequest(JSON.parse(part.data));
        }
        else if (cdHeader.directives["name"] === "context") {
            context = new oxpd2.SolutionManagerService.Context_Replace(JSON.parse(part.data));
        }
        else if (cdHeader.directives["name"] === "solution") {
            solutionBundle  = new Blob([part.data]);
        }
    });

    try {
        let installer = await solutionManagerService.installSolution(installSolutionRequest, solutionBundle, solutionBundleFilename, context);
        res.status(200).send(installer)
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.installer_install_remote = async (req, res, next) => {
    let installRemoteRequest = null;
    let remoteArchive = null;

    let boundary = MultipartParser.getContentBoundary(req.headers['content-type']);
    let parts = MultipartParser.parseContent(boundary, req.body);

    if (0 === parts.length) {
        throw new Error("OXPd scan target must have at least one part!")
    }

    parts.forEach((part) => {
        let cdHeader = part.headers.find((header) => {
            if (header.name === "content-disposition") {
                return true;
            }
            return false;
        });

        if (cdHeader.directives["name"] === "content") {
            installRemoteRequest = new oxpd2.SolutionManagerService.InstallRemoteRequest(JSON.parse(part.data));
        }
        else if (cdHeader.directives["name"] === "remote") {
            remoteArchive = new oxpd2.SolutionManagerTypes.RemoteArchive(JSON.parse(part.data));
        }
    });

    try {
        let installer = await solutionManagerService.installRemote(installRemoteRequest, remoteArchive);
        res.status(200).send(installer)
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.installer_uninstall_solution = async (req, res, next) => {
    try {
        let installer = await solutionManagerService.uninstallSolution(req.body);
        res.status(200).send(installer);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.installer_enumerate_installer_operations = async  (req, res, next) => {
    try {
        let installerOperations = await solutionManagerService.enumerateInstallerOperations(req.query.includeMembers, req.query.contentFilter);
        res.status(200).send(installerOperations);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.installer_get_installer_operation = async (req, res, next) => {
    try {
        let installerOperation = await solutionManagerService.getInstallerOperation(req.params.operationId);
        res.status(200).send(installerOperation);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.solution_enumerate_runtime_registrations = async (req, res, next) => {
    let query = new URLSearchParams(req.query);

    try {
        let runtimeRegistrations = await solutionManagerService.enumerateRuntimeRegistrations(req.params.solutionId, query);
        res.status(200).send(runtimeRegistrations);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.solution_create_runtime_registration = async (req, res, next) => {
    let query = new URLSearchParams(req.query);

    try {
        let runtimeRegistration = await solutionManagerService.createRuntimeRegistration(req.params.solutionId, req.body, query);
        res.status(200).send(runtimeRegistration);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.solution_get_runtime_registration = async (req, res, next) => {
    let query = new URLSearchParams(req.query);

    try {
        let runtimeRegistration = await solutionManagerService.getRuntimeRegistration(req.params.solutionId, req.params.resourceId, query);
        res.status(200).send(runtimeRegistration);
    }
    catch (err) {
        next(err);
    }
};

solutionManagerController.solution_delete_runtime_registration = async (req, res, next) => {
    try {
        let deleteContent = await solutionManagerService.deleteRuntimeRegistration(req.params.solutionId, req.params.resourceId);
        res.status(200).send(deleteContent);
    }
    catch (err) {
        next(err);
    }
};

export default solutionManagerController;
