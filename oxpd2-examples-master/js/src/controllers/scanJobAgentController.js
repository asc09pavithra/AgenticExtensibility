/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */

import MultipartParser from "../utils/multipartParser.js";
import fs from 'fs';
import oxpd2 from "oxpd2"
import scanJobAgentService from "../services/scanJobAgentService.js";

const scanJobAgentController = {};

scanJobAgentController.post_notification = async (req, res, next) => {
    try {
        for (let payloadItemJson of req.body.payloads) {
            await scanJobAgentService.handleNotification(payloadItemJson);
        }
        res.status(200).send();
    }
    catch (err) {
        next(err);
    }
}

scanJobAgentController.receive_scan_job = async (req, res, next) => {
    let scanJobReceived = null;
    let fileStream = null;

    let boundary = MultipartParser.getContentBoundary(req.headers['content-type']);
    let parts = MultipartParser.parseContent(boundary, req.body);

    if (0 === parts.length) {
        scanJobReceived = new oxpd2.ScanJobService.ServiceTargetContent(req.body);
    }
    else {
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
                scanJobReceived = new oxpd2.ScanJobService.ServiceTargetContent(JSON.parse(part.data));
            }
            else if (cdHeader.directives["name"] === "scanFile" || cdHeader.directives["name"] === "metadata") {
                fileStream = Buffer.from(part.data);
                let fileName = cdHeader.directives["filename"];

                if (scanJobReceived.scanJobId != null) {
                    fileName = "./ScanFiles/" + scanJobReceived.scanJobId.toString() + "/" + fileName;
                    if (!fs.existsSync("./ScanFiles/" + scanJobReceived.scanJobId.toString())) {
                        fs.mkdirSync("./ScanFiles/" + scanJobReceived.scanJobId.toString(), { recursive: true });
                    }
                }
                else {
                    fileName = "./ScanFiles/unknownId/" + fileName;
                    if (!fs.existsSync("./ScanFiles/unknownId/")) {
                        fs.mkdirSync("./ScanFiles/unknownId/", { recursive: true });
                    }
                }
                fs.writeFile(fileName, fileStream, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        });
    }
    try {
        let log = await scanJobAgentService.handleScanJobReceiver(scanJobReceived);
        res.status(200).send();
    }
    catch (err) {
        next(err);
    }
}


export default scanJobAgentController;
