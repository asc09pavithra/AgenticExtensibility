import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import { DeviceContext } from './DeviceContext';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export default function DeviceStatusDetails(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;

    function getContent() {
        if (currentDevice) {
            return (
                <React.Fragment>
                    <TextField disabled margin="normal" name="deviceStatus" variant="outlined" readonly fullWidth label="Bind Status: " value={currentDevice.bindStatus} />
                    <TextField disabled margin="normal" name="deviceStatus" variant="outlined" readonly fullWidth label="Network Address: " value={currentDevice.networkAddress} />
                </React.Fragment>
            )
        }
        else {
            return <p>There is currently no bound device.</p>
        }
    }

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Device Status</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {getContent()}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    )
}
