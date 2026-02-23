import React, { } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

export default function ApiResponseDialog(props) {
    const apiResponse = JSON.stringify(props.apiResponse, null, 2);
    const title = props.title || "API Response"

    return (
        <Dialog fullWidth={true} maxWidth="lg" open={props.open} onClose={props.handleClose}>
            <DialogTitle>{title}:</DialogTitle>
            <DialogContent dividers style={{ height: '450px' }}>
                <Typography gutterBottom><pre>{apiResponse}</pre></Typography>
            </DialogContent>
            <DialogActions>
                <CopyToClipboard text={apiResponse}>
                    <Button variant="outlined" color="primary">Copy to clipboard</Button>
                </CopyToClipboard>
                <Button onClick={props.handleClose} variant="outlined" color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
}
