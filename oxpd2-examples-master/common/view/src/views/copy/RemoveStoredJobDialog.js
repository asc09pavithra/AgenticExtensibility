import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useState } from 'react';
import SDKButton from '../../common/SDKButton';

export default function RemoveStoredJobDialog(props) {
    const [jobPassword, setJobPassword] = useState('');

    function handleCancelButtonPushed() {
        setJobPassword('');
        if (null !== props.onClose) {
            props.onClose();
        }
    }

    async function handleRemoveJob() {
        // Build the request body
        const requestBody = jobPassword.trim() !== '' ? { jobPassword: jobPassword } : {};

        try {
            const response = await props.service.removeStoredJob(props.agentId, props.storedJobId, requestBody);
            console.log("Remove Stored Job response: " + JSON.stringify(response));

            props.postAlert('success', 'Stored Job removed successfully');
            setJobPassword('');
            
            if (null !== props.onRemoveSuccess) {
                props.onRemoveSuccess();
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to remove stored job - ' + error.cause.message);
        }
    }

    const handlePasswordChange = (event) => {
        setJobPassword(event.target.value);
    };

    return (
        <Dialog fullWidth maxWidth="sm" open={props.open} onClose={handleCancelButtonPushed}>
            <DialogTitle>{"Remove Stored Job"}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="jobPassword"
                    label="Job Password (Optional)"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={jobPassword}
                    onChange={handlePasswordChange}
                />
            </DialogContent>
            <DialogActions>
                <SDKButton
                    disabled={false}
                    buttonlabel="Cancel"
                    primaryToolTip="Cancel and close dialog"
                    secondaryToolTip="Cancel and close dialog"
                    secondaryToolTipCondition={true}
                    onClick={handleCancelButtonPushed}
                />
                <SDKButton
                    color="secondary"
                    disabled={false}
                    buttonlabel="Remove"
                    primaryToolTip="Remove the stored job"
                    secondaryToolTip="Remove the stored job"
                    secondaryToolTipCondition={true}
                    onClick={handleRemoveJob}
                />
            </DialogActions>
        </Dialog>
    );
}
