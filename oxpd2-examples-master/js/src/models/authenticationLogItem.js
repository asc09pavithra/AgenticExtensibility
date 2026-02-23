/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */
import { LogItem } from "./logItem.js"
export class AuthenticationLogItem extends LogItem {
    constructor(type, authApiRequest, authResult) {
        let dataMap = new Map();
        dataMap.set("authApiRequest", authApiRequest);
        dataMap.set("authResult", authResult);
        const requestObject = Object.fromEntries(dataMap);
        super(type, requestObject)
    }
}
