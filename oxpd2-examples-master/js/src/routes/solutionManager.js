/**
 * (C) Copyright 2022 HP Development Company, L.P.
 * All rights reserved.
 */

import express from 'express';
var solutionMangerRouter = express.Router();

// SolutionManger Controllers
import solutionManagerController from "../controllers/solutionManagerController.js";

// Routes

// Capabilities
solutionMangerRouter.get("/capabilities", solutionManagerController.get_capabilities);

// Installer
solutionMangerRouter.get("/installer", solutionManagerController.get_installer);

solutionMangerRouter.post("/installer/installSolution", solutionManagerController.installer_install_solution);

solutionMangerRouter.post("/installer/installRemote", solutionManagerController.installer_install_remote);

solutionMangerRouter.post("/installer/uninstallSolution", solutionManagerController.installer_uninstall_solution);

solutionMangerRouter.get("/installer/installerOperations", solutionManagerController.installer_enumerate_installer_operations);

solutionMangerRouter.get("/installer/installerOperations/:operationId", solutionManagerController.installer_get_installer_operation);

// Solutions
solutionMangerRouter.get("/solutions", solutionManagerController.enumerate_solutions);

solutionMangerRouter.get("/solutions/:solutionId", solutionManagerController.get_solution);

solutionMangerRouter.get("/solutions/:solutionId/context", solutionManagerController.solution_get_context);

solutionMangerRouter.patch("/solutions/:solutionId/context", solutionManagerController.solution_modify_context);

solutionMangerRouter.put("/solutions/:solutionId/context", solutionManagerController.solution_replace_context);

solutionMangerRouter.get("/solutions/:solutionId/configuration", solutionManagerController.get_configuration);

solutionMangerRouter.patch("/solutions/:solutionId/configuration", solutionManagerController.modify_configuration);

solutionMangerRouter.get("/solutions/:solutionId/configuration/data", solutionManagerController.get_configuration_data);

solutionMangerRouter.put("/solutions/:solutionId/configuration/data", solutionManagerController.replace_configuration_data);

solutionMangerRouter.post("/solutions/:solutionId/reissueInstallCode", solutionManagerController.solution_reissue_install_code);

solutionMangerRouter.get("/solutions/:solutionId/certificateAuthorities", solutionManagerController.solution_enumerate_certificate_authorities);

solutionMangerRouter.post("/solutions/:solutionId/certificateAuthorities/export", solutionManagerController.solution_export_certificate_authorities);

solutionMangerRouter.post("/solutions/:solutionId/certificateAuthorities/import", solutionManagerController.solution_import_certificate_authority);

solutionMangerRouter.get("/solutions/:solutionId/certificateAuthorities/:certificateId", solutionManagerController.solution_get_certificate_authority);

solutionMangerRouter.delete("/solutions/:solutionId/certificateAuthorities/:certificateId", solutionManagerController.solution_delete_certificate_authority);

solutionMangerRouter.post("/solutions/:solutionId/certificateAuthorities/:certificateId/export", solutionManagerController.solution_export_certificate_authority);

solutionMangerRouter.get("/solutions/:solutionId/runtimeRegistrations", solutionManagerController.solution_enumerate_runtime_registrations);

solutionMangerRouter.post("/solutions/:solutionId/runtimeRegistrations", solutionManagerController.solution_create_runtime_registration);

solutionMangerRouter.get("/solutions/:solutionId/runtimeRegistrations/:resourceId", solutionManagerController.solution_get_runtime_registration);

solutionMangerRouter.delete("/solutions/:solutionId/runtimeRegistrations/:resourceId", solutionManagerController.solution_delete_runtime_registration);

export default solutionMangerRouter;
