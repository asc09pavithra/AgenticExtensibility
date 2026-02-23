import { Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import SDKButton from '../../common/SDKButton';

export default function ModifyJobsDialog(props) {
    const [notified, setNotified] = useState(0);
    const [processed, setProcessed] = useState(0);
    const jobStatisticsService = props.service;

    useEffect(() => { setNotified(props.jobs.lastSequenceNumberNotified)}, [props.jobs.lastSequenceNumberNotified] )
    useEffect(() => { setProcessed(props.jobs.lastSequenceNumberProcessed)}, [props.jobs.lastSequenceNumberProcessed] )
    
    function handleNotifiedChanged(e) {
        setNotified(parseInt(e.target.value));
    }

    function handleProcessedChanged(e) {
        setProcessed(parseInt(e.target.value));
    }

    async function handleModifyButtonPushed(e) {
        let response;
        try {
            response = await jobStatisticsService.modifyJobs(props.agentId, {
                lastSequenceNumberNotified: notified,
                lastSequenceNumberProcessed: processed
            })
            console.log("modifyJobs response:" + JSON.stringify(response));

            if (null !== response && null !== props.onStartModifyClose) {
                props.onStartModifyClose()
            }
        } catch (error) {
            props.postAlert('error', 'Unable to modify jobs - ' + error.message);
        }
    }

    function handleCancelButtonPushed() {
        if (null !== props.onClose) {
            props.onClose();
        }
    }

    return(
        <Dialog fullWidth={true} maxWidth="sm" open={props.open} onClose={props.handleClose}>
            <DialogTitle>Modify Jobs</DialogTitle>
            <DialogContent style={{ height: '300px' }}>
                <Grid container spacing={3} alignContent="flex-start" alignItems="center">
                    <Grid container item xs={12} spacing={3}>
                        <Grid item xs={12}>
                            <TextField label="lastSequenceNumberNotified" type='number' variant="outlined" size="small" value={notified} fullWidth onChange={handleNotifiedChanged} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="lastSequenceNumberProcessed" type='number' variant="outlined" size="small" value={processed} fullWidth onChange={handleProcessedChanged}/>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <SDKButton
                    disabled={false}
                    buttonlabel="Cancel"
                    primaryToolTip="Exit Message"
                    secondaryToolTip="Unable to Exit Message"
                    secondaryToolTipCondition={true}
                    onClick={handleCancelButtonPushed}
                />
                <SDKButton
                    disabled={false}
                    buttonlabel="Modify Jobs"
                    primaryToolTip="Modify Jobs"
                    secondaryToolTip="Unable to Modify Jobs"
                    secondaryToolTipCondition={true}
                    onClick={handleModifyButtonPushed}
                />
            </DialogActions>
        </Dialog>
    );
}
