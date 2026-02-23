import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, FormControlLabel, Switch } from '@mui/material';
import SDKButton from '../../common/SDKButton';

export default function ModifyDialog(props) {
    const [reportReadingActive, setReportReadingActive] = useState(props.reportReadingActive);

    function handleReportReadingActiveChanged(status) {
        setReportReadingActive(status);
    }

    function handleSubmit() {
        let request = { reportReadingActive: reportReadingActive };
        console.log("Request ===> " + JSON.stringify(request, undefined, 2));
        props.onSubmit(request);
    }

    return (
        <Dialog fullWidth maxWidth="sm" open={props.open} onClose={props.onClose} >
            <DialogTitle>Report Reading Active</DialogTitle>
            <DialogContent>
                <FormControlLabel
                    control={
                        <Switch
                            checked={reportReadingActive}
                            onChange={e => handleReportReadingActiveChanged(e.target.checked)}
                            name="reportReadingActive"
                            color="primary"
                        />
                    }
                    label={reportReadingActive ? "Enabled" : "Disabled"}
                />
            </DialogContent>
            <DialogActions>
                <SDKButton
                    disabled={false}
                    buttonlabel="Cancel"
                    primaryToolTip="Exit This View"
                    secondaryToolTip="No Open HID Accessory"
                    secondaryToolTipCondition={true}
                    onClick={props.onClose}
                />
                <SDKButton
                    disabled={false}
                    buttonlabel="Submit"
                    primaryToolTip="Modify HID Accessory"
                    secondaryToolTip="No Open HID Accessory"
                    secondaryToolTipCondition={true}
                    onClick={handleSubmit}
                />
            </DialogActions>
        </Dialog>
    )
}
