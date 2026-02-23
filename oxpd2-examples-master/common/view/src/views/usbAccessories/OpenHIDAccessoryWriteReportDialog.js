import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import React, { useState } from 'react';

import SDKButton from '../../common/SDKButton';
import { useStyles } from '../../common/commonStyles';

export default function WriteReportDialog(props) {
    let classes = useStyles();
    const [async, setAsync] = useState(true);
    const [data, setData] = useState("");
    const [reportId, setReportId] = useState("0");
    const [reportType, setReportType] = useState("hrtFeature");
    const [response, setResponse] = useState(null);

    async function handleRead() {
        let writeReportResponse = await props.onSubmit(async, data, parseInt(reportId), reportType);
        setResponse(JSON.stringify(writeReportResponse, undefined, 2));
    }

    function getReportTypeValue(num) {
        switch (num) {
            case 20: return "hrtOutput"
            case 30: return "hrtFeature"
        }
    }

    function getReportTypeNumber(value) {
        switch (value) {
            case "hrtOutput": return 20
            case "hrtFeature": return 30
        }
    }

    return (
        <Dialog fullWidth maxWidth="sm" open={props.open} onClose={props.onClose} >
            <DialogTitle>Write Report</DialogTitle>
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
                    id="data"
                    label="Data"
                    type="text"
                    value={data}
                    onInput={e => setData(e.target.value)}
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
                        onChange={e => setReportType(getReportTypeValue(e.target.value))}
                    >
                        <MenuItem value={20}>hrtOutput</MenuItem>
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
                    primaryToolTip="Exit Write Report View"
                    secondaryToolTip="No Open HID Accessory"
                    secondaryToolTipCondition={true}
                    onClick={props.onClose}
                />
                <SDKButton
                    disabled={!data || !reportId || !reportType}
                    buttonlabel="Write"
                    primaryToolTip="Perform Write Report"
                    secondaryToolTip="One Or More Fields Missing"
                    secondaryToolTipCondition={!(!data || !reportId || !reportType)}
                    onClick={handleRead}
                />
            </DialogActions>
        </Dialog>
    )
}
