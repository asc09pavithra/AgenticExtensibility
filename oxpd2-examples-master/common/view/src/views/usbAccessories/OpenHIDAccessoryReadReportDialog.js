import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import React, { useState } from 'react';

import SDKButton from '../../common/SDKButton';
import { useStyles } from '../../common/commonStyles';

export default function ReadReportDialog(props) {
    let classes = useStyles();
    const [async, setAsync] = useState(true);
    const [length, setLength] = useState(props.featureLength);
    const [reportId, setReportId] = useState("0");
    const [reportType, setReportType] = useState("hrtFeature");
    const [response, setResponse] = useState(null);

    async function handleRead() {
        let readReportResponse = await props.onSubmit(async, length, parseInt(reportId), reportType);
        setResponse(JSON.stringify(readReportResponse, undefined, 2));
    }

    function getReportTypeValue(num) {
        switch (num) {
            case 10: return "hrtInput"
            case 30: return "hrtFeature"
        }
    }

    function getReportTypeNumber(value) {
        switch (value) {
            case "hrtInput": return 10
            case "hrtFeature": return 30
        }
    }

    async function updateHidAccessoryReportType(reportType) {
        let response;
        setReportType(reportType);

        try {
            response = await props.usbAccessoryService.getOpenHIDAccessory(props.accessoryID, props.openHIDAccessoryID, props.isOwned);
            console.log("Response ===> " + JSON.stringify(response));

            if (null !== response) {
                if (reportType === "hrtInput") {
                    setLength(response.inputReportLength || "0");
                } else if (reportType === "hrtFeature") {
                    setLength(response.featureReportLength || "0");
                } else {
                    setLength(response.outputReportLength || "0");
                }
            }

        } catch (error) {
            props.postAlert('error', 'Unable to get report length - ' + error.cause.message);
        }
    }

    return (
        <Dialog fullWidth maxWidth="sm" open={props.open} onClose={props.onClose} >
            <DialogTitle>Read Report</DialogTitle>
            <DialogContent>
                <FormControlLabel
                    control={
                        <Switch
                            checked={async}
                            onChange={e => setAsync(e.target.checked)}
                            name="async"
                            color="primary"
                        />
                    }
                    label={async ? "asynchronous" : "synchronous"}
                />
                <TextField className={classes.dialogTextField} variant="outlined" required fullWidth
                    id="length"
                    label="Length"
                    type="text"
                    value={length}
                />
                <TextField className={classes.dialogTextField} variant="outlined" required fullWidth
                    id="reportId"
                    label="Report ID"
                    type="text"
                    value={reportId}
                    onInput={e => setReportId(e.target.value)}
                />
                <FormControl className={classes.dialogTextField} fullWidth>
                    <InputLabel variant="outlined" required shrink id="report-type">Report Type</InputLabel>
                    <Select variant="outlined"
                        labelId="report-type"
                        id="reportType"
                        value={getReportTypeNumber(reportType)}
                        label="Report Type"
                        onChange={e => updateHidAccessoryReportType(getReportTypeValue(e.target.value))}
                    >
                        <MenuItem value={10}>hrtInput</MenuItem>
                        <MenuItem value={30}>hrtFeature</MenuItem>
                    </Select>
                </FormControl>
                <TextField className={classes.dialogTextField} variant="outlined" fullWidth
                    id="response"
                    label="Response"
                    type="text"
                    value={response}
                    multiline
                    disabled
                />
            </DialogContent>
            <DialogActions>
                <SDKButton
                    disabled={false}
                    buttonlabel="Done"
                    primaryToolTip="Exit Read Report View"
                    secondaryToolTip="No Open HID Accessory"
                    secondaryToolTipCondition={true}
                    onClick={props.onClose}
                />
                <SDKButton
                    disabled={!length || !reportId || !reportType}
                    buttonlabel="Read"
                    primaryToolTip="Perform Read Report"
                    secondaryToolTip="One Or More Fields Missing"
                    secondaryToolTipCondition={!(!length || !reportId || !reportType)}
                    onClick={handleRead}
                />
            </DialogActions>
        </Dialog>
    )
}
