import React, { useState, useContext } from 'react';

import Button from '@mui/material/Button';

import { DeviceContext } from './DeviceContext';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

function AccessTokenDetails(props) {
    const [showToken, setShowToken] = useState(false);
    const admin_Token = props.adminToken;
    const solution_Token = props.solutionToken;
    const uiContext_Token = props.uiContextToken;

    function handleShowTokenClicked() {
        setShowToken(true);
    }

    return (
        <div>
            <Button color="primary" variant="contained" size="medium" onClick={handleShowTokenClicked}>Show Access Token(s)</Button>
            <br /><br />
            <div style={{ display: (showToken ? 'block' : 'none') }}>
                <div>
                    <h3>Admin Access Token</h3>
                    <TextField style={{ display: (showToken ? 'block' : 'none') }} margin="normal" name="token" variant="outlined" readonly fullWidth label="access_token" value={admin_Token ? admin_Token.access_token : 'None'} />
                </div>
                <div>
                    <h3>Solution Access Token</h3>
                    <TextField style={{ display: (showToken ? 'block' : 'none') }} margin="normal" name="token" variant="outlined" readonly fullWidth label="access_token" value={solution_Token ? solution_Token.access_token : 'None'} />
                </div>
                <div>
                    <h3>UI Context Access Token</h3>
                    <TextField style={{ display: (showToken ? 'block' : 'none') }} margin="normal" name="token" variant="outlined" readonly fullWidth label="access_token" value={uiContext_Token ? uiContext_Token.access_token : 'None'} />
                </div>
            </div>
        </div>
    )
}

export default function TokenStatusDetails(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;

    function getContent() {
        if (currentDevice) {
            let Token = { access_token: 'None', expires_in: 0 };
            let admin_Token = currentDevice.adminAccessTokenStatus === 'Granted' ? currentDevice.adminAccessToken : Token;
            let solution_Token = currentDevice.solutionAccessTokenStatus === 'Granted' ? currentDevice.solutionAccessToken : Token;
            let uiContext_Token = currentDevice.uiContextAccessTokenStatus === 'Granted' ? currentDevice.uiContextAccessToken : Token;
            return (
                <AccessTokenDetails adminToken={admin_Token} solutionToken={solution_Token} uiContextToken={uiContext_Token} />
            )
        }
        else {
            return <p>There are currently no access tokens...</p>
        }
    }
    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Access Token Status</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Warning! Treat this token with care as it carries device administrator scope and therefore provides read/write access to most of the device's configuration data.
                </DialogContentText>
                {getContent()}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    )
}
