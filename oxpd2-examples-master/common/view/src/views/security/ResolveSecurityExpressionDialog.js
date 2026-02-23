import { Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import SDKButton from '../../common/SDKButton';

export default function ResolveSecurityExpressionDialog(props) {
    const [expression, setExpression] = useState("");
    const [resolvedExpression, setResolvedExpression] = useState("");
    const securityService = props.service;

    function handleExpressionChanged(e) {
        setExpression(e.target.value);
        setResolvedExpression("");
    }

    async function handleResolveButtonPushed(e) {
        let response;
        try {
            response = await securityService.resolveSecurityExpression(props.agentId, {
                expression: expression
            })
            console.log("resolveSecurityExpression response:" + JSON.stringify(response));
            setResolvedExpression(response.result);
        } catch (error) {
            props.postAlert('error', 'Unable to resolve expression - ' + error.cause.message);
        }
    }

    function handleCancelButtonPushed() {
        if (null !== props.onClose) {
            setExpression("");
            setResolvedExpression("");
            props.onClose();
        }
    }

    return(
        <Dialog fullWidth={true} maxWidth="sm" open={props.open} onClose={props.handleClose}>
            <DialogTitle>Resolve Security Expression</DialogTitle>
            <DialogContent style={{ height: '300px' }}>
                <Grid container spacing={3} alignContent="flex-start" alignItems="center">
                    <Grid container item xs={12} spacing={3}>
                        <Grid item xs={12} style={{ marginTop: '5px' }}>
                            <TextField label="Security Expression" variant="outlined" size="small" value={expression} fullWidth onChange={handleExpressionChanged} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Resolved Security Expression Value" variant="outlined" size="small" value={resolvedExpression} fullWidth />
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <SDKButton
                    disabled={expression === "" || expression === null || expression === undefined}
                    buttonlabel="Resolve"
                    primaryToolTip="Resolve The Security Context Expression"
                    secondaryToolTip="Must Have An Expression Value"
                    secondaryToolTipCondition={!(expression === "" || expression === null || expression === undefined)}
                    onClick={handleResolveButtonPushed}
                />
                <SDKButton
                    disabled={false}
                    buttonlabel="Cancel"
                    primaryToolTip="Exit This Tab"
                    secondaryToolTip="Unable To Exit"
                    secondaryToolTipCondition={true}
                    onClick={handleCancelButtonPushed}
                />
            </DialogActions>
        </Dialog>
    );
}
