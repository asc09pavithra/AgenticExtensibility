import { useState } from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, Checkbox, FormControlLabel, TextField } from '@mui/material';
import SDKButton from '../../common/SDKButton';

export default function OpenHIDAccessoryDialog(props) {
    const [reportReadingActive, setReportReadingActive] = useState(false);
    const [operationContext, setOperationContext] = useState("");

    function handleSubmit() {
        props.onSubmit(operationContext, reportReadingActive);
    }

    return (
        <Dialog fullWidth maxWidth="sm" open={props.open} onClose={props.onClose} >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    id="operationContext"
                    label="Operation Context"
                    value={operationContext}
                    onChange={e => setOperationContext(e.target.value)}
                />
                <br />
                <FormControlLabel
                    control={
                        <Checkbox
                            id="reportReadingActive"
                            value={reportReadingActive}
                            onChange={e => setReportReadingActive(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Report Reading Active"
                />

            </DialogContent>
            <DialogActions>
                <SDKButton
                    disabled={false}
                    buttonlabel="Cancel"
                    primaryToolTip="Exit Open HID Accessory View"
                    secondaryToolTip="Exit Unavailable"
                    secondaryToolTipCondition={true}
                    onClick={props.onClose}
                />
                <SDKButton
                    disabled={false}
                    buttonlabel="Submit"
                    primaryToolTip="Open A HID Accessory"
                    secondaryToolTip="Missing Fields"
                    secondaryToolTipCondition={true}
                    onClick={handleSubmit}
                />
            </DialogActions>
        </Dialog>
    )
}
